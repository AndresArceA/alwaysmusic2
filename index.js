const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "1234",
  database: "alwaysmusic",
  port: 5432
};

const pool = new Pool(config);

// manejo del process.argv
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];

// resto de posiciones los otros campos
const nombre = argumentos[1];
const rut = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

console.log("**********");
console.log("Funcion: " + funcion);
console.log("Nombre: " + nombre);
console.log("Rut: " + rut);
console.log("Curso: " + curso);
console.log("Nivel: " + nivel);
console.log("**********");

//------------ pregunta 1-----

// funcion para agregar Alumnos
const nuevoAlumno = async ({ nombre, rut, curso, nivel }) => {
  const res  = await pool.query(
    `INSERT INTO alumnos values ($1,$2,$3,$4) RETURNING *`,
    [nombre, rut, curso, nivel]
  );
  console.log(`Alumno ${nombre} ${rut} agregado con éxito`);
  console.log("Alumno Agregado: ", res.rows[0]);
}

//---------------preg 2--------------

// funcion para consultar alumno por rut

const consultaRut = async ({ rut }) => {
  const res = await pool.query(
    `SELECT * FROM alumnos WHERE rut='${rut}'`
  );
  console.log("Alumno consultado: ", res.rows[0]);
}

//---------------preg 3--------------

// funcion para consultar todos los Alumnos registrados

const getAlumno = async () => {
  const res = await pool.query("SELECT * FROM alumnos");
  console.log("Alumnos registrados:", res.rows);
}
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

// Funcion IIFE que recibe de la linea de comando y llama funciones asincronas internas
(async () => {
  // recibir funciones y campos de la linea de comando
  switch (funcion) {
    case 'agregar':
      nuevoAlumno({nombre,rut,curso,nivel})
      break;
    case 'rut':
      consultaRut({ rut })
      break;
    case 'todos':
      getAlumno()
      break;
    case 'actualizar':
     actualizarAlumno({nombre,rut,curso,nivel})
          break;
    case 'eliminar':
     eliminarAlumno({rut})
      break;     
    default:
      console.log("Funcion: " + funcion + "no es valida")
      break;
  }
  
  pool.end()
})()



// instrucciones de uso;
// consultar todos:  node index todos
// consultar por rut: node index rut - 5555864
// ingresar datos: node index agregar Abraham 5555864 trompeta quinto
// actualizar datos: node index actualizar 5555864 piano sexto
// eliminar datos: node index eliminar - 5555864