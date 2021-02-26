const express=require('express');
var sql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
const redis = require("redis");

const PORT=process.env.PORT || 5000;
const  REDIS_PORT=process.env.PORT || 6379;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
var moment= require('moment');
var Connection =sql.createConnection({
    
    user     : "root",
    password : "root",
    host     : "localhost",
    database : "redisdb"    
})
const client = redis.createClient(REDIS_PORT);

//function of setResponse
function setResponse(id,respos){
    
  return`${id} ${respos} `;

}

async function getResponse(request,response){
  try{
  const id=request.params.id;
  console.log(id);
  let sqlQuery = "select id,name,age,salary,address from employee where id='"+id+"'";
  console.log('sqlQuery => ',sqlQuery)
  await Connection.query(sqlQuery,function(err,result){
  if(err) throw err;
  response.send(result);
});
  client.setex(id,60,result);
  response.send(setResponse(id,result));
}
  catch(err){
        console.log(err);
        response.status(500);
  }
}

function cache(req,res,next){
   const id=req.params.id;
  client.get(id,(err,data) =>{
      if(err) throw err;
      if(data!=null){
          res.send(setResponse(id,data));
      }
      else{
          next();
      }
  })
}



app.get('/:id',cache,getResponse);

app.listen(5000,() =>{
  console.log(`server listening on port ${PORT}`)
});






























