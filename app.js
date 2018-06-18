var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mysql=require('mysql');
var path=require('path');

app.use(express.static(path.join(__dirname,'/public')));


var con=mysql.createConnection({
    user:"root",
    password:"",
    host:"localhost",
    database:"nodedb"
});

con.connect(function(err){
    if(err){
        console.log("error in creating database");
    }else
    console.log('database craeted!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//CREATE CONTACT
app.post('/details',function(req,res){
   
    var user={
        name:req.body.name,
        phone:req.body.phone
    }
    con.query('INSERT INTO contactuser SET?',user,function(error,result){
        if(error){
            console.log('error in inserting values');
        }else
        console.log('contact inserted!');
        res.send("CONTACT CREATED---" + req.body.name +":"+ req.body.phone);
    });
});

//DELETE CONTACT
app.post('/delete',function(req,res){
    var phone=req.body.phone;
    con.query('SELECT name FROM contactuser WHERE phone=?',[phone],function(error,row,field){
        if(error){
            console.log('error in matching');
        }else{
        if(row.length>0){
                con.query('DELETE FROM contactuser WHERE phone=?',[phone],function(err,result){
                    if(err){
                    console.log('error in deleting');
                    }
                    else{
                    console.log('Contact deleted Successfully');
                    res.send('CONTACT DELETED--' + req.body.phone);
                    }
                });
            }else{
            console.log('No contact with that phone');
            res.send('NO CONTACT WITH THAT NUMBER');
            }
        }
    });
});

//SEARCH CONTACT
app.post('/search',function(req,res){
var name=req.body.name;
con.query('SELECT * FROM contactuser WHERE name=?',[name],function(error,rows,field){
    if(error){
        console.log('error in searching');
    }else{
        if(rows.length>0){
            res.send(rows);
       }else{
        console.log('No user with that name');
        res.send('NO USER WITH THE NAME :'+ req.body.name);
    }
}
});
});


app.listen(5000);
