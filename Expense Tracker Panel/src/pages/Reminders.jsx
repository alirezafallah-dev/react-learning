import { useState, useEffect } from "react";
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
  Alert,
  Chip,
} from "@mui/material";
import { useApp } from "../context/AppContext";

const dialogBackdropProps = {
  sx: {
    backgroundColor: "rgba(2, 3, 8, 0.88) !important",
    backdropFilter: "none !important",
    WebkitBackdropFilter: "none !important",
  },
};

const getDialogPaperProps = (maxWidth = 620) => ({
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

const Reminders = () => {
  const { reminders, addReminder, deleteReminder } = useApp();

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    frequency: "monthly",
    nextDueDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const dueReminders = reminders.filter((r) => r.nextDueDate === today);

    if (dueReminders.length > 0) {
      setAlertMessage(
        `شما ${dueReminders.length.toLocaleString("fa-IR")} یادآوری سررسید شده دارید!`,
      );

      if ("Notification" in window && Notification.permission === "granted") {
        dueReminders.forEach((r) => {
          new Notification(`یادآوری: ${r.title}`, {
            body: `مبلغ: ${r.amount.toLocaleString("fa-IR")} تومان`,
          });
        });
      }
    }
  }, [reminders]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      setAlertMessage("اعلان‌ها فعال شدند!");
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.amount || !formData.nextDueDate) {
      return alert("فیلدهای ضروری را پر کنید");
    }

    const amount = parseFloat(formData.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      return alert("مبلغ معتبر وارد کنید");
    }

    addReminder({
      ...formData,
      title: formData.title.trim(),
      amount,
    });

    setFormData({
      title: "",
      amount: "",
      frequency: "monthly",
      nextDueDate: new Date().toISOString().split("T")[0],
      description: "",
    });

    setOpen(false);
  };

  const getFrequencyLabel = (freq) =>
    ({
      weekly: "هفتگی",
      monthly: "ماهانه",
      yearly: "سالانه",
    })[freq] || freq;

  const getStatus = (date) => {
    if (!date) return "pending";
    if (date < todayStr) return "overdue";
    if (date === todayStr) return "today";
    return "pending";
  };

  const getStatusLabel = (status) => {
    if (status === "overdue") return "سررسید گذشته";
    if (status === "today") return "سررسید امروز";
    return "در انتظار";
  };

  const getStatusColor = (status) => {
    if (status === "overdue") return "#ef4444";
    if (status === "today") return "#f59e0b";
    return "#10b981";
  };

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
            یادآوری‌ ها
          </Typography>
          <Typography sx={{ color: "#9ca3af" }}>
            هزینه‌ های دوره‌ای و سررسیدها
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={requestNotificationPermission}
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
            فعال‌ سازی اعلان
          </Button>

          <Button
            variant="contained"
            onClick={() => setOpen(true)}
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
            یادآوری جدید
          </Button>
        </Box>
      </Box>

      {alertMessage && (
        <Alert
          severity="warning"
          dir="rtl"
          sx={{
            mb: 3,
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            color: "#f59e0b",
            borderRadius: "12px",
            textAlign: "right",
          }}
          onClose={() => setAlertMessage("")}
        >
          {alertMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {reminders.length === 0 ? (
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
              <Typography variant="h5" sx={{ color: "#9ca3af", mb: 1 }}>
                هیچ یادآوری ثبت نشده است
              </Typography>
              <Typography sx={{ color: "#6b7280" }}>
                برای ثبت یادآوری جدید روی دکمه بالا کلیک کنید
              </Typography>
            </Card>
          </Grid>
        ) : (
          reminders.map((reminder) => {
            const status = getStatus(reminder.nextDueDate);
            const statusColor = getStatusColor(status);
            const borderColor =
              status === "overdue"
                ? "#ef4444"
                : status === "today"
                  ? "#f59e0b"
                  : "#2a2a3a";

            return (
              <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    background: "rgba(26, 26, 36, 0.5)",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "16px",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 10px 30px ${statusColor}22`,
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
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#f9fafb",
                          fontWeight: 700,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {reminder.title}
                      </Typography>

                      <Button
                        onClick={() => deleteReminder(reminder.id)}
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

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        background:
                          "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {reminder.amount.toLocaleString("fa-IR")}
                    </Typography>

                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={getFrequencyLabel(reminder.frequency)}
                        size="small"
                        sx={{
                          background: "rgba(139, 92, 246, 0.15)",
                          color: "#8b5cf6",
                          border: "1px solid #8b5cf640",
                          fontWeight: 700,
                        }}
                      />

                      <Chip
                        label={getStatusLabel(status)}
                        size="small"
                        sx={{
                          background: `${statusColor}20`,
                          color: statusColor,
                          border: `1px solid ${statusColor}40`,
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: "#9ca3af", mb: 1 }}
                    >
                      تاریخ بعدی:{" "}
                      {new Date(reminder.nextDueDate).toLocaleDateString(
                        "fa-IR",
                      )}
                    </Typography>

                    {reminder.description && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#9ca3af", mt: 1 }}
                      >
                        {reminder.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        BackdropProps={dialogBackdropProps}
        PaperProps={getDialogPaperProps(620)}
      >
        <DialogTitle sx={dialogTitleSx}>یادآوری جدید</DialogTitle>

        <DialogContent sx={getDialogContentSx()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="عنوان"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="medium"
                label="مبلغ"
                type="number"
                inputProps={{ min: 0, step: "any" }}
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="medium">
                <InputLabel shrink>تکرار</InputLabel>
                <Select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  label="تکرار"
                  MenuProps={menuProps}
                >
                  <MenuItem value="weekly">هفتگی</MenuItem>
                  <MenuItem value="monthly">ماهانه</MenuItem>
                  <MenuItem value="yearly">سالانه</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="تاریخ بعدی"
                type="date"
                value={formData.nextDueDate}
                onChange={(e) =>
                  setFormData({ ...formData, nextDueDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="توضیحات"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={primaryButtonSx}
          >
            ذخیره
          </Button>
          <Button onClick={() => setOpen(false)} sx={cancelButtonSx}>
            لغو
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reminders;
