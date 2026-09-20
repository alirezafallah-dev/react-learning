import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { useApp } from "../context/AppContext";

const dialogBackdropProps = {
  sx: {
    backgroundColor: "rgba(2, 3, 8, 0.88) !important",
    backdropFilter: "none !important",
    WebkitBackdropFilter: "none !important",
  },
};

const getDialogPaperProps = (maxWidth = 560) => ({
  component: "div",
  dir: "rtl",
  sx: {
    width: "100%",
    maxWidth,
    background: "#12121c !important",
    backgroundColor: "#12121c !important",
    backgroundImage: "none !important",
    border: "1px solid #2b2b3d",
    borderRadius: "18px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.65)",
    backdropFilter: "none !important",
    WebkitBackdropFilter: "none !important",
    overflow: "hidden",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
});

const rtlInputsSx = {
  direction: "rtl",
  textAlign: "right",
  colorScheme: "dark",

  "& .MuiInputLabel-root": {
    right: 18,
    left: "auto",
    transformOrigin: "right",
    transform: "translate(0, 16px) scale(1)",
    color: "#9ca3af",
    "&.Mui-focused": { color: "#a78bfa" },
  },

  "& .MuiInputLabel-shrinked": {
    transform: "translate(0, -9px) scale(0.75) !important",
  },

  "& .MuiOutlinedInput-root": {
    direction: "rtl",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    colorScheme: "dark",
    "& fieldset": { borderColor: "#2a2a3a" },
    "&:hover fieldset": { borderColor: "#7c3aed" },
    "&.Mui-focused fieldset": { borderColor: "#8b5cf6" },
  },

  "& .MuiOutlinedInput-input": {
    direction: "rtl",
    textAlign: "right",
    color: "#f9fafb",
    padding: "16px 16px",
  },

  "& textarea.MuiOutlinedInput-input": {
    padding: "14px 16px",
    lineHeight: 1.8,
  },

  "& .MuiSelect-select": {
    direction: "rtl",
    textAlign: "right",
    color: "#f9fafb",
    paddingRight: "16px !important",
    paddingLeft: "42px !important",
  },

  "& .MuiSelect-icon": {
    right: "auto",
    left: 10,
    color: "#9ca3af",
  },
};

const getDialogContentSx = () => ({
  px: 3,
  py: 3,
  overflowY: "auto",
  flex: "1 1 auto",
  direction: "rtl",
  textAlign: "right",
  background: "#12121c",
  ...rtlInputsSx,
});

const dialogTitleSx = {
  color: "#f9fafb",
  fontWeight: 800,
  fontSize: "1.1rem",
  textAlign: "right",
  direction: "rtl",
  borderBottom: "1px solid #2a2a3a",
  px: 3,
  py: 2.25,
  background: "#12121c",
  flexShrink: 0,
};

const dialogActionsSx = {
  p: 2,
  px: 3,
  py: 2.5,
  gap: 1,
  borderTop: "1px solid #2a2a3a",
  justifyContent: "flex-start",
  direction: "rtl",
  background: "#12121c",
  flexShrink: 0,
};

const primaryButtonSx = {
  background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
  boxShadow: "0 8px 22px rgba(139,92,246,0.25)",
  borderRadius: "12px",
  px: 3,
  height: 42,
  fontWeight: 700,
  "&:hover": {
    boxShadow: "0 10px 26px rgba(139,92,246,0.34)",
  },
};

const cancelButtonSx = {
  color: "#9ca3af",
  borderRadius: "12px",
  px: 2.5,
  height: 42,
  "&:hover": {
    background: "rgba(255,255,255,0.05)",
    color: "#f9fafb",
  },
};

const menuProps = {
  dir: "rtl",
  anchorOrigin: { vertical: "bottom", horizontal: "right" },
  transformOrigin: { vertical: "top", horizontal: "right" },
  PaperProps: {
    sx: {
      direction: "rtl",
      textAlign: "right",
      mt: 1,
      minWidth: 210,
      background: "#12121c !important",
      backgroundColor: "#12121c !important",
      backgroundImage: "none !important",
      border: "1px solid #2b2b3d",
      borderRadius: "12px",
      boxShadow: "0 16px 45px rgba(0,0,0,0.55)",
      backdropFilter: "none !important",
      WebkitBackdropFilter: "none !important",
      "& .MuiMenuItem-root": {
        color: "#e5e7eb",
        fontSize: "0.875rem",
        py: 1,
        "&:hover": { background: "rgba(139,92,246,0.10)" },
        "&.Mui-selected": { background: "rgba(139,92,246,0.14)" },
        "&.Mui-selected:hover": { background: "rgba(139,92,246,0.18)" },
      },
    },
  },
};

const Wallets = () => {
  const { wallets, addWallet, deleteWallet, transferMoney } = useApp();

  const [openAdd, setOpenAdd] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: "" });
  const [transfer, setTransfer] = useState({
    fromWalletId: "",
    toWalletId: "",
    amount: "",
  });

  const handleAddWallet = () => {
    const name = newWallet.name.trim();

    if (!name) {
      return alert("نام کیف پول را وارد کنید");
    }

    if (wallets.some((w) => w.name.trim() === name)) {
      return alert("کیف پولی با این نام وجود دارد");
    }

    addWallet({ name, balance: 0 });
    setNewWallet({ name: "" });
    setOpenAdd(false);
  };

  const handleTransfer = () => {
    if (!transfer.fromWalletId || !transfer.toWalletId || !transfer.amount) {
      return alert("تمام فیلدها را پر کنید");
    }

    const amount = parseFloat(transfer.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      return alert("مبلغ معتبر وارد کنید");
    }

    if (transfer.fromWalletId === transfer.toWalletId) {
      return alert("مبدا و مقصد نمی‌تواند یکسان باشد");
    }

    const fromWallet = wallets.find((w) => w.id === transfer.fromWalletId);

    if (!fromWallet || fromWallet.balance < amount) {
      return alert("موجودی کیف پول مبدا کافی نیست");
    }

    transferMoney(transfer.fromWalletId, transfer.toWalletId, amount);
    setTransfer({ fromWalletId: "", toWalletId: "", amount: "" });
    setOpenTransfer(false);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <Box
      dir="rtl"
      className="glass-card"
      sx={{ p: { xs: 2, md: 3 }, mb: 3, textAlign: "right" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}
          >
            کیف پول‌ ها
          </Typography>
          <Typography sx={{ color: "#9ca3af" }}>
            مدیریت حساب ‌های مالی شما
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() => setOpenTransfer(true)}
            sx={{
              borderColor: "#2a2a3a",
              color: "#f9fafb",
              borderRadius: "12px",
              height: 44,
              px: 2.5,
              "&:hover": {
                borderColor: "#8b5cf6",
                background: "rgba(139,92,246,0.08)",
              },
            }}
          >
            انتقال پول
          </Button>

          <Button
            variant="contained"
            onClick={() => setOpenAdd(true)}
            sx={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
              boxShadow: "0 8px 22px rgba(139,92,246,0.28)",
              borderRadius: "12px",
              height: 44,
              px: 3,
              fontWeight: 700,
              "&:hover": {
                boxShadow: "0 10px 28px rgba(139,92,246,0.36)",
              },
            }}
          >
            کیف پول جدید
          </Button>
        </Box>
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(139, 92, 246, 0.3)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <CardContent sx={{ p: 4, position: "relative", textAlign: "right" }}>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.85)", mb: 1 }}
          >
            موجودی کل
          </Typography>
          <Typography
            variant="h3"
            sx={{ color: "#fff", fontWeight: 800, mb: 1 }}
          >
            {totalBalance.toLocaleString("fa-IR")}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
            تومان
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {wallets.length === 0 ? (
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                background: "rgba(26, 26, 36, 0.5)",
                border: "1px dashed #2a2a3a",
                borderRadius: "16px",
              }}
            >
              <Typography variant="h6" sx={{ color: "#9ca3af", mb: 1 }}>
                هیچ کیف پولی ثبت نشده است
              </Typography>
              <Typography sx={{ color: "#6b7280" }}>
                برای ایجاد کیف پول جدید روی دکمه «کیف پول جدید» کلیک کنید
              </Typography>
            </Card>
          </Grid>
        ) : (
          wallets.map((wallet) => (
            <Grid item xs={12} sm={6} md={4} key={wallet.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  background: "rgba(26, 26, 36, 0.5)",
                  border: "1px solid #2a2a3a",
                  borderRadius: "16px",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "#8b5cf6",
                    boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "right" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "14px",
                          background:
                            "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
                          border: "1px solid #8b5cf6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          color: "#a78bfa",
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        {wallet.name ? wallet.name.charAt(0) : ""}
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          color: "#f9fafb",
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {wallet.name}
                      </Typography>
                    </Box>

                    <Button
                      onClick={() => deleteWallet(wallet.id)}
                      sx={{
                        color: "#ef4444",
                        minWidth: "auto",
                        flexShrink: 0,
                        borderRadius: "10px",
                        "&:hover": { background: "rgba(239, 68, 68, 0.1)" },
                      }}
                    >
                      حذف
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: "#2a2a3a" }} />

                  <Typography
                    sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 0.5 }}
                  >
                    موجودی
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: wallet.balance >= 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {wallet.balance.toLocaleString("fa-IR")} تومان
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        BackdropProps={dialogBackdropProps}
        PaperProps={getDialogPaperProps(500)}
      >
        <DialogTitle sx={dialogTitleSx}>کیف پول جدید</DialogTitle>

        <DialogContent sx={getDialogContentSx()}>
          <TextField
            fullWidth
            size="medium"
            label="نام کیف پول"
            value={newWallet.name}
            onChange={(e) =>
              setNewWallet({ ...newWallet, name: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button
            onClick={handleAddWallet}
            variant="contained"
            sx={primaryButtonSx}
          >
            ذخیره
          </Button>
          <Button onClick={() => setOpenAdd(false)} sx={cancelButtonSx}>
            لغو
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openTransfer}
        onClose={() => setOpenTransfer(false)}
        fullWidth
        maxWidth="sm"
        BackdropProps={dialogBackdropProps}
        PaperProps={getDialogPaperProps(560)}
      >
        <DialogTitle sx={dialogTitleSx}>انتقال پول</DialogTitle>

        <DialogContent sx={getDialogContentSx()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FormControl fullWidth size="medium">
                <InputLabel shrink>از کیف پول</InputLabel>
                <Select
                  displayEmpty
                  value={transfer.fromWalletId}
                  onChange={(e) =>
                    setTransfer({ ...transfer, fromWalletId: e.target.value })
                  }
                  label="از کیف پول"
                  renderValue={(selected) =>
                    wallets.find((w) => w.id === selected)?.name ||
                    "انتخاب کنید"
                  }
                  MenuProps={menuProps}
                >
                  {wallets.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name} ({w.balance.toLocaleString("fa-IR")})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="medium">
                <InputLabel shrink>به کیف پول</InputLabel>
                <Select
                  displayEmpty
                  value={transfer.toWalletId}
                  onChange={(e) =>
                    setTransfer({ ...transfer, toWalletId: e.target.value })
                  }
                  label="به کیف پول"
                  renderValue={(selected) =>
                    wallets.find((w) => w.id === selected)?.name ||
                    "انتخاب کنید"
                  }
                  MenuProps={menuProps}
                >
                  {wallets.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name} ({w.balance.toLocaleString("fa-IR")})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="مبلغ"
                type="number"
                inputProps={{ min: 0, step: "any" }}
                value={transfer.amount}
                onChange={(e) =>
                  setTransfer({ ...transfer, amount: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button
            onClick={handleTransfer}
            variant="contained"
            sx={primaryButtonSx}
          >
            انتقال
          </Button>
          <Button onClick={() => setOpenTransfer(false)} sx={cancelButtonSx}>
            لغو
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wallets;
