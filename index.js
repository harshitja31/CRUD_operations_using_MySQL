const { faker } = require('@faker-js/faker');
const  mysql  = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: 'Harshit@2004'
  });
  let getRandomUser = () => {
    return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
    ]
};

let port = 5000;


app.listen(port,() =>{
    console.log("listening on port 5000");
})

app.get("/",(req,res) =>{
   let q = `SELECT count(*) FROM user`;
   try{
        connection.query(q,(err,result) => {
            if(err) throw err;
          let count = result[0]['count(*)'];
            res.render("home.ejs",{ count });
        }
    )}
    catch(err){
        console.log(err);
        res.send("Some error in DB.");
    }
})

app.get("/user",(req,res) =>{
    let q = `SELECT * FROM user`;
    try{
         connection.query(q,(err,result) => {
             if(err) throw err;
             let data = result;
             res.render("show.ejs",{ data });
         }
     )}
     catch(err){
         console.log(err);
         res.send("Some error in DB.");
     }
 })

app.get("/user/:id/edit",(req,res)=>{
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id ='${ id }'`
    try{
        connection.query(q,(err,result) => {
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs",{ user });
        }
    )}
    catch(err){
        console.log(err);
        res.send("Some error in DB.");
    }
})

app.patch("/user/:id",(req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id ='${ id }'`
    let { password : formPassword , username: newUsername} = req.body;
    try{
        connection.query(q,(err,result) => {
            if(err) throw err;
            let user = result[0];
            if( user.password != formPassword ){
                res.send("Wrong Password! Try Again");
            }
            else{
                let q2 = `UPDATE user SET username ='${newUsername}' WHERE id = '${id}'`;
                connection.query(q2,(err,result) => {
                    if(err) throw err;
                    res.redirect("/user");
            })
        }
        }
    )}
    catch(err){
        console.log(err);
        res.send("Some error in DB.");
    }
})

app.get("/user/:id/delete",(req,res)=>{
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id ='${ id }'`
    try{
        connection.query(q,(err,result) => {
            if(err) throw err;
            let user = result[0];
            res.render("delete.ejs",{ user });
        }
    )}
    catch(err){
        console.log(err);
        res.send("Some error in DB.");
    }
})

app.delete("/user/:id",(req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id ='${ id }'`
    let { password : formPassword , email: formEmail} = req.body;
    try{
        connection.query(q,(err,result) => {
            if(err) throw err;
            let user = result[0];
            if( user.password != formPassword && user.email != formEmail){
                res.send("Wrong Password & Email! Try Again");
            }
            else{
                let q2 = `DELETE FROM user WHERE id = '${ id }'`;
                connection.query(q2,(err,result) => {
                    if(err) throw err;
                    res.redirect("/user");
            })
        }
        }
    )}
    catch(err){
        console.log(err);
        res.send("Some error in DB.");
    }
})

app.get('/user/add',(req,res)=>{
    res.render("add.ejs");
})
app.post('/user',(req,res)=>{
    let { id:formId,username:formUsername,email:formEmail,password:formPassword} = req.body
    let q = `INSERT into user (id,username,email,password) VALUES ('${formId}','${formUsername}','${formEmail}','${formPassword}')`;
    try{
    connection.query(q,(err,result) =>{
        if(err) throw err
        res.redirect("/user");
    })
}
catch(err){
console.log(err);
}
})
app.get('/',(req,res)=>{
    res.redirect("/user");
})

// let q = ("INSERT into user (id,username,email,password) VALUES ? ");


// try{
//     connection.query(q,[data],(err,result) => {
//         if(err) throw err;
//         console.log(result);
//     }
// )}
// catch(err){
//     console.log(err);
// }
// connection.end();

// console.log(getRandomUser());