//requiero modulo pg
const { Pool } = require("pg");

// importo archivo para manejo de errores
const errores = require("./Errores.js");

// defino variables globales

const tabla = "alumnos";
const host = "localhost";
const user = "postgres";
const db = "alwaysmusic";
const PORT = 5432;
const pwd = "";

// Configuración de la conexión a PostgreSQL
// objeto de conexión
const config = {
  user: user,
  host: host,
  password: pwd,
  database: db,
  port: PORT,
};

// creo la instancia de Pool
const pool = new Pool(config);

// manejo del process.argv
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];

// resto de posiciones los otros campos
const rut = argumentos[1];
const nombre = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

//informacion de referencia para los datos ingesados
console.log("____________________");
console.log("|Funcion: " + funcion, "|");
console.log("|Rut: " + rut, "|");
console.log("|Nombre: " + nombre, "|");
console.log("|Curso: " + curso, "|");
console.log("|Nivel: " + nivel, "|");
console.log("_____________________");

// instrucciones de uso;
// ingresar Alumnos: node index agregar 13648382 Abraham trompeta quinto
// consultar Estudiantes registrados:  node index alumnos
// consultar por rut: node index rut 13648382
// actualizar Informacion de Alumno: node index actualizar 13648382 Juanito piano sexto
// eliminar datos: node index eliminar 13648382

//------------ pregunta 1-----
// funcion para consultar agregar Alumnos

const nvoAlumno = async ({ rut, nombre, curso, nivel }) => {
  if (!rut || !nombre || !curso || !nivel) {
    //valida que se estén pasando los parametros para la consulta
    console.log(
      "Debe proporcionar todos los valores correctamente para agregar un Alumno, Rut, Nombre, Curso y Nivel."
    );
    return;
  }
  try {
    const result = await pool.query({
      text: `INSERT INTO ${tabla} VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [rut, nombre, curso, nivel],
    });
    console.log(`Alumno ${nombre} ${rut} agregado con éxito`);
    console.log("Alumno Agregado: ", result.rows[0]);
  } catch (error) {
    console.log("Error al agregar al alumno");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
  }
};

//---------------preg 2--------------

// funcion para consultar todos los Alumnos registrados

const estudiantes = async () => {
  try {
    const res = await pool.query({
      rowMode: "array",
      text: `SELECT * FROM ${tabla}`,
    });
    // bloque if para validar que la tabla está vacía
    if (res.rowCount == 0) {
      console.log(
        `No existen Alumnos registrados; favor agregar y repetir la consulta.`
      );
    } else {
      console.log(`Alumnos registrados en la academia `, res.rows);
    }
  } catch (error) {
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
  }
};

//---------------preg 3--------------

// funcion para consultar alumno por rut

const consultaRut = async ({ rut }) => {
  if (!rut) { //valido que el parametro no esté vacío al hacer la consulta
    console.log("Debe proporcionar un valor para el parámetro 'rut'.");
    return;
  }
  try {
    const existeRut = await pool.query({
      // Consulto si el Rut existe en la tabla
      text: `SELECT * FROM ${tabla} WHERE rut = $1`,
      values: [rut],
    });
    // console.log("valor de existe rut : ", existeRut );
    // console.log("valor de rows[0] ", existeRut.rows[0] );
    // console.log("valor de count ", existeRut.rows[0].count );
    // Verifico si el Rut es un valor numérico válido antes de realizar la consulta,
    //para valor string opera el manejo de errores capturando el codigo de error.
    if (isNaN(rut)) {
      console.log("El Rut debe ser un valor numérico válido.");
    } else if 
      // Verifico si el Rut existe en la tabla
      (existeRut.rowCount == 0)
     {
      console.log(
        `El Rut ${rut} no está registrado. Revise el Rut o agreguelo con "Agregar"`
      );
    } else {
      // const res = await pool.query({
      //   // Si el Rut existe, realizar la consulta
      //   text: `SELECT * FROM ${tabla} WHERE rut = $1`,
      //   values: [rut]
      // });
      console.log("Alumno consultado: ", existeRut.rows[0]);
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
  if (!rut || !nombre || !curso || !nivel) {
    //valida que se estén pasando los parametros para la consulta
    console.log(
      "Debe proporcionar todos los valores correctamente para actualizar la informacion de un Alumno, Rut, Nombre, Curso y Nivel."
    );
    return;}
  try {
    const res = await pool.query({
      text: `UPDATE ${tabla} SET nombre=$2, curso=$3, nivel=$4 WHERE rut=$1 RETURNING *`,
      values: [rut, nombre, curso, nivel],
    });

    if (res.rowCount > 0) {
      console.log(`Alumno con rut ${rut} actualizado con éxito`);
      console.log("Alumno Actualizado: ", res.rows[0]);
    } else {
      console.log(
        `No se encontró ningún alumno con el rut ${rut}, revise los datos y reintente`
      );
    }
  } catch (error) {
    console.log("Error al actualizar el alumno");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
  }
};

//---------------preg 5--------------
// Función para eliminar un alumno por su rut
const eliminarAlumno = async ({ rut }) => {
  if (!rut) {
    console.log("Debe proporcionar un valor para buscar el 'rut' del alumno que desea eliminar.");
    return;
  }
  try {
    const existeRut = await pool.query({
      // Consulto si el Rut existe en la tabla
      text: `SELECT * FROM ${tabla} WHERE rut = $1`,
      values: [rut],
    });
    // Verifico si el Rut es un valor numérico válido antes de realizar la consulta,
    //para valor string opera el manejo de errores capturando el codigo de error.
    if (isNaN(rut)) {
      console.log("El Rut debe ser un valor numérico válido.");
    } else if (
      // Verifico si el Rut existe en la tabla
      existeRut.rowCount == 0
    ) {
      console.log(
        `El Rut ${rut} no existe en la base de datos. Revise el Rut e intentelo nuevamente`
      );
    } else {
      // Si el Rut existe, realizar la operación
      const res = await pool.query({
        text: `DELETE FROM ${tabla} WHERE rut=$1 RETURNING *`,
        values: [rut],
      });
      console.log(`Alumno con rut ${rut} eliminado con éxito`);
      console.log("Alumno Eliminado: ", res.rows[0]);
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

// Función IIFE que recibe los comandos de la línea de comandos y llama a las funciones asincrónicas internas
(async () => {
  // recibir funciones y campos de la línea de comandos
  switch (funcion) {
    case "agregar":
      await nvoAlumno({ rut, nombre, curso, nivel });
      break;
    case "rut":
      await consultaRut({ rut });
      break;
    case "alumnos":
      await estudiantes();
      break;
    case "actualizar":
      await actualizarAlumno({ nombre, rut, curso, nivel });
      break;
    case "eliminar":
      await eliminarAlumno({ rut });
      break;
    default:
      console.log("La función " + funcion + " no es válida");
      console.log(
        "Las funciones válidas son: agregar, rut, alumnos, actualizar, eliminar"
      );

      break;
  }
  pool.end(); //se cierra la conexión a la base de datos
})();
