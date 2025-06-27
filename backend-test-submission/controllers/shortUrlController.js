const generateCode = require("../utils/generateCode");

const urlStore = new Map();

exports.createShortUrl = (req, res) => {
  const { url, validation = 30, shortcode } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Invalid URL" });
  }

  const code = shortcode || generateCode();

  if (urlStore.has(code)) {
    return res.status(400).json({ message: "Shortcode already exists" });
  }

  const now = new Date();
  const expire = new Date(now.getTime() + validation * 60000);

  urlStore.set(code, {
    originalUrl: url,
    createdAt: now.toISOString(),
    expiresAt: expire.toISOString(),
    clicks: [],
  });

  res.status(201).json({
    shortLink: `http://localhost:5000/${code}`,
    shortcode: code,
    expiry: expire.toISOString(),
  });
};

exports.getStats = (req, res) => {
  const { shortcode } = req.params;
  const data = urlStore.get(shortcode);

  if (!data) {
    return res.status(404).json({ message: "Shortcode not found" });
  }

  res.json({
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiresAt,
    clicks: data.clicks.length,
    clickData: data.clicks,
  });
};

exports.redirectShortUrl = (req, res) => {
  const { shortcode } = req.params;
  const data = urlStore.get(shortcode);

  if (!data) {
    return res.status(404).json({ message: "Shortcode not found" });
  }

  const now = new Date();
  if (new Date(data.expiresAt) < now) {
    return res.status(410).json({ message: "Shortcode expired" });
  }

  data.clicks.push({
    timestamp: now.toISOString(),
    referrer: req.headers.referer || "direct",
    geo: "Unknown",
  });

  res.redirect(data.originalUrl);
};

exports.getAllShortUrls = (req, res) => {
  const all = [];
  for (const [shortcode, data] of urlStore.entries()) {
    all.push({
      shortcode,
      originalUrl: data.originalUrl,
      createdAt: data.createdAt,
      expiryTime: data.expiresAt,
      clickCount: data.clicks.length,
    });
  }
  res.json(all);
};
