if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/ilrnu";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(cookieParser());

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.all("*", (req, res, next) => {
  res.status(404).send("Page Not Found!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
