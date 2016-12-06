var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;    
var apartments = []; 
var apartmentsNextNum = 1;
app.use(bodyParser.json());
//Method GET
app.get('/', function(req, res){
	app.use(express.static(__dirname + '/html'));
    res.sendFile('html/index.html', {root: __dirname })
});
// GET /apartments
app.get('/apartments', function (req, res) { 
var query = req.query;
var where = {};
if (query.hasOwnProperty('a') && query.a.length > 0) {
where.location = {
$like: '%' + query.a + '%'
};
}
if (query.hasOwnProperty('b') && query.b.length > 0) {
where.condition = {
$like: '%' + query.b + '%'
};
}
													/*Как сделать фильтр по количество комнат????*/
													/*Как сделать фильтр по количество комнат????*/
													/*Как сделать фильтр по количество комнат????*/
													/*Как сделать фильтр по количество комнат????*/
													/*Как сделать фильтр по количество комнат????*/
db.apartments.findAll({where: where}).then(function (apartments) {
res.json(apartments);
}, function (e) {
res.status(500).send();
});
console.log('Method GET for /apartments working');
});
//Get count of apartments from //garage
app.get('/offer', function(req, res)
{
db.apartments.findAll({
attributes: ['id','amount', 'location', 'condition', 'floor','price']
}).then(function(apartments)
{
	var count = 0;
if(apartments){
for(var i=0; i<apartments.length; i++)
{
	count += 1;
}
res.send(JSON.stringify(apartments,null,null,10)+"\nYou have in a offer: "+count+" apartments");}
},
function(e) {
res.status(500).json(e);
});
});
// GET /apartments/:id
app.get('/apartments/:id', function(req, res){     
var apartmentsNextNum = parseInt(req.params.id, 10);
db.apartments.findById(apartmentsNextNum).then(function (apartments) {
if (!!apartments) {
res.json(apartments.toJSON());
} else {
res.status(404).send({"error": "Attention!: You have already deleted apartment with that ID"});
}
}, function (e) {
res.status(500).send();
});
console.log('Method GET for /apartments/:id working');
}); 
// POST /apartments
app.post('/apartments', function(req, res){         
var body = _.pick(req.body, 'amount', 'location','condition','floor','price');            
db.apartments.create(body).then(function (apartments) {
res.json(apartments.toJSON());
}, function (e) {
res.status(400).json(e);
});
console.log('Method POST for /apartments working');
});
	//Delete apartments /apartments/:id
	app.delete('/apartments/:id', function(req,res){
	var apartmentsNextNum = parseInt(req.params.id,10																																															);
	db.apartments.findById(apartmentsNextNum).then(function (apartments) 
	{																							
	if (apartments) {			
	res.send("Apartment with that ID:"+apartmentsNextNum+" has been deleted: \n");
	db.apartments.destroy({where:{id: apartmentsNextNum}});
	} 
	else {
	res.status(404).send({"error": "Attention!: You have already deleted apartment with that ID"});
	}
	}, function(e) 
	{
	res.status(500).send();
	});
	console.log('Method DELETE for /apartments/:id working');
	});

// PUT /apartments/:id
app.put('/apartments/:id', function(req, res) {
	var apartmentsNextNum = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'location','price');
	var attributes = {};

	if (body.hasOwnProperty('location','price')) {
		attributes.price=body.price;
		attributes.location = body.location;
	}
	db.apartments.findById(apartmentsNextNum).then(function(apartments){
		if(apartments){
			apartments.update(attributes).then(function (apartments){
				res.json(apartments.toJSON());
			}, function (e){
				res.status(400).json(e);
			});
		}else{
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();
	});
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});