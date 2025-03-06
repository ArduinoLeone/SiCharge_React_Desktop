import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Messaggi from "./pages/Messaggi";
import GestionePOI from "./pages/GestionePOI";
import Utenti from "./pages/Utenti";
import Settings from "./pages/Settings";
import {
  appContainerStyles,
  mainContentStyles,
  theme,
} from "./styles/App.styles";

const pageTitles = {
  "/": "Home",
  "/messaggi": "Messaggi",
  "/gestione-poi": "Gestione POI",
  "/utenti": "Utenti",
  "/settings": "Settings",
};

const AppContent = () => {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Page Not Found";

  return (
    <div style={appContainerStyles}>
      <Sidebar />
      <main style={mainContentStyles}>
        <Header pageTitle={pageTitle} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messaggi" element={<Messaggi />} />
          <Route path="/gestione-poi" element={<GestionePOI />} />
          <Route path="/utenti" element={<Utenti />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
