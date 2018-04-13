/**
 * Created by lakhe on 4/14/16.
 */

var storeController = (function () {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        Store = require('../models/store.server.model'),
        utilityHelper = require('../helpers/utilities.helper'),
        Promise = require("bluebird");

    var documentFields = '_id storeName addressLine1 addressLine2 storeArea pincode latitude longitude email facebookURL websiteURL imageName imageProperties active';

    function StoreModule(){}

    StoreModule.CreateStore = function(storeObj, loggedInUser, imageInfo){
        var storeInfo = new Store();

        storeInfo.storeName = storeObj.storeName;
        storeInfo.addressLine1 = storeObj.addressLine1;
        storeInfo.addressLine2 = storeObj.addressLine2;
        storeInfo.storeArea = storeObj.storeArea;
        storeInfo.pincode = storeObj.pincode;
        storeInfo.latitude = storeObj.latitude;
        storeInfo.longitude = storeObj.longitude;
        storeInfo.email = storeObj.email;
        storeInfo.facebookURL = storeObj.facebookURL;
        storeInfo.websiteURL = storeObj.websiteURL;
        storeInfo.active = storeObj.active;
        storeInfo.imageName = imageInfo._imageName;
        storeInfo.imageProperties = {
            imageExtension : imageInfo._imageExtension,
            imagePath : imageInfo._imagePath
        };
        storeInfo.addedBy = loggedInUser;
        storeInfo.addedOn = new Date();

        return storeInfo;
    };

    var _p = StoreModule.prototype;


    _p.checkValidationErrors = function(req){

        req.checkBody('storeName', messageConfig.store.validationErrMessage.storeName).notEmpty();
        req.checkBody('addressLine1', messageConfig.store.validationErrMessage.addressLine1).notEmpty();
        req.checkBody('addressLine2', messageConfig.store.validationErrMessage.addressLine2).notEmpty();
        req.checkBody('storeArea', messageConfig.store.validationErrMessage.storeArea).notEmpty();
        req.checkBody('pincode', messageConfig.store.validationErrMessage.pincode).notEmpty();
        req.checkBody('latitude', messageConfig.store.validationErrMessage.latitude).notEmpty();
        req.checkBody('longitude', messageConfig.store.validationErrMessage.longitude).notEmpty();
        if(req.body.email){
            req.checkBody('email', messageConfig.store.validationErrMessage.emailValid).isEmail();
        }
        if(req.body.facebookURL){
            req.checkBody('facebookURL', messageConfig.store.validationErrMessage.facebookURLValid).isURL();
        }
        if(req.body.websiteURL){
            req.checkBody('websiteURL', messageConfig.store.validationErrMessage.websiteURLValid).isURL();
        }
       

        return req.validationErrors();
    };

    _p.getAllStores = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        
        var query = {};

        // matches anything that  starts with the inputted person name, case insensitive
        if(req.query.personName){
            query.personName = { $regex: new RegExp('.*' + req.query.personName, "i") };
        }
        if(req.query.active){
            query.active = req.query.active;
        }
        query.deleted = false;

        return dataProviderHelper.getAllWithDocumentFieldsPagination(Store, query, pagerOpts, documentFields, { addedOn: -1 });
    };

    _p.getStoreByID = function(req){
        return dataProviderHelper.findById(Store, req.params.storeId, documentFields);
    };

    _p.patchStore = function(req, res, next){
        req.storeInfo.deleted = true;
        req.storeInfo.deletedOn = new Date();
        req.storeInfo.deletedBy = req.decoded.user.username;
        _p.saveFunc(req, res, req.storeInfo, next, messageConfig.store.deleteMessage);
    };



    _p.postStore=function(req, res, next){
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        }else{
            var imageInfo = utilityHelper.getFileInfo(req, null, next);
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var storeInfo = StoreModule.CreateStore(modelInfo, req.decoded.user.username, imageInfo);
            _p.saveFunc(req, res, storeInfo, next, messageConfig.store.saveMessage);
        }
    };

    _p.saveFunc = function(req, res, newstoreInfo, next, msg){
        dataProviderHelper.save(newstoreInfo)
            .then(function(){
                res.status(HTTPStatus.OK);
                res.json({
                    message: msg
                });
            })
            .catch(function(err){
                return next(err);
            });
    };

    _p.updateStore = function(req, res, next){
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        }else{
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var imageInfo = utilityHelper.getFileInfo(req, req.storeInfo, next);

            req.storeInfo.storeName = modelInfo.storeName;

            req.storeInfo.addressLine1 = modelInfo.addressLine1;
            req.storeInfo.addressLine2 = modelInfo.addressLine2;
            req.storeInfo.storeArea = modelInfo.storeArea;
            req.storeInfo.pincode = modelInfo.pincode;
            req.storeInfo.latitude = modelInfo.latitude;
            req.storeInfo.longitude = modelInfo.longitude;
            req.storeInfo.email =  modelInfo.email;
            req.storeInfo.facebookURL = modelInfo.facebookURL;

            req.storeInfo.websiteURL = modelInfo.websiteURL;


            req.storeInfo.active = modelInfo.active;
            req.storeInfo.imageName = imageInfo._imageName;
            req.storeInfo.imageProperties.imageExtension = imageInfo._imageExtension;
            req.storeInfo.imageProperties.imagePath = imageInfo._imagePath;
            req.storeInfo.updatedBy = req.decoded.user.username;
            req.storeInfo.updatedOn = new Date();
            _p.saveFunc(req, res, req.storeInfo, next, messageConfig.store.updateMessage);
        }
    };
Store
    return{
        getAllStores: _p.getAllStores,
        getStoreByID: _p.getStoreByID,
        patchStore: _p.patchStore,
        postStore: _p.postStore,
        updateStore: _p.updateStore
    };
})();


module.exports = storeController;