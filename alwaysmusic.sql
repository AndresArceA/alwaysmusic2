create database alwaysmusic;
\c alwaysmusic;
create table alumnos (
    Rut INTEGER PRIMARY KEY,
    Nombre VARCHAR(30) NOT NULL,
    Curso VARCHAR(20) NOT NULL,
    Nivel VARCHAR(20) NOT NULL
);

-- crea tabla vacia para manejar errores de la consulta sin registros
create table al (
    Rut INTEGER PRIMARY KEY,
    Nombre VARCHAR(30) NOT NULL,
    Curso VARCHAR(20) NOT NULL,
    Nivel VARCHAR(20) NOT NULL
);

