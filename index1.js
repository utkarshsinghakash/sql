const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "record",
  password: "6tillcock",
});

let getRandomUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.listen("8080", () => {
  console.log("app is listening on port 8080");
});

//Home route
app.get("/", (req, res) => {
  let q = `select count(*) from user`;

  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let count = results[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

//show route
app.get("/user", (req, res) => {
  let q = `select * from user`;

  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      const data = results;
      res.render("user.ejs", { data });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

//edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      const user = results[0];
      console.log(results[0]);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      const user = results[0];
      // console.log(results[0]);
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: NewformUser, password: NewformPass } = req.body;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      console.log(results[0]);
      const user = results[0];
      console.log(user);

      if (NewformUser != results.username || NewformPass != results.password) {
        // console.log(results);
        let q2 = `Delete from user where id='${id}'`;
        connection.query(q2, (err, results) => {
          console.log(results);
          res.redirect("/user");
        });
      } else {
        res.send("WRONG PASSWORD");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      const user = results[0];
      if (formPass != user.password) {
        res.send("WRONG PASSWORD");
      } else {
        let q2 = `Update user set username='${newUsername}' where id='${id}'`;
        connection.query(q2, (err, results) => {
          console.log(results);
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

//new user
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user", (req, res) => {
  let id = uuidv4();
  let { Email: formEmail, username: formUser, password: formPass } = req.body;
  let q = `Insert into user (id,Email,username,password) Values ('${id}','${formEmail}','${formUser}','${formPass}')`;

  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
  }
});
