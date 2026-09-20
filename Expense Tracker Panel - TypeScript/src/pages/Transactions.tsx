import { useState, useMemo, ChangeEvent } from "react";
import {
  Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Typography, Chip,
} from "@mui/material";
import { useApp } from "../context/AppContext";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction, deleteTransaction } from "../store/transactionsSlice";
import { exportToCSV, importFromCSV } from "../utils/csvUtils";
import { RootState, Transaction, TransactionType } from "../types";

const Transactions = () => {
  const { categories, wallets, updateWalletBalance } = useApp();
  const transactions = useSelector((state: RootState) => state.transactions);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [formData, setFormData] = useState<{
    title: string;
    amount: string;
    type: TransactionType;
    category: string;
    walletId: string;
    date: string;
    description: string;
  }>({
    title: "", amount: "", type: "expense", category: "",
    walletId: "", date: new Date().toISOString().split("T")[0], description: "",
  });

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return transactions.filter((t: Transaction) => {
      const title = (t.title || "").toLowerCase();
      const matchesSearch = !term || title.includes(term);
      const matchesCategory = !filterCategory || t.category === filterCategory;
      const matchesType = !filterType || t.type === filterType;
      const transactionDate = new Date(t.date);
      const matchesDateFrom = !dateFrom || transactionDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || transactionDate <= new Date(dateTo + "T23:59:59");
      return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [transactions, searchTerm, filterCategory, filterType, dateFrom, dateTo]);

  const filteredStats = useMemo(() => {
    const income = filteredTransactions.filter((t: Transaction) => t.type === "income").reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    const expense = filteredTransactions.filter((t: Transaction) => t.type === "expense").reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const clearFilters = () => { setSearchTerm(""); setFilterCategory(""); setFilterType(""); setDateFrom(""); setDateTo(""); };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.amount || !formData.category || !formData.walletId) {
      alert("لطفا تمام فیلدها را پر کنید"); return;
    }
    const amount = parseFloat(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) { alert("مبلغ معتبر وارد کنید"); return; }

    dispatch(addTransaction({ ...formData, title: formData.title.trim(), amount }));

    const wallet = wallets.find((w) => w.id === formData.walletId);
    if (wallet) {
      const changeAmount = formData.type === "income" ? amount : -amount;
      updateWalletBalance(wallet.id, wallet.balance + changeAmount);
    }

    setFormData({ title: "", amount: "", type: "expense", category: "", walletId: "", date: new Date().toISOString().split("T")[0], description: "" });
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const t = transactions.find((tx: Transaction) => tx.id === id);
    if (t) {
      dispatch(deleteTransaction(id));
      const wallet = wallets.find((w) => w.id === t.walletId);
      if (wallet) {
        const changeAmount = t.type === "income" ? -t.amount : t.amount;
        updateWalletBalance(wallet.id, wallet.balance + changeAmount);
      }
    }
  };

  const handleExport = () => exportToCSV(transactions as any, "transactions");

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const data = await importFromCSV(file);
      data.forEach((t: any) => {
        if (t.title && t.amount) {
          const amount = parseFloat(t.amount);
          dispatch(addTransaction({
            title: t.title.trim(), amount,
            type: t.type === "income" ? "income" : "expense",
            category: t.category || "", walletId: t.walletId || "",
            date: t.date || new Date().toISOString().split("T")[0],
            description: t.description || "",
          }));
          if (t.walletId) {
            const wallet = wallets.find((w) => w.id === t.walletId);
            if (wallet) {
              const changeAmount = (t.type === "income" ? 1 : -1) * amount;
              updateWalletBalance(wallet.id, wallet.balance + changeAmount);
            }
          }
        }
      });
    } catch (error) { alert("خطا در خواندن فایل"); }
  };

  return (
    <Box dir="rtl" className="glass-card" sx={{ p: { xs: 2, md: 3 }, mb: 3, textAlign: "right" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}>تراکنش‌ ها</Typography>
          <Typography sx={{ color: "#9ca3af" }}>مدیریت و مشاهده تمام تراکنش‌ های مالی</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={handleExport} sx={{ borderColor: "#2a2a3a", color: "#f9fafb", borderRadius: "12px", height: 44, px: 2.5, "&:hover": { borderColor: "#8b5cf6", background: "rgba(139,92,246,0.08)" } }}>خروجی</Button>
          <Button variant="outlined" component="label" sx={{ borderColor: "#2a2a3a", color: "#f9fafb", borderRadius: "12px", height: 44, px: 2.5, "&:hover": { borderColor: "#8b5cf6", background: "rgba(139,92,246,0.08)" } }}>
            ورودی<input type="file" hidden accept=".csv" onChange={handleImport} />
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)}
            sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", boxShadow: "0 8px 22px rgba(139,92,246,0.28)", borderRadius: "12px", height: 44, px: 3, fontWeight: 700, "&:hover": { boxShadow: "0 10px 28px rgba(139,92,246,0.36)" } }}>
            تراکنش جدید
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "16px", textAlign: "right" }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 1 }}>درآمد (فیلتر شده)</Typography>
            <Typography variant="h4" sx={{ color: "#10b981", fontWeight: 800 }}>+{filteredStats.income.toLocaleString("fa-IR")}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "16px", textAlign: "right" }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 1 }}>هزینه (فیلتر شده)</Typography>
            <Typography variant="h4" sx={{ color: "#ef4444", fontWeight: 800 }}>-{filteredStats.expense.toLocaleString("fa-IR")}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)", border: "1px solid rgba(139, 92, 246, 0.3)", borderRadius: "16px", textAlign: "right" }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 1 }}>خالص (فیلتر شده)</Typography>
            <Typography variant="h4" sx={{ color: filteredStats.balance >= 0 ? "#10b981" : "#ef4444", fontWeight: 800 }}>{filteredStats.balance.toLocaleString("fa-IR")}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, mb: 3, background: "rgba(26, 26, 36, 0.5)", border: "1px solid #2a2a3a", borderRadius: "16px", direction: "rtl", textAlign: "right" }}>
        <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700, mb: 2.5 }}>فیلترها و جستجو</Typography>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth placeholder="جستجو..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel shrink>دسته‌ بندی</InputLabel>
              <Select displayEmpty value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} label="دسته‌ بندی" renderValue={(selected) => selected || "همه"}>
                <MenuItem value="">همه</MenuItem>
                {categories.map((c) => (<MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel shrink>نوع</InputLabel>
              <Select displayEmpty value={filterType} onChange={(e) => setFilterType(e.target.value)} label="نوع" renderValue={(selected) => selected === "income" ? "درآمد" : selected === "expense" ? "هزینه" : "همه"}>
                <MenuItem value="">همه</MenuItem>
                <MenuItem value="income">درآمد</MenuItem>
                <MenuItem value="expense">هزینه</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="از تاریخ" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="تا تاریخ" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="outlined" onClick={clearFilters}
              sx={{ height: 56, minHeight: 56, borderColor: "#2a2a3a", color: "#9ca3af", borderRadius: "12px", "&:hover": { borderColor: "#ef4444", color: "#ef4444", background: "rgba(239,68,68,0.06)" } }}>
              پاک کردن فیلترها
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ background: "rgba(26, 26, 36, 0.5)", border: "1px solid #2a2a3a", borderRadius: "16px", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 780 }}>
            <TableHead>
              <TableRow sx={{ background: "rgba(139, 92, 246, 0.05)" }}>
                <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>عنوان</TableCell>
                <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>مبلغ</TableCell>
                <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>نوع</TableCell>
                <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>دسته‌ بندی</TableCell>
                <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>کیف پول</TableCell>
                <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>تاریخ</TableCell>
                <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 8, color: "#9ca3af" }}>تراکنشی یافت نشد</TableCell></TableRow>
              ) : (
                filteredTransactions.map((t: Transaction) => (
                  <TableRow key={t.id} sx={{ "&:hover": { background: "rgba(139, 92, 246, 0.05)" } }}>
                    <TableCell align="right" sx={{ color: "#f9fafb" }}>{t.title}</TableCell>
                    <TableCell align="right" sx={{ color: "#f9fafb", fontWeight: 700 }}>{t.amount.toLocaleString("fa-IR")}</TableCell>
                    <TableCell align="right">
                      <Chip label={t.type === "income" ? "درآمد" : "هزینه"} size="small"
                        sx={{ background: t.type === "income" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: t.type === "income" ? "#10b981" : "#ef4444", fontWeight: 700 }} />
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#9ca3af" }}>{t.category}</TableCell>
                    <TableCell align="right" sx={{ color: "#9ca3af" }}>{wallets.find((w) => w.id === t.walletId)?.name || "—"}</TableCell>
                    <TableCell align="right" sx={{ color: "#9ca3af" }}>{new Date(t.date).toLocaleDateString("fa-IR")}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleDelete(t.id)} sx={{ color: "#ef4444", minWidth: "auto", borderRadius: "10px", "&:hover": { background: "rgba(239, 68, 68, 0.1)" } }}>حذف</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#12121c", border: "1px solid #2b2b3d", borderRadius: "18px" } }}>
        <DialogTitle sx={{ color: "#f9fafb", fontWeight: 800, textAlign: "right", borderBottom: "1px solid #2a2a3a" }}>تراکنش جدید</DialogTitle>
        <DialogContent sx={{ pt: 3, direction: "rtl" }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}><TextField fullWidth label="عنوان" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} InputLabelProps={{ shrink: true }} autoFocus /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="مبلغ" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink>نوع</InputLabel>
                <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })} label="نوع">
                  <MenuItem value="income">درآمد</MenuItem>
                  <MenuItem value="expense">هزینه</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink>دسته‌ بندی</InputLabel>
                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} label="دسته‌ بندی">
                  {categories.map((c) => (<MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink>کیف پول</InputLabel>
                <Select value={formData.walletId} onChange={(e) => setFormData({ ...formData, walletId: e.target.value })} label="کیف پول">
                  {wallets.map((w) => (<MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="تاریخ" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="توضیحات" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #2a2a3a" }}>
          <Button onClick={handleSubmit} variant="contained" sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", borderRadius: "12px", px: 3, fontWeight: 700 }}>ذخیره</Button>
          <Button onClick={() => setOpen(false)} sx={{ color: "#9ca3af" }}>لغو</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;