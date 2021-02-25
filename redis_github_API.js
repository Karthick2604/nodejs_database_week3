const express=require('express');
const fetch=require('node-fetch');
const redis = require("redis");

const PORT=process.env.PORT || 7000;
const  REDIS_PORT=process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app=express();
//function of setResponse
function setResponse(username,respos){
    
    return`<h2>${username}has${respos} github</h2>`;

}

//connect to github
 async function getRepos(req,res,next){

    try{

    console.log('Fetching data...');
    const {username}=req.params;
    const response= await fetch(`http://api.github.com/users/${username}`);
    console.log(response);
    const data= await response.json();
    const respos=data.following;
    //set data to redis
    client.setex(username,3600,respos);
    res.send(setResponse(username,respos));
}
catch(err){
   
     console.log(err);
    res.status(500);
}

}

//cache function

function cache(req,res,next){
    const {username}=req.params;
    client.get(username,(err,data) =>{
        if(err) throw err;
        if(data!=null){
            res.send(setResponse(username,data));
        }
        else{
            next();
        }
    })
}



app.get('/repos/:username',cache,getRepos);

app.listen(7000,() =>{
  console.log(`server listening on port ${PORT}`)
});