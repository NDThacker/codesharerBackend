const connection = require('../utilities/connection');
const stopWords = ["and", "of", "a", "an", "the", "this", "that", "but", "how", "what", "are", "been", "by", "will", "is", "if"];

function generateNewId() {
	let s = Math.random();
	s = s * (10e16) / (new Date().getTime())
	s = s.toString(36).replace('.', '');
	return s;
}

async function searchByPhrase(phrase) {

	return connection.getSnippetCollection().then(db => {
		return db.find({ title: { $regex: new RegExp(phrase), $options: 'sxi' }, visibility: 'Public' }).then(rdata => {
			if (rdata.length > 0)
				return rdata;
			else
				return [];
		})
	})
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
		snippet.expiryTime = new Date();
		let months = snippet.expiryTime.getMonth();
		months = months == 12 ? 1 : months + 1;
		snippet.expiryTime.setMonth(months);
		snippet._id = generateNewId();
		return db.create(snippet).then(sdata => {
			if (sdata) return sdata._id;
			else return null;
		})
	})
}

model.searchSnippetByTitle = async (title) => {
	let results = [];
	
	for (let sword of stopWords)
	{
		sword = '\\W' + sword + '\\W';
		title = title.replace(new RegExp(sword, 'gi'), ' ');
	}
	let phrases = title.split(' ');
	console.log(phrases)
	let addedRes = []
	let newRes = []
	for (let phrase of phrases)
	{	
		newRes = await searchByPhrase(phrase);
		newRes = newRes.filter(sp => {
			if(!addedRes.includes(sp._id))
				return true;
			else return false;
		})
		results += newRes;
		newRes.forEach(sp => {
			addedRes.push(sp._id);
		})
	}
	return results;
}


model.editSnippet = (sid, content) => {
	return connection.getSnippetCollection().then(db => {
		return db.findByIdAndUpdate(sid, { $set: { modifiedTime: new Date(), content: content } }, { new: true }).then(sdata => {
			return sdata;
		})
	})
}

module.exports = model;