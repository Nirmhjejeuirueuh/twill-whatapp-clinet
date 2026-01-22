import { NextRequest } from 'next/server';

interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

let sseClients: SSEClient[] = [];

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const clientId = Math.random().toString(36).substring(7);
      const client: SSEClient = { id: clientId, controller };

      sseClients.push(client);
      console.log(`📡 SSE client connected: ${clientId}. Total clients: ${sseClients.length}`);

      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`;
      controller.enqueue(new TextEncoder().encode(data));

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        sseClients = sseClients.filter(c => c.id !== clientId);
        console.log(`📡 SSE client disconnected: ${clientId}. Total clients: ${sseClients.length}`);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Function to broadcast messages to all SSE clients
export function broadcastToSSE(message: any) {
  const data = `data: ${JSON.stringify(message)}\n\n`;
  const encodedData = new TextEncoder().encode(data);

  sseClients.forEach(client => {
    try {
      client.controller.enqueue(encodedData);
    } catch (error) {
      console.error('Error sending to SSE client:', error);
      // Remove broken client
      sseClients = sseClients.filter(c => c.id !== client.id);
    }
  });

  console.log(`📡 Broadcasted to ${sseClients.length} SSE clients`);
}