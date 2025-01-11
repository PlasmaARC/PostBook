//Importing mongoose
const mongoose = require('mongoose');

//Connecting to mongoose local host
mongoose
.connect("mongodb://127.0.0.1:27017/miniproject")
//sending connection msg
.then(function(){
    console.log("Coonected To Mongoose");
})
.catch(function(err){
    console.log("Error Encoutered: ", err);
});

//exporting mongoose module.
module.exports = mongoose.connection;
