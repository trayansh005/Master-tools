import ProductVariant from "../models/ProductsVariants.js";
import Product from "../models/Products.js";

export default {
  // CREATE
  async create(req, res) {
    try {
      const { productId } = req.params;   // 👈 get productId from URL
      const { size, price, stock } = req.body;

      if (!size || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productVariant = await ProductVariant.create({
        size,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        productId
      });

      return res.status(201).json(productVariant);
    } catch (err) {
      console.error("Variant create error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // LIST all variants for a product
  async list(req, res) {
    try {
      const { productId } = req.params;
      const variants = await ProductVariant.find({ productId });
      return res.json(variants);
    } catch (err) {
      console.error("Variant list error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await ProductVariant.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: "Variant not found" });
      return res.json(updated);
    } catch (err) {
      console.error("Variant update error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // DELETE
  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProductVariant.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Variant not found" });
      return res.json({ message: "Variant deleted successfully" });
    } catch (err) {
      console.error("Variant delete error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
