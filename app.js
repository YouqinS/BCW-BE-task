'use strict';
require('dotenv').config();
const express = require('express');
const db = require('./modules/database');
const resize = require('./modules/resize');
const exif = require('./modules/exif');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const multer = require('multer');
const upload = multer({dest: 'public/uploads/'});

const app = express();
app.use(bodyParser.json());
const connection = db.connect();

const cb = (result, res) => {
    //console.log(result);
    res.send(result);
};

app.use(express.static('public'));


//update
app.patch('/images/:id', (req, res) => {//upload.single('imagefile'),
    console.log('code running??');
    if(req.params.id != null){
        console.log('code running 2 ??:');
        const title = req.body.title;
        const category = req.body.category;
        const details = req.body.details;
        const id = req.params.id;

        console.log('img id: ' + id);
        const data = [
            category,
            title,
            details,
            id
        ];
        db.update(data, connection, res);


    }else {
        res.status(404);
        res.send({updatefail:' id not found'});
    }


});


//search
app.get('/search/:field/:value', (req, res)=>{

    const field = req.params.field.slice(1);
    const value = req.params.value.slice(1);

    console.log('search text: ' + value);
    console.log('field: ' + field);

    db.searchImages( field, value, connection, cb, res);

});

//delete an image
app.delete('/image/:id', (req, res) => {
    const data = [
        req.params.id
    ];
    db.deleteImage(data, connection, res);
});

// respond to post and save file
app.post('/upload', upload.single('mediafile'), (req, res, next) => {
    next();
});


// create thumbnail
app.use('/upload', (req, res, next) => {
    resize.doResize(req.file.path, 300,
        './public/thumbs/' + req.file.filename + '_thumb', next);
});

// create medium image
app.use('/upload', (req, res, next) => {
    resize.doResize(req.file.path, 640,
        './public/medium/' + req.file.filename + '_medium', next);
});

// get coordinates
app.use('/upload', (req, res, next) => {
    exif.getCoordinates(req.file.path).then(coords => {
        req.coordinates = coords;
        next();
    }).catch(() => {
        console.log('No coordinates');
        req.coordinates = {};
        next();
    });
});

// insert to database
app.use('/upload', (req, res, next) => {
    console.log('insert is here');
    const data = [
        req.body.category,
        req.body.title,
        req.body.details,
        req.file.filename + '_thumb',
        req.file.filename + '_medium',
        req.file.filename,
        req.coordinates,
    ];
    db.insert(data, connection, next);
});

// get updated data form database and send to client
app.use('/upload', (req, res) => {
    db.select(connection, cb, res);
});

app.get('/images', (req, res) => {
    db.select(connection, cb, res);
});


app.listen(3000);