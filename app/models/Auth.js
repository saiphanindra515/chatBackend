const mongoose = require('mongoose');
const schema = mongoose.Schema;
const time= require('./../libs/timeLib');

let Auth = new schema({
    userId:{
        type:String
    },
    authToken: {
        type: String
      },
      tokenSecret: {
        type: String
      },
      tokenGenerationTime: {
        type: Date,
        default: time.now()
      }
})

module.exports=mongoose.model('Auth',Auth);