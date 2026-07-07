"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlyData = [
  { month: "Jan", products: 22, contacts: 18, reviews: 9 },
  { month: "Feb", products: 28, contacts: 24, reviews: 12 },
  { month: "Mar", products: 35, contacts: 21, reviews: 17 },
  { month: "Apr", products: 38, contacts: 31, reviews: 21 },
  { month: "May", products: 44, contacts: 28, reviews: 24 },
  { month: "Jun", products: 52, contacts: 36, reviews: 29 },
];

const mixData = [
  { name: "Power", value: 44 },
  { name: "Control", value: 28 },
  { name: "House Wiring", value: 36 },
  { name: "Industrial", value: 22 },
];

export function MonthlySignalsChart() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <AreaChart data={monthlyData}>
          <defs>
            <linearGradient id="products" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#174ea6" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#174ea6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
          <Area type="monotone" dataKey="products" stroke="#174ea6" fill="url(#products)" strokeWidth={2} />
          <Area type="monotone" dataKey="contacts" stroke="#f97316" fill="#f9731622" strokeWidth={2} />
          <Area type="monotone" dataKey="reviews" stroke="#10b981" fill="#10b98122" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CatalogMixChart() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={mixData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
          <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
