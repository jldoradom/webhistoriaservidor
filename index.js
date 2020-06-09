const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectarDB = require('./config/db');
require('dotenv').config({
    path: 'variables.env'
});

// Conectar a lbbdd
connectarDB();


// Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    
});



// Arrancar el servidor
server.listen().then( ({url}) => {
    console.log(`Servidor iniciado en la URL ${url}`)
} )
