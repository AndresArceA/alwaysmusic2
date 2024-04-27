function errores(code, status, message) {
switch (code) {
    case '22P02':
        status = 400;
        message = "El Rut, ingresado no tiene formato valido, ingrese el Rut, sin puntos ni Guiones; favor intente de nuevo.";
        break;
    case '23505':
        status= 400;
        message = "Ya existe el Rut ingresado, favor ingrese un Rut nuevo.";
        break;
    case '28P01':
        message = "Autenticación de contraseña falló o no existe el usuario: " + pool.options.user;
        break;
    case '23505':
        status = 400;
        message = "Ya existe la ID a ingresar";
        break;
    case '28P01':
        status = 400;
        message = "autentificacion password falló o no existe usuario: ";
        break;
    case '42P01':
        status = 400;
        message = "No existe la tabla consultada ";
        break;    
    case '3D000':
        status = 400;
        message = "Base de Datos a conectar no existe";
        break;
    case 'ENOTFOUND':
        status = 500;
        message = "Error en valor usado como localhost";
        break;
    case 'ECONNREFUSED':
        status = 500;
        message = "Error en el puerto de conexion a BD";
        break;
    default:
        status = 500;
        message = "Error generico del Servidor";
        break;
}

  return {code, status, message}
}

module.exports = errores;