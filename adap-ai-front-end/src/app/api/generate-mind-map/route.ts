import { NextResponse } from 'next/server';

interface MindMapNode {
  id: string;
  label: string;
  type: string;
  parent?: string;
}

interface MindMapResponse {
  general_subject: string;
  nodes: MindMapNode[];
  edges: {
    source: string;
    target: string;
  }[];
}

// Función de utilidad para esperar
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para intentar la llamada a la API con retries
async function fetchWithRetry<T>(
  url: string, 
  options: RequestInit, 
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${maxRetries}...`);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      
      // Verificar la estructura de la respuesta
      if (!data.nodes || !data.edges || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
        throw new Error('Invalid response structure');
      }

      return data as T;
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Waiting ${delayMs/1000} seconds before next attempt...`);
        await delay(delayMs);
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('Generating mind map for prompt:', prompt);

    const data = await fetchWithRetry<MindMapResponse>(
      'https://adapt-ai-backend-production.up.railway.app/generate-mind-map',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          subject: prompt
        })
      }
    );

    console.log('Successfully generated mind map after retries');

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error generating mind map after all retries:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 