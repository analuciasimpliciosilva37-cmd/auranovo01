import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { analyzeReceipt } from "../services/aiService";

const router = Router();

router.post("/analyze", authenticate, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).send({ message: 'Image URL is required' });
    }
    const result = await analyzeReceipt(imageUrl);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error analyzing receipt" });
  }
});

export default router;