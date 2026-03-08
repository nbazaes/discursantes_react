const express = require('express');
const router = express.Router();
const { Discurso, Discursante } = require('./models');
const { Op } = require('sequelize');

// Obtener todos los discursos (con info de discursante)
router.get('/', async (req, res) => {
  try {
    const lista = await Discurso.findAll({
      include: [{
        model: Discursante,
        as: 'discursante',
        attributes: ['id', 'Nombres', 'Apellidos', 'Llamamiento']
      }],
      order: [['Fecha', 'DESC']]
    });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener historial agrupado por domingo
router.get('/domingos', async (req, res) => {
  try {
    const discursos = await Discurso.findAll({
      include: [{
        model: Discursante,
        as: 'discursante',
        attributes: ['id', 'Nombres', 'Apellidos', 'Llamamiento']
      }],
      order: [['Fecha', 'DESC']]
    });

    // Agrupar por fecha
    const agrupado = {};
    discursos.forEach(d => {
      const fecha = d.Fecha;
      if (!agrupado[fecha]) agrupado[fecha] = [];
      agrupado[fecha].push(d);
    });

    const resultado = Object.keys(agrupado)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(fecha => ({
        fecha,
        discursos: agrupado[fecha]
      }));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener temas únicos
router.get('/temas', async (req, res) => {
  try {
    const discursos = await Discurso.findAll({
      include: [{
        model: Discursante,
        as: 'discursante',
        attributes: ['Nombres', 'Apellidos']
      }],
      order: [['Fecha', 'DESC']]
    });
    res.json(discursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener discursos de una fecha específica
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const discursos = await Discurso.findAll({
      where: { Fecha: req.params.fecha },
      include: [{
        model: Discursante,
        as: 'discursante',
        attributes: ['id', 'Nombres', 'Apellidos', 'Llamamiento']
      }],
      order: [['id', 'ASC']]
    });
    res.json(discursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear uno o varios discursos (para un domingo)
router.post('/', async (req, res) => {
  try {
    const { discursos } = req.body; // [{ Fecha, Tema, DiscursanteId }, ...]
    if (Array.isArray(discursos)) {
      const creados = await Discurso.bulkCreate(discursos);
      res.json(creados);
    } else {
      const creado = await Discurso.create(req.body);
      res.json(creado);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reemplazar todos los discursos de una fecha (editar domingo)
router.put('/fecha/:fecha', async (req, res) => {
  try {
    const { discursos } = req.body; // [{ Tema, DiscursanteId }, ...]
    // Eliminar los existentes de esa fecha
    await Discurso.destroy({ where: { Fecha: req.params.fecha } });
    // Crear los nuevos
    const nuevos = (discursos || []).map(d => ({ ...d, Fecha: req.params.fecha }));
    const creados = nuevos.length > 0 ? await Discurso.bulkCreate(nuevos) : [];
    res.json(creados);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un discurso
router.delete('/:id', async (req, res) => {
  try {
    const disc = await Discurso.findByPk(req.params.id);
    if (!disc) return res.status(404).json({ error: 'No encontrado' });
    await disc.destroy();
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
