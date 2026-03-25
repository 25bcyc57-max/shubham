import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// 🔍 CHECK ENV LOADING
console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_KEY ? "Loaded ✅" : "Not Loaded ❌");

const app = express();
app.use(cors());
app.use(express.json());

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Save data route
app.post("/api/save", async (req, res) => {
  try {
    const { name } = req.body;

    console.log("Received name:", name); // 👈 check if request is coming

    const { data, error } = await supabase
      .from("users")
      .insert([{ name }]);

    if (error) {
      console.log("Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Inserted Data:", data);

    res.json({ message: "Data saved successfully ✅", data });

  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});