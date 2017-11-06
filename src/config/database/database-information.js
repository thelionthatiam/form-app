const databaseInformation = {
	user: 'formadmin',
	host: 'localhost',
	database: 'formapp',
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	port: 5432,
	foo:{
		bar: 1,
		baz: {
			...
		}
	}
};

module.exports = {
	databaseInformation:databaseInformation,
};

// change to json, this code not data
// config files just data, limited logic (or none)
