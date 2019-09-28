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
	let snippet = sanitize(req.body);
	service.submitSnippet(snippet).then(sid => {
		res.json({ url: sid });
	}).catch(err => next(err))
})

module.exports = router;