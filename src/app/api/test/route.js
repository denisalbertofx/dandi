import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API funcionando correctamente' });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ 
    message: 'Datos recibidos correctamente',
    data: body
  });
} 