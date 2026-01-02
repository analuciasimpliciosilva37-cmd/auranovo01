import { Router } from "express";
import * as admin from "firebase-admin";
import { analyzeReceipt } from "../services/aiService";
import { sendWhatsappMessage, getWhatsappImageUrl, getWhatsappVerifyToken } from "../services/whatsappService";

const router = Router();

// Webhook verification
router.get("/webhook", async (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        const verifyToken = await getWhatsappVerifyToken();
        if (mode === "subscribe" && token === verifyToken) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Handle incoming messages
router.post("/webhook", async (req, res) => {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
        const from = message.from; // User's phone number

        try {
            const usersRef = admin.firestore().collection('users');
            const userSnapshot = await usersRef.where('whatsappNumber', '==', from).limit(1).get();

            if (userSnapshot.empty) {
                await sendWhatsappMessage(from, "Seu número não foi encontrado no AuraFin. Por favor, cadastre-se primeiro.");
                return res.sendStatus(200);
            }

            const userId = userSnapshot.docs[0].id;

            if (message.type === 'image') {
                await sendWhatsappMessage(from, "Analisando seu recibo... 🤖");
                
                const imageId = message.image.id;
                const imageUrl = await getWhatsappImageUrl(imageId);
                
                const analysisResult = await analyzeReceipt(imageUrl);
                
                // A resposta da IA já é um objeto JSON, não precisa de parse!
                const extractedData = JSON.parse(analysisResult.extractedData);
                const { total, date, category, description, type } = extractedData;

                await admin.firestore().collection('users').doc(userId).collection('transactions').add({
                    amount: total,
                    date: new Date(date),
                    category,
                    description,
                    type: type || 'expense', // Default to expense
                    source: 'whatsapp', // Para rastrear a origem
                    createdAt: new Date()
                });

                await sendWhatsappMessage(from, `Recibo de R$ ${total} salvo com sucesso na categoria ${category}!`);
            } else {
                await sendWhatsappMessage(from, "Olá! Envie a foto de um recibo para que eu possa analisá-lo.");
            }
        } catch (error) {
            console.error("Error processing webhook:", error);
            await sendWhatsappMessage(from, "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
        }
    }

    res.sendStatus(200);
});

export default router;
