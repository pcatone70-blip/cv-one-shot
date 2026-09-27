import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { jobTitle } = await request.json();

    if (!jobTitle) {
      return NextResponse.json({ error: 'Job title is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Act as a career analyst. Analyze the job title: "${jobTitle}".
Return *strictly* raw JSON (no markdown block, no \`\`\`json, no backticks).
The JSON MUST follow this exact schema:
{
  "growthPercentage": "+X%",
  "growthText": "short text",
  "topSkills": ["skill1", "skill2", "skill3"],
  "advice": "short advice"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Attempt to parse JSON safely
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching career insights:', error);
    return NextResponse.json({ error: 'Failed to generate career insights' }, { status: 500 });
  }
}
