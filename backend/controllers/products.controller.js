import Product from "../models/Products.js";
import Category from "../models/Category.js";
import util from "util";
import mongoose from "mongoose";


export default {
  // CREATE
  async create(req, res) {

    console.log(util.inspect(req, { depth: null }));
    try {
      const { name, price, description, categoryId, stock } = req.body;

      if (!name || !price || !categoryId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}.jpg` : null;

      console.log(imageUrl);

      const product = await Product.create({
        name,
        price: parseFloat(price),
        description,
        imageUrl,
        category: categoryId,
        stock: stock ? parseInt(stock) : 0,
      });

      return res.status(201).json(product);
    } catch (err) {
      console.error("Product create error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // READ (List All)
  async list(req, res) {
    try {
      const { category, search } = req.query;
      let filter = {};
  
      if (category) filter.category = category;
      if (search) filter.name = { $regex: search, $options: "i" }; // case-insensitive
  
      const products = await Product.find(filter).populate("category", "name").sort({ name: 1 }); ;
      return res.json(products);
    } catch (err) {
      console.error("Product list error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  

  // READ (Single Product)
  async getOne(req, res) {
    const { id } = req.params;
  
    // 1. Validate that the ID exists and is a valid ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid or missing product ID" });
    }
  
    try {
      // 2. Fetch the product
      const product = await Product.findById(id).populate("category", "name");
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      return res.json(product);
    } catch (err) {
      console.error("Product get error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const { name, price, description, categoryId, stock } = req.body;

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });
        product.category = categoryId;
      }

      product.name = name || product.name;
      product.price = price ? parseFloat(price) : product.price;
      product.description = description || product.description;
      product.stock = stock ? parseInt(stock) : product.stock;

      if (req.file) {
        product.imageUrl = `/uploads/${req.file.filename}`;
      }

      await product.save();
      return res.json(product);
    } catch (err) {
      console.error("Product update error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // DELETE
  async remove(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Product delete error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
