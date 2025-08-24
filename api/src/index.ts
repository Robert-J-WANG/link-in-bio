import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./db"; // 确保你已经创建了 api/src/db.ts

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      message: "API is healthy and connected to the database",
    });
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Unknown database error";
    res.status(503).json({
      status: "error",
      message: "Database connection failed",
      error: errorMessage,
    });
  }
});

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`API server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
};

startServer();
