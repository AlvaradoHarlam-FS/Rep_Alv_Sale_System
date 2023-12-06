require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(morgan("combined")); // Logging middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://dev--repuestosalvarado.netlify.app"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set 'strictQuery' option to false
mongoose.set("strictQuery", true);

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// Serve the React app
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Handle any other routes by serving the React app's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

// Error Middleware
app.use(errorHandler);

// Connect to DB and start server
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MongoDB URI not found in environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const server = app.listen(process.env.PORT || 5001, () => {
      console.log(`Server Running on port ${server.address().port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log("Server and MongoDB connection closed gracefully");
          process.exit(0);
        });
      });
    });

    process.on("SIGINT", () => {
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log("Server and MongoDB connection closed gracefully");
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
