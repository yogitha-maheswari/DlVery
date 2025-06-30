
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpensesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        orderBy: {
          date: "desc",
        },
      }
    );
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item: { amount: { toString: () => any; }; }) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json(expenseByCategorySummary);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving expenses by category" });
  }
};


// export const getExpensesByDate = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const expenseByDateSummaryRaw = await prisma.expenseByDate.findMany({
//       orderBy: {
//         date: "desc",
//       },
//     });
//     const expenseByDateSummary = expenseByDateSummaryRaw.map(
//       (item: { amount: { toString: () => any; }; }) => ({
//         ...item,
//         amount: item.amount.toString(),
//       })
//     );

//     res.json(expenseByDateSummary);
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving expenses by date" });
//   }
// };