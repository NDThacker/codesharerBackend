const { getSnippetCollection } = require('../utilities/connection');
const connection = require('../utilities/connection');
const NewSnippet = require('./NewSnippet');
const NewUser = require('./NewUser');
const ld = require("lodash")
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
			if (rdata.length > 0) {
				return rdata;
			}
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
	}).catch(err => {
		err.status = 404;
		throw err;
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
	}).catch(err => {
		err.status = 406;
		throw err;
	})
}


model.submitSnippetToUser = (sid, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $push: { created: sid } }, { new: true }).then(udata => {
			if (udata) return true;
			else return null;
		})
	}).catch(err => {
		err.status = 406;
		throw err;
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
		results = results.concat(newRes);
		newRes.forEach(sp => {
			addedRes.push(sp._id);
		})
	}
	return results;
}

//will be improved later
model.editSnippet = (sid, content) => {
	return connection.getSnippetCollection().then(db => {
		return db.findByIdAndUpdate(sid, { $set: { modifiedTime: new Date(), content: content } }, { new: true }).then(sdata => {
			return sdata;
		})
	}).catch(err => {
		err.status = 406;
		throw err;
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
	}).catch(err => {
		err.message = "Cannot sign up";
		err.status = 406;
		throw err;
	})
}

model.logInUser = (email, password) => {
	return connection.getUserCollection().then(db => {
		return db.findById(email).then(udata => {
			if (udata && udata.password == password) {
				udata.password = null;
				// let newUdata = ld.omit(udata, "password"); not able to remove 'password' key, DONT KNOW WHY?!
				return udata;
			}
			else return null;
		})
	})
}

//not in use yet
model.addStarredSnippet = (email, sid) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $push: { starred: sid } }, { new: true }).then(udata => { //{ select: starred }
			if (udata) return udata.starred;
			else return null;
		})
	}).catch(err => {
		err.status = 406;
		throw err;
	})
}

model.updateStarredInUser = (starred, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { starred: starred }).then(retObj => {
			if (retObj) return true;
			else return null;
		})
	}).catch(err => {
		err.status = 406;
		throw err;
	})
}

model.updateCreatedInUser = (created, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { created: created }).then(retObj => {
			if (retObj) return true;
			else return null;
		})
	}).catch(err => {
		err.status = 406;
		throw err;
	})
}

model.getRecentSnippets = () => {
	return connection.getSnippetCollection().then(db => {
		return db.aggregate([{$sort: {creationTime: -1}}, {$limit: 6}]).then(retList => {
			if(retList.length) return retList;
			else return null;
		})
	})
}

module.exports = model;

if(process.env["NODE_ENV"] === "TEST") 
{
	module.exports.generateNewId = generateNewId;
	module.exports.searchByPhrase = searchByPhrase;
}