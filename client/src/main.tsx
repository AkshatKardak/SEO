import "./index.css";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProjectProvider } from "./context/ProjectContext.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider>
            <AuthProvider>
                <ProjectProvider>
                    <App />
                </ProjectProvider>
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>
);
