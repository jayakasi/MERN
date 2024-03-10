const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
      name: { type : String, required: true},
      rollno:{ type : String, required: true, unique:true},
      
      email: { type : String, required: true, unique:true},
      password: { type : String, required: true,minlength:8},
      image :{ type : String, required: true},
      docs : [{ type : mongoose.Schema.Types.ObjectId, required: true, ref:'Document'}]
});

userSchema.plugin(uniqueValidator);


module.exports=mongoose.model('User',userSchema); 