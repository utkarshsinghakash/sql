const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta1",
  password: "6tillcock",
});

let createRandomUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

let data = [];
for (let i = 0; i < 100; i++) {
  data.push(createRandomUser());
}

let q = "Insert into user (id,username,email,password) values ?";

try {
  connection.query(q, [data], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

connection.end();
