const connection = require('../utilities/connection');
const stopWords = ["and", "of", "a", "an", "the", "this", "that", "but", "how", "what", "are", "been", "being", "by", "will", "is", "if"]

function generateNewId() {
	let s = Math.random();
	s = s * (10e16) / (new Date().getTime())
	s = s.toString(36).replace('.', '');
	return s;
}



const model = {};


model.getSnippetById = (id) => {
	return connection.getSnippetCollection().then(db => {
		return db.findById(id).then(sdata => {
			return sdata;
		})
	})
}

model.submitSnippet = (snippet) => {
	return connection.getSnippetCollection().then(db => {
		snippet.createTime = new Date();
		snippet.modifiedTime = new Date();
		snippet._id = generateNewId();
		return db.create(snippet).then(sdata => {
			if (sdata) return sdata._id;
			else return null;
		})
	})
}

model.searchSnippetByTitle = async (title) => {
	let results = [];
	for (let sWord of stopWords)
		title.replace(new RegExp("/" + sWord + "/gi"), '');
	let phrases = title.split(' ');
	return connection.getSnippetCollection().then(db => {
		for (let phrase of phrases)
			results.concat(db.find({ title: { $regex: new RegExp(phrase), $options: 'sxi' }, visibility: 'Public' }));
		return results;
	})
}


model.editSnippet = (sid, content) => {
	return connection.getSnippetCollection().then(db => {
		return db.findByIdAndUpdate(sid, { $set: { modifiedTime: new Date(), content: content } }, { new: true }).then(sdata => {
			return sdata;
		})
	})
}

module.exports = model;