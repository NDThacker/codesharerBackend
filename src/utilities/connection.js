const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const connection = {};
const dbUrl = 'mongodb://localhost:27017/snippetsdb';


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
	return mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(conn => {
		return conn.model('Users', userSchema);
	})
}

connection.getSnippetCollection = () => {
	return mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(conn => {
		return conn.model('CodeSnippet', snippetSchema);
	})
};

module.exports = connection;