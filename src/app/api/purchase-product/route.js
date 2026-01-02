import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get('Authorization');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchase-product/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || '',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to purchase product' }, { status: 500 });
    }
}
