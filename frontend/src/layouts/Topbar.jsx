import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onToggleMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar>
        <IconButton onClick={onToggleMenu}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
          Bonjour, {user?.username}
        </Typography>

        <Typography
          sx={{ cursor: "pointer", color: "red" }}
          onClick={handleLogout}
        >
          Déconnexion
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
