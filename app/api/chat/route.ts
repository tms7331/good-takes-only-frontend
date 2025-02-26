import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const encodedMessage = searchParams.get('message');

        if (!encodedMessage) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const message = decodeURIComponent(encodedMessage);

        const API_KEY = process.env.OPENROUTER_API_KEY;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an assistant tasked with judging whether people's views of the cryptocurrency markets are good or not. You will be given a message, and you will need to respond with whether the message is good or not. You will also be given a description of the user's views, and you will need to use that to make your judgment. Return a one-word response only, either 'good' or 'bad'.",
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            }),
        });

        const data = await response.json();

        return NextResponse.json({ response: data.choices[0].message.content });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const API_KEY = process.env.OPENROUTER_API_KEY; // Use environment variable

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an assistant tasked with judging whether people's views of the cryptocurrency markets are good or not. You will be given a message, and you will need to respond with whether the message is good or not. You will also be given a description of the user's views, and you will need to use that to make your judgment. Return a one-word response only, either 'good' or 'bad'.",
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            }),
        });

        const data = await response.json();

        return NextResponse.json({ response: data.choices[0].message.content });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
