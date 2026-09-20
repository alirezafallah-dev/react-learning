import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useApp } from "../../context/AppContext";

// ===================== SVG ICONS =====================
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

const TransactionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </svg>
);

const CategoriesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z" />
    <path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845" />
  </svg>
);

const WalletsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const RemindersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
  </svg>
);

const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

// 🆕 آیکون مدیریت مالی (برای لوگو)
const FinanceLogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
);

// ===================== LAYOUT COMPONENT =====================
const drawerWidth = 260;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, logout, reminders } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: "داشبورد", path: "/", color: "#8b5cf6", icon: <DashboardIcon /> },
    {
      text: "تراکنش ها",
      path: "/transactions",
      color: "#3b82f6",
      icon: <TransactionsIcon />,
    },
    {
      text: "دسته بندی ها",
      path: "/categories",
      color: "#10b981",
      icon: <CategoriesIcon />,
    },
    {
      text: "کیف پول‌ ها",
      path: "/wallets",
      color: "#f59e0b",
      icon: <WalletsIcon />,
    },
    {
      text: "یادآوری ها",
      path: "/reminders",
      color: "#ef4444",
      icon: <RemindersIcon />,
    },
    {
      text: "گزارش ها",
      path: "/reports",
      color: "#ec4899",
      icon: <ReportsIcon />,
    },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setAnchorEl(null);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background:
          "linear-gradient(180deg, rgba(19, 19, 26, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(42, 42, 58, 0.6)",
        position: "relative",
      }}
    >
      {/* لوگو با آیکون مدیریت مالی */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid rgba(42, 42, 58, 0.6)",
        }}
      >
        <Box
          sx={{
            width: 45,
            height: 45,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(-8deg) scale(1.05)",
              boxShadow: "0 6px 20px rgba(139, 92, 246, 0.6)",
            },
          }}
        >
          <FinanceLogoIcon />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            مدیریت مالی
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#9ca3af", fontSize: "0.75rem" }}
          >
            Expense Tracker
          </Typography>
        </Box>
      </Box>

      {/* منو */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "12px",
                mb: 1,
                px: 2,
                py: 1.5,
                background: isActive
                  ? "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(139, 92, 246, 0.3)"
                  : "1px solid transparent",
                color: isActive ? "#fff" : "#9ca3af",
                transition: "all 0.2s ease",
                backdropFilter: isActive ? "blur(10px)" : "none",
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.1)",
                  color: "#fff",
                  transform: "translateX(-4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: isActive ? `${item.color}30` : "transparent",
                  border: isActive
                    ? `1px solid ${item.color}60`
                    : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? item.color : "#9ca3af",
                  transition: "all 0.2s ease",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.95rem",
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#8b5cf6",
                    boxShadow: "0 0 10px #8b5cf6",
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      {/* بخش کاربر */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          borderTop: "1px solid rgba(42, 42, 58, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: "12px",
            background: "rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(42, 42, 58, 0.6)",
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            {currentUser?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#f9fafb",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser?.username}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#9ca3af", fontSize: "0.7rem" }}
            >
              کاربر فعال
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{
              color: "#ef4444",
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              "&:hover": { background: "rgba(239, 68, 68, 0.2)" },
            }}
          >
            <Box sx={{ fontSize: "0.7rem", fontWeight: 700 }}>خ</Box>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* هدر بالا - Glass */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(10, 10, 15, 0.7)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(42, 42, 58, 0.6)",
          boxShadow: "none",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mr: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "#f9fafb" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Box
                sx={{
                  width: 20,
                  height: 2,
                  background: "#f9fafb",
                  borderRadius: "2px",
                }}
              />
              <Box
                sx={{
                  width: 20,
                  height: 2,
                  background: "#f9fafb",
                  borderRadius: "2px",
                }}
              />
              <Box
                sx={{
                  width: 20,
                  height: 2,
                  background: "#f9fafb",
                  borderRadius: "2px",
                }}
              />
            </Box>
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#f9fafb" }}>
              {menuItems.find((m) => m.path === location.pathname)?.text ||
                "داشبورد"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component={Link}
              to="/reminders"
              sx={{
                px: 2,
                py: 1,
                borderRadius: "10px",
                background:
                  reminders.length > 0
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(42, 42, 58, 0.3)",
                border: `1px solid ${
                  reminders.length > 0
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(42, 42, 58, 0.6)"
                }`,
                color: reminders.length > 0 ? "#ef4444" : "#9ca3af",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  background:
                    reminders.length > 0
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(42, 42, 58, 0.5)",
                },
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RemindersIcon />
              </Box>
              {reminders.length > 0
                ? `${reminders.length} یادآوری`
                : "بدون یادآوری"}
            </Box>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                p: 0,
                border: "2px solid transparent",
                "&:hover": { borderColor: "#8b5cf6" },
                borderRadius: "50%",
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                  fontWeight: 700,
                }}
              >
                {currentUser?.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                background: "rgba(26, 26, 36, 0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(42, 42, 58, 0.6)",
                borderRadius: "12px",
                minWidth: 200,
              },
            }}
          >
            <MenuItem disabled>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  background: "rgba(139, 92, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8b5cf6",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  ml: 1,
                }}
              >
                {currentUser?.username?.[0]?.toUpperCase() || "U"}
              </Box>
              {currentUser?.username}
            </MenuItem>
            <Divider sx={{ borderColor: "rgba(42, 42, 58, 0.6)" }} />
            <MenuItem onClick={handleLogout}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  background: "rgba(239, 68, 68, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  ml: 1,
                }}
              >
                خ
              </Box>
              خروج
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* سایدبار با anchor="right" برای RTL */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "rgba(19, 19, 26, 0.95)",
              backdropFilter: "blur(20px)",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "transparent",
              borderRight: "none",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* محتوای اصلی */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
