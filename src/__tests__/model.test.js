const model = require("../model/model");
const connection = require("../utilities/connection");
const { faker } = require("@faker-js/faker");

const names = ["User1", "User2", "User3", "User4", "User5", "User6", "User7", "User8", "User9", "User10"];
const pass = "pass";
const sampleEmail = "sample@g.com";
let usersList = [];

for(let itr = 0; itr < 9; itr++)
{
	usersList.push({
		email: faker.internet.email(),
		name: names[itr],
		password: pass
	})
}
usersList.push({
	email: sampleEmail,
	password: pass,
	name: names[9]
});

let snippetList = [];

for(let itr = 0; itr < 9; itr++)
{
	snippetList.push({
		expiryTime: faker.date.future(),
		content: faker.lorem.paragraph(4),
		title: faker.lorem.word(),
		author: faker.name.firstName()

	});
}


describe("Testing Snippet ID Generation", () => {
	test("should be of type string", () => {
		expect(typeof model.generateNewId()).toEqual("string");
	})
})

describe("Testing db connection", () => {
	test("should get correct collection from correct db", async() => {
		
		let db = await connection.getUserCollection()
		expect(db.modelName).toEqual("Users");

		db = await connection.getSnippetCollection();
		expect(db.modelName).toEqual("CodeSnippet");
		// connection.close();
	})
})

describe("Testing sign up and login", () => {
	test("should insert single user details", async() => {
		expect(await model.signUpUser(usersList[3])).toEqual(true);
		expect(await model.signUpUser(usersList)).not.toEqual(true);
		await connection.clearUsers();

	})
	test("should check creds while logging in", async() => {
		expect(await model.signUpUser(usersList[9])).toEqual(true);
		expect(await model.logInUser(sampleEmail, pass)).not.toEqual(null);
		expect(await model.logInUser(sampleEmail, "randomstring")).not.toEqual(true);
		await connection.clearUsers();
		connection.close();
	})
})


describe("Testing Snippet submission", () => {
	test("should submit the snippet with correct email id", async() => {
		expect(await model.signUpUser(usersList[9])).toEqual(true);
		let sid = await model.submitSnippet(snippetList[2]);
		expect(typeof sid).toEqual("string");
		expect(await model.submitSnippetToUser(sid, sampleEmail)).toEqual(true);
		await connection.clearUsers();
		await connection.clearSnippets();
		connection.close();

	})
})