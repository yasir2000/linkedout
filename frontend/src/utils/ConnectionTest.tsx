import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

interface ConnectionStatus {
  pocketbaseInternal: boolean;
  pocketbasePublic: boolean;
  n8nInternal: boolean;
  n8nPublic: boolean;
}

export const ConnectionTest = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    pocketbaseInternal: false,
    pocketbasePublic: false,
    n8nInternal: false,
    n8nPublic: false,
  });

  useEffect(() => {
    const testConnections = async () => {
      // Test PocketBase Internal
      try {
        const pbInternal = new PocketBase(process.env.NEXT_PUBLIC_INTERNAL_POCKETBASE_URL);
        await pbInternal.health.check();
        setStatus(prev => ({ ...prev, pocketbaseInternal: true }));
      } catch (e) {
        console.error('PocketBase Internal Error:', e);
      }

      // Test PocketBase Public
      try {
        const pbPublic = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
        await pbPublic.health.check();
        setStatus(prev => ({ ...prev, pocketbasePublic: true }));
      } catch (e) {
        console.error('PocketBase Public Error:', e);
      }

      // Test n8n Internal
      try {
        const n8nInternal = await fetch(process.env.NEXT_PUBLIC_INTERNAL_N8N_WEBHOOK_URL as string);
        setStatus(prev => ({ ...prev, n8nInternal: n8nInternal.ok }));
      } catch (e) {
        console.error('n8n Internal Error:', e);
      }

      // Test n8n Public
      try {
        const n8nPublic = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string);
        setStatus(prev => ({ ...prev, n8nPublic: n8nPublic.ok }));
      } catch (e) {
        console.error('n8n Public Error:', e);
      }
    };

    testConnections();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
      <h2>Connection Status</h2>
      <pre>{JSON.stringify(status, null, 2)}</pre>
      <div>
        <h3>Environment Variables</h3>
        <pre>
          NEXT_PUBLIC_INTERNAL_POCKETBASE_URL: {process.env.NEXT_PUBLIC_INTERNAL_POCKETBASE_URL}
          NEXT_PUBLIC_POCKETBASE_URL: {process.env.NEXT_PUBLIC_POCKETBASE_URL}
          NEXT_PUBLIC_INTERNAL_N8N_WEBHOOK_URL: {process.env.NEXT_PUBLIC_INTERNAL_N8N_WEBHOOK_URL}
          NEXT_PUBLIC_N8N_WEBHOOK_URL: {process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}
        </pre>
      </div>
    </div>
  );
};
