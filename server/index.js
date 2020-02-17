const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/kanbanlists', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
requireDir('./src/models');

app.use('/api', require('./src/routes'));

app.listen(3000, () => console.log('Listening on 3000.'));