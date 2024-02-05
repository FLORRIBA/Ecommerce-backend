const mongoose=require('mongoose')
const Schema=mongoose.Schema

const categorySchema=new Schema({

    name:{
        type: String,
        required:true,
        unique:true,
        trim:true,
        minlength:3,
        maxlength:255
    },
    description:{
        type:String,
        required:false,
        trim:true,
        maxlength:255
        
    }
})
                //va a crear la collection categories en mongoose
module.exports=mongoose.model('Category', categorySchema)