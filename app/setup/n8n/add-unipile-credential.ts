// app/setup/n8n/add-unipile-credential.ts

export async function addUnipileCredential(
    n8nApiKey: string,
    unipileApiKey: string,
    setError: (error: string | null) => void
  ): Promise<boolean> {
    try {
      console.log("Creating Unipile credential in n8n...");
      
      const credentialData = {
        name: "Unipile - LinkedIn API",
        type: "headerAuth",
        data: {
          name: "X-API-KEY",
          value: unipileApiKey
        }
      };
      
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service': 'n8n',
          'x-endpoint': 'api/v1/credentials',
          'x-n8n-api-key': n8nApiKey
        },
        body: JSON.stringify(credentialData),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("n8n credential creation failed:", errorData);
        throw new Error(errorData.message || 'Failed to create Unipile credential in n8n');
      }
  
      const result = await response.json();
      localStorage.setItem('unipileCredentialId', result.id);
      
      return true;
    } catch (error) {
      console.error('Error creating Unipile credential:', error);
      setError(error instanceof Error ? error.message : 'Failed to add Unipile credential to n8n');
      return false;
    }
  }