"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const deliveryRoutes_1 = __importDefault(require("./routes/deliveryRoutes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
// ✅ Middleware to parse JSON body (needed for req.body)
app.use(express_1.default.json());
// Optional: For parsing URL-encoded form data if needed
app.use(express_1.default.urlencoded({ extended: false }));
// Security and logging middlewares
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use((0, cors_1.default)());
/* ROUTES */
app.get("/hello", (req, res) => {
    res.send("Welcome to the server!");
});
app.use("/dashboard", dashboardRoutes_1.default);
app.use("/products", productRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/expenses", expenseRoutes_1.default);
app.use("/deliveries", deliveryRoutes_1.default);
app.use("/report", report_routes_1.default);
/* SERVER START */
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
