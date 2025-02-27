// app/setup/n8n/import-workflows.ts
import { SetupStatus } from './types';

export async function importWorkflows(
  n8nApiKey: string,
  unipileCredentialId: string | null,
  setError: (error: string | null) => void
): Promise<boolean> {
  try {
    console.log("Importing workflows to n8n...");
    
    if (!unipileCredentialId) {
      throw new Error('Missing Unipile credential ID');
    }
    
    // Define workflows to import with their names
    const workflows = [
      { name: "Inbox Backend", filename: "inbox-backend" },
      { name: "Thread Backend", filename: "thread-backend" },
      //{ name: "New Message Ingress", filename: "new-message-ingress" },
      { name: "Setup Workflow", filename: "setup-workflow" }
    ];
    
    // Define replacements map (easy to extend in the future)
    const replacements = {
      "****POCKETBASE_BASE_URL****": process.env.NEXT_PUBLIC_POCKETBASE_URL || "",
      "****UNIPILE_CREDENTIAL_ID****": unipileCredentialId,
      "****UNIPILE_DSN_URL****": process.env.UNIPILE_DSN_URL || "",
      "****POCKETBASE_SERVICE_USER_EMAIL****": process.env.POCKETBASE_SERVICE_USER_EMAIL || "",
      "****POCKETBASE_SERVICE_USER_PASSWORD****": process.env.POCKETBASE_SERVICE_USER_PASSWORD || ""
    };
    
    // Import each workflow
    for (const workflow of workflows) {
      console.log(`Importing workflow: ${workflow.name}`);
      
      try {
        // Fetch the workflow template
        const response = await fetch(`/workflows/${workflow.filename}.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to load workflow file: ${workflow.filename}.json (Status: ${response.status})`);
        }
        
        let workflowData;
        
        try {
          workflowData = await response.json();
        } catch (parseError) {
          console.error(`Error parsing JSON for workflow ${workflow.name}:`, parseError);
          
          // Try to get the text and log it for debugging
          const text = await response.text().catch(() => "Could not get response text");
          console.error(`Raw response for ${workflow.filename}.json:`, text);
          
          throw new Error(`Invalid JSON in workflow file: ${workflow.filename}.json`);
        }
        
        // Convert workflow to string for replacements
        let workflowStr = JSON.stringify(workflowData);
        
        // Apply all replacements
        for (const [placeholder, value] of Object.entries(replacements)) {
          workflowStr = workflowStr.split(placeholder).join(value);
        }
        
        // Parse back to object
        try {
          workflowData = JSON.parse(workflowStr);
        } catch (parseError) {
          console.error(`Error parsing JSON after replacements for workflow ${workflow.name}:`, parseError);
          throw new Error(`Failed to process workflow after replacements: ${workflow.filename}.json`);
        }
        
        // Create a clean workflow object
        const cleanWorkflow = {
          name: workflow.name,
          nodes: workflowData.nodes || [],
          connections: workflowData.connections || {},
          settings: {
            saveExecutionProgress: true,
            saveManualExecutions: true,
            saveDataErrorExecution: "all",
            saveDataSuccessExecution: "all",
            executionTimeout: 3600,
            timezone: "UTC"
          }
        };
        
        // Import the workflow
        const importResponse = await fetch('/api/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-service': 'n8n',
            'x-endpoint': 'api/v1/workflows',
            'x-n8n-api-key': n8nApiKey
          },
          body: JSON.stringify(cleanWorkflow),
        });
        
        if (!importResponse.ok) {
          const errorText = await importResponse.text();
          let errorMessage = `Failed to import workflow: ${workflow.name}`;
          
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (e) {
            // If we can't parse the error as JSON, use the raw text
            errorMessage = `${errorMessage} - ${errorText}`;
          }
          
          console.error(`Failed to import workflow ${workflow.name}:`, errorMessage);
          throw new Error(errorMessage);
        }
        
        console.log(`Successfully imported workflow: ${workflow.name}`);
      } catch (error) {
        console.error(`Error importing workflow ${workflow.name}:`, error);
        throw error; // Re-throw to be caught by the outer try/catch
      }
    }
    
    console.log("All workflows imported successfully");
    return true;
  } catch (error) {
    console.error('Error importing workflows:', error);
    setError(error instanceof Error ? error.message : 'Failed to import workflows to n8n');
    return false;
  }
}