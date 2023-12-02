// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const axios = require("axios");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Replace 'YOUR_COINGECKO_API_KEY' with your actual CoinGecko API key
const coinGeckoApiKey = 'CG-FPXfz6ZfxJCpk4uZZwHVCeED';

app.get('/api/coin-price', async (req, res) => {
  try {
    const { id, vsCurrency } = req.query;
    const response = await axios.get(`https://api.coingecko.com/api/v3/ping?x_cg_api_key=CG-FPXfz6ZfxJCpk4uZZwHVCeED`, {
      params: { ids: id, vs_currencies: vsCurrency },
      headers: { 'Content-Type': 'application/json', 'X-CoinGecko-API-Key': coinGeckoApiKey },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const investRoutes = require("./routes/Invest.routes");
app.use("/invest", investRoutes);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;


