class NewSnippet {
	constructor(obj) {
		//this.visibility = obj.visibility;
		this.content = obj.content;
		this.title = obj.title;
		this.author = obj.author;
		this.createTime = new Date();
		this.modifiedTime = new Date();
		if(new Date(obj.expiryTime) < new Date())
		{
			let err = new Error("Invalid Expiry Date");
			throw err;
		}
		this.expiryTime = new Date(obj.expiryTime);
		// let months = obj.expiryTime.getMonth();
		// months = months == 12 ? 1 : months + 1;
		// this.expiryTime.setMonth(months);

	}
}

module.exports = NewSnippet;