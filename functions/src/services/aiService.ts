import { GoogleGenerativeAI } from "@google/generative-ai";
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

let genAI: GoogleGenerativeAI;

async function getApiKey(): Promise<string> {
    const name = 'projects/aurafin-project-id/secrets/GEMINI_API_KEY/versions/latest'; // TODO: Substitua pelo seu project-id
    const secretManager = new SecretManagerServiceClient();
    const [version] = await secretManager.accessSecretVersion({ name });
    const payload = version.payload?.data?.toString();

    if (!payload) {
        throw new Error('Secret payload is empty');
    }

    return payload;
}

async function initializeAI() {
    if (!genAI) {
        const apiKey = await getApiKey();
        genAI = new GoogleGenerativeAI(apiKey);
    }
}

export async function analyzeFinance(data: any) {
    await initializeAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const prompt = `Analyze the following financial data and provide insights:\n${JSON.stringify(data, null, 2)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return { insights: text };
}

export async function analyzeReceipt(imageUrl: string) {
    await initializeAI();
    // Modelo configurado para responder sempre com JSON
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });
    const prompt = `Analyze the receipt image available at the URL and extract the total amount, date, type (fixed or variable), category, and a short description. The date must be in YYYY-MM-DD format. Return a valid JSON object with the keys: 'total', 'date', 'type', 'category', 'description'.`;
    
    // Fetch a imagem e converte para base64
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: response.headers.get('content-type') || 'image/jpeg',
        },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    return { extractedData: text };
}
