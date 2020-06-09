const Usuario = require('../models/Usuario');
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
        obtenerUsuario: async (_,{token}, ctx) => {
            // Obtenemos el token del usuario
            const usuarioId = await jwt.verify(token, process.env.SECRETA );
            
            return usuarioId;

        }
    },
    // Mutations de GraqhQl (inserciones, actualizaciones y borrados)
    Mutation: {
        // Funcion para crear un nuevo usuario
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


            
 
        }
    }
}

module.exports = resolvers;