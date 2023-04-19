const mongoose = require('mongoose');
const config = require("config");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const connection = {};
let dbUrl = '';
if(process.env["NODE_ENV"] === "TEST")
{
	dbUrl = 'mongodb+srv://' + config.get("test.user") + ":" + config.get("test.password") + "@" + config.get("test.host") + "/" + config.get("test.db") + "?retryWrites=true&w=majority";
}
else
{
	dbUrl = 'mongodb+srv://' + config.get("prod.user") + ":" + config.get("prod.password") + "@" + config.get("prod.host") + "/" + config.get("prod.db") + "?retryWrites=true&w=majority";
}



let snippetSchema = new Schema({
	_id: { type: String },
	title: { type: String, required: true },
	author: { type: String, required: true },
	creationTime: { type: Date, default: new Date() },
	modifiedTime: { type: Date, default: new Date() },
	expiryTime: { type: Date },
	visibility: { type: String, enum: ['Public', 'Private'], default: 'Public' },
	content: { type: String }
}, { collection: 'CodeSnippet' });

let userSchema = new Schema({
	_id: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	starred: { type: [String], default: [] },
	created: { type: [String], default: [] }
}, { collection: 'Users' });

connection.getUserCollection = () => {
	return mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}).then(conn => {
		return conn.model('Users', userSchema);
	})
}

connection.getSnippetCollection = () => {
	return mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}).then(conn => {
		return conn.model('CodeSnippet', snippetSchema);
	})
};

connection.close = async() => {
	await mongoose.disconnect();
};


if(process.env["NODE_ENV"] === "TEST")
{
	
	connection.clearUsers = async() => {
		await mongoose.connections[0].dropCollection("Users");

	};
	connection.clearSnippets = async() => {
		await mongoose.connection.dropCollection("CodeSnippet");
	
	};
	
}

module.exports = connection;