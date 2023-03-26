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

service.addStarredSnippet = (email, sid) => {
	return model.addStarredSnippet(email, sid).then(starred => {
		if(starred) return starred;
		else {
			let err = new Error("Can't add star.!");
			err.status = 406;
			throw err;
		}
	})
}

service.submitSnippetToUser = (sid, email) => {
	return model.getSnippetById(sid).then(obj => {
		if(obj && Object.keys(obj).length !== 0)
		{
			return model.submitSnippetToUser(sid, email).then(status => {
				if(status) return status;
				else {
					let err = new Error("Can't submit new snippet");
					err.status = 406;
					throw err;
				}
			})
		}
		else
		{
			let err = new Error("No such Snippet found");
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
	return model.signUpUser(User).then(status => {
		if(status) return status;
		else {
			let error = new Error("Signing up failed");
			error.status = 406;
			throw error;
		}
	})
}

service.updateStarredInUser = (starred, email) => {
	return model.updateStarredInUser(starred, email).then(status => {
		if(status) return true;
		else {
			let error = new Error("Cannot update starred snippets");
			error.status = 406;
			throw error;
		}
	})
}

service.updateCreatedInUser = (created, email) => {
	return model.updateCreatedInUser(created, email).then(status => {
		if(status) return true;
		else {
			let error = new Error("Cannot update created snippets");
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

service.getRecentSnippets = () => {
	return model.getRecentSnippets().then(retList => {
		if(retList) return retList;
		else{
			let error = new Error("Cannot retrieve Recent Snippets");
			error.status = 501;
			throw error;
		}
	})
}

module.exports = service;