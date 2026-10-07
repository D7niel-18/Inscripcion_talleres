import express from 'express';

const app = express();
const PORT = 3000;

/* Dos colecciones en memoria (se cargan tres elementos de cada colección al arrancar el
servidor): */
const talleres = [
{id: 1,titulo: "Introducción a Docker",categoria: "sistemas",plazas: 20,nivel: "avanzado"},
{id: 2,titulo: "Introducción a React",categoria: "programación",plazas: 15,nivel: "inicial"},
{id: 3,titulo: "Introducción a Node.js",categoria: "web",plazas: 10,nivel: "inicial"}
];

const inscripciones = [
{id: 1,tallerId: 1,nombre: "Curro Ximénez",email: "currox@example.com"},
{id: 2,tallerId: 2,nombre: "María López",email: "marialopez@example.com"},
{id: 3,tallerId: 3,nombre: "Daniel Jiménez",email: "danieljimenez@example.com"}
];

/* Rutas - GET - POST - MIDDLEWARE */
/* El usuario podrá consultar talleres y aplicar filtros por categoría, nivel y disponibilidad. */

app.get('/', (req, res) => {
  res.send('200, todo ok');
});

// Llamada a /talleres
app.get('/talleres', (req, res) => {
    const categoria = req.query.categoria;
    const nivel = req.query.nivel;
    const plazas = req.query.plazas;

    let talleresFiltrados = talleres; // Copiamos el array de talleres para filtrar
    if (categoria) {
        talleresFiltrados = talleresFiltrados.filter(taller => taller.categoria === categoria);
    }
    if (nivel) {
        talleresFiltrados = talleresFiltrados.filter(taller => taller.nivel === nivel);
    }
    if (plazas) {
        talleresFiltrados = talleresFiltrados.filter(taller => taller.plazas >= parseInt(plazas));
    }
    res.json(talleresFiltrados);
});

app.listen(PORT, () => {
    console.log(`[+]Servidor encendido -> http://localhost:${PORT}`);
});