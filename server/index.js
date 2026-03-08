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

app.use('/discursantes', discursantesRouter);
app.use('/discursos', discursosRouter);

// SPA fallback: cualquier ruta no-API devuelve el index.html de React
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 2501;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
});