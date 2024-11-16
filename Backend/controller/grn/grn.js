const Product = require("../../models/product/product");
const ProductHistory = require("../../models/product/productHistory");
const GRN = require("../../models/grn/grn");
const GRNHistory = require("../../models/grn/grnHistory");
const accountPayable = require("../../models/ledgers/accountPayable");

// Add GRN
const addGRN = async (req, res) => {
  try {
    // Create GRN record
    await GRN.create({
      userID: req.body.userId,
      items: req.body.items,
      supplier: req.body.supplier,
      transportCost: req.body.transportCost,
      laborCost: req.body.laborCost,
      total: req.body.total,
      purchaseDate: req.body.purchaseDate,
    });

    // Create GRNHistory record
    await GRNHistory.create({
      userID: req.body.userId,
      items: req.body.items,
      supplier: req.body.supplier,
      transportCost: req.body.transportCost,
      laborCost: req.body.laborCost,
      total: req.body.total,
      purchaseDate: req.body.purchaseDate,
      requestType: "GRN Created",
    });

    // Loop over each item in the GRN request
    for (const item of req.body.items) {
      const productData = {
        items: item.item,
        packSize: item.packSize,
        stock: item.stock,
        supplier: req.body.supplier,
        production: item.production,
        expirationDate: item.expirationDate,
        city: item.city,
        area: item.area,
        warehouseNumber: item.warehouseNumber,
      };

      // Check if the product already exists
      const existingProduct = await Product.findOne({
        items: productData.items,
        packSize: productData.packSize,
        supplier: productData.supplier,
        production: productData.production,
        expirationDate: productData.expirationDate,
        city: productData.city,
        area: productData.area,
        warehouseNumber: productData.warehouseNumber,
      });

      if (existingProduct) {
        existingProduct.stock += productData.stock;
        await existingProduct.save();
        await ProductHistory.create({
          ...productData,
          requestType: "Inventory Updated",
        });
      } else {
        await Product.create(productData);

        await ProductHistory.create({
          ...productData,
          requestType: "Inventory Added",
        });
      }
    }

    // Handle supplier account transactions if a supplier exists
    if (req.body.supplier) {
      const account = await accountPayable.findOne({ name: req.body.supplier });
      if (account) {
        const newTransaction = {
          date: new Date(),
          amount: req.body.total,
          type: "credit",
          debit: 0,
          credit: req.body.total,
        };
        account.transactions.push(newTransaction);
        const transactionAmount =
          newTransaction.type === "credit"
            ? -newTransaction.amount
            : newTransaction.amount;
        account.total += transactionAmount;
        await account.save();
      }
    }

    res
      .status(200)
      .send({ message: "Inventory and GRN and their History Created" });
  } catch (e) {
    res.status(402).send({ message: e.message });
  }
};

// Get All GRNs
const getAllGRNs = async (req, res) => {
  const findAllGRNs = await GRN.find().sort({ expirationDate: 1 }); // -1 for descending;
  res.json(findAllGRNs);
};

const updateGRN = async (req, res) => {
  try {
    const userId = req.body.userId;
    const updatedResult = await GRN.findByIdAndUpdate(
      { _id: req.body.id },
      {
        userID: req.body.userId,
        items: req.body.items,
        supplier: req.body.supplier,
        transportCost: req.body.transportCost,
        laborCost: req.body.laborCost,
        total: req.body.total,
        purchaseDate: req.body.purchaseDate,
      },
      { new: true }
    );
    await GRNHistory.create({
      userID: userId,
      items: updatedResult.items,
      supplier: updatedResult.supplier,
      transportCost: updatedResult.transportCost,
      laborCost: updatedResult.laborCost,
      total: updatedResult.total,
      purchaseDate: updatedResult.purchaseDate,
      requestType: "GRN Updated",
    });

    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search GRNs
const searchGRN = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const grns = await GRN.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(grns);
};

module.exports = {
  addGRN,
  getAllGRNs,
  searchGRN,
};