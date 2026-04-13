module.exports = (sequelize, DataTypes) => {
  const Discurso = sequelize.define('Discurso', {
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Tema: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    }
  });

  Discurso.associate = (models) => {
    Discurso.belongsTo(models.Discursante, {
      foreignKey: 'DiscursanteId',
      as: 'discursante'
    });
  };

  return Discurso;
};
