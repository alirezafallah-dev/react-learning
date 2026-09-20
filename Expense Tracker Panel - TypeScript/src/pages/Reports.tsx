import { useMemo, useState } from "react";
import { Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useSelector } from "react-redux";
import { RootState, Transaction, TransactionType } from "../types";

const Reports = () => {
  const transactions = useSelector((state: RootState) => state.transactions);
  const [timeRange, setTimeRange] = useState("all");

  const pieData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    transactions.filter((t: Transaction) => t.type === "expense").forEach((t: Transaction) => {
      if (!categoryMap[t.category]) categoryMap[t.category] = 0;
      categoryMap[t.category] += t.amount;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const lineData = useMemo(() => {
    const dateMap: Record<string, { date: string; income: number; expense: number }> = {};
    transactions.forEach((t: Transaction) => {
      const date = new Date(t.date);
      const dateKey = timeRange === "month" ? date.toLocaleDateString("fa-IR", { month: "short", day: "numeric" }) : date.toLocaleDateString("fa-IR", { month: "short", year: "numeric" });
      if (!dateMap[dateKey]) dateMap[dateKey] = { date: dateKey, income: 0, expense: 0 };
      if (t.type === "income") dateMap[dateKey].income += t.amount;
      else dateMap[dateKey].expense += t.amount;
    });
    return Object.values(dateMap);
  }, [transactions, timeRange]);

  const stats = useMemo(() => {
    const income = transactions.filter((t: Transaction) => t.type === "income").reduce((s: number, t: Transaction) => s + t.amount, 0);
    const expense = transactions.filter((t: Transaction) => t.type === "expense").reduce((s: number, t: Transaction) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

  return (
    <Box className="glass-card" sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#f9fafb", mb: 0.5 }}>گزارش ها و تحلیل</Typography>
          <Typography sx={{ color: "#9ca3af" }}>تحلیل بصری هزینه‌ ها و درآمدها</Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>بازه زمانی</InputLabel>
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="بازه زمانی">
            <MenuItem value="month">ماه جاری</MenuItem>
            <MenuItem value="year">سال جاری</MenuItem>
            <MenuItem value="all">همه زمان‌ ها</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "16px" }}>
            <Typography sx={{ color: "#9ca3af", mb: 1 }}>کل درآمد</Typography>
            <Typography variant="h4" sx={{ color: "#10b981", fontWeight: 700 }}>{stats.income.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "16px" }}>
            <Typography sx={{ color: "#9ca3af", mb: 1 }}>کل هزینه</Typography>
            <Typography variant="h4" sx={{ color: "#ef4444", fontWeight: 700 }}>{stats.expense.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)", border: "1px solid rgba(139, 92, 246, 0.3)", borderRadius: "16px" }}>
            <Typography sx={{ color: "#9ca3af", mb: 1 }}>خالص</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: stats.balance >= 0 ? "#10b981" : "#ef4444" }}>{stats.balance.toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, background: "rgba(26, 26, 36, 0.5)", border: "1px solid #2a2a3a", borderRadius: "16px", height: "100%" }}>
            <Typography variant="h6" sx={{ color: "#f9fafb", mb: 3, fontWeight: 600 }}>هزینه‌ها بر اساس دسته‌بندی</Typography>
            {pieData.length === 0 ? (
              <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#9ca3af" }}>داده‌ای برای نمایش نیست</Typography>
              </Box>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={110} dataKey="value" stroke="#0a0a0f" strokeWidth={3}>
                      {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: "10px", color: "#f9fafb" }} formatter={(value: any) => [`${value.toLocaleString()} تومان`, "مبلغ"]} />
                    <Legend wrapperStyle={{ color: "#9ca3af", paddingTop: "20px" }} />
                  </PieChart>
                </ResponsiveContainer>
                {pieData[0] && (
                  <Box sx={{ mt: 2, p: 2, background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.3)", borderRadius: "10px" }}>
                    <Typography variant="body2" sx={{ color: "#f9fafb" }}>
                      بیشترین هزینه در <strong style={{ color: "#8b5cf6" }}>{pieData[0].name}</strong> با {pieData[0].value.toLocaleString()} تومان
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, background: "rgba(26, 26, 36, 0.5)", border: "1px solid #2a2a3a", borderRadius: "16px", height: "100%" }}>
            <Typography variant="h6" sx={{ color: "#f9fafb", mb: 3, fontWeight: 600 }}>روند درآمد و هزینه</Typography>
            {lineData.length === 0 || lineData.every((d) => d.income === 0 && d.expense === 0) ? (
              <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#9ca3af" }}>داده‌ای برای نمایش نیست</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: "10px", color: "#f9fafb" }} formatter={(value: any) => `${value.toLocaleString()} تومان`} />
                  <Legend wrapperStyle={{ paddingTop: "20px", color: "#9ca3af" }} />
                  <Line type="monotone" dataKey="income" name="درآمد" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8, fill: "#10b981" }} />
                  <Line type="monotone" dataKey="expense" name="هزینه" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 8, fill: "#ef4444" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;