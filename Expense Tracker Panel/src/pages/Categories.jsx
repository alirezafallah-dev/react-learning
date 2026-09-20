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

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useApp();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    color: "#8b5cf6",
  });

  const colors = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#6366f1",
    "#f97316",
    "#14b8a6",
  ];

  const handleSubmit = () => {
    const name = formData.name.trim();

    if (!name) {
      alert("لطفاً نام دسته‌ بندی را وارد کنید");
      return;
    }

    if (categories.some((c) => c.name.trim() === name)) {
      alert("این دسته‌ بندی قبلاً ثبت شده است");
      return;
    }

    addCategory({ ...formData, name });

    setFormData({
      name: "",
      icon: "",
      color: "#8b5cf6",
    });

    setOpen(false);
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}
          >
            دسته‌ بندی‌ ها
          </Typography>
          <Typography sx={{ color: "#9ca3af" }}>
            مدیریت دسته‌ بندی‌ های تراکنش‌ ها
          </Typography>
        </Box>

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
          دسته‌ بندی جدید
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.length === 0 ? (
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
                هیچ دسته‌ بندی ثبت نشده است
              </Typography>
              <Typography sx={{ color: "#6b7280" }}>
                برای ایجاد دسته‌ بندی جدید روی دکمه بالا کلیک کنید
              </Typography>
            </Card>
          </Grid>
        ) : (
          categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
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
                    boxShadow: `0 10px 30px ${category.color}30`,
                    borderColor: category.color,
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
                          background: `linear-gradient(135deg, ${category.color}33, ${category.color}1f)`,
                          border: `1px solid ${category.color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          color: category.color,
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        {category.name ? category.name.charAt(0) : ""}
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
                        {category.name}
                      </Typography>
                    </Box>

                    <Button
                      onClick={() => deleteCategory(category.id)}
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

                  <Chip
                    label={category.color}
                    size="small"
                    sx={{
                      bgcolor: category.color,
                      color: "#fff",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      direction: "ltr",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        BackdropProps={dialogBackdropProps}
        PaperProps={getDialogPaperProps(560)}
      >
        <DialogTitle sx={dialogTitleSx}>دسته‌ بندی جدید</DialogTitle>

        <DialogContent sx={getDialogContentSx()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="نام دسته‌ بندی"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ color: "#9ca3af", mb: 1.5, fontWeight: 600 }}>
                رنگ
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    title={color}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: color,
                      cursor: "pointer",
                      border:
                        formData.color === color
                          ? "3px solid #fff"
                          : "2px solid rgba(255,255,255,0.08)",
                      transform:
                        formData.color === color ? "scale(1.08)" : "scale(1)",
                      transition: "transform 0.2s, border 0.2s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                ))}
              </Box>
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

export default Categories;
