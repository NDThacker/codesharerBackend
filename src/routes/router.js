const express = require('express');
const router = express.Router();
const sanitize = require('mongo-sanitize');
const service = require('../service/service');

router.get('/getsnippetbyid/:id', (req, res, next) => {
	let id = sanitize(req.params.id);
	service.getSnippetById(id).then(sdata => {
		res.json(sdata);
	}).catch(err => next(err))
})

router.post('/submitsnippet', (req, res, next) => {
	//let snippet = sanitize(req.body);
	service.submitSnippet(req.body).then(sid => {
		res.json({ url: sid });
	}).catch(err => next(err))
})


router.get('/searchsnippetbytitle/:title', (req, res, next) => {
	let tle = sanitize(req.params.title);
	service.searchSnippetByTitle(tle).then(sarray => {
		res.json(sarray);
	}).catch(err => next(err))
})

router.put('/editsnippet/:id', (req, res, next) => {
	let sid = sanitize(req.params.id);
	let content = sanitize(req.body.content);
	service.editSnippet(sid, content).then(sdata => {
		res.json(sdata);
	}).catch(err => next(err))
})

module.exports = router;