const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});


const connectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true

        });
        console.log('DB Conectada');
    } catch (error) {
        console.log('Error al conectar a la bbdd');
        console.log(error);
        process.exit(1); // salir/detener de la app

    }
}



module.exports = connectarDB;