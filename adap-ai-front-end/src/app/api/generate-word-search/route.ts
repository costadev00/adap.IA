import { NextResponse } from 'next/server';

interface WordSearchResponse {
  grid: string[][];
  answers: {
    word: string;
    start: [number, number];
    end: [number, number];
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
      if (!data.grid || !data.answers || !Array.isArray(data.grid) || !Array.isArray(data.answers)) {
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
    console.log('Generating word search for prompt:', prompt);

    const data = await fetchWithRetry<WordSearchResponse>(
      'https://adapt-ai-backend-production.up.railway.app/generate-word-search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          topic: prompt
        })
      }
    );

    console.log('Successfully generated word search after retries');

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error generating word search after all retries:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 