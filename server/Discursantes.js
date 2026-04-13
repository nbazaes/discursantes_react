const express = require('express');
const router = express.Router();
const { Discursante, Discurso } = require('./models');
const { Sequelize } = require('sequelize');

// Obtener todos los discursantes
router.get('/', async (req, res) => {
  try {
    const lista = await Discursante.findAll({
      include: [{
        model: Discurso,
        as: 'discursos',
        attributes: ['Fecha', 'Tema']
      }],
      order: [['Apellidos', 'ASC'], ['Nombres', 'ASC']]
    });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un discursante por id
router.get('/:id', async (req, res) => {
  try {
    const disc = await Discursante.findByPk(req.params.id, {
      include: [{ model: Discurso, as: 'discursos' }]
    });
    if (!disc) return res.status(404).json({ error: 'No encontrado' });
    res.json(disc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sugerencia: discursantes que no han hablado hace más tiempo (o nunca)
router.get('/accion/sugerencia', async (req, res) => {
  try {
    const discursantes = await Discursante.findAll({
      include: [{
        model: Discurso,
        as: 'discursos',
        attributes: ['Fecha']
      }],
      order: [['Apellidos', 'ASC']]
    });

    const conFecha = discursantes.map(d => {
      const plain = d.toJSON();
      const fechas = plain.discursos.map(disc => disc.Fecha);
      const ultima = fechas.length > 0 ? fechas.sort().reverse()[0] : null;
      return { ...plain, ultimaFecha: ultima };
    });

    // Ordenar: primero los que nunca han hablado, luego por fecha más antigua
    conFecha.sort((a, b) => {
      if (!a.ultimaFecha && !b.ultimaFecha) return 0;
      if (!a.ultimaFecha) return -1;
      if (!b.ultimaFecha) return 1;
      return new Date(a.ultimaFecha) - new Date(b.ultimaFecha);
    });

    res.json(conFecha);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear discursante
router.post('/', async (req, res) => {
  try {
    const nuevo = await Discursante.create(req.body);
    res.json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar discursante
router.put('/:id', async (req, res) => {
  try {
    const disc = await Discursante.findByPk(req.params.id);
    if (!disc) return res.status(404).json({ error: 'No encontrado' });
    await disc.update(req.body);
    res.json(disc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar discursante
router.delete('/:id', async (req, res) => {
  try {
    const disc = await Discursante.findByPk(req.params.id);
    if (!disc) return res.status(404).json({ error: 'No encontrado' });
    await disc.destroy();
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;