import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar isCollapsed={isCollapsed} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Topbar onToggleMenu={() => setCollapsed(!isCollapsed)} />

        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet /> {/* IMPORTANT */}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
