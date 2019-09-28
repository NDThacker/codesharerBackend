const model = require('../model/model');



const service = {};


service.getSnippetById = (id) => {
	return model.getSnippetById(id).then(sdata => {
		if(sdata)
			return sdata;
		else {
			let err = new Error("No such snippet found");
			err.status = 404;
			throw err;
		}
	})
}

service.submitSnippet = (snippet) => {
	return model.submitSnippet(snippet).then(sid => {
		if(sid) return sid;
		else {
			let error = new Error("Cannot post snippet");
			error.status = 406;
			throw error;
		}
	})
}

module.exports = service;