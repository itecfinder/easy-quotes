import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Say OK",
    });

    return NextResponse.json({
      surfaces: [
        {
          label: response.output_text || "OK",
          area: 1,
          unit: "sq ft",
          confidence: 1,
        },
      ],
      damage: [],
      scope: [],
      followUps: [],
    });
  } catch (error: any) {
    return NextResponse.json({
      surfaces: [
        {
          label: error?.message || "Unknown error",
          area: 0,
          unit: "",
          confidence: 0,
        },
      ],
      damage: [],
      scope: [],
      followUps: [],
    });
  }
}

