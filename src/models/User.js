const nanoid = require('nanoid')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.CHAR(10),
      primaryKey: true
    },
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING(45),
      validate: {
        isEmail: true
      },
      allowNull: false,
      unique: true
    },
    name: DataTypes.STRING(45),
    apiKey: {
      type: DataTypes.CHAR(24)
    },
    sessionSignature: {
      type: DataTypes.CHAR(24),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }

  })

  User.associate = (models) => {
    User.hasMany(models.Image)
  }

  User.generateId = function () {
    return nanoid(10)
  }

  User.generateApiKey = function () {
    return nanoid(24)
  }

  User.generateSessionSignature = function () {
    return nanoid(24)
  }

  return User
}
