const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const connection = {};



// let contentSchema = new Schema({
// 	html: { type: String },
// 	js: { type: String },
// 	css: { type: String }
// })

let snippetSchema = new Schema({
	_id: { type: String },
	title: { type: String, required: true },
	creationTime: { type: Date, default: new Date() },
	modifiedTime: { type: Date, default: new Date() },
	visibility: { type: String, enum: ['Public', 'Private'], default: 'Public' },
	content: { type: String }
}, { collection: 'CodeSnippet' });


connection.getSnippetCollection = () => {
	return mongoose.connect('mongodb://localhost:27017/snippetsdb', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(conn => {
		return conn.model('CodeSnippet', snippetSchema);
	})

};

module.exports = connection;