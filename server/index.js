const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./models');

const discursantesRouter = require('./Discursantes');
const discursosRouter = require('./Discursos');

app.use('/api/discursantes', discursantesRouter);
app.use('/api/discursos', discursosRouter);

// SPA fallback: cualquier ruta no-API devuelve el index.html de React
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 2501;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}).catch((err) => {
    console.error('Error al conectar a la base de datos:', err.message);
    // Arrancar el servidor de todas formas para que Railway no lo reinicie en loop
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT} (sin conexión a DB)`);
    });
});