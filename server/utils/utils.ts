import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

async function pdfExtraction(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new  PDFParse({data:dataBuffer});
  
  const result = await parser.getText();

  await parser.destroy();

  return result.text;
}

export async function docExtraction(filepath: string) {
    const buffer = fs.readFileSync(filepath);
    const result = await mammoth.extractRawText({
        buffer,
    });
    return result.value.trim();
}

export async function resumeExtraction(){
    const resumeFolder = './resume'
    const files = await fs.readdirSync(resumeFolder)
      if (files.length === 0) {
        throw new Error("Resume folder is empty");
    }
        const file = files[0];
    const filePath = path.join(resumeFolder, file);
    const extension = path.extname(file).toLowerCase();
    if(extension==".pdf"){
        const resumetext = pdfExtraction(filePath)
        return resumetext;
    }
    if(extension=='docx'){
        const  resumetext = docExtraction(filePath)
        return resumetext;
    }

}