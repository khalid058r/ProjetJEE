import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isCollapsed }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { label: "Catégories", icon: <CategoryIcon />, path: "/admin/categories" },
    { label: "Produits", icon: <InventoryIcon />, path: "/admin/products" },
    { label: "Ventes", icon: <ShoppingCartIcon />, path: "/admin/sales" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 70 : 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? 70 : 220,
          boxSizing: "border-box",
          bgcolor: "#111827",
          color: "white",
          borderRight: "1px solid #222",
        },
      }}
    >
      {/* Sidebar header */}
      <Box sx={{ p: 2 }}>
        {!isCollapsed && (
          <Typography variant="h6" fontWeight={700}>
            Admin Panel
          </Typography>
        )}
      </Box>

      <List>
        {menuItems.map((item) => (
          <Tooltip
            key={item.label}
            title={isCollapsed ? item.label : ""}
            placement="right"
          >
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
