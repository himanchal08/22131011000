"use client";

import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Box,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShortenUrlPage from "./components/ShortenUrlPage";
import StatsPage from "./components/StatsPage";
import "./App.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      dark: "#2563eb",
    },
    secondary: {
      main: "#8b5cf6",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(20px)",
            border: "none",
            borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
          }}
        >
          <Toolbar sx={{ py: 2, px: { xs: 2, md: 4 } }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Url Shortner
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Hero section */}
        <Box
          sx={{
            width: "100%",
            py: { xs: 6, md: 10 },
            px: { xs: 2, md: 0 },
            textAlign: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
              mb: 3,
              background:
                "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Professional URL Shortening Made Simple
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#cbd5e1",
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
              mb: 6,
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Url Shortner is a reliable, efficient, and user-friendly URL shortening
            service designed for professionals and businesses. Simplify your
            links and track performance with ease.
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "rgba(51, 65, 85, 0.5)",
              mb: 4,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="navigation tabs"
              variant="fullWidth"
              TabIndicatorProps={{
                style: {
                  height: 4,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  borderRadius: "2px",
                },
              }}
            >
              <Tab
                icon={<LinkIcon />}
                label="Create Links"
                id="tab-0"
                aria-controls="tabpanel-0"
                sx={{
                  fontWeight: 600,
                  color: "#64748b",
                  "&.Mui-selected": { color: "#3b82f6" },
                }}
              />
              <Tab
                icon={<BarChartIcon />}
                label="Analytics Dashboard"
                id="tab-1"
                aria-controls="tabpanel-1"
                sx={{
                  fontWeight: 600,
                  color: "#64748b",
                  "&.Mui-selected": { color: "#3b82f6" },
                }}
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ShortenUrlPage />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <StatsPage />
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
