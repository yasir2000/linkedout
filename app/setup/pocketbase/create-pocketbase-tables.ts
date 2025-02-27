// app/setup/pocketbase/create-pocketbase-tables.ts
import { SetupStatus } from './types';

export async function createPocketbaseTables(
  n8nApiKey: string,
  pocketbaseSuperuserEmail: string,
  pocketbaseSuperuserPassword: string,
  setError: (error: string | null) => void
): Promise<boolean> {
  try {
    console.log("Creating tables in PocketBase...");
    
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
    console.log("Calling n8n webhook to create tables...");
    const webhookUrl = `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/webhook/linkedout/setup/db-tables`;
    console.log("Webhook URL:", webhookUrl);
    
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          pocketbaseUrl: process.env.NEXT_PUBLIC_POCKETBASE_URL
        })
      });
      
      console.log("Webhook response status:", webhookResponse.status);
      
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error("PocketBase tables creation failed:", errorText);
        throw new Error(`Failed to create tables in PocketBase (Status: ${webhookResponse.status}): ${errorText}`);
      }
      
      console.log("Successfully created tables in PocketBase");
      return true;
    } catch (error: any) {
      console.error("Error calling webhook:", error);
      throw new Error(`Failed to call n8n webhook: ${error.message}`);
    }
  } catch (error) {
    console.error('Error creating PocketBase tables:', error);
    setError(error instanceof Error ? error.message : 'Failed to create tables in PocketBase');
    return false;
  }
}