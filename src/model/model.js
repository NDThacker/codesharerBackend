const conection = require('../utilities/connection');


function generateNewId() {
	let s = Math.random();
	s = s * (10e16) / (new Date().getTime())
	s = s.toString(36).replace('.', '');
	return s;
}



const model = {};


model.getSnippetById = (id) => {
	return conection.getSnippetCollection().then(db => {
		return db.findById(id).then(sdata => {
			return sdata;
		})
	})
}

model.submitSnippet = (snippet) => {
	return conection.getSnippetCollection().then(db => {
		snippet.createTime = new Date().toDateString();
		snippet.modifiedTime = new Date().toDateString();
		snippet._id = generateNewId();
		return db.create(snippet).then(sdata => {
			if(sdata) return sdata._id;
			else return null;
		})
	})

}


module.exports = model;