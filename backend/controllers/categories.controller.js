// controllers/categories.controller.js
import Category from "../models/Category.js";

async function list(req, res) {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
}

async function create(req, res) {
  const category = await Category.create(req.body);
  res.status(201).json(category);
}

async function update(req, res) {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
}

async function remove(req, res) {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}

export default { list, create, update, remove };
