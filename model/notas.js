module.exports = function(){
	var mongoose = require('mongoose');
	const Schema = mongoose.Schema;

	let db;

	if(!db){
		db = mongoose.connect('mongodb://localhost/caixa_eletronico')
	}

	var Notas = Schema({
		cod: String,
		name: String,
		value: String
	});

	return mongoose.model('notas', Notas);
}