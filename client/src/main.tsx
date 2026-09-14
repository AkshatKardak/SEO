import "./index.css";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProjectProvider } from "./context/ProjectContext.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

const app = (
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

createRoot(document.getElementById("root")!).render(
    clerkPublishableKey ? (
        <ClerkProvider publishableKey={clerkPublishableKey}>
            {app}
        </ClerkProvider>
    ) : (
        app
    )
);

