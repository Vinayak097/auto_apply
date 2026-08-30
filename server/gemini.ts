import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function askGemini(prompt: string , system_instruction:string) {
  
const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [
    {
      role: "system",
      content: system_instruction
    },
    {
      role: "user",
      content: prompt
    }
  ]
});


  return  response.choices[0].message.content;
}


async function resumeExtraction(){

}
async function jobDescriptionExtraction(){

}