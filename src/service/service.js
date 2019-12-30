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

service.submitSnippetToUser = (snippet, email) => {
	return model.submitSnippetToUser(snippet, snippet._id, email).then(udata => {
		if(udata) return udata;
		else {
			let err = new Error("Can't submit new snippet");
			err.status = 406;
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

service.searchSnippetByTitle = (title) => {
	return model.searchSnippetByTitle(title).then(sarray => {
		if(sarray.length) {
			return sarray;
		}
		else {
			let error = new Error("No such Snippets found");
			error.status = 404;
			throw error;
		}
	})
}


service.editSnippet = (sid, content) => {
	return model.editSnippet(sid, content).then(sdata => {
		if(sdata) return sdata;
		else {
			let error = new Error("Snippet cannot be saved");
			error.status = 406;
			throw error;
		}
	})
}


service.signUpUser = (User) => {
	return model.signUpUser(User).then(udata => {
		if(udata) return udata;
		else {
			let error = new Error("Signing up failed");
			error.status = 406;
			throw error;
		}
	})
}

service.logInUser = (creds) => {
	return model.logInUser(creds.email, creds.password).then(udata => {
		if(udata) return udata;
		else {
			let error = new Error("Email or Password incorrect");
			error.status = 406;
			throw error;
		}
	})
}

module.exports = service;