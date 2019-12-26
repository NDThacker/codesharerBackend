const express = require('express');
const router = express.Router();
const sanitize = require('mongo-sanitize');
const service = require('../service/service');



/*get a snippet by url which is the id for snippets
	route requires url for snippet as a route/request parameter
	it returns the snippet if found
	else with statuscode 404 returns error */
	
router.get('/getsnippetbyid/:id', (req, res, next) => {
	let id = sanitize(req.params.id);
	service.getSnippetById(id).then(sdata => {
		res.json(sdata);
	}).catch(err => next(err))
})


/*post a snippet 
	req.body requires an object with  'visibility' which can either 'Public' or 'Private'
	'content' which is plain text
	'title' which can be multi phrased string to describe the snippet
	'expiryDate' which user will specify as date object
	new snippet's url is returned
	else error is returned with statuscode 406 */

router.post('/submitsnippet', (req, res, next) => {
	//let snippet = sanitize(req.body);
	service.submitSnippet(req.body).then(sid => {
		res.json({ url: sid });
	}).catch(err => next(err))
})

/*get results of searching snippets by title
	give title as a req params 
	it can be multiphrased string
	returns array of snippets if search phrase yielded any snippets
	else returns an error with statuscode 404 */

router.get('/searchsnippetbytitle/:title', (req, res, next) => {
	let tle = sanitize(req.params.title);
	service.searchSnippetByTitle(tle).then(sarray => {
		res.json(sarray);
	}).catch(err => next(err))
})


/*put an edited snippet
	requires url as req params and new content as req body
	returns new updated snippet else returns an error with statuscode 406 */

router.put('/editsnippet/:id', (req, res, next) => {
	let sid = sanitize(req.params.id);
	let content = sanitize(req.body.content);
	service.editSnippet(sid, content).then(sdata => {
		res.json(sdata);
	}).catch(err => next(err));
})


/*user sign up
	require req body object email, name and password returns the same object back
	else returns error with 406 status */

router.post('/signup',(req, res, next) => {
	let User = sanitize(req.body);
	service.signUpUser(User).then(udata => {
		res.json(udata);
	}).catch(err => next(err));
})


/*post request for logging in
	require req body object with email and password
	return user data if creds are valid, else 406 error */
	
router.post('/login', (req, res, next) => {
	let creds = sanitize(req.body);
	service.logInUser(creds).then(udata => {
		res.json(udata);
	}).catch(err => next(err));
})

module.exports = router;