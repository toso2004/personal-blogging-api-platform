const express = require('express');
const AuthService = require('../services/auth.services');

async function registerController(req, res){
    const { first_name, last_name, date_of_birth, email, password } = req.body;

    try{
        if(!first_name || !last_name || !date_of_birth || !email || !password){
            res.status(400).json({
                success: false,
                message: "All fields are required in order to register a new account"
            });
        }else{
            const newUser = await AuthService.registerUser({first_name, last_name, date_of_birth, email, password});
            res.status(200).json({
                success: true,
                data: newUser
            });
        }
    }catch(e){
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.message
        })
    }
}

async function loginController(req, res){
    const { email, password } = req.body;

    try{
        const { getUser, token } = await AuthService.loginUser({email, password});
        res.status(200).json({
            success: true,
            data: getUser, token
        })
    }catch(e){
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.message
        });
    } 
}

module.exports = { registerController, loginController};