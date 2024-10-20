import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  try {
    const response = await fetch('http://localhost:9000/asr?encode=true&task=transcribe&language=en&word_timestamps=false&output=json', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding request to ASR service:', error);
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
  }
}