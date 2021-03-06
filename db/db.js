var mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const con = await mongoose.connect(`${process.env.MONGO_URL}${process.env.DATABASE_NAME}`, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
        console.log(`Database connected : ${con.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB;