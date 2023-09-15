const Sequelize = require('sequelize')

const sequelize = new Sequelize('postapp','root', 'Edwin@19', {
    host: "localhost",
    dialect: "mysql"
})

module.exports = {Sequelize, sequelize}