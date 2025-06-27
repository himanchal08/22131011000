"use client";

import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Link,
  CircularProgress,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";

const ShortenUrlPage = () => {
  const [mainUrl, setMainUrl] = useState("");
  const [urlInputs, setUrlInputs] = useState([
    { id: 1, longUrl: "", validity: 30, shortcode: "", error: {} },
  ]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoPaste, setAutoPaste] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const validateUrl = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateShortcode = (shortcode) => {
    const alphanumericPattern = /^[a-zA-Z0-9]*$/;
    return alphanumericPattern.test(shortcode);
  };

  const handleMainUrlSubmit = async () => {
    if (!mainUrl.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a URL to shorten",
        severity: "error",
      });
      return;
    }

    if (!validateUrl(mainUrl)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid URL",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/shorturls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl: mainUrl,
          validity: 30,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const expiryTime = new Date(Date.now() + 30 * 60 * 1000);

        const newUrl = {
          id: Date.now(),
          originalUrl: mainUrl,
          shortUrl: `http://localhost:3001/${data.shortcode}`,
          shortcode: data.shortcode,
          expiryTime: expiryTime.toLocaleString(),
          success: true,
        };

        setShortenedUrls((prev) => [newUrl, ...prev]);
        setMainUrl("");
        setSnackbar({
          open: true,
          message: "URL shortened successfully!",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || "Failed to shorten URL",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Network error occurred",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setUrlInputs((prev) =>
      prev.map((input) => {
        if (input.id === id) {
          const updatedInput = { ...input, [field]: value };
          updatedInput.error = { ...updatedInput.error };
          delete updatedInput.error[field];

          if (field === "longUrl" && value && !validateUrl(value)) {
            updatedInput.error.longUrl = "Please enter a valid URL";
          }
          if (field === "validity" && value && (isNaN(value) || value <= 0)) {
            updatedInput.error.validity = "Validity must be a positive number";
          }
          if (field === "shortcode" && value && !validateShortcode(value)) {
            updatedInput.error.shortcode = "Shortcode must be alphanumeric";
          }

          return updatedInput;
        }
        return input;
      })
    );
  };

  const addUrlInput = () => {
    if (urlInputs.length < 5) {
      const newId = Math.max(...urlInputs.map((input) => input.id)) + 1;
      setUrlInputs((prev) => [
        ...prev,
        {
          id: newId,
          longUrl: "",
          validity: 30,
          shortcode: "",
          error: {},
        },
      ]);
    }
  };

  const removeUrlInput = (id) => {
    if (urlInputs.length > 1) {
      setUrlInputs((prev) => prev.filter((input) => input.id !== id));
    }
  };

  const validateInput = (input) => {
    const errors = {};

    if (!input.longUrl.trim()) {
      errors.longUrl = "URL is required";
    } else if (!validateUrl(input.longUrl)) {
      errors.longUrl = "Please enter a valid URL";
    }

    if (input.validity && (isNaN(input.validity) || input.validity <= 0)) {
      errors.validity = "Validity must be a positive number";
    }

    if (input.shortcode && !validateShortcode(input.shortcode)) {
      errors.shortcode = "Shortcode must be alphanumeric";
    }

    return errors;
  };

  const handleBulkSubmit = async () => {
    setLoading(true);
    const validInputs = [];
    const updatedInputs = [...urlInputs];

    for (let i = 0; i < updatedInputs.length; i++) {
      const errors = validateInput(updatedInputs[i]);
      updatedInputs[i].error = errors;

      if (Object.keys(errors).length === 0 && updatedInputs[i].longUrl.trim()) {
        validInputs.push(updatedInputs[i]);
      }
    }

    setUrlInputs(updatedInputs);

    if (validInputs.length === 0) {
      setSnackbar({
        open: true,
        message:
          "Please fix validation errors and ensure at least one URL is provided",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const results = [];
    for (const input of validInputs) {
      try {
        const response = await fetch("http://localhost:3001/shorturls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            longUrl: input.longUrl,
            validity: input.validity || 30,
            shortcode: input.shortcode || undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const expiryTime = new Date(
            Date.now() + (input.validity || 30) * 60 * 1000
          );

          results.push({
            id: Date.now() + Math.random(),
            originalUrl: input.longUrl,
            shortUrl: `http://localhost:3001/${data.shortcode}`,
            shortcode: data.shortcode,
            expiryTime: expiryTime.toLocaleString(),
            success: true,
          });
        } else {
          const errorData = await response.json();
          results.push({
            id: Date.now() + Math.random(),
            originalUrl: input.longUrl,
            error: errorData.message || "Failed to shorten URL",
            success: false,
          });
        }
      } catch (error) {
        results.push({
          id: Date.now() + Math.random(),
          originalUrl: input.longUrl,
          error: "Network error occurred",
          success: false,
        });
      }
    }

    setShortenedUrls((prev) => [...results, ...prev]);
    setLoading(false);

    const successCount = results.filter((r) => r.success).length;
    const errorCount = results.filter((r) => !r.success).length;

    if (successCount > 0 && errorCount === 0) {
      setSnackbar({
        open: true,
        message: `Successfully shortened ${successCount} URL${
          successCount > 1 ? "s" : ""
        }`,
        severity: "success",
      });
    } else if (successCount > 0 && errorCount > 0) {
      setSnackbar({
        open: true,
        message: `${successCount} URLs shortened, ${errorCount} failed`,
        severity: "warning",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Failed to shorten URLs",
        severity: "error",
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({
        open: true,
        message: "Copied to clipboard!",
        severity: "success",
      });
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Main URL Input */}
      <Box sx={{ mb: 6, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Paste your long URL here (e.g. https://example.com/your-link)"
              value={mainUrl}
              onChange={(e) => setMainUrl(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon sx={{ color: "#4b164c" }} />
                  </InputAdornment>
                ),
                className: "hero-input",
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  fontSize: "1.1rem",
                  color: "#4b164c",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "#f8e7f6",
                  borderRadius: "50px",
                  border: "2px solid #dd88cf",
                  padding: "8px 24px",
                  fontSize: "1.1rem",
                  color: "#4b164c",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#dd88cf",
                  },
                  "&.Mui-focused": {
                    borderColor: "#4b164c",
                    boxShadow: "0 0 0 4px #f8e7f6",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleMainUrlSubmit}
              disabled={loading}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 2,
                fontWeight: 700,
                fontSize: "1rem",
                background: "linear-gradient(90deg, #dd88cf 60%, #4b164c 100%)",
                color: "#fff",
                minWidth: 180,
                letterSpacing: 1,
                boxShadow: "0 4px 15px rgba(75, 22, 76, 0.12)",
                textTransform: "none",
                transition: "all 0.2s",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #4b164c 60%, #dd88cf 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 25px rgba(75, 22, 76, 0.18)",
                  transform: "translateY(-2px) scale(1.04)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Shorten URL"
              )}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              mb: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={autoPaste}
                  onChange={(e) => setAutoPaste(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#3b82f6",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#3b82f6",
                    },
                  }}
                />
              }
              label="Auto Paste from Clipboard"
              sx={{
                color: "#cbd5e1",
                "& .MuiFormControlLabel-label": {
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            You can create{" "}
            <span style={{ color: "#ec4899", fontWeight: 600 }}>05</span> more
            links.{" "}
            <Link href="#" sx={{ color: "#3b82f6", fontWeight: 600 }}>
              Register
            </Link>{" "}
            Now to enjoy Unlimited usage
          </Typography>
        </Box>
      </Box>

      {/* Bulk URL Creation */}
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#f8fafc",
          mb: 3,
          letterSpacing: "-0.025em",
        }}
      >
        Bulk URL Creation
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {urlInputs.map((input, index) => (
            <Box
              key={input.id}
              sx={{
                mb: 3,
                p: 3,
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: 3,
                background: "rgba(51, 65, 85, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  background: "rgba(59, 130, 246, 0.05)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#f8fafc", fontWeight: 600 }}
                >
                  Link #{index + 1}
                </Typography>
                {urlInputs.length > 1 && (
                  <IconButton
                    onClick={() => removeUrlInput(input.id)}
                    sx={{
                      color: "#f87171",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: 2,
                      "&:hover": {
                        background: "rgba(239, 68, 68, 0.2)",
                        transform: "scale(1.05)",
                      },
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Long URL"
                    placeholder="https://example.com/very-long-url"
                    value={input.longUrl}
                    onChange={(e) =>
                      handleInputChange(input.id, "longUrl", e.target.value)
                    }
                    error={!!input.error.longUrl}
                    helperText={input.error.longUrl}
                    required
                    InputLabelProps={{
                      style: { color: "#cbd5e1", fontWeight: 500 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={input.validity}
                    onChange={(e) =>
                      handleInputChange(input.id, "validity", e.target.value)
                    }
                    error={!!input.error.validity}
                    helperText={input.error.validity}
                    inputProps={{ min: 1 }}
                    InputLabelProps={{
                      style: { color: "#cbd5e1", fontWeight: 500 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode"
                    placeholder="mylink123"
                    value={input.shortcode}
                    onChange={(e) =>
                      handleInputChange(input.id, "shortcode", e.target.value)
                    }
                    error={!!input.error.shortcode}
                    helperText={input.error.shortcode}
                    InputLabelProps={{
                      style: { color: "#cbd5e1", fontWeight: 500 },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            {urlInputs.length < 5 && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addUrlInput}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  color: "#60a5fa",
                  background: "rgba(59, 130, 246, 0.05)",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    borderColor: "#3b82f6",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Add Another URL
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleBulkSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                color: "#fff",
                px: 4,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.6)",
                },
              }}
            >
              {loading ? "Creating Links..." : "Create Short Links"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results */}
      {shortenedUrls.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 700, color: "#f8fafc", mb: 3 }}
          >
            Generated Links
          </Typography>
          {shortenedUrls.map((result) => (
            <Card
              key={result.id}
              sx={{
                mb: 3,
                borderRadius: 3,
                background: result.success
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                border: result.success
                  ? "1px solid rgba(16, 185, 129, 0.2)"
                  : "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {result.success ? (
                  <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#f8fafc", fontWeight: 600, mb: 1 }}
                      >
                        Original URL:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-all", color: "#cbd5e1" }}
                      >
                        {result.originalUrl}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#f8fafc", fontWeight: 600, mb: 1 }}
                      >
                        Short URL:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Link
                          href={result.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            fontWeight: 600,
                            color: "#60a5fa",
                            wordBreak: "break-all",
                          }}
                        >
                          {result.shortUrl}
                        </Link>
                        <IconButton
                          onClick={() => copyToClipboard(result.shortUrl)}
                          sx={{
                            color: "#60a5fa",
                            background: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            borderRadius: 2,
                            "&:hover": {
                              background: "rgba(59, 130, 246, 0.2)",
                              transform: "scale(1.05)",
                            },
                          }}
                          size="small"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                        Expires: {result.expiryTime}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Alert
                    severity="error"
                    sx={{
                      background: "transparent",
                      color: "#f87171",
                      fontWeight: 500,
                      border: "none",
                      p: 0,
                    }}
                  >
                    {result.error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShortenUrlPage;
