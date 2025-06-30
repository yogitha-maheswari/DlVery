import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import reportRoutes from "./routes/report.routes";

/* CONFIGURATIONS */
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

// ✅ Middleware to parse JSON body (needed for req.body)
app.use(express.json());
// Optional: For parsing URL-encoded form data if needed
app.use(express.urlencoded({ extended: false }));

// Security and logging middlewares
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

/* ROUTES */
app.get("/hello", (req, res) => {
  res.send("Welcome to the server!");
});

app.use("/dashboard", dashboardRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/report", reportRoutes);

/* SERVER START */
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
