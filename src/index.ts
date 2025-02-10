import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import prisma from "./database/prisma";
const app = new Hono();

app.get("/api", async (c) => {
  const currentMonth = new Date();

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const monthlyBudgets = await prisma.monthly_budgets.findMany({
    where: {
      month: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      categories: true,
      expenses: true,
    },
  });

  // console.log(monthlyBudgets[0].month);

  return c.json(monthlyBudgets);
});

app.post("/api/v1/expenses", async (c) => {
  const data = await c.req.json();

  await prisma.expenses.create({ data });

  return c.text("hi");
});

app.use("/*", serveStatic({ root: "./frontend/dist/" }));
app.use("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default {
  port: 4032,
  fetch: app.fetch,
};
