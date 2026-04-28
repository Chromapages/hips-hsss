import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Proxy the request to the internal Safety Engine (Port 3003)
    // The Safety Engine is responsible for the actual NLP classification
    const safetyEngineUrl = process.env.SAFETY_ENGINE_URL || 'http://localhost:3003';
    
    const response = await fetch(`${safetyEngineUrl}/safety/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Safety engine responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Safety Ingest Proxy Error:', error);
    // Don't leak internal errors to the client, but fail gracefully
    return NextResponse.json({ status: 'buffered_offline' }, { status: 200 });
  }
}
