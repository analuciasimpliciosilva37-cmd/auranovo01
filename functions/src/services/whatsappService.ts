import axios from 'axios';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const WHATSAPP_TOKEN_SECRET_NAME = 'projects/aurafin-project-id/secrets/WHATSAPP_ACCESS_TOKEN/versions/latest'; // TODO: Substitua pelo seu project-id
const WHATSAPP_VERIFY_TOKEN_SECRET_NAME = 'projects/aurafin-project-id/secrets/WHATSAPP_VERIFY_TOKEN/versions/latest'; // TODO: Substitua pelo seu project-id
const WHATSAPP_PHONE_NUMBER_ID = 'YOUR_PHONE_NUMBER_ID'; // TODO: Substitua pelo seu Phone Number ID

async function getSecret(secretName: string): Promise<string> {
    const secretManager = new SecretManagerServiceClient();
    const [version] = await secretManager.accessSecretVersion({ name: secretName });
    const payload = version.payload?.data?.toString();

    if (!payload) {
        throw new Error(`Secret payload for ${secretName} is empty`);
    }

    return payload;
}

export const getWhatsappToken = () => getSecret(WHATSAPP_TOKEN_SECRET_NAME);
export const getWhatsappVerifyToken = () => getSecret(WHATSAPP_VERIFY_TOKEN_SECRET_NAME);

export async function sendWhatsappMessage(to: string, message: string) {
    const token = await getWhatsappToken();

    try {
        await axios.post(`https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
            messaging_product: 'whatsapp',
            to: to,
            text: { body: message }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
    }
}

export async function getWhatsappImageUrl(imageId: string): Promise<string> {
    const token = await getWhatsappToken();

    try {
        const response = await axios.get(`https://graph.facebook.com/v20.0/${imageId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // A URL da imagem vem com escapes, axios trata isso automaticamente
        return response.data.url;
    } catch (error) {
        console.error('Error getting image URL:', error.response ? error.response.data : error.message);
        throw new Error('Could not get image URL');
    }
}