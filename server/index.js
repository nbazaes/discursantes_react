const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = require('./models');

const discursantesRouter = require('./Discursantes');
const discursosRouter = require('./Discursos');

app.use('/discursantes', discursantesRouter);
app.use('/discursos', discursosRouter);

db.sequelize.sync().then(() => {
    app.listen(2501, () => {
        console.log('Servidor corriendo en http://localhost:2501');
    });
});