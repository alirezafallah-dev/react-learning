import { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from "@mui/material";
import { useApp } from "../context/AppContext";

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useApp();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", icon: "", color: "#8b5cf6" });

  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#6366f1", "#f97316", "#14b8a6"];

  const handleSubmit = () => {
    const name = formData.name.trim();
    if (!name) { alert("لطفاً نام دسته‌ بندی را وارد کنید"); return; }
    if (categories.some((c) => c.name.trim() === name)) { alert("این دسته‌ بندی قبلاً ثبت شده است"); return; }
    addCategory({ ...formData, name });
    setFormData({ name: "", icon: "", color: "#8b5cf6" });
    setOpen(false);
  };

  return (
    <Box dir="rtl" className="glass-card" sx={{ p: { xs: 2, md: 3 }, mb: 3, textAlign: "right" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}>دسته‌ بندی‌ ها</Typography>
          <Typography sx={{ color: "#9ca3af" }}>مدیریت دسته‌ بندی‌ های تراکنش‌ ها</Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)}
          sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", boxShadow: "0 8px 22px rgba(139,92,246,0.28)", borderRadius: "12px", height: 44, px: 3, fontWeight: 700 }}>
          دسته‌ بندی جدید
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.length === 0 ? (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ p: 5, textAlign: "center", background: "rgba(26, 26, 36, 0.5)", border: "1px dashed #2a2a3a", borderRadius: "16px" }}>
              <Typography variant="h6" sx={{ color: "#9ca3af", mb: 1 }}>هیچ دسته‌ بندی ثبت نشده است</Typography>
            </Card>
          </Grid>
        ) : (
          categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card elevation={0} sx={{ height: "100%", background: "rgba(26, 26, 36, 0.5)", border: "1px solid #2a2a3a", borderRadius: "16px", "&:hover": { transform: "translateY(-4px)", borderColor: category.color } }}>
                <CardContent sx={{ textAlign: "right" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: "14px", background: `linear-gradient(135deg, ${category.color}33, ${category.color}1f)`, border: `1px solid ${category.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: category.color, fontWeight: "bold" }}>
                        {category.name.charAt(0)}
                      </Box>
                      <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700 }}>{category.name}</Typography>
                    </Box>
                    <Button onClick={() => deleteCategory(category.id)} sx={{ color: "#ef4444", minWidth: "auto", borderRadius: "10px" }}>حذف</Button>
                  </Box>
                  <Chip label={category.color} size="small" sx={{ bgcolor: category.color, color: "#fff", fontWeight: 700, fontFamily: "monospace", direction: "ltr" }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#12121c", border: "1px solid #2b2b3d", borderRadius: "18px" } }}>
        <DialogTitle sx={{ color: "#f9fafb", fontWeight: 800, textAlign: "right", borderBottom: "1px solid #2a2a3a" }}>دسته‌ بندی جدید</DialogTitle>
        <DialogContent sx={{ pt: 3, direction: "rtl" }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}><TextField fullWidth label="نام دسته‌ بندی" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} InputLabelProps={{ shrink: true }} autoFocus /></Grid>
            <Grid item xs={12}>
              <Typography sx={{ color: "#9ca3af", mb: 1.5, fontWeight: 600 }}>رنگ</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {colors.map((color) => (
                  <Box key={color} onClick={() => setFormData({ ...formData, color })}
                    sx={{ width: 44, height: 44, borderRadius: "12px", background: color, cursor: "pointer", border: formData.color === color ? "3px solid #fff" : "2px solid rgba(255,255,255,0.08)", transform: formData.color === color ? "scale(1.08)" : "scale(1)" }} />
                ))}
              </Box>
            </Grid>
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

export default Categories;