var express = require('express');
var router = express.Router();
var modelnotas = require('../model/notas')();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/* GET home page. */
router.get('/', (req, res) => {
	let cem, cinquenta, vinte, dez;
	modelnotas.find({}, (err, notas) => {
		if(err) throw err;
		if(notas == ""){
			modelnotas.create([{cod: 100, name: 'cem', value:0}, 
				{cod:50, name: 'cinquenta', value:0},
				{cod:20, name:'vinte', value:0},
				{cod:10, name:'dez', value:0}], (err, notas) =>{

					modelnotas.find({cod: 100}, (err, value) => {
						if(err) throw err;
						cem = value[0].value;
						console.log(cem);
						modelnotas.find({cod: 50}, (err, value) => {
							if(err) throw err;
							cinquenta = value[0].value; 
							modelnotas.find({cod: 20}, (err, value) => {
								if(err) throw err;
								vinte = value[0].value;
								modelnotas.find({cod: 10}, (err, value) => {
									if(err) throw err;
									dez = value[0].value;
									res.send({'cem':cem, 'cinquenta': cinquenta, 'vinte':vinte, 'dez':dez});
								});
							});
						});
					});
			});
		}else{
			modelnotas.find({cod: 100}, (err, value) => {
				if(err) throw err;
				cem = value[0].value;
				console.log(cem);
				modelnotas.find({cod: 50}, (err, value) => {
					if(err) throw err;
					cinquenta = value[0].value; 
					modelnotas.find({cod: 20}, (err, value) => {
						if(err) throw err;
						vinte = value[0].value;
						modelnotas.find({cod: 10}, (err, value) => {
							if(err) throw err;
							dez = value[0].value;
							res.send({'cem':cem, 'cinquenta': cinquenta, 'vinte':vinte, 'dez':dez});
						});
					});
				});
			});
		}
	});
});

router.post('/addMoney', (req, res) =>{
	let body = req.body;
	let codnota  = body.cod;
	let finalValue = 0;
	var notapos = 0;

	modelnotas.find({cod: codnota}, (err, notas) => {
		if(err) throw err;

		finalValue = parseInt(body.money) + parseInt(notas[0].value);

		modelnotas.findOneAndUpdate({cod:codnota}, {$set:{value: finalValue}}, {new:true}, function(err, doc){
			if (err) {
				console.log("error")
			}else{
				console.log("Updated");
			}
			res.redirect('/');
		});
	});
});



router.post('/getMoney', (req, res) =>{
	let body = req.body;

	modelnotas.find({}, (err, notas) =>{
		let cem = 0, cinquenta = 0, vinte = 0, dez = 0;
		if(err) throw err;
		if(notas == ""){
			res.send({error:true});
		}else{
			modelnotas.find({cod:100},(req,nota)=>{
				cem = nota[0].value;
				console.log(cem);

				modelnotas.find({cod:50},(req,nota)=>{
					cinquenta = nota[0].value;
					console.log(cinquenta);

					modelnotas.find({cod:20},(req,nota)=>{
						vinte = nota[0].value;
						console.log(vinte);

						modelnotas.find({cod:10},(req,nota)=>{
							dez = nota[0].value;
							console.log(dez);

							var allMoney = body.money;
							console.log(allMoney);
							var result = allMoney % 100;

							var hundredIncrement = 0;
							var fifityIncrement = 0;
							var twentyIncrement = 0;
							var tenIncrement = 0;

							var value = 0;

							//Hundred Increment
							for(var i = 0; i < allMoney; i += 100){
								if(hundredIncrement < cem){
									hundredIncrement += 1;
								}
							}
							value = hundredIncrement * 100;
							if(value > allMoney){
								hundredIncrement += -1;
								value = hundredIncrement * 100;
							}

							//Fifity Increment
							if(value < allMoney){
								for(var i = value; i < allMoney; i += 50){
									if(fifityIncrement < cinquenta){
										fifityIncrement += 1;
									}
								}
								value += fifityIncrement * 50;
								if(value > allMoney){
									fifityIncrement += -1;
									value = (hundredIncrement * 100) + (fifityIncrement * 50);
								}
							}

							//Twenty Increment
							if(value < allMoney){
								for(var i = value; i < allMoney; i += 20){
									if(twentyIncrement < vinte){
										twentyIncrement += 1;
									}
								}
								value += twentyIncrement * 20;
								if(value > allMoney){
									twentyIncrement += -1;
									value = (hundredIncrement * 100) + (fifityIncrement * 50) + (twentyIncrement * 20);
								}
							}

							//Ten Increment
							if(value < allMoney){
								for(var i = value; i < allMoney; i += 10){
									if(tenIncrement < dez){
										tenIncrement += 1;
									}
								}
								value += tenIncrement * 10;
								if(value > allMoney){
									tenIncrement += -1;
									value = (hundredIncrement * 100) + (fifityIncrement * 50) + (twentyIncrement * 20) + (tenIncrement * 10);
								}
							}
								
							var value = hundredIncrement * 100 + fifityIncrement * 50 + twentyIncrement * 20 + tenIncrement * 10;

							cem = cem -hundredIncrement;
							cinquenta = cinquenta -fifityIncrement;
							vinte = vinte -twentyIncrement;
							dez = dez -tenIncrement;
							result = allMoney % value;
							console.log(cem + " " +cinquenta+ " " +vinte+ " " +dez);

							console.log("Final Result: "+ result);
							if (result != 0) {
								res.send({error:true});
							}else{
								console.log(hundredIncrement + " hundred \n" + fifityIncrement + " fifity \n" + twentyIncrement + " twenty \n" + tenIncrement + " ten");
								modelnotas.findOneAndUpdate({cod:100}, {$set:{value: cem}}, {new: true}, function(err, doc){
									if(err){
								        console.log("Something wrong when updating data!");
								    }
								    modelnotas.findOneAndUpdate({cod:50}, {$set:{value: cinquenta}}, {new: true}, function(err, doc){
										if(err){
									        console.log("Something wrong when updating data!");
									    }
									    modelnotas.findOneAndUpdate({cod:20}, {$set:{value: vinte}}, {new: true}, function(err, doc){
											if(err){
										        console.log("Something wrong when updating data!");
										    }
										    modelnotas.findOneAndUpdate({cod:10}, {$set:{value: dez}}, {new: true}, function(err, doc){
												if(err){
											        console.log("Something wrong when updating data!");
											    }
											    res.send({error: false, cem: hundredIncrement, cinquenta: fifityIncrement, vinte: twentyIncrement, dez: tenIncrement});
											});	
										});	
									});
								});
							}
						});
					});			
				});					
			});
		}
	});
});

module.exports = router;
