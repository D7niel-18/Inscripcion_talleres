/* Imports */
import express from 'express';
import {obtenerPlazasRestantes, estaInscrito, validarInscripcion} from './funciones.js';


const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');

/* Middleware - urlencoded*/
app.use(express.urlencoded({ extended: true }));

/* Rutas */
/* El usuario podrá consultar talleres y aplicar filtros por categoría, nivel y disponibilidad. */
app.get('/', (req, res) => {
  res.send('200, todo ok');
});

// GET /talleres
app.get('/talleres', (req, res) => {
    const categoria = req.query.categoria;
    const nivel = req.query.nivel;
    const disponibles = req.query.disponibles;

    let talleresFiltrados = talleres.map(taller => ({
        id: taller.id,
        titulo: taller.titulo,
        categoria: taller.categoria,
        plazas: taller.plazas,
        nivel: taller.nivel,
        plazasRestantes: obtenerPlazasRestantes(taller, inscripciones)
    }));

    if (categoria) {
        talleresFiltrados = talleresFiltrados.filter(taller => taller.categoria === categoria);
    }

    if (nivel) {
        talleresFiltrados = talleresFiltrados.filter(taller => taller.nivel === nivel);
    }

    if (disponibles === 'true') {
        talleresFiltrados = talleresFiltrados.filter(taller => taller.plazasRestantes > 0);
    }

    res.json(talleresFiltrados);
});

/* GET  /talleres/:id */
app.get('/talleres/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const taller = talleres.find(taller => taller.id === id);

    if (!taller) {
        return res.status(404).send('Taller no encontrado');
    }

    const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);

    let estado;

    if (plazasRestantes === 0) {
        estado = "Completo";
    } else if (plazasRestantes === 1) {
        estado = "Última plaza disponible";
    } else {
        estado = plazasRestantes + " plazas disponibles";
    }
    res.render('detalle', {
        taller: taller,
        plazasRestantes: plazasRestantes,
        estado: estado
    });
});

/* GET /talleres/:id/inscripcion */
app.get('/talleres/:id/inscripcion', (req, res) => {
    const id = parseInt(req.params.id);
    const taller = talleres.find(taller => taller.id === id);

    if (!taller) {

        return res.status(404).send('Taller no encontrado');

    }

    const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);

    if (plazasRestantes <= 0) {

        return res.status(400).send('Este taller está completo');

    }
    res.render('inscripcion', {

        taller: taller,

        plazasRestantes: plazasRestantes

    });

});

/* POST /talleres/:id/inscripcion */
app.post('/talleres/:id/inscripcion', (req, res) => {
    const id = parseInt(req.params.id);
    const nombre = req.body.nombre;
    const email = req.body.email;
    const taller = talleres.find(taller => taller.id === id);

    if (!taller) {
        return res.status(404).send('Taller no encontrado');
    }

    const errores = [];

    const resultado = validarInscripcion(req.body);
    if (!resultado.valido) {
        resultado.errores.forEach(error => {
            errores.push(error);
        });
    }

    if (estaInscrito(id, email, inscripciones)) {
        errores.push('Este correo ya está registrado en este taller.');
    }

    const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);
    if (plazasRestantes <= 0) {
        errores.push('El taller está completo.');
    }

    if (errores.length > 0) {
        return res.status(400).render('inscripcion', {
            taller: taller,
            plazasRestantes: plazasRestantes,
            errores: errores,
            datos: req.body
        });
    }

    const nuevaInscripcion = {
        id: inscripciones.length > 0 ? inscripciones[inscripciones.length - 1].id + 1 : 1,
        tallerId: id,
        nombre: nombre,
        email: email
    };

    inscripciones.push(nuevaInscripcion);

    res.redirect('/talleres/' + id);
});

app.listen(PORT, () => {
    console.log(`[+]Servidor encendido -> http://localhost:${PORT}`);
});