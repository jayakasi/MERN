const uuid = require('uuid');
const mongoose = require('mongoose');

const { validationResult }= require('express-validator')

const HttpError = require('../models/http-error');
const Doc = require('../models/doc');
const User = require('../models/user');




const getDocsById =async (req,res,next)=>{
    const docId = req.params.docid;
    let doc;
    try{
        doc = await Doc.findById(docId);

    }catch(err){
        const error = new HttpError(
            'Semething went wrong, could not find the document',
            500
        );
        return next(error);
    }
    if(!doc){
        
        const error =  new HttpError("Could not find the document for this ID",404);
        return next(error);

    }
    res.json({doc:doc.toObject( {getters:true} )});
};

const getDocsByUserId = async (req,res,next)=>{
    const sId=req.params.sid;
    let docs;
    try{
        docs = await Doc.find( {studId: sId} );

    }catch(err){
        const error = new HttpError(
            'Fetching the document failed please try again later',
            500
        );
        return next(error);
    }

    if(!docs || docs.length===0){
        return next(
            new HttpError("Could not find the documents for this ID",404)
        ); 
    } 
    res.json({docs:docs.map(doc=>doc.toObject({getters:true}))});

}

const createDoc = async (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next (
            new  HttpError('Invalid inputs passed, please check your data',422)
        ) ;
    }
    const {title,description,date,studId,studClass,studSec,creator} = req.body;
    const createdDoc = new Doc({
        title,
        description,
        image: '../NUS_certificate.png',
        date,
        studId,
        studClass,
        studSec,
        creator
    });

    let user;
    try{
        user= await User.findById(creator);
    }catch(err){
        console.error('Error creating the document:', err);
        const error = new HttpError(
            'An error occurred while creating the document',
            500
        );
        return next(error);
    }


    if(!user){
        const error = new HttpError(
            'could not find user for provided id',
            404
        );
        return next(error);
    }
    console.log(user);

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdDoc.save({session : sess});
        user.docs.push(createdDoc);
        await  user.save({session :sess});
        await sess.commitTransaction();

    }catch(err){
        const error = new HttpError(
            'Creating the document failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({doc:createdDoc});
};

const updateDoc = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next (new  HttpError('Invalid inputs passed, please check your data',422)); 
    }
    const {title,description} = req.body;
    const docId = req.params.did;
    
    let doc;
    try{
        doc = await Doc.findById(docId);
    }catch(err){
        const error = new HttpError(
        'something went wrong , Could not update',
        500
    );
        return next(error);
    }

    doc.title=title;
    doc.description=description;

    try{
        await  doc.save();
    }catch(err){
        const error = new HttpError(
            "Updating the document failed, please try again.",
            500
        );
        return next(error);
    }

    res.status(200).json({doc:doc.toObject({getters:true})});
};

const deleteDoc = async (req,res,next) =>{
    const docId=req.params.did;
    let doc;
    try{
        doc = await Doc.findById(docId).populate({
            path: 'creator',
            populate: { path: 'docs' },
        });

    }catch(err){
        const error = new HttpError(
            'Could not find the doc, try again later',
            500
        );
        return next(error);
    }
    if(!doc){
        const error = new HttpError(
            'Could not find the doc for this id.',
            404
        );
        return next(error);

    }
    try{

        const sess = await mongoose.startSession();
        sess.startTransaction();
        await doc.deleteOne( {session:sess} );
        doc.creator.docs.pull(doc);
        await doc.creator.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
    console.log(doc.creator.docs);

        console.error('Error deleting document:', err);
        const error = new HttpError(
            'SOmething went wrong, could not delete the palce',
            500
        );
        return next(error);
    }
    res.status(200).json({message:"Deleted Document "});
};
exports.getDocsById = getDocsById;
exports.getDocsByUserId = getDocsByUserId;
exports.createDoc = createDoc;
exports.updateDoc = updateDoc;
exports.deleteDoc = deleteDoc;