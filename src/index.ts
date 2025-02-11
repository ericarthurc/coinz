import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import prisma from "./database/prisma";
import { month_enum } from "@prisma/client";

const monthMap: Record<number, keyof typeof month_enum> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
};

const app = new Hono();

app.get("/api/v1/budget", async (c) => {
  const { month } = c.req.query();
  // console.log("QUERY", month);

  if (month) {
    const queriedMonth = month as keyof typeof month_enum;
    const monthlyBudgets = await prisma.monthly_budgets.findMany({
      where: {
        month: month_enum[queriedMonth],
      },
      include: {
        categories: true,
        expenses: true,
      },
    });

    // handle this differently
    // if a query to a month returns no values and a empty []
    // if (monthlyBudgets.length == 0) {
    //   return c.notFound();
    // }

    return c.json(monthlyBudgets);
  }

  const currentMonth = monthMap[new Date().getMonth() + 1];
  const monthlyBudgets = await prisma.monthly_budgets.findMany({
    where: {
      month: month_enum[currentMonth],
    },
    include: {
      categories: true,
      expenses: true,
    },
  });

  return c.json(monthlyBudgets);
});

app.post("/api/v1/expenses", async (c) => {
  const data = await c.req.json();

  await prisma.expenses.create({ data });

  return c.text("ok");
});

app.delete("/api/v1/expense/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  await prisma.expenses.delete({ where: { id: id } });

  return c.text("ok");
});

app.use("/*", serveStatic({ root: "./frontend/dist/" }));
app.use("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default {
  port: 4032,
  fetch: app.fetch,
};
