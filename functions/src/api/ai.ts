import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { analyzeFinance } from "../services/aiService";
import * as admin from "firebase-admin";

const router = Router();

router.post("/analyze-finance", authenticate, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
        return res.status(400).send({ message: 'User not found' });
    }

    const transactionsRef = admin.firestore().collection('users').doc(userId).collection('transactions');
    const snapshot = await transactionsRef.get();
    const transactions = snapshot.docs.map(doc => doc.data());

    const result = await analyzeFinance(transactions);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error analyzing finance" });
  }
});

export default router;