var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/cars.sqlite'
});

var db = {};
db.cars = sequelize.import(__dirname + '/models/cars.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

