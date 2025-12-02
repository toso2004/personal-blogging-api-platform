const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser({ first_name, last_name, date_of_birth, email, password}){

    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if(checkUser.rows.length > 0){
        const error = new Error("User with this account already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const results = await db.query(
        `INSERT INTO users(first_name, last_name, date_of_birth, email, password)
        VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [first_name, last_name, date_of_birth, email, hashedPassword]);

    return results.rows[0];
}

async function loginUser({email, password}){

    const getUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if(getUser.rows.length === 0){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const comparePassword = await bcrypt.compare(password, getUser.rows[0].password)

    if(!comparePassword){
        const error = new Error("Incorrect credentials");
        error.statusCode = 401;
        throw error;
    }

        //Create a jwt token
    const token = jwt.sign(
        {userID: getUser.rows[0].user_id, email: getUser.rows[0].email},
        "tupperware",
        {expiresIn: "1h"}
    );

    return {getUser: getUser.rows[0], token};
}

module.exports = {registerUser, loginUser};