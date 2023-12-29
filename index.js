const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "record",
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
for (let i = 1; i <= 100; i++) {
  data.push(createRandomUser());
}

let q = "Insert into user (id,username,email,password) values ?";
// let users = [
//   ["123b", "123-newuserb", "abcb@gmail.com", "abcb"],
//   ["123c", "123-newuserc", "abcc@gmail.com", "abcc"],
// ];

//using connection to place query
try {
  connection.query(q, [data], (err, results) => {
    if (err) throw err;
    console.log(results);
  });
} catch (err) {
  console.log(err);
}
connection.end();

//.log(createRandomUser());
