import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import store from "./_redux/store";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <SnackbarProvider maxSnack={3}>
                    <App />
                </SnackbarProvider>
            </Provider>
        </BrowserRouter>
    </StrictMode>
);
