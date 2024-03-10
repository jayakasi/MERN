const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docSchema = new Schema({
      title: { type : String, required: true},
      description: { type : String, required: true},
      image: { type : String, required: true},
      date: { type : String, required: true},
      studId : { type : String, required: true},
      studClass :{ type : String, required: true},
      studSec :{ type : String, required: true},
      creator : { type : mongoose.Types.ObjectId, required: true, ref:'User'}
});



module.exports=mongoose.model('Document',docSchema); 