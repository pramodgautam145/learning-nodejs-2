const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const posts={};
//single end point to communicate
app.get("/posts",(req,res)=>{
    res.json(posts);
});

app.post("/events",(req,res)=>{
    const {type,data} = req.body;
    if(type =="Post created"){
        const {id,title} = data;
        posts[id] ={id,title,comments:[]};
    }
    else if(type=="Comment created"){
        const {id,content,postId} =data;
        const post = posts[id];
        post.comments.push({id,content});
    }
    console.log("query :"+ posts);
    res.send({});
});

app.listen(4004, () => {
    console.log("Query service running at 4004 !");
  });