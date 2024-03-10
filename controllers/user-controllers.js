const mongoose = require('mongoose');

const { validationResult }= require('express-validator')
const HttpError = require('../models/http-error');
const User = require( '../models/user' );
const Doc = require('../models/doc');
const { response } = require('express');



const getUsers = async (req,res,next)=>{
    let users;
    try{
        users = await User.find({},'-password');

    }catch (err){
        const error = new HttpError(
            'Fetching users failed, please try again later',
            500
        );
        return next(error);
    }
    res.json({users:users.map(user => user.toObject({getters:true}))});
};
const signup = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new  HttpError('Invalid inputs passed, please check your data',422)) ;
    }
    const { name,email,password,rollno }= req.body;
    let existingUser;
    try{
        existingUser = await User.findOne( {email:email});

    }catch(err){
        const  error = new HttpError("Signing up failed ,please try again later ",500);
        return next(error);
    }
    if(existingUser){
        const error = new  HttpError ('Email already in use, please login instead',422);
        return next(error);
    }
    const createdUser = new User( {
       name,
       rollno,
       email,
       image:'../NUS_certificate.png',
       password,
       docs:[]

    });

    console.log(createdUser);
    try{
        await createdUser.save();
        console.log('Printing line after save');
 
    }catch(err){
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({user:createdUser.toObject({getters:true})});
};
const login = async (req,res,next)=>{

    const {email,password}= req.body;
    let existingUser;
    try{
        existingUser = await User.findOne( {email:email});

    }catch(err){
        const  error = new HttpError("Login in failed ,please try again later ",500);
        return next(error);
    }

    if(!existingUser || existingUser.password != password){
        const error = new  HttpError('Invalid credentials, Could not log you in',401);
        return next(error);
    }
    res.json({message:'Logged in!!!'});
    
};


exports.getUsers=getUsers;
exports.signup=signup;
exports.login=login;
