import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function askGemini(prompt: string , system_instruction:string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: prompt,
    config:{
        systemInstruction:system_instruction,
        
    }
  });

  return response.text;
}


async function resumeExtraction(){

}
async function jobDescriptionExtraction(){
    
}