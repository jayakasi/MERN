const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error')
const usersRoutes = require('./routes/users-routes');

const docsRoutes = require('./routes/docs-routes');


const app = express();

app.use(bodyparser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    
    next();
});


app.use('/api/docs',docsRoutes);
app.use('/api/students',usersRoutes)

app.use((req,res,next) =>{
    const error = new HttpError('Could not find this route .',404);
    throw next('error' ,error);
});
app.use((error,req,res,next)=>{
    console.error(error);
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occured.'});
});


mongoose
    .connect('mongodb+srv://Jayalakshmi:KE3JB_x5ft_w4pL@cluster0.z90nqlr.mongodb.net/mern?retryWrites=true&w=majority')
    .then(()=>{
        app.listen(5050);
    })
    .catch(error=>{
        console.log(error);
    });
