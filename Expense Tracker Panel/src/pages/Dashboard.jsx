import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { useSelector } from "react-redux";
import { useApp } from "../context/AppContext";

const Dashboard = () => {
  const transactions = useSelector((state) => state.transactions);
  const { wallets, currentUser, categories } = useApp();
  
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;
    const totalWalletBalance = wallets.reduce((s, w) => s + w.balance, 0);
    return { income, expense, balance, totalWalletBalance };
  }, [transactions, wallets]);

  const pieData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!map[t.category]) map[t.category] = 0;
        map[t.category] += t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const lineData = useMemo(() => {
    const map = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("fa-IR", {
        month: "short",
        day: "numeric",
      });
      map[key] = { date: key, income: 0, expense: 0 };
    }
    transactions.forEach((t) => {
      const key = new Date(t.date).toLocaleDateString("fa-IR", {
        month: "short",
        day: "numeric",
      });
      if (map[key]) {
        if (t.type === "income") map[key].income += t.amount;
        else map[key].expense += t.amount;
      }
    });
    return Object.values(map);
  }, [transactions]);

  const PIE_COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#ec4899",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* هدر خوش‌ آمدگویی */}
      <Box sx={{ mb: 4 }}>
        <Box
          className="glass-card"
          sx={{ p: 3, position: "relative", overflow: "hidden" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              left: -50,
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#f9fafb",
              mb: 0.5,
              position: "relative",
            }}
          >
            خوش آمدید، {currentUser?.username}
          </Typography>
          <Typography
            sx={{ color: "#9ca3af", fontSize: "0.95rem", position: "relative" }}
          >
            {new Date().toLocaleDateString("fa-IR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Box>

      {/* کارت‌ های آماری */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        <StatCard title="کل درآمد" value={stats.income} color="#10b981" />
        <StatCard title="کل هزینه" value={stats.expense} color="#ef4444" />
        <StatCard
          title="موجودی کل"
          value={stats.totalWalletBalance}
          color="#3b82f6"
        />
        <StatCard
          title="تراز مالی"
          value={stats.balance}
          color={stats.balance >= 0 ? "#10b981" : "#ef4444"}
        />
      </Box>

      {/* نمودارها */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Pie Chart */}
        <Box className="glass-card" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#f9fafb", mb: 0.5 }}
            >
              توزیع هزینه‌ ها
            </Typography>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              بر اساس دسته‌ بندی
            </Typography>
          </Box>
          {pieData.length === 0 ? (
            <Box
              sx={{
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              <Typography>داده‌ای برای نمایش نیست</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  {PIE_COLORS.map((color, i) => (
                    <linearGradient
                      key={i}
                      id={`pieGrad${i}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="rgba(10, 10, 15, 0.8)"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#pieGrad${index % PIE_COLORS.length})`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(26, 26, 36, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "12px",
                    color: "#f9fafb",
                    fontFamily: "Vazir",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()} تومان`,
                    "مبلغ",
                  ]}
                />
                <Legend
                  wrapperStyle={{ color: "#9ca3af", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Line Chart */}
        <Box className="glass-card" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#f9fafb", mb: 0.5 }}
            >
              روند مالی
            </Typography>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              ۳۰ روز اخیر
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(42, 42, 58, 0.4)"
              />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: "11px", fontFamily: "Vazir" }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: "11px", fontFamily: "Vazir" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 26, 36, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "12px",
                  color: "#f9fafb",
                  fontFamily: "Vazir",
                }}
                formatter={(value) => `${value.toLocaleString()} تومان`}
              />
              <Legend wrapperStyle={{ color: "#9ca3af", paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey="income"
                name="درآمد"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="هزینه"
                stroke="#ef4444"
                strokeWidth={3}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* آخرین تراکنش‌ ها */}
      <Box className="glass-card" sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#f9fafb", mb: 0.5 }}
          >
            آخرین تراکنش‌ ها
          </Typography>
          <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            5 تراکنش اخیر شما
          </Typography>
        </Box>
        {transactions.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 5, color: "#6b7280" }}>
            هنوز تراکنشی ثبت نشده است
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {transactions.slice(0, 5).map((t) => {
              const cat = categories.find((c) => c.name === t.category);
              return (
                <Box
                  key={t.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    background: "rgba(42, 42, 58, 0.3)",
                    border: "1px solid rgba(42, 42, 58, 0.6)",
                    borderRadius: "14px",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "rgba(139, 92, 246, 0.08)",
                      borderColor: "rgba(139, 92, 246, 0.3)",
                      transform: "translateX(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, ${cat?.color || "#8b5cf6"}40, ${cat?.color || "#8b5cf6"}20)`,
                        border: `1px solid ${cat?.color || "#8b5cf6"}60`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        color: cat?.color || "#8b5cf6",
                        fontWeight: "bold",
                      }}
                    >
                      {cat?.name ? cat.name.charAt(0) : "T"}
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontWeight: 600, color: "#f9fafb", mb: 0.3 }}
                      >
                        {t.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                        {t.category} •{" "}
                        {new Date(t.date).toLocaleDateString("fa-IR")}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: t.type === "income" ? "#10b981" : "#ef4444",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {t.amount.toLocaleString()}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const StatCard = ({ title, value, color }) => (
  <Box
    className="glass-card"
    sx={{ p: 3, position: "relative", overflow: "hidden" }}
  >
    <Box
      sx={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
        filter: "blur(20px)",
        pointerEvents: "none",
      }}
    />
    <Typography
      sx={{
        color: "#9ca3af",
        fontSize: "0.875rem",
        mb: 1,
        position: "relative",
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontSize: "1.75rem",
        fontWeight: 800,
        color: color,
        position: "relative",
        mb: 0.5,
      }}
    >
      {value.toLocaleString()}
    </Typography>
    <Typography
      sx={{ color: "#6b7280", fontSize: "0.75rem", position: "relative" }}
    >
      تومان
    </Typography>
  </Box>
);

export default Dashboard;
