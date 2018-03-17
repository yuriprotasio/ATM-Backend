var mongoose = require('mongoose');
var db;

module.exports = function Connection(){
	if(!db){
		db = mongoose.connect('mongodb://localhost/caixa_eletronico');
	}
	return db;
}