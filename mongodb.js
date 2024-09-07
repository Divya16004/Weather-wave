const mongoose=require('mongoose');


mongoose.connect('mongodb+srv://divya:divya2004%4016@cluster0.whstcup.mongodb.net/')
.then(()=>{
    console.log("mongodb connected");
})
.catch((error)=>{
    console.error("failed to connect",error.message);
});

const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

});

const collection=new mongoose.model("Collection1",LogInSchema)
module.exports=collection