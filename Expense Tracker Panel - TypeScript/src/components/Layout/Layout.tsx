// src/components/Layout/Layout.tsx
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItem,
  ListItemIcon, ListItemText, IconButton, Box, Avatar,
  Menu, MenuItem, Divider, Badge, Tooltip,
} from "@mui/material";
import { useApp } from "../../context/AppContext";

// ===================== SVG ICONS =====================
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

const TransactionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" />
  </svg>
);

const CategoriesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z" />
    <path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845" />
  </svg>
);

const WalletsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const RemindersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
  </svg>
);

const FinanceLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
);

// ===================== LAYOUT COMPONENT =====================
const drawerWidth = 260;

interface LayoutProps {
  children: ReactNode;
}

interface MenuItem {
  text: string;
  path: string;
  color: string;
  icon: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser, logout, reminders } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { text: "داشبورد", path: "/", color: "#8b5cf6", icon: <DashboardIcon /> },
    { text: "تراکنش ها", path: "/transactions", color: "#3b82f6", icon: <TransactionsIcon /> },
    { text: "دسته بندی ها", path: "/categories", color: "#10b981", icon: <CategoriesIcon /> },
    { text: "کیف پول‌ ها", path: "/wallets", color: "#f59e0b", icon: <WalletsIcon /> },
    { text: "یادآوری ها", path: "/reminders", color: "#ef4444", icon: <RemindersIcon /> },
    { text: "گزارش ها", path: "/reports", color: "#ec4899", icon: <ReportsIcon /> },
  ];

  const handleDrawerToggle = (): void => setMobileOpen(!mobileOpen);

  const handleLogout = (): void => {
    logout();
    navigate("/login");
    setAnchorEl(null);
  };

  const dueRemindersCount = reminders.filter((r) => {
    const today = new Date().toISOString().split("T")[0];
    return r.nextDueDate <= today;
  }).length;

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, rgba(19, 19, 26, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(42, 42, 58, 0.6)",
        position: "relative",
      }}
    >
      {/* لوگو و هدر */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(42, 42, 58, 0.4)",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(139, 92, 246, 0.3)",
            color: "#fff",
          }}
        >
          <FinanceLogoIcon />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "#f9fafb", fontSize: "1.1rem", lineHeight: 1.2 }}>
            پنل مالی
          </Typography>
          <Typography sx={{ color: "#9ca3af", fontSize: "0.75rem" }}>
            مدیریت هوشمند
          </Typography>
        </Box>
      </Box>

      {/* منوی ناوبری */}
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "14px",
                mb: 0.5,
                cursor: "pointer",
                transition: "all 0.2s",
                background: isActive ? `${item.color}20` : "transparent",
                border: isActive ? `1px solid ${item.color}40` : "1px solid transparent",
                "&:hover": {
                  background: `${item.color}15`,
                  borderColor: `${item.color}30`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? item.color : "#9ca3af",
                  transition: "color 0.2s",
                }}
              >
                {item.path === "/reminders" && dueRemindersCount > 0 ? (
                  <Badge badgeContent={dueRemindersCount} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: isActive ? "#f9fafb" : "#9ca3af",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.925rem",
                  },
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: item.color,
                    boxShadow: `0 0 12px ${item.color}`,
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      {/* بخش پروفایل پایین */}
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2 }}>
        <Divider sx={{ borderColor: "rgba(42, 42, 58, 0.4)", mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: "14px",
            background: "rgba(42, 42, 58, 0.3)",
            border: "1px solid rgba(42, 42, 58, 0.6)",
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            {currentUser?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ color: "#f9fafb", fontWeight: 600, fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {currentUser?.username}
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: "0.75rem" }}>کاربر</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar بالا */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(10, 10, 15, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(42, 42, 58, 0.4)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, color: "#f9fafb" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconButton>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="خروج از حساب">
              <IconButton onClick={handleLogout} sx={{ color: "#ef4444", "&:hover": { background: "rgba(239, 68, 68, 0.1)" } }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: "#f9fafb", "&:hover": { background: "rgba(139, 92, 246, 0.1)" } }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                {currentUser?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  background: "rgba(26, 26, 36, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(42, 42, 58, 0.6)",
                  borderRadius: "14px",
                  minWidth: 200,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(42, 42, 58, 0.4)" }}>
                <Typography sx={{ color: "#f9fafb", fontWeight: 700, fontSize: "0.95rem" }}>
                  {currentUser?.username}
                </Typography>
                <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>کاربر سیستم</Typography>
              </Box>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#ef4444",
                  "&:hover": { background: "rgba(239, 68, 68, 0.1)" },
                  mt: 0.5,
                  mx: 0.5,
                  borderRadius: "8px",
                }}
              >
                <ListItemIcon sx={{ color: "#ef4444", minWidth: 36 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </ListItemIcon>
                خروج از حساب
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer موبایل */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer دسکتاپ */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* محتوای اصلی */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;