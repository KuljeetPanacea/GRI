import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./common/theme/theme";
import { PersistGate } from "redux-persist/integration/react";
import { registerSW } from "virtual:pwa-register"; // Import PWA register function

if ("serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}
registerSW({ immediate: true }); // Registers SW on app start

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
