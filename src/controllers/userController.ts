import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const usuarios = await prisma.user.findMany();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O ID deve ser numérico" });
  }

  const usuario = await prisma.user.findUnique({ where: { id } });
  if (!usuario) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(usuario);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, email, name, role } = req.body;

    // Validação dos campos obrigatórios
    if (id == null || !email || !name) {
      return res.status(400).json({
        error: "Os campos id, email e name são obrigatórios.",
      });
    }

    const existente = await prisma.user.findUnique({ where: { id } });
    if (existente) {
      return res.status(409).json({ error: "ID já existente." });
    }

    const novoUsuario = await prisma.user.create({
      data: { id, email, name, role },
    });

    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { email, name, role } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "O ID deve ser numérico" });
  }

  try {
    // Verifica se o usuário existe
    const usuario = await prisma.user.findUnique({ where: { id } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Atualiza os dados
    const atualizado = await prisma.user.update({
      where: { id },
      data: { email, name, role },
    });

    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O ID deve ser numérico" });
  }

  try {
    const usuario = await prisma.user.findUnique({ where: { id } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

export default router;
