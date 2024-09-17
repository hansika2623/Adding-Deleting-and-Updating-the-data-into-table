const {faker} = require("@faker-js/faker");
const mysql = require("mysql2/promise");
const express =  require("express");
const app = express();


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

app.get("/",(req,res)=>{
    let q = `SELECT count(*) FROM user`
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result[0]["count(*)"]);
            res.send("Success");
        });
    }catch(err){
        console.log(err);
        res.send("Some error in database");
    }
});

app.listen("8080",()=>{
    console.log("server is listening to port 8080");
});
