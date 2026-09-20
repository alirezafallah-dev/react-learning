import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { store } from "./store/store";

import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";

const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: { main: "#8b5cf6" },
    background: { default: "#0a0a0f", paper: "rgba(26, 26, 36, 0.35)" },
    text: { primary: "#f9fafb", secondary: "#9ca3af" },
  },
  typography: { fontFamily: '"Vazir", Tahoma, sans-serif' },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <AppProvider>
            <App />
          </AppProvider>
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);