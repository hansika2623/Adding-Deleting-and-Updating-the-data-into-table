const {faker} = require("@faker-js/faker");
const mysql = require("mysql2");
const express =  require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const {v4:uuidv4}=require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection =  mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'delta_app',
    password : 'mysql@123'
});
    
let getRandomUser=()=>{
    return[
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}

//Home page route
app.get("/",(req,res)=>{
    let q = `SELECT count(*) FROM user`;
        connection.query(q,(err,result)=>{
            if(err){
                console.error(err);
                res.send("Some error in database");
                return;
            }
            let count = result[0]["count(*)"];
            res.render("home.ejs",{count});
        });
});

//Show users route
app.get("/user",(req,res)=>{
    let q = `SELECT * FROM user`;
    connection.query(q,(err,users)=>{
        if(err){
            console.error(err);
            res.send("Some error in database");
            return;
        }
        res.render("showusers.ejs",{users});
        
    });
});

//Edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    connection.query(q,(err,result)=>{
        if(err){
            console.error(err);
            res.send("Some error in database");
            return;
        }
        //console.log(result);
        let user = result[0];
        res.render("edit.ejs",{user});
    });
});

//Update route
app.patch("/user/:id",(req,res)=>{
    let {id} = req.params;
    let {password: formPass, username:newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    connection.query(q,(err,result)=>{
        if(err){
            console.error(err);
            res.send("Some error in database");
            return;
        }
        
        let user = result[0];
        if(formPass !=user.password){
            res.send("WRONG PASSWORD");
        }else{
            let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}' `;
            connection.query(q2,(err,result)=>{
                if(err){
                    console.error(err);
                    res.send("Some error in database");
                    return;
                }
                res.redirect("/user");
            });
        }
    });
});

//Add new user
app.get("/user/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/user/new",(req,res)=>{
    let {username, email, password} = req.body;
    let id = uuidv4();
    let q = `INSERT INTO user (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;
    connection.query(q,(err,result)=>{
        if(err){
            console.error(err);
            res.send("Some error in database");
            return;
        }
        res.redirect("/user");
    });
});

//Delete a user
app.get("/user/:id/delete",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    connection.query(q,(err,result)=>{
        if(err){
            console.error(err);
            res.send("Some error in database");
            return;
        }
        //console.log(result);
        let user = result[0];
        res.render("delete.ejs",{user});
    });
});

app.delete("/user/:id/",(req,res)=>{
    let {id} = req.params;
    let {password} = req.body;
    let q =`SELECT * FROM user WHERE id='${id}'`;
    connection.query(q,(err,result)=>{
        if(err){
            console.error(err);
            res.send("Some error in database");
            return;
        }
        let user = result[0];
        if(user.password!=password){
            res.send("WRONG PASSWORD");
        }else{
            let q2= `DELETE FROM user WHERE id='${id}'`;
            connection.query(q2,(err,result)=>{
                if(err){
                    console.error(err);
                    res.send("Some error in database");
                    return;
                }else{
                    res.redirect("/user");
                }
            });
        }
    })
})

app.listen("8080",()=>{
    console.log("server is listening to port 8080");
});
