import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  apiKey: string,
  systemInstruction: string,
  botName: string
): Promise<string> => {
  try {
    if (!apiKey) {
      return "⚠️ Configuración Incompleta: Falta la API Key en el panel de administración. Por favor contacte al administrador del sitio.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const contextPrompt = history
      .slice(-4) // Keep last 4 messages for context to save tokens
      .map(msg => `${msg.role === 'user' ? 'Cliente' : botName}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${contextPrompt}\nCliente: ${newMessage}\n${botName}:`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Lo siento, no pude procesar tu solicitud en este momento.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Tuve un problema técnico momentáneo. Verifica tu conexión o la API Key configurada.";
  }
};