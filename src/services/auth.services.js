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
    //Gives access to user info
    const getUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    let isActive = false;

    if(getUser.rows.length === 0){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }else{
        isActive = true;
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
        {
            email : getUser.rows[0].email,
            user_id: getUser.rows[0].user_id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "1d"}
    );

    const refresh = await db.query(`INSERT INTO auth_token(token, user_id, isActive) 
        VALUES($1, $2, $3) RETURNING *`,
    [refreshToken, getUser.rows[0].user_id, isActive]); 

    return {getUser: getUser.rows[0], refreshToken, accessToken, refresh: refresh.rows[0]};
}

async function logoutUser({token, user_id}){
    //Fix
    const checkUser = await db.query("SELECT * FROM auth_token WHERE token = $1", [token]);
    if(!checkUser){
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }else{
        const result = await db.query("UPDATE auth_token SET isActive = false WHERE user_id = $1", [user_id]);
        const deleteToken = await db.query("DELETE FROM auth_token WHERE user_id = $1", [user_id]);
    }
    
}




module.exports = {registerUser, loginUser, logoutUser};