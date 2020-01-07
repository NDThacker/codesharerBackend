const connection = require('../utilities/connection');
const NewSnippet = require('./NewSnippet');
const NewUser = require('./NewUser');
const stopWords = ["and", "of", "a", "an", "the", "this", "that", "but", "how", "what", "are", "been", "by", "will", "is", "if"];

function generateNewId() {
	let s = Math.random();
	s = s * (10e16) / (new Date().getTime())
	s = s.toString(36).replace('.', '');
	return s;
}

async function searchByPhrase(phrase) {

	return connection.getSnippetCollection().then(db => {
		return db.find({ title: { $regex: new RegExp(phrase), $options: 'sxi' }, visibility: "Public" }).then(rdata => {
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

model.submitSnippet = (snp) => {
	return connection.getSnippetCollection().then(db => {
		let snippet = new NewSnippet(snp);
		snippet._id = generateNewId();
		return db.create(snippet).then(sdata => {
			if (sdata) return sdata._id;
			else return null;
		})
	})
}

model.submitSnippetToUser = (snp, sid, email) => {
	return connection.getUserCollection().then(db => {
		let snippet = new NewSnippet(snp);
		snippet._id = sid;
		return db.findByIdAndUpdate(email, { $push: { created: snp } }, { new: true }).then(udata => {
			if (udata) return true;
			else return null;
		})
	})
}

model.searchSnippetByTitle = async (title) => {
	let results = [];

	for (let sword of stopWords) {
		sword = '\\W' + sword + '\\W';
		title = title.replace(new RegExp(sword, 'gi'), ' ');
	}
	let phrases = title.split(' ');
	console.log(phrases)
	let addedRes = []
	let newRes = []
	for (let phrase of phrases) {
		newRes = await searchByPhrase(phrase);
		newRes = newRes.filter(sp => {
			if (!addedRes.includes(sp._id))
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


model.signUpUser = (User) => {
	let newUser = new NewUser(User);
	return connection.getUserCollection().then(db => {
		return db.create(newUser).then(udata => {
			if (udata) {
				return true;
			}
			
			else return null;
		})
	})
}

model.logInUser = (email, password) => {
	return connection.getUserCollection().then(db => {
		return db.findById(email).then(udata => {
			if (udata && udata.password == password) {
				delete udata.password;
				return udata;
			}
			else return null;
		})
	})
}

model.addStarredSnippet = (email, snippet) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $push: { starred: snippet } }, { select: starred }).then(starred => {
			if(starred) return starred;
			else return null;
		})
	})
}


model.updateStarredInUser = (starred, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $set: { starred: starred } }, { select: starred }).then(starred => {
			if(starred) return true;
			else return null;
		})
	})
}

model.updateCreatedInUser = (created, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $set: { created: created } }, { select: created }).then(created => {
			if(created) return true;
			else return null;
		})
	})
}
module.exports = model;