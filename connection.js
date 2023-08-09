const mongoose = require("mongoose");

let uri = ''

mongoose.connect(uri, {useNewUrlParser: true}, (err) => {
    if(!err){
        console.log("Connected to database");
    }else{
        console.log("Error connecting to database");
    }
});