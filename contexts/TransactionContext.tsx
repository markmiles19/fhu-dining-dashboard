import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type Transaction = {
  id: string;
  amount: number;
  description: string;
  tag: string;
};

type Section = {
  date: string;
  data: Transaction[];
};

type TransactionContextType = {
  sections: Section[];
  totalSpent: number;
  totalsByTag: Record<string, number>;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [sections, setSections] = useState<Section[]>([
    {
      date: '2025-09-29',
      data: [
        { id: '0929-1', amount: 6.45, description: 'Iced latte', tag: 'Starbucks' },
        { id: '0929-2', amount: 1, description: 'Lunch Meal Swipe', tag: 'Jones' },
        { id: '0929-3', amount: 1, description: 'Dinner Meal Swipe', tag: 'LP' },
      ],
    },
    {
      date: "2025-10-01",
      data: [
        { id: '1001-1', amount: 1, description: "Breakfast Meal Swipe", tag: "Jones" },
        { id: '1001-2', amount: 5.95, description: "Latte", tag: "Starbucks" },
        { id: '1001-3', amount: 1, description: "Dinner Meal Swipe", tag: "Jones" },
      ],
    },
    {
      date: "2025-10-02",
      data: [
        { id: '1002-1', amount: 1, description: "Breakfast Meal Swipe", tag: "LP" },
        { id: '1002-2', amount: 4.85, description: "Cookie", tag: "Starbucks" },
        { id: '1002-3', amount: 1, description: "Dinner Meal Swipe", tag: "Jones" },
      ]
    },
    {
      date: "2025-10-03",
      data: [
        { id: '1003-1', amount: 1, description: "Lunch Meal Swipe", tag: "Jones" },
        { id: '1003-2', amount: 1, description: "Dinner Meal Swipe", tag: "Jones" },
        { id: '1003-3', amount: 4.15, description: "Coffee", tag: "Starbucks" },
      ],
    },
    {
      date: "2025-10-04",
      data: [
        { id: '1004-1', amount: 5.65, description: "Flat White", tag: "Starbucks" },
        { id: '1004-2', amount: 1, description: "Lunch Meal Swipe", tag: "LP" },
        { id: '1004-3', amount: 1, description: "Chick-Fil-A Sandwich", tag: "CFA" },
      ],
    }
  ]);

  const totalSpent = useMemo(
      () =>
        sections.reduce(
          (sum, section) => sum + section.data.reduce((acc, t) => acc + t.amount, 0),
          0
        ),
      [sections]
    );

  const totalsByTag = useMemo(() => {
    const totals: Record<string, number> = {};
    sections.forEach((section) => {
      section.data.forEach((t) => {
        totals[t.tag] = (totals[t.tag] || 0) + t.amount;
      });
    });
    return totals;
  }, [sections]);

  const value = useMemo(
    () => ({ sections, totalSpent, totalsByTag, setSections }),
    [sections, totalSpent, totalsByTag]
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
};