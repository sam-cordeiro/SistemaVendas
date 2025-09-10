import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email: "teste@exemplorm.com",
      password: "123456",
    },
  });

  // Criar produtos
  const product1 = await prisma.product.create({
    data: { name: "Notebook", price: 3500 },
  });
  const product2 = await prisma.product.create({
    data: { name: "Mouse Gamer", price: 250 },
  });

  // Criar pedido
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      products: {
        create: [
          { productId: product1.id, quantity: 1 },
          { productId: product2.id, quantity: 2 },
        ],
      },
    },
    include: { products: { include: { product: true } } },
  });

  console.log("Usuário criado:", user);
  console.log("Pedido criado:", order);

  // Listar pedidos
  const allOrders = await prisma.order.findMany({
    include: { user: true, products: { include: { product: true } } },
  });
  console.log("Todos os pedidos:", allOrders);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());