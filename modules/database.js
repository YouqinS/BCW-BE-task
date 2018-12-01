'use strict';
const mysql = require('mysql2');

const connect = () => {
  // create the connection to database
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
  });
  return connection;
};

const select = (connection, callback, res) => {
  // simple query
  connection.query(
      'SELECT * FROM testdb',
      (err, results, fields) => {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results, res);
      },
  );
};

const insert = (data, connection, callback) => {
  // simple query
  connection.execute(
      'INSERT INTO testdb (category, title, details, thumbnail, image, original, coordinates) VALUES (?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback();
      },
  );
};

const deleteImage =(data, connection, res) =>{
    connection.execute(
        'DELETE FROM testdb WHERE t_ID = ?',
        data,
        (err, results, fields) => {
            if (err){
                console.log(err);
                res.send({result: 'delete NOT OK'});
            }else {
                res.send({result:'delete OK'});
            }

        },
    );

};


const searchImages = (field, searchText, connection, callback, res) =>{

   // const colname = category;
    connection.query(
        "SELECT * FROM testdb WHERE " + field + " LIKE '%" + searchText+ "%'",
        (err, results, fields) => {
            console.log(err);
            callback(results, res);
        },
    );

};

const update = (data, connection, res) =>{
    connection.execute(
        'UPDATE testdb SET category = ?, title = ?, details = ? WHERE t_ID = ?',
        data,
        (err, results, fields) => {
            if (err){
                console.log(err);
                res.send({result: 'update NOT OK'});
            }else {
                res.send({result:'update OK'});
            }

        },
    );
};


module.exports = {
  connect: connect,
  select: select,
  insert: insert,
   deleteImage: deleteImage,
    searchImages: searchImages,
    update: update,
};