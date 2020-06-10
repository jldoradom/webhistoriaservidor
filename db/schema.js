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
        id: ID
        texto: String!
        usuario: ID
        blog: ID
        creado: String
        actualizado: String 
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
        # usuario: ID
    }
    input ComentarioBlogInput {
       texto: String!
    }
    input ComentarioUsuarioInput {
        usuario: ID
        comentario: ID
    }
    enum rol {
        NORMAL
        ADMIN
        
    }
    type Query {
        # Usuarios
        obtenerUsuario(token: String!): Usuario
        obtenerUsuarios: [Usuario]
        # Blog
        obtenerBlogs: [Blog]
        obtenerBlog(id: ID!): Blog
        obtenerBlogsUsuario: [Blog]
        # Comentarios
        obtenerComentarios: [Comentario]
        obtenerComentario(id: ID!) : Comentario
        obtenerComentariosUsuario: [Comentario]
      

    }
    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput!): Usuario
        autenticarUsuario( input: AutenticarInput ): Token
        editarUsuario(input: UsuarioInput!) : Usuario
        eliminarUsuario(id: ID!) : String
        # Blog
        nuevoBlog(input: BlogInput!) : Blog 
        actualizarBlog(id: ID!, input: BlogInput!) : Blog 
        eliminarBlog(id: ID!) : String
        # Comentarios
        nuevoComentario(id: ID!, input: ComentarioBlogInput!) : Comentario
        actualizarComentario(id: ID!, input: ComentarioBlogInput!) : Comentario
        eliminarComentario(id: ID!) : String

    }
`;


module.exports = typeDefs;