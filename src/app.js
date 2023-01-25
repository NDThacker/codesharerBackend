const bdp = require('body-parser');
const cors = require('cors');
const errorlogger = require('./utilities/errorlogger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require('./routes/router');


const app = express();

app.use(bdp.json());
app.use(bdp.urlencoded({ extended: true }));
app.use(cors())
app.use(helmet());
app.use(morgan('common'));
app.use('/', router);
app.use(errorlogger);

app.listen(1050);
console.log("BackEnd On");