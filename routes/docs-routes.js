const express = require('express');
const { check }= require('express-validator')
const placeControllers = require('../controllers/docs-controllers')
const HttpError = require('../models/http-error');


const router = express.Router();


router.get('/:docid',placeControllers.getDocsById);

router.get('/student/:sid',placeControllers.getDocsByUserId);

router.post(
    '/',
    [
    check('title')
    .not()
    .isEmpty(),

    check('description')
    .isLength({min:5}),

    check('date')
    .not()
    .isEmpty(),

    check('studId')
    .not()
    .isEmpty()
] , 
    placeControllers.createDoc
);

router.patch('/:did',
[
    check('title')
    .not()
    .isEmpty(),

    check('description')
    .isLength({min:5})
],
placeControllers.updateDoc);

router.delete('/:did',placeControllers.deleteDoc);

module.exports=router;