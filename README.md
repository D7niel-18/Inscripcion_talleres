# Gestión de Talleres e Inscripciones - Node.js & Express

Este proyecto es una aplicación web para la gestión de talleres y sus inscripciones realizada con **Node.js**, **Express** y plantillas **EJS**.

---

## Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install express ejs
   ```
2. **Iniciar el servidor**:
   ```bash
   npm js/app.js
   ```
   *El servidor se ejecutará en `http://localhost:3000`.*

---

## Funcionalidades e Implementación

### 1. Comprobación del Servidor (Ruta Raíz)
* **Descripción:** Permite verificar que el servidor está en ejecución y responde correctamente.
* **Cómo se ha realizado:** Se ha configurado una ruta `GET /` básica en Express que devuelve una respuesta de texto plano con el mensaje `'200, todo ok'`.

#### Ejemplo CURL:
```bash
curl -X GET http://localhost:3000/
```

---

### 2. Consulta y Filtrado de Talleres (`GET /talleres`)
* **Descripción:** Devuelve un listado en formato JSON con los talleres disponibles, permitiendo aplicar filtros mediante parámetros de consulta (*query*) por `categoria`, `nivel` y disponibilidad (`disponibles=true`).
* **Cómo se ha realizado:**
  * Se leen los parámetros `req.query.categoria`, `req.query.nivel` y `req.query.disponibles`.
  * Se mapea la colección de talleres en memoria agregando la propiedad calculada `plazasRestantes` mediante la función auxilar `obtenerPlazasRestantes()`.
  * Se aplican filtros sucesivos utilizando el método `.filter()` de JavaScript según la presencia de los parámetros.
  * La respuesta se envía formateada como JSON con `res.json()`.

#### Ejemplo CURL (Sin Filtros):
```bash
curl -X GET http://localhost:3000/talleres
```

#### Ejemplo CURL (Con Filtros):
```bash
curl -X GET "http://localhost:3000/talleres?categoria=sistemas&nivel=avanzado&disponibles=true"
```

#### Equivalente en HTML:
```html
<!-- Formulario para consultar y filtrar talleres -->
<form action="/talleres" method="GET">
  <label for="categoria">Categoría:</label>
  <select name="categoria" id="categoria">
    <option value="">Todas</option>
    <option value="sistemas">Sistemas</option>
    <option value="programación">Programación</option>
    <option value="web">Web</option>
  </select>

  <label for="nivel">Nivel:</label>
  <select name="nivel" id="nivel">
    <option value="">Todos</option>
    <option value="inicial">Inicial</option>
    <option value="avanzado">Avanzado</option>
  </select>

  <label for="disponibles">Disponibles:</label>

  <select name="disponibles" id="disponibles">
    <option value="">Todos</option>
    <option value="true">Solo con plazas</option>
  </select>

  <button type="submit">Buscar Talleres</button>
</form>
```

---

### 3. Vista de Detalle de un Taller (`GET /talleres/:id`)
* **Descripción:** Renderiza una vista HTML con los detalles completos de un taller específico y su estado actual de plazas.
* **Cómo se ha realizado:**
  * Se obtiene el ID del parámetro de ruta (`req.params.id`) y se busca el taller en la colección con `.find()`.
  * Si el taller no existe, se retorna un código de estado `404`.
  * Se calcula el número de plazas restantes y se determina una cadena de texto descriptiva (`estado`) en función del número de plazas libres disponibles.
  * Se renderiza la plantilla `detalle.ejs` pasando el objeto taller, las plazas restantes y el estado.

#### Ejemplo CURL:
```bash
curl -X GET http://localhost:3000/talleres/1
```

#### Equivalente en HTML:
```html
<!-- Enlace directo al detalle del taller 1 -->
<a href="/talleres/1">Ver detalle del Taller 1</a>
```

---

### 4. Formulario de Inscripción (`GET /talleres/:id/inscripcion`)
* **Descripción:** Muestra la vista con el formulario HTML para que un usuario pueda inscribirse en un taller determinado.
* **Cómo se ha realizado:**
  * Se extrae el ID desde los parámetros de la URL (`req.params.id`).
  * Se verifica la existencia del taller (404 si no existe).
  * Se calcula si quedan plazas disponibles con `obtenerPlazasRestantes()`. Si las plazas se han agotado ($\le 0$), se responde con un código de estado `400` e impide el acceso al formulario.
  * Si hay plazas, se renderiza la vista `inscripcion.ejs`.

#### Ejemplo CURL:
```bash
curl -X GET http://localhost:3000/talleres/1/inscripcion
```

#### Equivalente en HTML:
```html
<!-- Enlace hacia la página del formulario de inscripción -->
<a href="/talleres/1/inscripcion">Ir al formulario de inscripción del Taller 1</a>
```

---

### 5. Procesamiento de la Inscripción (`POST /talleres/:id/inscripcion`)
* **Descripción:** Recibe y procesa los datos del formulario de inscripción (`nombre` y `email`), ejecutando las validaciones de negocio correspondientes.
* **Cómo se ha realizado:**
  * Se leen `nombre` y `email` desde `req.body` gracias al middleware `express.urlencoded`.
  * Se ejecutan las validaciones necesarias:
    1. Campos vacíos u obligatorios mediante `validarInscripcion()`.
    2. Comprobación de duplicados mediante `estaInscrito()` para evitar que un mismo correo se registre dos veces en el mismo taller.
    3. Verificación de cupo disponible.
  * En caso de encontrar algún error, la petición responde con estado `400` y vuelve a renderizar la vista `inscripcion.ejs`, conservando los datos introducidos y mostrando la lista de errores.
  * Si la validación es exitosa, se crea un nuevo objeto de inscripción, se añade al array `inscripciones` y se redirige (`302`) al usuario a la página de detalle del taller (`/talleres/:id`).

#### Ejemplo CURL:
```bash
curl -X POST http://localhost:3000/talleres/1/inscripcion \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "nombre=Juan+Perez&email=juan.perez@example.com"
```

#### Equivalente en HTML:
```html
<!-- Formulario HTML de inscripción para el taller con ID 1 -->
<form action="/talleres/1/inscripcion" method="POST">
  <div>
    <label for="nombre">Nombre completo:</label>
    <input type="text" id="nombre" name="nombre" required>
  </div>
  <br>
  <div>
    <label for="email">Correo Electrónico:</label>
    <input type="email" id="email" name="email" required>
  </div>
  <br>
  <button type="submit">Inscribirme al Taller</button>
</form>
```
---
- IA usada y link: Geminis - [https://gemini.google.com/u/3/app/b976f3b36234fb7f?hl=es-ES&pageId=none](https://gemini.google.com/share/d/1SsLt5e8poIB8dU0IqSbMDbY1ZJOBFUou?usp=sharing)
- Entorno usado: Visual Studio code
- Tecnologias: JavaScript, EJS, Express y Node.js
- Realizado por Daniel Jiménez Ramírez - 2ºDAW - DWES
