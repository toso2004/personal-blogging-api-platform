const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

    //Access token
    const accessToken = jwt.sign(
        {
            user_id: getUser.rows[0].user_id, 
            email: getUser.rows[0].email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "10m"}
    );

    //Refresh token
    const refreshToken = jwt.sign(
        {email : getUser.rows[0].email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "1d"}
    );

    return {getUser: getUser.rows[0], accessToken};
}

function accessRefreshToken({refreshToken, accessToken}){
    
    if(!refreshToken){
        const error = new Error("Not authorized.Wrong or missing token");
        error.statusCode = 401;
        throw error;
    }else{
        accessToken = jwt.sign(
            {
                user_id: getUser.rows[0].user_id, 
                email: getUser.rows[0].email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "10m"}
        );
    }

    return {accessToken};
}


module.exports = {registerUser, loginUser, accessRefreshToken};