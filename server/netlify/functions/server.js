require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("../../routes/auth/auth-routes");
const adminProductsRouter = require("../../routes/admin/products-routes");
const shopListingRouter = require("../../routes/shop/listing-routes");
const shopCartRouter = require("../../routes/shop/cart-routes");
const shopAddressRouter = require("../../routes/shop/address-routes");
const OrderRouter = require("../../routes/shop/order-routes");
const adminOrderRouter = require("../../routes/admin/order-routes");
const shopSearchRouter = require("../../routes/shop/search-routes");
const shopReviewsRouter = require("../../routes/shop/reviews-routes");
const commonFeatureRouter = require("../../routes/common/feature-routes");
const adminUserRouter = require("../../routes/admin/user-routes");
//connect to DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected."))
    .catch((error) => console.log(error));

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_BASE_URL,
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopListingRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", OrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/reviews", shopReviewsRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/admin/users", adminUserRouter);
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});
if(process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () =>
        console.log(`Server running on PORT: ${PORT}`)
    );
}
module.exports.handler = serverless(app);
