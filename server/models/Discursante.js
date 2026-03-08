module.exports = (sequelize, DataTypes) => {
  const Discursante = sequelize.define('Discursante', {
    Nombres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    Apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    Llamamiento: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 150]
      }
    }
  });

  Discursante.associate = (models) => {
    Discursante.hasMany(models.Discurso, {
      foreignKey: 'DiscursanteId',
      as: 'discursos'
    });
  };

  return Discursante;
}