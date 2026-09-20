import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Alert, Chip } from "@mui/material";
import { useApp } from "../context/AppContext";

const Reminders = () => {
  const { reminders, addReminder, deleteReminder } = useApp();
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState<{
    title: string;
    amount: string;
    frequency: "weekly" | "monthly" | "yearly";
    nextDueDate: string;
    description: string;
  }>({
    title: "", amount: "", frequency: "monthly",
    nextDueDate: new Date().toISOString().split("T")[0], description: "",
  });
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const dueReminders = reminders.filter((r) => r.nextDueDate === todayStr);
    if (dueReminders.length > 0) {
      setAlertMessage(`شما ${dueReminders.length.toLocaleString("fa-IR")} یادآوری سررسید شده دارید!`);
    }
  }, [reminders]);

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.amount || !formData.nextDueDate) { alert("فیلدهای ضروری را پر کنید"); return; }
    const amount = parseFloat(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) { alert("مبلغ معتبر وارد کنید"); return; }
    addReminder({ ...formData, title: formData.title.trim(), amount });
    setFormData({ title: "", amount: "", frequency: "monthly", nextDueDate: new Date().toISOString().split("T")[0], description: "" });
    setOpen(false);
  };

  const getFrequencyLabel = (freq: string) => ({ weekly: "هفتگی", monthly: "ماهانه", yearly: "سالانه" } as any)[freq] || freq;
  const getStatus = (date: string) => { if (date < todayStr) return "overdue"; if (date === todayStr) return "today"; return "pending"; };
  const getStatusLabel = (status: string) => ({ overdue: "سررسید گذشته", today: "سررسید امروز", pending: "در انتظار" } as any)[status];
  const getStatusColor = (status: string) => ({ overdue: "#ef4444", today: "#f59e0b", pending: "#10b981" } as any)[status];

  return (
    <Box dir="rtl" className="glass-card" sx={{ p: { xs: 2, md: 3 }, mb: 3, textAlign: "right" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}>یادآوری‌ ها</Typography>
          <Typography sx={{ color: "#9ca3af" }}>هزینه‌ های دوره‌ای و سررسیدها</Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)}
          sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", borderRadius: "12px", height: 44, px: 3, fontWeight: 700 }}>
          یادآوری جدید
        </Button>
      </Box>

      {alertMessage && <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setAlertMessage("")}>{alertMessage}</Alert>}

      <Grid container spacing={3}>
        {reminders.length === 0 ? (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ p: 5, textAlign: "center", background: "rgba(26, 26, 36, 0.5)", border: "1px dashed #2a2a3a", borderRadius: "16px" }}>
              <Typography variant="h5" sx={{ color: "#9ca3af", mb: 1 }}>هیچ یادآوری ثبت نشده است</Typography>
            </Card>
          </Grid>
        ) : (
          reminders.map((reminder) => {
            const status = getStatus(reminder.nextDueDate);
            const statusColor = getStatusColor(status);
            const borderColor = status === "overdue" ? "#ef4444" : status === "today" ? "#f59e0b" : "#2a2a3a";
            return (
              <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                <Card elevation={0} sx={{ height: "100%", background: "rgba(26, 26, 36, 0.5)", border: `1px solid ${borderColor}`, borderRadius: "16px", "&:hover": { transform: "translateY(-4px)" } }}>
                  <CardContent sx={{ textAlign: "right" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700 }}>{reminder.title}</Typography>
                      <Button onClick={() => deleteReminder(reminder.id)} sx={{ color: "#ef4444", minWidth: "auto" }}>حذف</Button>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {reminder.amount.toLocaleString("fa-IR")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip label={getFrequencyLabel(reminder.frequency)} size="small" sx={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }} />
                      <Chip label={getStatusLabel(status)} size="small" sx={{ background: `${statusColor}20`, color: statusColor }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>تاریخ بعدی: {new Date(reminder.nextDueDate).toLocaleDateString("fa-IR")}</Typography>
                    {reminder.description && <Typography variant="body2" sx={{ color: "#9ca3af", mt: 1 }}>{reminder.description}</Typography>}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#12121c", border: "1px solid #2b2b3d", borderRadius: "18px" } }}>
        <DialogTitle sx={{ color: "#f9fafb", fontWeight: 800, textAlign: "right", borderBottom: "1px solid #2a2a3a" }}>یادآوری جدید</DialogTitle>
        <DialogContent sx={{ pt: 3, direction: "rtl" }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}><TextField fullWidth label="عنوان" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} InputLabelProps={{ shrink: true }} autoFocus /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="مبلغ" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink>تکرار</InputLabel>
                <Select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value as "weekly" | "monthly" | "yearly" })} label="تکرار">
                  <MenuItem value="weekly">هفتگی</MenuItem>
                  <MenuItem value="monthly">ماهانه</MenuItem>
                  <MenuItem value="yearly">سالانه</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="تاریخ بعدی" type="date" value={formData.nextDueDate} onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="توضیحات" multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
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

export default Reminders;