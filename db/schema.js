const { gql } = require('apollo-server');


// Schema
const typeDefs = gql`
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        edad: Int
        curso: String
        ies: String
        logros: [String]
        creado: String
    }

    type Token {
        token: String
    }

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
        edad: Int!
        curso: String!
        ies: String!
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    enum rol {
        NORMAL
        ADMIN
        
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput!): Usuario
        autenticarUsuario( input: AutenticarInput ): Token

    }

    type Query {
        # Usuarios
        obtenerUsuarios: Usuario
    }
`;


module.exports = typeDefs;