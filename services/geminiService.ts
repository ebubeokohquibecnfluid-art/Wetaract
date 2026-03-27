
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async getGrowthStrategy(platform: string, niche: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide 5 specific, high-impact growth strategies for a ${platform} creator in the ${niche} niche. Focus on organic engagement and community building. Return as a bulleted list.`,
        config: {
          temperature: 0.7,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate growth strategies at this time.";
    }
  },

  async validateContentLink(link: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this link: ${link}. Is it a valid social media content link (Instagram, TikTok, YouTube, or Twitter)? Return a JSON object with 'isValid' (boolean) and 'platform' (string or null).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: { type: Type.BOOLEAN },
              platform: { type: Type.STRING, nullable: true }
            },
            required: ["isValid"]
          }
        },
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Validation Error:", error);
      return { isValid: true, platform: "unknown" }; // Fallback
    }
  }
};
