var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;    
var cars = []; 
var CarsNextNum = 1;
app.use(bodyParser.json());
//Method GET
app.get('/', function(req, res){  
	res.send('Welcome to my cars garage!!!');   
}); 
			// GET /cars
			app.get('/cars', function (req, res) { 
			var query = req.query;
				var where = {};
				if (query.hasOwnProperty('a') && query.a.length > 0) {
					where.name = {
						$like: '%' + query.a + '%'
					};
				}
				if (query.hasOwnProperty('b') && query.b.length > 0) {
					where.typecar = {
						$like: '%' + query.b + '%'
					};
				}
				db.cars.findAll({where: where}).then(function (cars) {
					res.json(cars);
				}, function (e) {
					res.status(500).send();
				});
				console.log('Method GET for /cars working');
			});
							//Get count of cars from //garage
							app.get('/garage', function(req, res)
							{
									db.cars.findAll({
							  attributes: ['id', 'name', 'typecar', 'amount', 'number']
							}).then(function(cars)
									{var count = 0;
									if(cars){
											for(var i=0; i<cars.length; i++){count += 1;}
												res.send(JSON.stringify(cars,null,null,10)+"\nYou have in a garage: "+count+" cars");}
								}, 
											function(e) {
													res.status(500).json(e);
												});
							});
														// GET /cars/:id
														app.get('/cars/:id', function(req, res){     
															var CarsNextNum = parseInt(req.params.id, 10);
															db.cars.findById(CarsNextNum).then(function (cars) {
																if (!!cars) {
																	res.json(cars.toJSON());
																} else {
																	res.status(404).send({"error": "Attention!: You have already deleted car with that ID"});
																}
															}, function (e) {
																res.status(500).send();
															});
															console.log('Method GET for /cars/:id working');
														}); 
																				// POST /cars
																				app.post('/cars', function(req, res){         
																					var body = _.pick(req.body, 'name', 'typecar','amount','number');            
																					db.cars.create(body).then(function (cars) {
																						res.json(cars.toJSON());
																					}, function (e) {
																						res.status(400).json(e);
																					});
																					console.log('Method POST for /cars working');
																				});
																								//Delete cars /cars/:id
																								app.delete('/cars/:id', function(req,res){
																									var CarsNextNum = parseInt(req.params.id,10);
																									
																								db.cars.findById(CarsNextNum).then(function (cars) 
																								{
																										if (cars) {			
																											res.send("Car with that ID:"+CarsNextNum+" has been deleted: \n");
																											db.cars.destroy({where:{id: CarsNextNum}});
																										} 
																										else {
																											res.status(404).send({"error": "Attention!: You have already deleted car with that ID"});
																										}
																								}, function(e) 
																									{
																										res.status(500).send();
																									});
																									console.log('Method DELETE for /cars/:id working');
																								});
																											//PUT /cars/:id
//PUT /cart/:id
app.put('/cars/:id', function(req, res){
	var CarsNextNum = parseInt(req.params.id,10);
	var matchedCars = _.findWhere(cars, {id: CarsNextNum});
	var body = _.pick(req.body, 'amount');
	var changeableValue = {};
	if(!matchedCars)
	{
		res.status(404).json({"error": "meal with that ID not found"});
	}
	if(body.hasOwnProperty('amount') && _.isNumber(body.amount))
		{
			changeableValue.amount = body.amount;
		} 
	else 
		{
			return res.status(400).send();
		}
	matchedCars = _.extend(matchedCars, changeableValue);  //copy(add) 2nd object fields to 1st
	res.json(matchedCars);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});
