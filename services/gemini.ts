
import { GoogleGenAI } from "@google/genai";

export const getTravelTips = async (dayTitle: string, locations: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `身為資深導遊，請針對行程「${dayTitle}」中的景點：${locations.join('、')}，提供一段 150 字內的專業旅遊建議（包含穿著建議、隱藏玩法或注意事項）。請用親切且專業的口吻。`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "導遊正在趕來的路上，稍等片刻...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "祝您有趟愉快的旅程！記得多帶一件保暖衣物。";
  }
};
