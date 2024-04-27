create database alwaysmusic;
\c alwaysmusic;
create table alumnos (
    Rut INTEGER PRIMARY KEY,
    Nombre VARCHAR(30) NOT NULL,
    Curso VARCHAR(20) NOT NULL,
    Nivel VARCHAR(20) NOT NULL
);

