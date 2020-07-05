const mongoose = require('mongoose');
const config=require('config')
const db=config.get('mongoURI')

const connectDB = async() =>
{
    try{
        mongoose.connect(db
        
        , {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
        });
        console.log("Mongo server connected");
    }
    catch(err){
        console.log(err);

    }
}

module.exports= connectDB;