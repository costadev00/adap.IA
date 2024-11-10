import { NextResponse } from 'next/server';

const API_URL = 'https://adapt-ai-backend-production.up.railway.app/send-message';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        message: body.message,
        temperature: 1,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    const markdownResponse = data.response || data.message || data.content || 'No response content';
    
    return NextResponse.json({
      response: markdownResponse,
      status: 'success'
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', response: null },
      { status: 500 }
    );
  }
} 