const { Pool } = require("pg");

const errores = require('./handleErrors.js');

// variables globales

const tabla = "alumnos";
const host = "localhost"
const user = "postgres";
const db = "alwaysmusic";
const PORT = 5432;
const pwd = "";


// objeto de conexión
const config = {
  user: user,
  host: host,
  password: pwd,
  database: db,
  port: PORT
};

const pool = new Pool(config);

//
// manejo del process.argv
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];

// resto de posiciones los otros campos
const rut = argumentos[1];
const nombre = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

console.log("**********");
console.log("Funcion: " + funcion);
console.log("Rut: " + rut);
console.log("Nombre: " + nombre);
console.log("Curso: " + curso);
console.log("Nivel: " + nivel);
console.log("**********");

//------------ pregunta 1-----

// funcion para agregar Alumnos
// const nvoAlumno = async () => {
//   try {
//     const result = await pool.query({
//       text: `INSERT INTO alumnos values ($1,$2,$3,$4) RETURNING *`,
//       values: [rut, nombre, curso, nivel],
//     });
//     console.log(`Alumno ${nombre} ${rut} agregado con éxito`);
//     console.log("Alumno Agregado: ", result.rows[0]);
    
//   } catch (error) {
//     let status;
//   console.log("Error producido: ",error);
//   console.log("Codigo de error PG producido: ",error.code);
//   switch (error.code) {
//       case '28P01':
//           status = 400;
//           error.message = "autentificacion password falló o no existe usuario: "+pool.options.user;
//           break;
//       case '42P01':
//           status = 400;
//           error.message = "No existe la tabla ["+tabla+"] consultada";
//           break;    
//       case '3D000':
//           status = 400;
//           error.message = "Base de Datos ["+pool.options.database+"] no existe";
//           break;
//       case '28000':
//           status = 400;
//           error.message = "Usuario ["+pool.options.user+"] no existe";
//           break;
//       case '42601':
//           status = 400;
//           error.message = "Error de Sintaxis en la instrucción";
//           break;
//       case 'ENOTFOUND':
//           status = 500;
//           error.message = "Error en valor usado como localhost: "+pool.options.host;
//           break;
//       case 'ECONNREFUSED':
//           status = 500;
//           error.message = "Error en el puerto de conexion a BD, usando: "+pool.options.port;
//           break;
//       case '22P02':
//           status = 500;
//           error.message = "Error en el ingreso de datos del campo Rut, debe ser un valor Integer, no usar guiones";
//           break;    
//       default:
//           status=500;
//           error.message = "Error interno del servidor";
//           break;
//   }
  
// }
// }

const nvoAlumno = async () => {
  try {
    const result = await pool.query({
      text: `INSERT INTO ${tabla} VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [rut, nombre, curso, nivel],
    });
    console.log(`Alumno ${nombre} ${rut} agregado con éxito`);
    console.log("Alumno Agregado: ", result.rows[0]);
  } catch (error) {
    const EE = errores(error.code,error.status,error.message);
    console.log("Status ",EE.status," |Error Cod. ",EE.code,"|",EE.message);
      
    };
  };


//---------------preg 2--------------

// funcion para consultar todos los Alumnos registrados

const estudiantes = async () => {
  try {
    const res = await pool.query({
      rowMode: "array",
      text: `SELECT * FROM ${tabla}`
     });
     console.log(`Alumnos registrados en la academia `, res.rows);
  } catch (error) {
    console.log("Error :", err);
    const EE = errores(error.code,error.status,error.message);
    console.log("Status ",EE.status," |Error Cod. ",EE.code,"|",EE.message);

  }
  }


//---------------preg 3--------------

// funcion para consultar alumno por rut

const consultaRut = async ({ rut }) => {
  const res = await pool.query(
    `SELECT * FROM alumnos WHERE rut='${rut}'`
  );
  console.log("Alumno consultado: ", res.rows[0]);
}





  
//   res.status(status).json({ 
//                               error: error.message 
//                           });

// }
// });


//---------------preg 4--------------
// Función para actualizar un alumno por su rut
const actualizarAlumno = async ({ nombre, rut, curso, nivel }) => {
    const res = await pool.query(
      `UPDATE alumnos SET nombre=$1, curso=$2, nivel=$3 WHERE rut=$4 RETURNING *`,
      [nombre, rut, curso, nivel]
    );
    if (res.rowCount > 0) {
      console.log(`Alumno con rut ${rut} actualizado con éxito`);
      console.log("Alumno Actualizado: ", res.rows[0]);
    } else {
      console.log(`No se encontró ningún alumno con el rut ${rut}`);
    }
  }

//---------------preg 5--------------
// Función para eliminar un alumno por su rut
const eliminarAlumno = async ({ rut }) => {
    const res = await pool.query(
      `DELETE FROM alumnos WHERE rut=$1 RETURNING *`,
      [rut]
    );
    if (res.rowCount > 0) {
      console.log(`Alumno con rut ${rut} eliminado con éxito`);
      console.log("Alumno Eliminado: ", res.rows[0]);
    } else {
      console.log(`No se encontró el rut, revisa bien el rut ingresado ${rut}`);
    }
  }  

// Función IIFE que recibe los comandos de la línea de comandos y llama a las funciones asincrónicas internas
(async () => {
    // recibir funciones y campos de la línea de comandos
    switch (funcion) {
      case 'agregar':
        await nvoAlumno({ rut, nombre, curso, nivel });
        break;
      case 'rut':
        await consultaRut({ rut });
        break;
      case 'alumnos':
        await estudiantes();
        break;
      case 'actualizar':
        await actualizarAlumno({ nombre, rut, curso, nivel });
        break;
      case 'eliminar':
        await eliminarAlumno({ rut });
        break;
      default:
        console.log("La función " + funcion + " no es válida");
        console.log("Las funciones válidas son: agregar, rut, alumnos, actualizar, eliminar");
       
        break;
    }  
    pool.end(); // Asegurarse de que se cierre la conexión con la base de datos, incluso en caso de error
}
)();



// instrucciones de uso;
// consultar todos:  node index todos
// consultar por rut: node index rut - 5555864
// ingresar datos: node index agregar Abraham 5555864 trompeta quinto
// actualizar datos: node index actualizar 5555864 piano sexto
// eliminar datos: node index eliminar - 5555864