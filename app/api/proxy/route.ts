import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Check if an endpoint is a setup endpoint
const isSetupEndpoint = (endpoint: string): boolean => {
  return endpoint.startsWith('setup/');
};

export async function POST(request: Request) {
  const headersList = headers();
  const token = headersList.get('authorization');
  const contentType = headersList.get('content-type');
  const endpoint = request.headers.get('x-endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }

  // Return error for setup endpoints - these will be handled by a different route
  if (isSetupEndpoint(endpoint)) {
    return NextResponse.json({ error: 'Setup endpoints not supported in this route' }, { status: 400 });
  }

  // Require authentication for all non-setup endpoints
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    console.log(`Forwarding request to n8n webhook: ${endpoint}`);
    
    // Forward to n8n webhook
    const response = await fetch(`https://devrel.app.n8n.cloud/webhook/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`n8n webhook response status: ${response.status}`);
    
    // First try to get the response as text
    const responseText = await response.text();
    
    // Try to parse as JSON, if it fails, return the text
    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: response.status });
    } catch (e) {
      // If it's not JSON, return the text response
      return new NextResponse(responseText, { 
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}