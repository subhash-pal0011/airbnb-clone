const mongoose = require('mongoose');

let listschema = new mongoose.Schema({
       title: {
              type: String,
              required: true
       },
       description: {
              type: String,
              required: true
       },
       image: {
              url: {
                     type: String,
                     default: "https://plus.unsplash.com/premium_vector-1721890983082-3992f67f7e6b?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              },
              filename: { type: String}
       },
       price: {
              type: Number,
              min: [1000, "price low"],
              required: true
       },
       location: {
              type: String,
              required: true
       },
       country: {
              type: String,
              required: true
       },
       review: [
              {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Review"
              }
       ],
       
       owner: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User' // This should match your User model name
       }
            
});


module.exports = mongoose.model('mainSchema', listschema);

