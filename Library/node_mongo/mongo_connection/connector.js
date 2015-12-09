(function (connector, mongodb) {

	//create our mongo client so that we can connect to the databse
	var MongoClient = mongodb.MongoClient;
	//url tells us where the connection is living
	var url = 'mongodb://' + (process.env.IP || 'localhost') + '/test';
	var assert = require('assert');
	//custom function
	var ConnectToDB = function (callback) {

		//this is what actually connects to the databse
		MongoClient.connect(url, function (err, db) {

			assert.equal(null, err);

			if (err) {

				return console.log(err);

			}

			callback(db, function () {

				db.close();
			});

		});

	};

	connector.ConnectToDB = ConnectToDB;

})(

	module.exports,
	require('mongodb')

);
