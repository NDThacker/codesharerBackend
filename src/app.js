const bdp = require('body-parser');
const errorlogger = require('./utilities/errorlogger');
const express = require('express');
const helmet = require('helmet');
const router = require('./routes/router');
const morgan = require('morgan');

const app = express();

app.use(bdp.json());
app.use(bdp.urlencoded({ urlencoded: true}));
app.use(helmet());
app.use(morgan.combined())
app.use('/', router);
app.use(errorlogger);

app.listen(1050);
console.log("BackEnd On");