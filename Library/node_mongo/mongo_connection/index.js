(function (dbRepo, connector, mongodb) {


	var ObjectID = mongodb.ObjectID;

	var FindAllInCollectionsAsArray = function (collectionName, callback) {

		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).find().toArray(function (err, data) {

				if (err) {

					closeDB();


				}



				callback(data);


				setTimeout(closeDB(), 100);


			});

		});

	};

	var WriteAllInCollectionsAsArray = function (collectionName, model, callback) {

		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).save(model, function (err, data) {

				if (err) {

					closeDB();


				}



				callback(data);


				setTimeout(closeDB(), 100);
			});

		});

	};

	var FindOneAndUpdate = function (collectionName, id, model, callback) {

		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).update({
				_id: new ObjectID(id)
			}, {
				$set: model
			}, function (err, data) {
				if (err) {

					closeDB();


				}

				callback(data);

				closeDB();







			});

		});




	};

	var FindOneAndInsert = function (collectionName, id, model, callback) {

		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).update({
				_id: new ObjectID(id)
			}, {
				$push: model
			}, function (err, data) {
				if (err) {

					closeDB();


				}






				closeDB();




			});

		});



	};

	var UpdateAllInCollectionsAsArray = function (collectionName, hi, callback) {

		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).update(hi, function (err, data) {

				if (err) {

					closeDB();


				}



				callback(data);


				setTimeout(closeDB(), 100);

			});

		});

	};

	var FindSingleInCollectionsByID = function (collectionName, id, callback) {



		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).find({

				_id: new ObjectID(id)

			}).toArray(function (err, data) {

				if (err) {

					closeDB();


				}


				callback(data[0]);
				//console.log(data[0]);

				setTimeout(closeDB(), 100);


			});

		});

	};

	var FindUserByName = function (collectionName, username, callback) {

		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).find({
				name: username
			}).toArray(function (err, data) {

				if (err) {
					return console.log(err);
				}
				else {

					callback(data);
					closeDB();
				}

			});

		});

	}

	var FindUserByID = function (collectionName, id, callback) {

		connector.ConnectToDB(function (db, closeDB) {

			db.collection(collectionName).find({
				_id: new ObjectID(id)
			}).toArray(function (err, data) {

				if (err) {
					return console.log(err);
				}
				else {

					callback(data);
					closeDB();
				}

			});

		});

	}


	dbRepo.FindAllInCollectionsAsArray = FindAllInCollectionsAsArray;
	dbRepo.FindSingleInCollectionsByID = FindSingleInCollectionsByID;
	dbRepo.WriteAllInCollectionsAsArray = WriteAllInCollectionsAsArray;
	dbRepo.FindSingleInCollectionsByID = FindSingleInCollectionsByID;
	dbRepo.FindOneAndUpdate = FindOneAndUpdate;
	dbRepo.FindOneAndInsert = FindOneAndInsert;
	dbRepo.FindUserByName = FindUserByName;
	dbRepo.FindUserByID = FindUserByID;

})(

	module.exports,
	require('./connector.js'),
	require('mongodb')

);