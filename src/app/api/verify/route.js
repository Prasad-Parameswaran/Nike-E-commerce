import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        console.log(body);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        console.log(data, 'hhhhhhhhh')
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to verify user' }, { status: 500 });
    }
}
