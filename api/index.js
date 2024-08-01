import bcrypt from 'bcrypt';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { Post } from './models/post.js';
import { User } from './models/user.js';
import path from 'path';
import 'dotenv/config';
const saltRounds = 10;
const { sign, decode, verify } = jsonwebtoken;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const uploadMiddleware = multer({ dest: 'uploads/' })


const Mongo_Url=process.env.Mongo_Url;
const secret = process.env.secret;



mongoose.connect(Mongo_Url);

app.post("/register", async (req, res) => {
  try {
    const { username, password, confirmpassword } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if(!(password === confirmpassword)){
      return res.status(411).json({msg:"password and confirm password not matched"})
    }
    const existingUser = await User.findOne({
      username
    })
    if(existingUser){
      res.status(411).json({
        msg:"Username already exists"
      })

    }else{
      const UserTable=  await User.create({
        username,
        password:bcrypt.hashSync(password, saltRounds),
      })
      const token = jsonwebtoken.sign({id:UserTable._id,username:UserTable.username},secret);
    res.json({token,user:UserTable});
    }
    


    
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/login', async(req,res)=>{
try{
    const{username,password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
    const UserDoc = await User.findOne({username})
    if(!UserDoc){
        return res.status(404).json({ message:"User Not Found"})
    }
    const passok = bcrypt.compareSync(password, UserDoc.password);
    
    if(!passok){
        res.status(411).json({message:'invalid credentials'})
    }
    const token = jsonwebtoken.sign({id:UserDoc._id,username:UserDoc.username},secret);
    res.json({token});

}catch(e){
    console.log(e);
}
})

app.get('/profile',  (req,res)=>{
    const AuthHead = req.headers.authorization;
    if(!AuthHead){
        res.status(401).json();
    }

    const token = AuthHead;
    try{
         jsonwebtoken.verify(token,secret,(err,userinfo)=>{
            if(err) throw err;
            res.json(userinfo)
        });
        
    }
    catch(e){
        res.json("error");
    }
})

app.post('/createPost', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let NewPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = path.split('\\');
      NewPath = `${parts[0]}\\${originalname}`;
      fs.renameSync(path, NewPath);
    }

    const { title, summary, content } = req.body;

    const AuthHead = req.headers.authorization;
    if (!AuthHead) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = AuthHead;
    jsonwebtoken.verify(token, secret, async (err, userinfo) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const PostDoc = await Post.create({
        title,
        summary,
        content,
        cover: NewPath,
        author: userinfo.id,
      });

      res.json(PostDoc);
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/createPost', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/createPost/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', ['username']);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/createPost', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let NewPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = path.split('\\');
      NewPath = `${parts[0]}\\${originalname}`;
      fs.renameSync(path, NewPath);
    }

    const AuthHead = req.headers.authorization;
    if (!AuthHead) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = AuthHead;
    jsonwebtoken.verify(token, secret, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json({ error: 'You are not the author' });
      }

      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;

      if (NewPath) {
        postDoc.cover = NewPath;
      }

      await postDoc.save();
      res.json(postDoc);
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/post/:id',async(req,res)=>{
  try{
    const { id } = req.params;
    const PostDoc = await Post.findByIdAndDelete(id);
    if(!PostDoc){
      return res.status(404).json({ error: 'Post not found' });

    }
    res.status(200).json({ message: 'Resource deleted successfully' });

  }catch(err){
    return res.status(500).json(srvv)
  }
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
