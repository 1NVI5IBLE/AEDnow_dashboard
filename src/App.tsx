import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Box
} from "@mui/material";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 LOGIN — FULL SCREEN
  if (!isLoggedIn) {
    return (
      <>
        <CssBaseline />
        <Login onLogin={() => setIsLoggedIn(true)} />
      </>
    );
  }

 
  
  return (
    <>
      <CssBaseline />

      {/* RED BACKGROUND LAYER */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 200,
          backgroundColor: "#DC0000",
          zIndex: 0
        }}
      />

      {/* NAVBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          color: "#ffffff",
          zIndex: 1
        }}
      >
        <Toolbar>
          <Typography variant="h6">
            AEDnow Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          mt: "96px"
        }}
      >
        <Dashboard />
      </Container>
    </>
  );
}
