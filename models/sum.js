const mongoose=require('mongoose');
const Schema=mongoose.Schema;

// create Schema

const SumSchema= new Schema({
  val1:{type:Number,required:true},
  val2:{type:Number,required:true},
  total:{type:Number,default:''}
});

mongoose.model('sums',SumSchema);
