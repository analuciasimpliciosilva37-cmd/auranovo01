
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameters and exclusively rely on process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAuraSuggestion = async (balance: number, expenses: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User current balance: ${balance}. Monthly expenses so far: ${expenses}. 
      Give a short, encouraging financial tip (max 2 sentences) in Portuguese.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Continue focado em seus objetivos financeiros!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantenha o controle das suas finanças para um futuro próspero.";
  }
};

export const getAuraMentorship = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o seguinte cenário financeiro do usuário e forneça uma mentoria estratégica em Português.
      Cenário: ${JSON.stringify(data)}.
      
      A resposta deve conter:
      1. Prioridade de pagamentos (quais contas pagar primeiro baseado em juros e vencimento).
      2. Orientação sobre empréstimos (se é o momento ou não).
      3. Dicas de economia comportamental.
      4. Um plano de ação de 3 passos.
      
      Retorne em formato JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority_list: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de prioridades de pagamento"
            },
            loan_advice: { type: Type.STRING, description: "Conselho sobre empréstimos" },
            behavioral_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            action_plan: { type: Type.ARRAY, items: { type: Type.STRING } },
            mentorship_note: { type: Type.STRING, description: "Uma mensagem final inspiradora da Aura" }
          },
          required: ["priority_list", "loan_advice", "behavioral_tips", "action_plan", "mentorship_note"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getInvestmentRecommendations = async (amount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário quer investir R$ ${amount} este mês. 
      Com base no cenário econômico brasileiro atual (Selic, Inflação), sugira 3 opções de investimento 
      (ex: CDB, Tesouro Direto, FIIs). Retorne em formato JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              risk: { type: Type.STRING },
              expectedReturn: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["name", "risk", "expectedReturn", "description"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const parseReceipt = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: "Extract data from this receipt: date (YYYY-MM-DD), total amount (number), category (one word), and merchant name. Return as JSON." },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            merchant: { type: Type.STRING }
          },
          required: ["date", "amount", "category", "merchant"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
