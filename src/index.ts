import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createError from "http-errors";

const prisma = new PrismaClient();
const app = express();
const PORT = 3060;

app.use(express.json());

app.get("/post", async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  res.json(posts);
});

app.post("/post", async (req: Request, res: Response) => {
  try {
    const { content, authorEmail } = req.body;
    const result = await prisma.post.create({
      data: {
        content,
        author: { connect: { email: authorEmail } },
      },
    });
    res.json(result);
  } catch (error) {
    res.json(createError(400));
  }
});

app.get("/post/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    res.json(post);
  } catch (error) {
    res.json(createError(400));
  }
});

app.put("/post/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
      },
    });

    res.json(post);
  } catch (error) {
    res.json(createError(400));
  }
});

app.delete("/post/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json(post);
  } catch (error) {
    res.json(createError(400));
  }
});

app.post("/user", async (req: Request, res: Response) => {
  try {
    const result = await prisma.user.create({
      data: { ...req.body },
    });
    res.json(result);
  } catch (error) {
    res.json(createError(400));
  }
});

app.get("/user/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    res.json(user);
  } catch (error) {
    res.json(createError(400));
  }
});

// 404
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});
