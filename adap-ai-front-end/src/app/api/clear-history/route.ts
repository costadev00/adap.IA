import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch(
      'https://adapt-ai-backend-production.up.railway.app/clear-history',
      {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Clear history failed with status ${response.status}`);
    }

    return NextResponse.json({ 
      success: true 
    });

  } catch (error) {
    console.error('Error clearing history:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 