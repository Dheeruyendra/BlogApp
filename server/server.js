import express from "express";
import cors from "cors";
import connectDB from "./database/db.js";
import UserModel from "./models/userSchema.js";
import PostModel from "./models/postSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
const uploadMiddleware = multer({ dest: "uploads/" });
import fs from "fs";

const app = express();
const port = 8000;
connectDB();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use( '/uploads', express.static("uploads"));

const salt = bcrypt.genSaltSync(10);
const secretKey = "secretKey";

app.post("/createpost", uploadMiddleware.single("file"), async (req, res) => {
  //console.log(req.file, req.body);
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newpath = path + "." + ext;
  fs.renameSync(path, newpath);
  //console.log(newpath);
  
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    
  const { title, summary, content } = req.body;
  const postDoc = await PostModel.create({
    title,
    summary,
    content,
    cover: newpath,
    author : info.id,
  });
  res.json(postDoc);
  });
  //res.json({ message: 'File uploaded successfully', file: req.file });
});

app.get("/posts", async (req, res) => {
  const posts = await PostModel.find().populate("author").sort({createdAt: -1}).limit(29);
  res.json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  const postDoc = await PostModel.findById(id).populate("author");
  res.json(postDoc);
  
});

app.put("/post", uploadMiddleware.single('file'), async (req, res) => {
     let newPath = null;     
  if(req.file){
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newpath = path + "." + ext;
        fs.renameSync(path, newpath);
       }
       const { token } = req.cookies;
        jwt.verify(token, secretKey, {}, async (err, info) => {
          if (err) return res.status(401).json({ error: "Invalid token" });
          const { title, summary, content, id } = req.body;
          const postDoc = await PostModel.findByIdAndUpdate(id);
          const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
          if(!isAuthor){
            return res.status(401).json({ error: "You are not the author" });
          }
           await PostModel.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
          });
          res.json(postDoc);
        });
}); 

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await UserModel.find({ username: username });
    if (findUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    });
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await UserModel.find({ username: username });
    if (findUser.length === 0) {
      return res.status(400).json({ message: "Username does not exist" });
    }
    const isPasswordCorrect = bcrypt.compareSync(
      password,
      findUser[0].password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const payload = {
      username: username,
      id: findUser[0]._id,
    };

    jwt.sign(payload, secretKey, { expiresIn: "24h" }, (err, token) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.cookie("token", token, { httpOnly: true }).json({
        message: "Login successful",
        username: username,
        id: findUser[0]._id,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.json(info);
  });
});

app.get("/", (req, res) => {
  res.json(`Server is up and running at port ${port}`);
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
