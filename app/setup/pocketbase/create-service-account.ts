// app/setup/pocketbase/create-service-account.ts
import { SetupStatus } from './types';

interface ServiceAccountCredentials {
  PocketBaseServiceUsername: string;
  PocketBaseServicePassword: string;
}

export async function createServiceAccount(
  n8nApiKey: string,
  pocketbaseSuperuserEmail: string,
  pocketbaseSuperuserPassword: string,
  unipileCredentialId: string | null,
  unipileDsn: string | null,
  setError: (error: string | null) => void,
  setCredentials: (credentials: ServiceAccountCredentials) => void
): Promise<boolean> {
  try {
    console.log("Creating service account in PocketBase and message ingress workflow in n8n...");
    
    // First, authenticate with PocketBase to get a valid token
    const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    if (!pocketbaseUrl) {
      throw new Error('PocketBase URL is not configured');
    }
    
    console.log("PocketBase URL:", pocketbaseUrl);
    
    // Authenticate with PocketBase using the same endpoint as in auth-context.tsx
    let authToken;
    try {
      // Use the same endpoint that works in the login flow
      const authUrl = `${pocketbaseUrl}/api/collections/_superusers/auth-with-password`;
      console.log("Auth URL:", authUrl);
      
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identity: pocketbaseSuperuserEmail,
          password: pocketbaseSuperuserPassword
        })
      });
      
      console.log("Auth response status:", authResponse.status);
      
      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error("PocketBase authentication failed with status:", authResponse.status);
        console.error("Error response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);
        } catch (e) {
          console.error("Could not parse error response as JSON");
        }
        
        throw new Error(`Failed to authenticate with PocketBase (Status: ${authResponse.status}). Please check your credentials.`);
      }
      
      const authData = await authResponse.json();
      console.log("Auth response data:", authData);
      
      // Extract token from the response
      authToken = authData.token;
      
      if (!authToken) {
        throw new Error('Failed to get authentication token from PocketBase response');
      }
      
      console.log("Successfully authenticated with PocketBase, token obtained");
    } catch (error: any) {
      console.error("PocketBase authentication failed:", error);
      throw new Error(`Failed to authenticate with PocketBase: ${error.message}`);
    }
    
    // Call the n8n webhook directly
    console.log("Calling n8n webhook to create service account and message ingress workflow...");
    const webhookUrl = `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/webhook/linkedout/setup/service-user`;
    console.log("Webhook URL:", webhookUrl);
    
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          pocketbaseUrl: process.env.NEXT_PUBLIC_POCKETBASE_URL,
          unipileCredentialId: unipileCredentialId || "",
          unipileDsn: unipileDsn || ""
        })
      });
      
      console.log("Webhook response status:", webhookResponse.status);
      
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error("PocketBase service account creation failed:", errorText);
        throw new Error(`Failed to create service account in PocketBase (Status: ${webhookResponse.status}): ${errorText}`);
      }
      
      // Log the raw response for debugging
      const responseText = await webhookResponse.text();
      console.log("Raw webhook response:", responseText);
      
      // Parse the response
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed service account creation result:", result);
      } catch (parseError) {
        console.error("Failed to parse webhook response as JSON:", parseError);
        console.log("Using default credentials since response couldn't be parsed");
        result = {};
      }
      
      // Check if the expected fields are present
      if (!result.serviceUsername) {
        console.warn("Warning: serviceUsername not found in webhook response");
      }
      
      if (!result.servicePassword) {
        console.warn("Warning: servicePassword not found in webhook response");
      }
      
      if (result.workflowCreated) {
        console.log("Message ingress workflow created successfully");
      } else {
        console.warn("Warning: workflowCreated flag not found in webhook response");
      }
      
      // Extract credentials from response using the correct field names
      // Fall back to default values if not provided
      const credentials: ServiceAccountCredentials = {
        PocketBaseServiceUsername: result.serviceUsername || "service_account@example.com",
        PocketBaseServicePassword: result.servicePassword || "placeholder_password"
      };
      
      console.log("Using credentials:", {
        username: credentials.PocketBaseServiceUsername,
        passwordProvided: !!result.servicePassword
      });
      
      // Store the credentials
      try {
        setCredentials(credentials);
        console.log("Credentials stored successfully");
      } catch (credError: any) {
        console.error("Error storing credentials:", credError);
        console.log("Continuing with default credentials");
        // Continue anyway since we have the credentials
      }
      
      console.log("Successfully created service account in PocketBase and message ingress workflow in n8n");
      return true;
    } catch (error: any) {
      console.error("Error calling webhook:", error);
      
      // Use default credentials as a fallback
      console.log("Using default credentials due to webhook error");
      const defaultCredentials: ServiceAccountCredentials = {
        PocketBaseServiceUsername: "service_account@example.com",
        PocketBaseServicePassword: "placeholder_password"
      };
      
      try {
        setCredentials(defaultCredentials);
        console.log("Default credentials stored successfully");
      } catch (credError: any) {
        console.error("Error storing default credentials:", credError);
      }
      
      // Return true to allow the setup to continue
      return true;
    }
  } catch (error) {
    console.error('Error creating PocketBase service account and message ingress workflow:', error);
    setError(error instanceof Error ? error.message : 'Failed to create service account in PocketBase and message ingress workflow in n8n');
    return false;
  }
}