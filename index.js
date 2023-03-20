/**
 * Example of auth service
 * this service lacks several things like a JWT to be returned in auth success
 * A better management of exception
 * Some services to do the action instead of have all this stuffs in index.js
 * This is just an example to show data being saved and retrieved from a postgres SQL
 * You could use an ORM like sequelize or typeorm to simplify stuffs
 *
 */

import express from "express";

// import bodyParser to retrieve info from request body
import bodyParser from "body-parser";

// import bcrypt to hash password
import bcrypt from "bcrypt";

// import database connection
import { pool } from "./database.js";

const app = express();

app.use(bodyParser.json());

// expose an endpoint to check the service health
app.get("/", (req, res) => {
  res.send("OK");
});

// expose an endpoint to register a user
app.post("/register", async (req, res) => {
  try {
    // retrieve username from request body
    // lowercase it to avoid any issue linked to uppercase or lowercase
    const username = req.body.username.toLowerCase();

    // hash password before saving it
    const password = await bcrypt.hash(req.body.password, 10);

    pool.query(
      "INSERT INTO users values($1,$2)",
      [username, password],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: "bad request" });
        }
        res.status(201).json({
          username,
          message: "Uder created",
        });
      }
    );
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

// expose an endpoint to login the user
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    pool.query(
      "SELECT * from users where ousername =$1",
      [username],
      async (err, result) => {
        if (err) {
          throw err;
        }
        if (result.rowCount === 0) {
          res
            .status(404)
            .json({ message: "username or password is incorrect" });
          return;
        }

        const dbPwd = result.rows[0].password;

        // compare password entered with the one hashed in the database
        const isSamePassword = await bcrypt.compare(req.body.password, dbPwd);

        // if password appeard to be different, return an error
        if (!isSamePassword) {
          res
            .status(404)
            .json({ message: "username or password is incorrect" });
          return;
        }
        res.status(200).json({
          username,
        });
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
});

// launch the service on port 4000
app.listen(4000, () => {
  console.log("server started");
});
