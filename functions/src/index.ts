
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

// Import routes
import aiRouter from "./api/ai";
import whatsappRouter from "./api/whatsapp";
import receiptsRouter from "./api/receipts";

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Use routes
app.use("/ai", aiRouter);
app.use("/whatsapp", whatsappRouter);
app.use("/receipts", receiptsRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend AuraFin rodando com sucesso 🚀",
  });
});

export const api = functions.https.onRequest(app);
