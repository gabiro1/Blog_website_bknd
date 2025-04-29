import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    let { first_name, last_name, email, password, role, image, address, country, city, contact } = req.body;

    // Handle image upload if present
    const profileImage = req.file ? req.file.filename : image || null;

    try {
        // Check if user already exists
        db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("DB query error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const insertQuery = `
                INSERT INTO user 
                (first_name, last_name, email, password, role, image, address, country, city, contact)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(insertQuery, [
                first_name,
                last_name,
                email,
                hashedPassword,
                role || "Author",
                profileImage,
                address,
                country,
                city,
                contact
            ], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error("Insert error:", insertErr);
                    return res.status(500).json({ message: "Error saving user" });
                }

                return res.status(201).json({ message: "User registered successfully" });
            });
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("DB query error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = results[0];

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Credential" });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id, role:user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.status(200).json({ token, user });
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { register, login };
