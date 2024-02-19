import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createError from "http-errors";

const prisma = new PrismaClient();
const app = express();
const PORT = 3060;

app.use(express.json());

// 404
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});
