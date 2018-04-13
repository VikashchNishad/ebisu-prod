/**
 * Created by lakhe on 4/14/16.
 */
var storeRoutes = (function () {

    'use strict';

    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        storeController = require('../controllers/store.server.controller'),
        imageFilePath = './public/uploads/images/store/',
        uploadPrefix = 'store',
        fileUploadHelper = require('../helpers/file.upload.helper')(imageFilePath, '', uploadPrefix),
        uploader = fileUploadHelper.uploader,
        storeRouter =  express.Router();

    storeRouter.route('/')

   

        .get( getAllStores )

        
        .post( tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, storeController.postStore );



    //middleware function that will get the testimonial object for each of the routes defined downwards
    storeRouter.use('/:storeId', function(req, res, next){
        storeController.getStoreByID(req)
            .then(function(storeInfo){
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (storeInfo) {
                    req.storeInfo = storeInfo;
                    next();
                    return null;// return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    });


    storeRouter.route('/:storeId')



        .get(function(req, res){
            res.status(HTTPStatus.OK);
            res.json(req.storeInfo);
        })


        
        .patch( tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, storeController.patchStore )


        
        .put( tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, storeController.updateStore );



    //function declaration to return testimonial list to the client if exists else return not found message
    function getAllStores(req, res, next) {
        storeController.getAllStores (req, next)
            .then(function(stores){
                //if exists, return data in json format
                if (stores) {
                    res.status(HTTPStatus.OK);
                    res.json(stores);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }

    return storeRouter;

})();

module.exports = storeRoutes;