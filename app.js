const express = require('express');

const mongodb = require('./connection');
const user = require('./model/user');

const userModel = require('./model/user');

const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("<h1>Connected</h1>");
});

function getResponse(isSuccess, message, user) {
    return {"isSuccess": isSuccess,"message": message, "user": user}
}

function getUserResponse(name, email, id, password) {
    return {"name": name, "email" :email, "id": id, "password": password}   
}

app.post("/login", (req, res) => {
    email = req.body.email;
    password = req.body.password;

    if(!email && !password){
        res.status(400).send(getResponse(false, "Email and Password missing"));
    }
    else if(!email){
        res.status(400).send(getResponse(false, 'Email Missing'));
    }else if(!password){
        res.status(400).send(getResponse(false,'Password Missing'));
    }else{
        userModel.findOne({"email": email, "password": password},(err, doc) => {
            if(err){
                res.status(500).send(getResponse(false,"Internal Server Error"));
            }else{
                if(!doc){
                    res.status(404).send( getResponse(false,"User not found."));
                }
                else {
                    res.status(200).json(getResponse(true, 'Login successful', getUserResponse(doc.name, doc.email)));
                }
            }
        });
    }
});

app.post("/signup",(req, res) => {
    name = req.body.name;
    email = req.body.email;
    password = req.body.password;

    // console.log(username);
    // console.log(email);
    // console.log(password);

    userModel.findOne({"email" : email},(err, doc) => {
        if(err){
            res.status(500).send(getResponse(false,"Error signing up"));
        }else{
            if(doc){
                res.status(409).send(getResponse(false,"User already exists"));
            }else{
                const user = new userModel();
                user.name = name;
                user.email = email;
                user.password = password;
                user.save((err) => {
                    if(err){
                        res.status(500).send(getResponse(false,"Sign up unsuccessful."));
                    }else{
                        res.status(201).send(getResponse(true, 'Sign up successful',getUserResponse(name, email)));
                    }
                }); 
            }
        }
    });

});

app.get("/users", (req, res) => {
    userModel.find((err, docs) => {
        if(err){
            res.send(getResponse(false,"Error getting users from database"));
        }else{
            res.send(docs);
        }
    });
});

app.listen(3000,() => {
    console.log("Server listening at port: 3000");
});