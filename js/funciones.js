/* Dos colecciones en memoria (se cargan tres elementos de cada colección al arrancar el
servidor): */
export const talleres = [
{id: 1,titulo: "Introducción a Docker",categoria: "sistemas",plazas: 20,nivel: "avanzado"},
{id: 2,titulo: "Introducción a React",categoria: "programación",plazas: 15,nivel: "inicial"},
{id: 3,titulo: "Introducción a Node.js",categoria: "web",plazas: 2,nivel: "inicial"}
];

export const inscripciones = [
{id: 1,tallerId: 1,nombre: "Curro Ximénez",email: "currox@example.com"},
{id: 2,tallerId: 2,nombre: "María López",email: "marialopez@example.com"},
{id: 3,tallerId: 3,nombre: "Daniel Jiménez",email: "danieljimenez@example.com"}
];

/* Funciones */

export function obtenerPlazasRestantes(taller, inscripciones) {
    const inscritos = inscripciones.filter(inscripcion => inscripcion.tallerId === taller.id);

    return taller.plazas - inscritos.length;
}

export function estaInscrito(tallerId, email, inscripciones) {
    return inscripciones.some(inscripcion => inscripcion.tallerId === tallerId && inscripcion.email === email);
}

export function validarInscripcion(datos) {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim() === "") {
        errores.push("El nombre es obligatorio.");
    }

    if (!datos.email || datos.email.trim() === "") {
        errores.push("El email es obligatorio.");
    } 
    return {
        valido: errores.length === 0,
        errores: errores
    };
}

