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
        rol: rol
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
    type Curso {
        id: ID
        nombre: String
        instituto: String
        cantidadAlumnos: Int
        localidad: String
        provincia: String
        estado: String
        curso: String
        usuarios: [Usuario]
        creado: String
    }

    input CursoInput {
        nombre: String!
        instituto: String!
        cantidadAlumnos: Int!
        localidad: String!
        provincia: String!
        curso: String!
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
    enum estado {
        ACTUAL
        PASADO
    }
    type Query {
        # Usuarios
        obtenerUsuario(token: String!): Usuario
        obtenerUsuarioId(id: ID!): Usuario
        obtenerUsuarios: [Usuario]
        # Blog
        obtenerBlogs: [Blog]
        obtenerBlog(id: ID!): Blog
        obtenerBlogsUsuario: [Blog]
        # Comentarios
        obtenerComentarios: [Comentario]
        obtenerComentario(id: ID!) : Comentario
        obtenerComentariosUsuario: [Comentario]
        # Cursos
        obtenerCursos: [Curso]
        obtenerCursoId(id: ID!): Curso

      

    }
    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput!): Usuario
        autenticarUsuario( input: AutenticarInput ): Token
        editarUsuario(input: UsuarioInput!) : Usuario
        editarUsuariosAdmin(id: ID!, input: UsuarioInput!) : Usuario
        eliminarUsuario(id: ID!) : String
        eliminarUsuariosAdmin(id: ID!) : String
        # Blog
        nuevoBlog(input: BlogInput!) : Blog 
        actualizarBlog(id: ID!, input: BlogInput!) : Blog 
        eliminarBlog(id: ID!) : String
        # Comentarios
        nuevoComentario(id: ID!, input: ComentarioBlogInput!) : Comentario
        actualizarComentario(id: ID!, input: ComentarioBlogInput!) : Comentario
        eliminarComentario(id: ID!) : String
        # Cursos
        nuevoCurso(input: CursoInput!) : Curso
        editarCurso(id: ID!, input: CursoInput!) : Curso
        eliminarCurso(id: ID!) : String
        insertarUsuarioCurso(usuarioid: ID!, cursoid: ID!) : Curso 
        eliminarUsuarioCurso(usuarioid: ID!, cursoid: ID!) : String

    }
`;


module.exports = typeDefs;