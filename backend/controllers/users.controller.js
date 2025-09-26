import User from "../models/User.js";
// import { useAuth } from "@/contexts/AuthContext";

export default {
  // CREATE
  async update(req, res) {
    // const { user } = useAuth();
    try {
    //   const {userId } = user.id; 
    //   const { first_name, last_name, email, phone, bio, country, state, city, postal_code, tax_id } = req.body;

    //   const userfetch = await User.findById(userId);
    //   if (!userfetch) {
    //     return res.status(404).json({ error: "Product not found" });
    //   }
      const newUser = await User.create({
        first_name,
        last_name,
        email,
        phone,
        bio,
        country,
        state,
        city,
        postal_code,
        tax_id
      });

      return res.status(201).json(newUser);
    } catch (err) {
      console.error("Variant create error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

};