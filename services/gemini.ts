import { GoogleGenAI } from "@google/genai";
import { getHexDump } from "../utils/converter";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const decompileBinary = async (
  data: Uint8Array,
  fileName: string
): Promise<string> => {
  try {
    const ai = getClient();
    // Use flash for larger context window to handle binary data
    const model = "gemini-2.5-flash";
    
    // We limit the hex dump to reasonable size to prevent overload, 
    // but Flash has a large context window so we can send a fair bit.
    // 32KB of binary = ~96KB of hex string.
    const hexContent = getHexDump(data, 32000); 
    const isFullDump = data.length <= 32000;

    const prompt = `
      I am a developer working on Xbox 360 Homebrew.
      I have a binary file named "${fileName}" which is an Xbox 360 Executable (XEX).
      
      TASK: 
      100% Decode this file and convert it to its original C Source Code.
      Analyze the binary structure, look for the XEX2 header, optional headers, and the machine code (PowerPC Xenon).
      
      Decompile the logic into readable C code.
      If standard library functions are recognized, use them.
      If string literals are found, include them.
      
      INPUT HEX DUMP (${isFullDump ? 'Full File' : 'First 32KB'}):
      ${hexContent}

      OUTPUT FORMAT:
      Return ONLY valid C code.
      Include comments explaining the XEX header fields found (Magic, Module Flags, etc).
      Reconstruct the 'main' function or entry point logic as best as possible.
      Do not wrap in markdown blocks, just return the code.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: {
           thinkingBudget: 1024 // Give it some budget to analyze the binary structure
        }
      }
    });

    return response.text || "// Failed to decompile. AI returned empty response.";
  } catch (error) {
    console.error("Gemini Decompile Error:", error);
    return `// Error during decompilation.\n// ${error instanceof Error ? error.message : 'Unknown error'}\n// Please check your API key and file size.`;
  }
};

export const generateDocumentation = async (
  variableName: string,
  fileSize: number,
  fileName: string
): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    
    const prompt = `
      I have a C byte array named "${variableName}" representing an Xbox 360 XEX file.
      Size: ${fileSize} bytes.
      
      Generate a Markdown guide on how to load this XEX from memory on an Xbox 360 (using XeLoadImage or similar generic kernel exports if applicable, or just how to mount it).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No documentation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating documentation.";
  }
};
