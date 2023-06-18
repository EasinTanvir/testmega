const express = require("express");
const HttpError = require("./helper/HttpError");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
const gptRoutes = require("./routes/user");
const vetRoutes = require("./routes/vet");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const { Configuration, OpenAIApi } = require("openai");
const APIONE = require("./models/apikey");
const APITWO = require("./models/apikeytwo");
const APITHREE = require("./models/apikeythree");

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

app.use(async (req, res, next) => {
  try {
    const user = await APIONE.findOne();

    const openApi = new OpenAIApi(
      new Configuration({
        apiKey: user.apikey,
      })
    );
    app.set("gpt", openApi);
  } catch (err) {
    const errors = new HttpError("No Api Key Found", 500);
    return next(errors);
  }

  next();
});
app.use(async (req, res, next) => {
  const user = await APITWO.findOne();

  const openApi = new OpenAIApi(
    new Configuration({
      apiKey: user.apikey,
    })
  );
  app.set("gpt2", openApi);

  next();
});
app.use(async (req, res, next) => {
  const user = await APITHREE.findOne();

  const openApi = new OpenAIApi(
    new Configuration({
      apiKey: user.apikey,
    })
  );
  app.set("gpt3", openApi);

  next();
});

app.use(gptRoutes);
app.use(vetRoutes);
app.use(authRoutes);
app.use(adminRoutes);

app.use((req, res, next) => {
  const errors = new HttpError("No route found for this path", 404);
  return next(errors);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "unknown error occured" });
});

app.listen(process.env.PORT);
