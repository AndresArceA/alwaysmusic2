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
      const EE = errores(error.code,error.status,error.message);
      console.log("Status ",EE.status," |Error Cod. ",EE.code,"|",EE.message);

  }
  }


//---------------preg 3--------------

// funcion para consultar alumno por rut

const consultaRut = async ({ rut }) => {
  try {
    
    const existeRut = await pool.query({
      // Consulto si el Rut existe en la tabla
      text: `SELECT COUNT(*) FROM ${tabla} WHERE rut = $1`,
      values: [rut]
    });
    // Verifico si el Rut es un valor numérico válido antes de realizar la consulta, 
    //para valor string opera el manejo de errores capturando el codigo de error.
    if (isNaN(rut)) {
      console.log("El Rut debe ser un valor numérico válido.");
    }else if
        // Verifico si el Rut existe en la tabla
    (existeRut.rows[0].count === '0') {
      console.log(`El Rut ${rut} no existe en la tabla. Revise el Rut o agreguelo con "Agregar"`);
    } else {
      const res = await pool.query({
        // Si el Rut existe, realizar la consulta
        text: `SELECT * FROM ${tabla} WHERE rut = $1`,
        values: [rut]
      });
      console.log("Alumno consultado: ", res.rows[0]);
    }
  } catch (error) {
    // Manejar el error
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " | Error Cod. ",
      EE.code,
      " | ",
      EE.message
    );
  }
};


//---------------preg 4--------------
// Función para actualizar un alumno por su Rut
const actualizarAlumno = async ({ rut, nombre, curso, nivel }) => {
  try {
    const res = await pool.query({
      text: `UPDATE ${tabla} SET nombre=$2, curso=$3, nivel=$4 WHERE rut=$1 RETURNING *`,
      [rut, nombre , curso, nivel]
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