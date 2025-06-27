"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Link,
  Divider,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BarChartIcon from "@mui/icons-material/BarChart";
import LinkIcon from "@mui/icons-material/Link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import QrCodeIcon from "@mui/icons-material/QrCode";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [detailedStats, setDetailedStats] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/shorturls");

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        throw new Error("Failed to fetch statistics");
      }
    } catch (err) {
      setError(
        "Unable to load statistics. Please check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedStats = async (shortcode) => {
    try {
      setLoadingDetails((prev) => ({ ...prev, [shortcode]: true }));
      const response = await fetch(
        `http://localhost:5000/api/shorturls/${shortcode}`
      );

      if (response.ok) {
        const data = await response.json();
        setDetailedStats((prev) => ({ ...prev, [shortcode]: data }));
      } else {
        throw new Error("Failed to fetch detailed statistics");
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [shortcode]: false }));
    }
  };

  const handleExpandClick = (shortcode) => {
    const isExpanded = expandedCards[shortcode];

    setExpandedCards((prev) => ({
      ...prev,
      [shortcode]: !isExpanded,
    }));

    if (!isExpanded && !detailedStats[shortcode]) {
      fetchDetailedStats(shortcode);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusChip = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const isExpired = now > expiry;

    return (
      <Chip
        label={isExpired ? "Inactive" : "Active"}
        size="small"
        sx={{
          fontWeight: 600,
          borderRadius: 2,
          background: isExpired
            ? "rgba(239, 68, 68, 0.2)"
            : "rgba(16, 185, 129, 0.2)",
          color: isExpired ? "#f87171" : "#34d399",
          border: `1px solid ${
            isExpired ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"
          }`,
        }}
      />
    );
  };

  const getPlatformIcon = (url) => {
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return <TwitterIcon sx={{ color: "#1da1f2", fontSize: 20 }} />;
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return <YouTubeIcon sx={{ color: "#ff0000", fontSize: 20 }} />;
    }
    return <LinkIcon sx={{ color: "#64748b", fontSize: 20 }} />;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CircularProgress size={48} sx={{ color: "#3b82f6" }} />
        <Typography variant="h6" sx={{ color: "#cbd5e1", fontWeight: 500 }}>
          Loading analytics dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 3,
          borderRadius: 3,
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#f87171",
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <TrendingUpIcon sx={{ mr: 2, fontSize: 32, color: "#3b82f6" }} />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-0.025em",
          }}
        >
          Analytics Dashboard
        </Typography>
      </Box>

      {stats.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <BarChartIcon sx={{ fontSize: 64, color: "#64748b", mb: 3 }} />
            <Typography
              variant="h6"
              color="#cbd5e1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              No analytics data available
            </Typography>
            <Typography variant="body2" color="#64748b">
              Create some short links to start tracking their performance.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {/* Table Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 3fr 80px 80px 100px 120px",
              },
              gap: 2,
              p: 3,
              background: "rgba(30, 41, 59, 0.6)",
              borderRadius: "20px 20px 0 0",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderBottom: "none",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Short Link
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: { xs: "none", md: "block" },
              }}
            >
              Original Link
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "center",
                display: { xs: "none", md: "block" },
              }}
            >
              QR Code
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "center",
                display: { xs: "none", md: "block" },
              }}
            >
              Clicks
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "center",
                display: { xs: "none", md: "block" },
              }}
            >
              Status
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "center",
                display: { xs: "none", md: "block" },
              }}
            >
              Date
            </Typography>
          </Box>

          {/* Table Rows */}
          {stats.map((stat, index) => (
            <Card
              key={stat.shortcode}
              sx={{
                mb: 0,
                borderRadius: index === stats.length - 1 ? "0 0 20px 20px" : 0,
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderTop: "none",
                background: "rgba(30, 41, 59, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.05)",
                  borderColor: "rgba(59, 130, 246, 0.3)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr auto",
                      md: "2fr 3fr 80px 80px 100px 120px",
                    },
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  {/* Short Link */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: "rgba(59, 130, 246, 0.1)",
                      }}
                    >
                      {getPlatformIcon(stat.originalUrl)}
                    </Avatar>
                    <Box>
                      <Link
                        href={`http://localhost:5000/api/${stat.shortcode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontWeight: 600,
                          color: "#60a5fa",
                          fontSize: "0.875rem",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        linkly.com/{stat.shortcode}
                      </Link>
                      <IconButton
                        onClick={() =>
                          copyToClipboard(
                            `http://localhost:5000/api/${stat.shortcode}`
                          )
                        }
                        size="small"
                        sx={{
                          ml: 1,
                          color: "#64748b",
                          "&:hover": { color: "#3b82f6" },
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Original Link */}
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#cbd5e1",
                        wordBreak: "break-all",
                        fontSize: "0.875rem",
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {stat.originalUrl}
                    </Typography>
                  </Box>

                  {/* QR Code */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      justifyContent: "center",
                    }}
                  >
                    <Box className="qr-placeholder">
                      <QrCodeIcon fontSize="small" />
                    </Box>
                  </Box>

                  {/* Clicks */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#f8fafc",
                        fontWeight: 700,
                      }}
                    >
                      {stat.clickCount || 0}
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      justifyContent: "center",
                    }}
                  >
                    {getStatusChip(stat.expiryTime)}
                  </Box>

                  {/* Date */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#94a3b8",
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(stat.expiryTime)}
                    </Typography>
                  </Box>

                  {/* Mobile expand button */}
                  <Box
                    sx={{
                      display: { xs: "flex", md: "none" },
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton
                      onClick={() => handleExpandClick(stat.shortcode)}
                      sx={{
                        color: "#3b82f6",
                        background: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.2)",
                        },
                      }}
                    >
                      {expandedCards[stat.shortcode] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* Mobile Details */}
                <Collapse
                  in={expandedCards[stat.shortcode]}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ mt: 3, display: { xs: "block", md: "none" } }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", fontWeight: 600 }}
                        >
                          Original URL:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#cbd5e1", wordBreak: "break-all" }}
                        >
                          {stat.originalUrl}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", fontWeight: 600 }}
                        >
                          Clicks:
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: "#f8fafc", fontWeight: 700 }}
                        >
                          {stat.clickCount || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", fontWeight: 600 }}
                        >
                          Status:
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {getStatusChip(stat.expiryTime)}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>

                {/* Desktop Detailed Analytics */}
                <Collapse
                  in={expandedCards[stat.shortcode]}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Divider
                      sx={{ my: 3, borderColor: "rgba(51, 65, 85, 0.5)" }}
                    />
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#f8fafc", fontWeight: 600, mb: 3 }}
                    >
                      Detailed Analytics
                    </Typography>

                    {loadingDetails[stat.shortcode] ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          py: 4,
                          gap: 2,
                        }}
                      >
                        <CircularProgress size={24} sx={{ color: "#3b82f6" }} />
                        <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                          Loading detailed analytics...
                        </Typography>
                      </Box>
                    ) : detailedStats[stat.shortcode] ? (
                      <Box>
                        {detailedStats[stat.shortcode].clicks &&
                        detailedStats[stat.shortcode].clicks.length > 0 ? (
                          <TableContainer
                            component={Paper}
                            sx={{
                              borderRadius: 3,
                              background: "rgba(51, 65, 85, 0.3)",
                              border: "1px solid rgba(51, 65, 85, 0.5)",
                            }}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow
                                  sx={{ background: "rgba(51, 65, 85, 0.5)" }}
                                >
                                  <TableCell
                                    sx={{ fontWeight: 600, color: "#f8fafc" }}
                                  >
                                    Timestamp
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontWeight: 600, color: "#f8fafc" }}
                                  >
                                    Referrer
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontWeight: 600, color: "#f8fafc" }}
                                  >
                                    Location
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontWeight: 600, color: "#f8fafc" }}
                                  >
                                    User Agent
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {detailedStats[stat.shortcode].clicks.map(
                                  (click, index) => (
                                    <TableRow key={index}>
                                      <TableCell sx={{ color: "#cbd5e1" }}>
                                        {new Date(
                                          click.timestamp
                                        ).toLocaleString()}
                                      </TableCell>
                                      <TableCell sx={{ color: "#cbd5e1" }}>
                                        {click.referrer || "Direct"}
                                      </TableCell>
                                      <TableCell sx={{ color: "#cbd5e1" }}>
                                        {click.location || "Unknown"}
                                      </TableCell>
                                      <TableCell sx={{ maxWidth: 200 }}>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            wordBreak: "break-all",
                                            color: "#94a3b8",
                                          }}
                                        >
                                          {click.userAgent
                                            ? click.userAgent.substring(0, 50) +
                                              "..."
                                            : "Unknown"}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Alert
                            severity="info"
                            sx={{
                              borderRadius: 3,
                              background: "rgba(59, 130, 246, 0.1)",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                              color: "#60a5fa",
                            }}
                          >
                            No clicks recorded for this URL yet.
                          </Alert>
                        )}
                      </Box>
                    ) : (
                      <Alert
                        severity="warning"
                        sx={{
                          borderRadius: 3,
                          background: "rgba(245, 158, 11, 0.1)",
                          border: "1px solid rgba(245, 158, 11, 0.2)",
                          color: "#fbbf24",
                        }}
                      >
                        Unable to load detailed analytics for this URL.
                      </Alert>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default StatsPage;
