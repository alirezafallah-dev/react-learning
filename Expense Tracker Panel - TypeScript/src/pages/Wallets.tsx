import { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import { useApp } from "../context/AppContext";

const Wallets = () => {
  const { wallets, addWallet, deleteWallet, transferMoney } = useApp();
  const [openAdd, setOpenAdd] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: "" });
  const [transfer, setTransfer] = useState({ fromWalletId: "", toWalletId: "", amount: "" });

  const handleAddWallet = () => {
    const name = newWallet.name.trim();
    if (!name) { alert("نام کیف پول را وارد کنید"); return; }
    if (wallets.some((w) => w.name.trim() === name)) { alert("کیف پولی با این نام وجود دارد"); return; }
    addWallet({ name, balance: 0 });
    setNewWallet({ name: "" });
    setOpenAdd(false);
  };

  const handleTransfer = () => {
    if (!transfer.fromWalletId || !transfer.toWalletId || !transfer.amount) { alert("تمام فیلدها را پر کنید"); return; }
    const amount = parseFloat(transfer.amount);
    if (Number.isNaN(amount) || amount <= 0) { alert("مبلغ معتبر وارد کنید"); return; }
    if (transfer.fromWalletId === transfer.toWalletId) { alert("مبدا و مقصد نمی‌تواند یکسان باشد"); return; }
    const fromWallet = wallets.find((w) => w.id === transfer.fromWalletId);
    if (!fromWallet || fromWallet.balance < amount) { alert("موجودی کافی نیست"); return; }
    transferMoney(transfer.fromWalletId, transfer.toWalletId, amount);
    setTransfer({ fromWalletId: "", toWalletId: "", amount: "" });
    setOpenTransfer(false);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <Box dir="rtl" className="glass-card" sx={{ p: { xs: 2, md: 3 }, mb: 3, textAlign: "right" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}>کیف پول‌ ها</Typography>
          <Typography sx={{ color: "#9ca3af" }}>مدیریت حساب ‌های مالی شما</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={() => setOpenTransfer(true)} sx={{ borderColor: "#2a2a3a", color: "#f9fafb", borderRadius: "12px", height: 44, px: 2.5 }}>انتقال پول</Button>
          <Button variant="contained" onClick={() => setOpenAdd(true)} sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", borderRadius: "12px", height: 44, px: 3, fontWeight: 700 }}>کیف پول جدید</Button>
        </Box>
      </Box>

      <Card elevation={0} sx={{ mb: 4, background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", borderRadius: "20px", boxShadow: "0 10px 40px rgba(139, 92, 246, 0.3)" }}>
        <CardContent sx={{ p: 4, textAlign: "right" }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", mb: 1 }}>موجودی کل</Typography>
          <Typography variant="h3" sx={{ color: "#fff", fontWeight: 800, mb: 1 }}>{totalBalance.toLocaleString("fa-IR")}</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>تومان</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {wallets.length === 0 ? (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ p: 5, textAlign: "center", background: "rgba(26, 26, 36, 0.5)", border: "1px dashed #2a2a3a", borderRadius: "16px" }}>
              <Typography variant="h6" sx={{ color: "#9ca3af", mb: 1 }}>هیچ کیف پولی ثبت نشده است</Typography>
            </Card>
          </Grid>
        ) : (
          wallets.map((wallet) => (
            <Grid item xs={12} sm={6} md={4} key={wallet.id}>
              <Card elevation={0} sx={{ height: "100%", background: "rgba(26, 26, 36, 0.5)", border: "1px solid #2a2a3a", borderRadius: "16px", "&:hover": { transform: "translateY(-4px)", borderColor: "#8b5cf6" } }}>
                <CardContent sx={{ textAlign: "right" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: "14px", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)", border: "1px solid #8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#a78bfa", fontWeight: "bold" }}>
                        {wallet.name.charAt(0)}
                      </Box>
                      <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700 }}>{wallet.name}</Typography>
                    </Box>
                    <Button onClick={() => deleteWallet(wallet.id)} sx={{ color: "#ef4444", minWidth: "auto", borderRadius: "10px" }}>حذف</Button>
                  </Box>
                  <Divider sx={{ my: 2, borderColor: "#2a2a3a" }} />
                  <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 0.5 }}>موجودی</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: wallet.balance >= 0 ? "#10b981" : "#ef4444" }}>{wallet.balance.toLocaleString("fa-IR")} تومان</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#12121c", border: "1px solid #2b2b3d", borderRadius: "18px" } }}>
        <DialogTitle sx={{ color: "#f9fafb", fontWeight: 800, textAlign: "right", borderBottom: "1px solid #2a2a3a" }}>کیف پول جدید</DialogTitle>
        <DialogContent sx={{ pt: 3, direction: "rtl" }}>
          <TextField fullWidth label="نام کیف پول" value={newWallet.name} onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })} InputLabelProps={{ shrink: true }} autoFocus />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #2a2a3a" }}>
          <Button onClick={handleAddWallet} variant="contained" sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", borderRadius: "12px", px: 3, fontWeight: 700 }}>ذخیره</Button>
          <Button onClick={() => setOpenAdd(false)} sx={{ color: "#9ca3af" }}>لغو</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTransfer} onClose={() => setOpenTransfer(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#12121c", border: "1px solid #2b2b3d", borderRadius: "18px" } }}>
        <DialogTitle sx={{ color: "#f9fafb", fontWeight: 800, textAlign: "right", borderBottom: "1px solid #2a2a3a" }}>انتقال پول</DialogTitle>
        <DialogContent sx={{ pt: 3, direction: "rtl" }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>از کیف پول</InputLabel>
                <Select value={transfer.fromWalletId} onChange={(e) => setTransfer({ ...transfer, fromWalletId: e.target.value })} label="از کیف پول">
                  {wallets.map((w) => (<MenuItem key={w.id} value={w.id}>{w.name} ({w.balance.toLocaleString("fa-IR")})</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>به کیف پول</InputLabel>
                <Select value={transfer.toWalletId} onChange={(e) => setTransfer({ ...transfer, toWalletId: e.target.value })} label="به کیف پول">
                  {wallets.map((w) => (<MenuItem key={w.id} value={w.id}>{w.name} ({w.balance.toLocaleString("fa-IR")})</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="مبلغ" type="number" value={transfer.amount} onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #2a2a3a" }}>
          <Button onClick={handleTransfer} variant="contained" sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", borderRadius: "12px", px: 3, fontWeight: 700 }}>انتقال</Button>
          <Button onClick={() => setOpenTransfer(false)} sx={{ color: "#9ca3af" }}>لغو</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wallets;