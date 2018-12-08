const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  content: {type: String, trim: true, required: true},
  host: {type: String, required: true},
  area: {type:String, trim: true, required: true},
  subject: {type:String, trim: true, required: true},
  period: {type:String, trim: true, required: true},
  outline: {type:String, trim: true, required: true},
  manager: {type:String, trim: true, required: true},
  tel: {type:String, trim: true, required: true},
  tags: [String],
  numLikes: {type: Number, default: 0},
  numHates: {type: Number, default: 0},
  numAnswers: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  img: {type:String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Question = mongoose.model('Question', schema);

module.exports = Question;
