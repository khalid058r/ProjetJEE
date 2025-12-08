import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";


import { ToastProvider } from "./components/Toast"; 

ReactDOM.createRoot(document.getElementById("root")).render(
    <ToastProvider>   
        <ThemeProvider>
            <AppRouter />
        </ThemeProvider>      
    </ToastProvider>
);
