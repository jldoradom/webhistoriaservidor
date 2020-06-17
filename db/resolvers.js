const Usuario = require('../models/Usuario');
const Blog = require('../models/Blog');
const Comentario = require('../models/Comentario');
const Curso = require('../models/Curso');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {
    const { id, nombre, email, apellido  } = usuario
    // devolvemos el jwt recibe el payload (id, email, nombre, apellido) o info que se añade a la cabecera del jwt, la palabra secreta
    // para crear el token y el tiempo de expiracion
    return jwt.sign( { id, email, nombre, apellido }, secreta, { expiresIn } );
}


// Resolver
const resolvers = {
    // Querys de GraqhQl (consultas)
    Query: {
        obtenerUsuarioId: async (_, {id}, ctx) => {
            const usuario = Usuario.findById(id);
            return usuario;
        },
        // Obtener el usuario del context y devuelve su id 
        obtenerUsuario: async (_,{token}, ctx) => {
            // Obtenemos el token del usuario por su token
            const usuarioId = await jwt.verify(token, process.env.SECRETA );
            
            return usuarioId;

        },
        // Funcion para ontener todos los usuarios
        obtenerUsuarios: async () => {
            try {
                const usuarios = await Usuario.find({});
                return usuarios;
            } catch (error) {
                console.log(error)
            }
        },
        // Obtener todas las entradas del Blog
        obtenerBlogs: async () => {
            try {
                const blogs = await Blog.find({});
                return blogs;
            } catch (error) {
                console.log(error)
            }
        },
        // Obtener todas las entradas del Blog del Usuario del context 
        obtenerBlogsUsuario: async(_,{}, ctx) => {
            try {
                const blogs = await Blog.find({ usuario: ctx.usuario.id }).populate('usuarios');
                return blogs;
            } catch (error) {
                console.log(error)
            }
        },
        // Obtener entrada de Blog por su id del usuario del context
        obtenerBlog: async(_,{id},ctx) => {
            // Si el blog existe o no 
            const blog = await Blog.findById(id);
            if(!blog){
               throw new Error('No existe esta entrada del blog');
            }
            // Solo quien lo creo puede verlo
            if(blog.usuario.toString() !== ctx.usuario.id) {
               throw new Error('No tienes permiso para ver esta entrada del blog');                
            }

            // Retornar el resultado
            return blog;

        },
        // Funcion  para obtener todos los comentarios
        obtenerComentarios: async () => {
            try {
                const comentarios = await Comentario.find({});
                return comentarios;
            } catch (error) {
                console.log(error)
            }

        },
        // Funcion para obtener un comentario por su id
        obtenerComentario: async (_,{id}, ctx) => {
             // Si el comentario existe o no 
             const comentario = await Comentario.findById(id);
             if(!comentario){
                throw new Error('No existe este comentario del comentario');
             }
             // Retornar el resultado
             return comentario;

        },
        // Funcion para obtener todos los comentarios
        obtenerComentariosUsuario: async (_,{}, ctx) => {
            try {
                const comentarios = await Comentario.find({ usuario: ctx.usuario.id }).populate('usuarios');
                return comentarios;
            } catch (error) {
                console.log(error)
            }

        },
        // Funcion para obtener todos los cursos
        obtenerCursos: async () => {
            try {
                const cursos = Curso.find({});
                return cursos;
            } catch (error) {
                console.log(error);
            }
        },
        // Obtener curso por id 
        obtenerCursoId: async (_,{id}, ctx) => {
            const curso = await Curso.findById(id);
            if(!curso){
                throw new Error('No existe el curso');
            }
            return curso;

        }
     
    },
   

    // Mutations de GraqhQl (inserciones, actualizaciones y borrados)
    Mutation: {
        // Funcion para crear un nuevo usuario devuelve el usuario
        nuevoUsuario: async (_,{input}, ctx) => {
           // destructuring al input para obtener los datos del input
           const { email, password } = input;
           // Revisar si el usuario ya esta registrado, le pasamos un objeto con el email
            const existeUsuario = await Usuario.findOne({email});
           if(existeUsuario){
               throw new Error('El usuario ya esta registrado');
           }
           // Hashear el password
           const salt = await bcryptjs.genSaltSync(10);
           input.password = await bcryptjs.hash(password, salt);
            try {
                // Guardar en la bbdd   
                const usuario = new Usuario(input);
                // guardamos el usuario
                usuario.save();
                return usuario;
            } catch (error) { 
               console.log(error);
               
            }
            

        },
        // Funcion para autenticar un usuario devuelve el token
        autenticarUsuario: async (_, {input}) =>{
            // destructuring al input para obtener los datos del input
            const  { email, password } = input
            // Si el usuario existe, le pasamos un objeto con el email
            const existeUsuario = await Usuario.findOne({email});
            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }

            // Revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if(!passwordCorrecto) {
                throw new Error('El password es incorecto');
            }
            // Crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h' )
            }
        },
        // Funcion para crear entrada del Blog devuelve la entrada
        nuevoBlog: async (_,{input},ctx) => {
            const { usuario } = input;
            // Verificar si exite el usuario
            let usuarioExiste  = await Usuario.findById(usuario);
            if(!usuarioExiste){
               throw new Error('El usuario no fue encontrado');
            }
            // Crear el nuevo pedido
            const nuevoBlog =  new Blog(input);
            // Asignar el pedido  al vendedor
            nuevoBlog.usuario = ctx.usuario.id;
            // Guardar en la bbdd
            try {
                const resultado = await nuevoBlog.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }

        },
        // Funcion para actualizar una entrada del Blog por su id del usuario del context o el admin devuelve la entrada actualizada
        actualizarBlog: async (_, {id, input}, ctx) => {
            // Verificar si la entrada de blog existe
            const blogExiste  = await Blog.findById(id);
            if(!blogExiste){
               throw new Error('La entrada de Blog no fue encontrada');
            }
            // Si la entrada de Blog pertenece al usuario o si es admin pordra editar
            const usuario = await Usuario.findById(ctx.usuario.id.toString());
            if( blogExiste.usuario.toString() !== ctx.usuario.id && usuario.rol !== 'ADMIN'){
                throw new Error('No estas autorizado para modificar esta entrada de Blog');
 
            }
            // Guardar la entrada del Blog
            try {
                const resultado = await Blog.findOneAndUpdate({_id:id}, input, {new: true});
                return resultado;
            } catch (error) {
                console.log(error);
            }

        },
        // Funcion para eliminar una entrada del Blog del usuario del context o admin
        eliminarBlog: async (_,{id}, ctx) => {
            // Verificar si la entrada de blog existe
            const blogExiste  = await Blog.findById(id);
            if(!blogExiste){
               throw new Error('La entrada de Blog no fue encontrada');
            }
              // Si la entrada de Blog pertenece al usuario
              if( blogExiste.usuario.toString() !== ctx.usuario.id ){
                throw new Error('No estas autorizado para eliminar esta entrada de Blog');
 
            }
            // TODO: Hacer que los usuarios con rol Admin puedan eliminarlo

            // Eliminamos la entrada del Blog
            try {
                const resultado = await Blog.findByIdAndDelete({_id: id});
                return 'Entrada eliminada';
            } catch (error) {
                console.log(error);
            }

        },
        // Funcion para crear un comentario pasandole un id de Blog para poder insertar en ese Blog el nuevo comentario creado
        // y el usuario que lo crea
        nuevoComentario: async (_,{id, input}, ctx) => {
            // obtenemos el texto del input
            const { texto } = input;
            // Verificar si la entrada de blog existe
            const blogExiste  = await Blog.findById(id);
            if(!blogExiste){
               throw new Error('La entrada de Blog no fue encontrada');
            }
            // Crear el nuevo comentario
            const nuevoComentario =  new Comentario(input);
            // Asignar a que usuario le corresponde el comentario
            nuevoComentario.usuario = ctx.usuario.id;
            // Asignar a que blog le corresponde el comentario
            nuevoComentario.blog = id;
            // Guardar en la bbdd
            try {
                const resultado = await nuevoComentario.save();
                // Insertamos el comentario a la entrada de Blog que corresponda.
                await Blog.findOneAndUpdate({_id:id}, {$push:{comentarios: {texto,usuario:ctx.usuario.id,comentarioid:resultado._id}}},{new: true});
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        // Funcion para actualizar comentario por su id
        actualizarComentario: async (_,{id, input},ctx) => {
             // Verificar si la entrada de blog existe
             const comentario  = await Comentario.findById(id);
             if(!comentario){
                throw new Error('El comentario no fue encontrada');
             }
             // Si el comentario pertenece al usuario
            if( comentario.usuario.toString() !== ctx.usuario.id ){
                throw new Error('No estas autorizado para modificar esta entrada de Blog');
 
            }
            // TODO: Hacer que los usuarios con rol Admin puedan editarlo
            
            // Guardar el comentario
            try {
                const resultado = await Comentario.findOneAndUpdate({_id:id}, input, {new: true});
                return resultado;
            } catch (error) {
                console.log(error);
            }

        },
        // Funcion para eliminar un comentario por su id 
        eliminarComentario: async (_,{id},ctx) => {
            // Verificar si el comentario existe
            const comentarioExiste  = await Comentario.findById(id);
            if(!comentarioExiste){
               throw new Error('El comentario no fue encontrada');
            }
              // Si el comentario pertenece al usuario
              if( comentarioExiste.usuario.toString() !== ctx.usuario.id ){
                throw new Error('No estás autorizado para eliminar este comentario');
 
            }
            // TODO: Hacer que los usuarios con rol Admin puedan eliminarlo

            // Eliminamos el comentario
            try {
                const resultado = await Comentario.findByIdAndDelete({_id: id});
                return 'Comentario eliminado';
            } catch (error) {
                console.log(error);
            }

        },
        // Funcion para editar usuarios
        editarUsuario: async (_,{input}, ctx) => {
            // destructuring al input para obtener los datos del input
           const { email, password } = input;
           // Revisar si el usuario ya esta registrado, le pasamos un objeto con el email
            const existeUsuario = await Usuario.findOne({email});
           if(existeUsuario){
               throw new Error('El usuario ya está registrado');
           }
            // sacamos el id del context
            const id = ctx.usuario.id;
            // Verificar si la entrada de blog existe
            const usuario  = await Usuario.findById(id);
            if(!usuario){
               throw new Error('El usuario no fue encontrado');
            }

            // Hashear el password
           const salt = await bcryptjs.genSaltSync(10);
           input.password = await bcryptjs.hash(password, salt);
           
           // TODO: Hacer que los usuarios con rol Admin puedan editarlo
           
           // Guardar el Usuario
           try {
               const resultado = await Usuario.findOneAndUpdate({_id:id}, input, {new: true});
               return resultado;
           } catch (error) {
               console.log(error);
           }

        },
        // Funcion para eliminar un Usuario por su id
        eliminarUsuario: async (_,{id}, ctx) => {
            // Verificar si el comentario existe
            const usuario  = await Usuario.findById(id);
            if(!usuario){
               throw new Error('El usuario no fue encontrado');
            }
            // El mismo usuario puede eliminarse
            if( usuario._id.toString() !== ctx.usuario.id ){
                throw new Error('No estás autorizado para eliminar este usuario');
 
            }
            // TODO: Hacer que los usuarios con rol Admin puedan eliminarlo

            // Eliminamos el comentario
            try {
                const resultado = await Usuario.findByIdAndDelete({_id: id});
                return 'Usuario eliminado';
            } catch (error) {
                console.log(error);
            }

        },
        // Funcion para crear nuevos cursos
        nuevoCurso: async (_,{input}, ctx) => {
            // Comprobar que el usuario es tipo admin
            const usuario = await Usuario.findById(ctx.usuario.id.toString());
            if(usuario.rol !== 'ADMIN'){
                throw new Error('No estás autorizado para crear cursos');
            }
            // Crear el curso
            const curso = new Curso(input);
            // Guardar en bbdd
            try {
                const respuesta = await curso.save();
                return respuesta;
            } catch (error) {
                console.log(error);
            }
        },
        // Funcion para editar curso
        editarCurso: async (_,{id, input}, ctx) => {
            
            // Comprobar que el usuario es tipo admin
            const usuario = await Usuario.findById(ctx.usuario.id.toString());
            if(usuario.rol !== 'ADMIN'){
                throw new Error('No estás autorizado para editar cursos');
            }

            // Comprobar si existe el curso
            const curso = Curso.findById(id);
            if(!curso){
                throw new Error('No existe el curso que intenta editar');

            }

            // Guardar el Usuario
            try {
                const resultado = await Curso.findOneAndUpdate({_id:id}, input, {new: true});
                return resultado;
                } catch (error) {
                    console.log(error);
            }


        },
        // Funcion para eliminar un curso por su id
        eliminarCurso: async (_,{id},ctx) => {
            // Verificar si el Curso existe
            const curso  = await Curso.findById(id);
            if(!curso){
               throw new Error('El curso no fue encontrado');
            }
            // Comprobar que el usuario es tipo admin
            const usuario = await Usuario.findById(ctx.usuario.id.toString());
            if(usuario.rol !== 'ADMIN'){
                throw new Error('No estás autorizado para editar cursos');
            }

            // Eliminamos el curso
            try {
                const resultado = await Curso.findByIdAndDelete({_id: id});
                return 'Curso eliminado';
            } catch (error) {
                console.log(error);
            }

        }


        
    }
}

module.exports = resolvers;