const Usuario = require('../models/Usuario');
const Blog = require('../models/Blog');
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
        // Obtener el usuario 
        obtenerUsuario: async (_,{token}, ctx) => {
            // Obtenemos el token del usuario por su token
            const usuarioId = await jwt.verify(token, process.env.SECRETA );
            
            return usuarioId;

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
            // Si la entrada de Blog pertenece al usuario
            if( blogExiste.usuario.toString() !== ctx.usuario.id ){
                throw new Error('No estas autorizado para modificar esta entrada de Blog');
 
            }
            // TODO: Hacer que los usuarios con rol Admin puedan editarlo
            
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
            // TODO: Hacer que los usuarios con rol Admin puedan editarlo

            // Eliminamos la entrada del Blog
            try {
                const resultado = await Blog.findByIdAndDelete({_id: id});
                return 'Entrada eliminada';
            } catch (error) {
                console.log(error);
            }

        }
    }
}

module.exports = resolvers;