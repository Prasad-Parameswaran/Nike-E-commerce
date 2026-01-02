import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('Authorization');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-orders/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || '',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user orders' }, { status: 500 });
    }
}
