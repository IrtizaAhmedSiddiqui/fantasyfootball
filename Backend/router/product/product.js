const express = require("express");
const app = express();
const product = require("../../controller/product/product");

// Get All Products
app.get("/get/:userId", product.getAllProducts);

// Delete Selected Product Item
app.get("/delete/:id", product.deleteSelectedProduct);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Search Product
app.get("/search", product.searchProduct);

module.exports = app;
