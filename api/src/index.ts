import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./db";

const app = express();
const PORT = process.env.PORT || 4000;
// 我们将使用这个 ID 作为默认用户进行测试
const DEFAULT_USER_ID = "clxkhm94y0000111122223333";

app.use(cors());
app.use(express.json());

// --- 业务接口 ---

// 健康检查接口 (保持不变)
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

// 获取所有链接 (现在会返回 clicks 字段)
app.get("/api/links", async (req: Request, res: Response) => {
  const links = await prisma.link.findMany({
    where: { ownerId: DEFAULT_USER_ID },
    orderBy: { createdAt: "desc" },
  });
  res.json(links);
});

// 创建一个新链接
app.post("/api/links", async (req: Request, res: Response) => {
  try {
    const { title, url } = req.body;
    // 确保 title 和 url 存在
    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required." });
    }
    const newLink = await prisma.link.create({
      data: {
        title,
        url,
        ownerId: DEFAULT_USER_ID,
      },
    });
    res.status(201).json(newLink);
  } catch (error) {
    console.error("Failed to create link:", error);
    res.status(500).json({ message: "Failed to create link" });
  }
});

// 【新功能】记录一次链接点击
app.post("/api/links/:id/click", async (req: Request, res: Response) => {
  try {
    const linkId = parseInt(req.params.id, 10);
    if (isNaN(linkId)) {
      return res.status(400).json({ message: "Invalid link ID." });
    }
    await prisma.link.update({
      where: { id: linkId },
      data: { clicks: { increment: 1 } },
    });
    res.status(200).json({ message: "Click recorded" });
  } catch (error) {
    // Prisma 在找不到记录时会抛出错误，我们可以捕获它
    console.error("Error recording click:", error);
    res
      .status(404)
      .json({ message: "Link not found or error recording click" });
  }
});

// --- 启动服务器的健壮函数 ---
const startServer = async () => {
  try {
    // 确保默认用户存在
    await prisma.user.upsert({
      where: { id: DEFAULT_USER_ID },
      update: {},
      create: {
        id: DEFAULT_USER_ID,
        username: "default-user",
      },
    });
    console.log("Default user is ready.");

    app.listen(PORT, () => {
      console.log(`API server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
};

startServer();
