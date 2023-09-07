const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  
  url: String,
  
});
exports.Image = mongoose.model('Image', imageSchema);


