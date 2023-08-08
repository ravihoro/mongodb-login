const mongoose = require("mongoose");

let uri = 'mongodb+srv://ravijohn:Lumiablack@5@cluster0.4rp5eyl.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri, {useNewUrlParser: true}, (err) => {
    if(!err){
        console.log("Connected to database");
    }else{
        console.log("Error connecting to database");
    }
});