import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Función para descargar el video
async function downloadVideo(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// Función para esperar el estado del video
async function waitForVideoCompletion(videoId: string): Promise<string> {
  const maxAttempts = 100; // 2 minutos (24 intentos * 5 segundos = 120 segundos = 2 minutos)
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      console.log(`Checking video status attempt ${attempts + 1}...`);
      
      // Añadir el header de autenticación
      const response = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
        {
          headers: {
            "X-Api-Key": ""
            
          }
        }
      );
      
      if (!response.ok) {
        console.error('Error response from status API:', response.status);
        throw new Error(`Status API responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Status response:', JSON.stringify(data, null, 2));

      // Verificar la estructura de la respuesta
      if (!data || typeof data.code === 'undefined') {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from status API');
      }

      // Verificar el código de respuesta y el estado
      if (data.code === 100 && data.data?.status === 'completed') {
        console.log('Video completed, URL:', data.data.video_url);
        return data.data.video_url;
      } else if (data.data?.status === 'failed' || data.data?.error) {
        console.error('Video generation failed:', data.data?.error);
        throw new Error(data.data?.error || 'Video generation failed');
      }

      // Si el video aún está en proceso, mostrar el estado actual y el tiempo transcurrido
      const minutesElapsed = (attempts * 5) / 60;
      console.log(`Video still processing, status: ${data.data?.status}. Time elapsed: ${minutesElapsed.toFixed(1)} minutes`);
      
      // Esperar 5 segundos antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;

    } catch (error) {
      console.error('Error checking video status:', error);
      throw error;
    }
  }

  throw new Error('Video generation timeout after 2 minutes');
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    // 1. Generar texto inicial
    console.log('Generating initial text...');
    const textResponse = await fetch('http://147.182.255.123:3000/generateText', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage: prompt })
    });

    if (!textResponse.ok) {
      throw new Error(`Text generation failed with status ${textResponse.status}`);
    }

    const textData = await textResponse.json();
    console.log('Text generation response:', textData);

    // 2. Generar video
    console.log('Initiating video generation...');
    const videoGenResponse = await fetch('http://147.182.255.123:3000/generateVideo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage: prompt })
    });

    if (!videoGenResponse.ok) {
      throw new Error(`Video generation failed with status ${videoGenResponse.status}`);
    }

    const videoGenData = await videoGenResponse.json();
    console.log('Video generation response:', videoGenData);

    if (!videoGenData.video_id) {
      throw new Error('No video ID received from generation API');
    }

    // 3. Esperar a que el video esté listo
    console.log('Waiting for video completion...');
    const videoUrl = await waitForVideoCompletion(videoGenData.video_id);

    // 4. Descargar y guardar el video
    console.log('Downloading video...');
    const publicPath = path.join(process.cwd(), 'public');
    const videoPath = path.join(publicPath, 'video_demo.mp4');
    await downloadVideo(videoUrl, videoPath);
    console.log('Video downloaded successfully');

    return NextResponse.json({ 
      success: true, 
      video_url: '/video_demo.mp4',
      content: textData.content,
      title: videoGenData.title,
      estimated_minutes: 2 // Tiempo estimado por defecto
    });

  } catch (error) {
    console.error('Error in video generation process:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 