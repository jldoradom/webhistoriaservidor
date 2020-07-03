const { ApolloServer } = require('apollo-server');
const {apolloUploadExpress} = require('apollo-upload-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectarDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({
    path: 'variables.env'
});

// Conectar a la bbdd
connectarDB();


// Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({
        req
    }) => {
        // console.log(req.headers['authorization'])

        // console.log(req.headers);

        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                // console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                console.log('Hubo un error al comprobar el token del usuario');
                console.log(error);
            }
        }
    },
    apolloUploadExpress
    
});




// Arrancar el servidor
server.listen().then( ({url}) => {
    console.log(`Servidor iniciado en la URL ${url}`)
} )
