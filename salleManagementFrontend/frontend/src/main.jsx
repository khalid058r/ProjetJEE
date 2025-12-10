import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";



import { ToastProvider } from "./components/Toast"; 

ReactDOM.createRoot(document.getElementById("root")).render(
    <ToastProvider>   
        <ThemeProvider>
             <UserProvider>
                <AppRouter />
            </UserProvider>
        </ThemeProvider>      
    </ToastProvider>
);
