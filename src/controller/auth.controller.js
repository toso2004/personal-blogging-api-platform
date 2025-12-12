const express = require('express');
const { registerUser, loginUser, logoutUser }= require('../services/auth.services');

async function registerController(req, res){
    const { first_name, last_name, date_of_birth, email, password } = req.body;

    try{
        if(!first_name || !last_name || !date_of_birth || !email || !password){
            res.status(400).json({
                success: false,
                message: "All fields are required in order to register a new account"
            });
        }else{
            const newUser = await registerUser({first_name, last_name, date_of_birth, email, password});
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
    const { email, password} = req.body;
    

    try{
        if(email !== req.body.email || password !== req.body.password){
            res.status(401).json({
                success: false,
                message: "Incorrect user details"
            })
        }else{
            const { getUser, accessToken, refreshToken} = await loginUser({email, password});

            res.cookie("BlogCookie", refreshToken,
                {
                    secure: true,
                    httpOnly: true,
                    expires: new Date(Date.now() + 900000)
                }
            );
            
            res.status(200).json({
                success: true,
                data: getUser, accessToken, refreshToken
            });
            
        }    
    }catch(e){
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.message
        });
    } 
}


async function logoutController(req, res){
    const { email, password } = req.body;
    const {user_id} = req.user

    try{
        if(email !== req.body.email || password !== req.body.password){
        res.status(401).json({
            success: false,
            message: "Incorrect user details"
        })
        }else{
            const logout = await logoutUser({email, password, user_id});

            res.status(200).json({
                success: true,
                logout,
                message: "Logout successfull"
            })
        }
    }catch(e){
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.message
        })
    }
    
}

module.exports = { registerController, loginController, logoutController};