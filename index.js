const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // collection declare here

    const db = client.db("assignment");
    const collection = db.collection("users");

    const clothCollections = client.db("assignment").collection("cloths");
    const donationCollections = client.db("assignment").collection("donations");
    const communityCollections = client
      .db("assignment")
      .collection("communitys");
    const testimonialCollections = client
      .db("assignment")
      .collection("testimonials");
    const volunteerCollections = client
      .db("assignment")
      .collection("volunteers");

    // User Registration
    app.post("/api/v1/register", async (req, res) => {
      try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "User already exists",
          });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await collection.insertOne({ name, email, password: hashedPassword });

        res.status(201).json({
          success: true,
          message: "User registered successfully",
        });
      } catch (err) {
        console.log(err);
      }
    });

    // User Login
    app.post("/api/v1/login", async (req, res) => {
      const { email, password } = req.body;
      console.log(email, password);

      // Find user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, name: user.name },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
      });
    });

    // ==============================================================
    // WRITE YOUR CODE HERE
    // ==============================================================

    // === cloths collection

    // == get all ==

    app.get("/api/v1/cloths", async (req, res) => {
      try {
        const result = await clothCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // == get single ==

    app.get("/api/v1/cloths/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const result = await clothCollections.findOne(query);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // == update ==

    app.patch("/api/v1/cloths/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const clothsInfo = req.body;

        const updatedCloth = {
          $set: {
            title: clothsInfo.title,
            category: clothsInfo.category,
            size: clothsInfo.size,
            description: clothsInfo.description,
          },
        };

        const result = await clothCollections.updateOne(query, updatedCloth);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // == post ==

    app.post("/api/v1/cloths", async (req, res) => {
      try {
        const clothsData = req.body;

        const result = await clothCollections.insertOne(clothsData);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // == delete ==

    app.delete("/api/v1/cloths/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const result = await clothCollections.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // ========= donation ============

    app.get("/api/v1/donations", async (req, res) => {
      try {
        const result = await donationCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // === post ==

    app.post("/api/v1/donations", async (req, res) => {
      try {
        const donationData = req.body;
        const result = await donationCollections.insertOne(donationData);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // community ===========

    app.get("/api/v1/comment", async (req, res) => {
      try {
        const result = await communityCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // post

    app.post("/api/v1/comment", async (req, res) => {
      try {
        const donationData = req.body;
        const result = await communityCollections.insertOne(donationData);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    //  testimonial ========

    app.get("/api/v1/testimonial", async (req, res) => {
      try {
        const result = await testimonialCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // post

    app.post("/api/v1/testimonial", async (req, res) => {
      try {
        const donationData = req.body;
        const result = await testimonialCollections.insertOne(donationData);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // volunteers

    app.get("/api/v1/volunteer", async (req, res) => {
      try {
        const result = await volunteerCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // post

    app.post("/api/v1/volunteer", async (req, res) => {
      try {
        const donationData = req.body;
        const result = await volunteerCollections.insertOne(donationData);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
