import { NextResponse } from 'next/server';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  difficulty: string;
  tags: string[];
  image: string;
}

interface FlashcardsResponse {
  general_subject: string;
  flashcards: {
    flashcards: Flashcard[];
  };
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
      if (!data.flashcards || !data.flashcards.flashcards || !Array.isArray(data.flashcards.flashcards)) {
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
    console.log('Generating flashcards for prompt:', prompt);

    // Usar la función de retry
    const data = await fetchWithRetry<FlashcardsResponse>(
      'https://adapt-ai-backend-production.up.railway.app/generate-flashcards',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          subject: prompt,
          num_flashcards: 5
        })
      }
    );

    // Validar y normalizar cada flashcard
    const validatedFlashcards = data.flashcards.flashcards.map(card => ({
      id: card.id || Math.random(),
      front: card.front || '',
      back: card.back || '',
      category: card.category || data.general_subject || 'General',
      difficulty: card.difficulty || 'Medium',
      tags: Array.isArray(card.tags) ? card.tags : [],
      image: card.image || ''
    }));

    console.log('Successfully generated flashcards after retries');

    return NextResponse.json({
      success: true,
      data: {
        general_subject: data.general_subject,
        flashcards: validatedFlashcards
      }
    });

  } catch (error) {
    console.error('Error generating flashcards after all retries:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 