(function (server, PORT, HOST, bodyParser, mongoRepo, fs, express, passport, passportLocal, cookieParser, expressSession) {

	server.use(express.static('public'));

	var express = require('express');

	server.use(bodyParser.urlencoded({
		extended: true
	}));

	server.get('/', function (req, res) {


		fs.readFile('templates/home.html', function (err, stuff) {

			if (err) {

				console.log(err);

			}

			res.send(stuff.toString());

		});

	});

	server.get('/batman', function (req, res) {

		mongoRepo.FindAllInCollectionsAsArray('libraryFinal', function (data) {

			res.send({
				success: data,
				failure: false
			});

		});

	});

	server.get('/logged', function (req, res) {

		mongoRepo.FindAllInCollectionsAsArray('usersFinal', function (data) {

			res.send({
				success: data,
				failure: false
			});

		});

	});

	server.post('/batman2', function (req, res) {


		var book = {

			name: req.body.name,
			description: req.body.description,
			status: 'Available',
			category: req.body.category,
			owner: req.body.owner,
			who: ''

		}

		mongoRepo.WriteAllInCollectionsAsArray('libraryFinal', book, function (data) {

			res.send({
				success: data,
				failure: false
			});

		});

	});

	server.post('/register', function (req, res) {


		var user = {

			name: req.body.name,
			password: req.body.password,
			booksOut: []

		}

		mongoRepo.WriteAllInCollectionsAsArray('usersFinal', user, function (err, data) {

		});


	});

	server.post('/added', function (req, res) {



		mongoRepo.FindOneAndUpdate('libraryFinal', req.body.id, {
			status: 'Checked Out',
			who: req.body.who,
			dueDate: req.body.dueDate
		}, function (err) {


			mongoRepo.FindOneAndInsert('usersFinal', req.body.idz, {
				booksOut: req.body.checkedOut
			}, function (err) {


			});


		});


	});

	server.post('/deadded', function (req, res) {



		mongoRepo.FindOneAndUpdate('libraryFinal', req.body.id, {
			status: 'Available',
			who: '',
			dueDate: ''
		}, function (err) {


		});


	});



	server.post('/returned', function (req, res) {

		if (req.body.remaining == null) {

			mongoRepo.FindOneAndUpdate('usersFinal', req.body.id, {
				booksOut: []
			}, function (err, data) {

				mongoRepo.FindOneAndUpdate('libraryFinal', req.body.idz, {
					status: 'Available',
					who: '',
					dueDate: ''
				}, function (err) {

				});

			});

		}

		else {

			mongoRepo.FindOneAndUpdate('usersFinal', req.body.id, {
				booksOut: req.body.remaining
			}, function (err) {

				mongoRepo.FindOneAndUpdate('libraryFinal', req.body.idz, {
					status: 'Available',
					who: '',
					dueDate: ''
				}, function (err) {

				});

			});

		}

	});

	server.post('/return', function (req, res) {


		mongoRepo.FindSingleInCollectionsByID('usersFinal', req.body.person, function (data) {

			res.send({
				success: data,
				failure: false
			});

		});







	});




	server.listen(PORT, HOST, function () {

		console.log('Super server is super engaged.  On an awesome port.')

	});



})(

	require('express')(), (process.env.PORT || 1337), (process.env.IP || 'localhost'),
	require('body-parser'),
	require('./mongo_connection'),
	require('fs'),
	require('express'),
	require('passport'),
	require('passport-local'),
	require('cookie-parser'),
	require('express-session')

);