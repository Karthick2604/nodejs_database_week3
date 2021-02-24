var express = require('express');
var sql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
var moment= require('moment');
var Connection =sql.createConnection({
    
    user     : "root",
    password : "root",
    host     : "localhost",
    database : "school"    
})

app.get('/',function(request,response)
{
    Connection.connect(function(err) 
    {
        if (err) throw err;
        //Select all customers and return the result object:
        Connection.query("SELECT * FROM student", function (err, result) {
        if (err) throw err;
        response.send(result);
    });
  });
})
app.get('/:id', function (req, res) {
    // if object found return an object else return 404 not-found
    console.log('req.params.id ',req.params.id)
        Connection.query(`select * from student where register_number=${req.params.id}`, function(err,result){
        res.send(result);
        });    
});
// get the specific class student
app.get('/class/:id', function (req, res) {
    // if object found return an object else return 404 not-found
    console.log('req.params.id ',req.params.id)
        Connection.query(`select class.name,student.name,student.address,student.phone_number from student JOIN class on student.class =  class.id where class.id=${req.params.id}`, function(err,result){
        res.send(result);
        });    
});

app.get('/staff/:id', function (req, res) {
    // if object found return an object else return 404 not-found
    console.log('req.params.id ',req.params.id)
        Connection.query(`select class.name, staff.name,staff.e_mail from staff JOIN class on staff.id = class.teacher_id where class.teacher_id=${req.params.id}`, function(err,result){
        res.send(result);
        });    
});
app.get('/subject_details/',function(req,response)
{
    // console.log('request',req.body);
    let sqlQuery = "select * from subject";
    console.log('sqlQuery => ',sqlQuery)
    Connection.query(sqlQuery,function(err,result){
    if(err) throw err;
    response.send(result);
  });
})
app.get('/attandance_details/:id',function(req,response)
{
    let id = parseInt(req.params.id);
    console.log('req',req.body);
    let sqlQuery = "select student_id,updated_at,status from attandance where student_id='"+id+"'";
    console.log('sqlQuery => ',sqlQuery)
    Connection.query(sqlQuery,function(err,result){
    if(err) throw err;
    response.send(result);
  });
})
app.get('/mark/:id',function(req,res){ 
    let id = parseInt(req.params.id);
    //console.log(id);
    var sqlQuery="select subject.name,mark.mark from mark join subject on mark.subject_id=subject.id  where mark.register_number='"+id+"'";
    console.log('sqlQuery => ',sqlQuery)
    Connection.query(sqlQuery,function(err,result){
    if(err) throw err;
    res.send(result); 
    });  
})
app.post('/student_details', function (req, res) {
    // create an object of new Item
    console.log('req ',req.body);
    let sqlQuery = "insert into student (name,class,dob,address,phone_number,city,state) values('"+req.body.name+"','"+req.body.class+"','"+req.body.dob+"','"+req.body.address+"','"+req.body.phone_number+"','"+req.body.city+"','"+req.body.state+"')";
    console.log('sqlQuery => ',sqlQuery)
    Connection.query(sqlQuery,function(err,result){
    res.send(result);
  });
});

//  ADD A NEW SUBJECT
app.post('/add_subject', function (req, res) {
    // create an object of new Itemar mysqlTimestamp = 
    Connection.query(sqlQuery,function(err,result){
    res.send(result);
  });
});
// add new mark in this function
app.post('/ad_mark',function(req,res){
    console.log('req',req.body);
    let sqlQuery="insert into mark (register_number,subject_id,mark) values('"+req.body.register_number+"','"+req.body.subject_id+"','"+req.body.mark+"')";
    console.log('sqlQuery  =>',sqlQuery);
    Connection.query(sqlQuery,function(err,result){
    res.send(result);
    });
})
//put attandance to student
app.post('/attandance',function(req,res){
   // var updated_at=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log('req',req.body);
    let sqlQuery="insert into attandance(student_id,status) values('"+req.body.student_id+"','"+req.body.status+"')";
    console.log('sqlQuery  =>',sqlQuery);
    Connection.query(sqlQuery,function(err,result){
    res.send(result);
    });
})
app.put('/update_student_details/:id',function(req,res){//id found then start the update function
    let id = parseInt(req.params.id);
    console.log('req ',req.body);
    let sqlQuery = "update student set  address='"+req.body.address+"' where register_number = '"+id+"'";
    console.log('sqlQuery => ',sqlQuery)
    Connection.query(sqlQuery,function(err,result){
      res.send(result);
});
});
app.put('/update_attandance_details/:id',function(req,res){//id found then start the update function
    let id = parseInt(req.params.id);
    var updated_at=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log('req ',req.body);
    let sqlQuery = "update attandance set  updated_at='"+updated_at+"',status = '"+req.body.status+"'  where student_id = '"+id+"'";
    console.log('sqlQuery => ',sqlQuery)
    Connection.query(sqlQuery,function(err,result){
      res.send(result);
});
});

var port = process.env.PORT || 9000;
app.listen(port,function(){
    console.log(`Running ${port}`);
});