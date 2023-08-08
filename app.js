const express = require('express');

const mongodb = require('./connection');
const user = require('./model/user');

const userModel = require('./model/user');

const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("<h1>Connected</h1>");
});

function getResponse(success, message, user) {
    return {"success": success,"message": message, "user": user}
}

function getUserResponse(name, email) {
    return {"name": name, "email" :email,}   
}

app.post("/login", (req, res) => {
    email = req.body.email;
    password = req.body.password;

    if(!email){
        res.status(401).send(getResponse(false, 'Email Missing'));
    }else if(!password){
        res.status(401).send(getResponse(false,'Password Missing'));
    }else{
        userModel.findOne({"email": email},(err, doc) => {
            if(err){
                res.status(500).send(getResponse(false,"Error getting user from database"));
            }else{
                if(!doc){
                    res.status(401).send( getResponse(false,"User not found."));
                }
                else if(doc && doc.password == password) {
                    res.status(200).json(getResponse(true, 'Login successful',getUserResponse(doc.name, doc.email,)));
                }else{
                    res.status(401).send(false,getResponse('Invalid Login'));
                }
            }
        });
    }

    
});

app.post("/signup",(req, res) => {
    username = req.body.name;
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
                user.name = username;
                user.email = email;
                user.password = password;
                user.save((err) => {
                    if(err){
                        res.status(500).send(getResponse(false,"Sign up unsuccessful."));
                    }else{
                        res.status(201).send(getResponse(true, 'Sign up successful',getUserResponse(username, email)));
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