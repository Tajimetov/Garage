var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/apartments.sqlite'
});

var db = {};
db.apartments = sequelize.import(__dirname + '/models/apartments.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

