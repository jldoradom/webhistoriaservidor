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
    type Blog {
        id: ID
        titulo: String
        imagen: String
        descripcion: String
        comentarios: [Comentario]
        puntos: Int
        usuario: ID
    }
    type Token {
        token: String
    }
    type Comentario {
        comentario: String
        usuario: ID
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
    input BlogInput {
        titulo: String!
        imagen: String!
        descripcion: String!
        usuario: ID!
    }
    enum rol {
        NORMAL
        ADMIN
        
    }
    type Query {
        # Usuarios
        obtenerUsuario(token: String!): Usuario
        # Blog
        obtenerBlogs: [Blog]
        obtenerBlog(id: ID!): Blog
        obtenerBlogsUsuario: [Blog]

    }
    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput!): Usuario
        autenticarUsuario( input: AutenticarInput ): Token
        # Blog
        nuevoBlog(input: BlogInput!) : Blog 

    }
`;


module.exports = typeDefs;