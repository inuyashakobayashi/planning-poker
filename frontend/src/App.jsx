import React from "react";
import { useRoutes } from "react-router-dom";
import BackgroundBox from "./Components/Frames/BackgroundBox";
import SessionPage from "./Views/SessionPage";
import MainSession from "./Views/StartPage/MainSession";
import useDosTheme from "./Common/Theme/useDosTheme.jsx";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import useWebSocketListener from "./Common/Hooks/useWebSocketListener.jsx";
import useAccessControl from "./Common/Hooks/useAccessControl.jsx";
import "./App.css";

const App = () => {
  useWebSocketListener();
  useAccessControl();
  return (
    <ThemeProvider theme={useDosTheme()}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;

const AppRoutes = () => {
  const MainRoutes = {
    path: "/",
    element: <BackgroundBox />,
    children: [
      {
        path: "",
        element: <MainSession />,
      },
      {
        path: "session",
        element: <SessionPage />,
      },
    ],
  };

  return useRoutes([MainRoutes]);
};
