const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/events",(req,res)=>{
    //notify the listener
    const event = req.body;
    axios.post("http://post-srv-cl-ip:4000/events",event)
     .catch(err=>console.log(err));

     axios.post("http://comments-srv-cl-ip:4001/events",event)
     .catch(err=>console.log(err));

     axios.post("http://query-srv-cl-ip:4004/events",event)
     .catch(err=>console.log(err));

     res.send({status:"ok"});
});

app.listen(4003,()=>{
    console.log("event bus service running at port 4003");
})