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
    
    // Example workflow to import
    const workflow = {
      name: "LinkedOut Workflow",
      nodes: [
        {
          "id": "123",
          "name": "Unipile",
          "type": "n8n-nodes-base.httpRequest",
          "parameters": {
            "authentication": "headerAuth",
            "headerParameters": {
              "parameters": [
                {
                  "name": "X-API-KEY",
                  "value": "={{ $credentials.unipileApi.data.apiKey }}"
                }
              ]
            }
          },
          "credentials": {
            "headerAuth": unipileCredentialId
          },
          "position": [100, 100]
        }
      ],
      connections: {},
      active: false,
      settings: {
        saveManualExecutions: true,
        callerPolicy: "workflowsFromSameOwner"
      }
    };
    
    // Use the generic setup endpoint
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service': 'n8n',
        'x-endpoint': 'api/v1/workflows',
        'x-n8n-api-key': n8nApiKey
      },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("n8n workflow import failed:", errorData);
      throw new Error(errorData.message || 'Failed to import workflow to n8n');
    }

    await response.json();
    console.log("Workflow imported successfully");
    
    return true;
  } catch (error) {
    console.error('Error importing workflows:', error);
    setError(error instanceof Error ? error.message : 'Failed to import workflows to n8n');
    return false;
  }
}