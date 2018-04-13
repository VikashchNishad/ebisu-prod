/**
 * Created by lakhe on 4/27/16.
 */

var productsRoutes = (function () {

    'use strict';

    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        productsRouter = express.Router(),
        imageFilePathCat = './public/uploads/images/productscategory/',
        imageFilePath = './public/uploads/images/products/',
        uploadPrefixCat = 'productscategory',
        uploadPrefix = 'products',
        fileUploadHelper = require('../helpers/file.upload.helper')(imageFilePath, '', uploadPrefix),
        fileUploadHelperCat = require('../helpers/file.upload.helper')(imageFilePathCat, '', uploadPrefixCat),
        uploader = fileUploadHelper.uploader,
        uploaderCat = fileUploadHelperCat.uploader,
        productsController = require('../controllers/products.server.controller');

    productsRouter.route('/productscategory/')
    .get(getAllProductsCategory)
    .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploaderCat.single('imageName'), fileUploadHelperCat.imageUpload, productsController.postProductsCategory);

     productsRouter.route('/productssubcategory/')
    .get(getAllProductsSubCategory)
    .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, productsController.postProductsSubCategory);


    //middleware function that will get the products category object for each of the routes defined downwards
    productsRouter.use('/productscategory/:productsCategoryId', function (req, res, next) {
        productsController.getProductsCategoryInfoByID(req)
            .then(function(productsCategoryInfo){
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (productsCategoryInfo) {
                    req.productsCategoryInfo = productsCategoryInfo;
                    next();
                    return null;// return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProductsCategory
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    });

    //middleware function that will get the products subcategory object for each of the routes defined downwards
    productsRouter.use('/productssubcategory/:productsSubCategoryId', function (req, res, next) {
        productsController.getProductsSubCategoryInfoByID(req)
            .then(function(productsSubCategoryInfo){
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (productsSubCategoryInfo) {
                    req.productsSubCategoryInfo = productsSubCategoryInfo;
                    next();
                    return null;// return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProductsSubCategory
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    });


    productsRouter.route('/productscategory/:productsCategoryId').get(function (req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.productsCategoryInfo);
        })
    .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, productsController.patchProductsCategory)
    .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploaderCat.single('imageName'), fileUploadHelperCat.imageUpload, productsController.updateProductsCategory);
   
    productsRouter.route('/productssubcategory/:productsSubCategoryId').get(function (req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.productsSubCategoryInfo);
        })
    .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, productsController.patchProductsSubCategory)
    .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, productsController.updateProductsSubCategory);
   


    // productsRouter.route('/productscategoryimage/:productsId')
    //         .get( getProductsCategoryImageInfoByImageID )









/*---------------------------------------------------------------------------------------------------*/

    productsRouter.route('/products/').get( getAllProducts ).post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, productsController.postProducts);

    //middleware function that will get the products object for each of the routes defined downwards
    productsRouter.use('/products/:productsId', function (req, res, next) {
        productsController.getProductsByID(req)
            .then(function(productsInfo){
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (productsInfo) {
                    req.productsInfo = productsInfo;
                    next();
                    return null;// return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProducts
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    });

    productsRouter.route('/products/:productsId') 	
        .get(function (req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.productsInfo);
        })  

        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, productsController.updateProducts)
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, productsController.patchProducts);

    productsRouter.route('/productsimage/:productsId')
        .get( getAllProductsImagesByProductsID )
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, productsController.postProductsImageInfo);



    //middleware function that will get the products related image object for each of the routes defined downwards
    productsRouter.use('/productsimage/:productsId/:imageId', function (req, res, next) {
        productsController.getProductsImageInfoByImageID(req)
            .then(function(productsImageInfo){
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (productsImageInfo) {
                    req.productsImageInfo = productsImageInfo;
                    next();
                    return null;// return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProductsImage
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    });

    productsRouter.route('/productsimage/:productsId/:imageId')
        .delete(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, productsController.removeProductsImage)
        .get(function (req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.productsImageInfo);
        }).patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, productsController.updateCoverImage)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, productsController.updateProductsImageInfo);



    productsRouter.route('/productsdetail/:year/:month/:day/:titleSlog')
       .get( getProductsDetailByTitleSlog );

      


    productsRouter.route('/filter/productscategory/:productsCategory')

        .get( getProductsgByCategory );




 //function declaration to return products detailed object related to the filter parameter category name, if exists, else return not found message
  function getProductsgByCategory(req, res, next) {
        productsController.getProductsgByCategory (req, next)
            .then(function(productsList) {
                //if exists, return data in json format
                if (productsList) {
                    res.status(HTTPStatus.OK);
                    res.json(productsList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProducts
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }


productsRouter.route('/filter/productssubcategory/:productsSubCategory')

        .get( getProductsgBySubCategory );




 //function declaration to return products detailed object related to the filter parameter category name, if exists, else return not found message
  function getProductsgBySubCategory(req, res, next) {
        productsController.getProductsgBySubCategory (req, next)
            .then(function(productsList) {
                //if exists, return data in json format
                if (productsList) {
                    res.status(HTTPStatus.OK);
                    res.json(productsList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProducts
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }


 productsRouter.route('/filtersubcategory/productscategorymy/:productsCategory')

        .get( getProductsSubCategoryByCategory );

  function getProductsSubCategoryByCategory(req, res, next) {
        productsController.getProductsSubCategoryByCategory (req, next)
            .then(function(productsList) {
                //if exists, return data in json format
                if (productsList) {
                    res.status(HTTPStatus.OK);
                    res.json(productsList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProducts
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }





/*---------------------------------------------------------------------------------------------------------*/

    //function declaration to return products list to the client if exists else return not found message
    function getAllProducts(req, res, next) {
        productsController.getAllProducts(req, next)
            .then(function(productsList){
                //if exists, return data in json format
                if (productsList) {
                    res.status(HTTPStatus.OK);
                    res.json(productsList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProducts
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }


    //function declaration to return products category list to the client if exists else return not found message
    function getAllProductsCategory(req, res, next) {
        productsController.getAllProductsCategory (req)
            .then(function(productsCategoryList){
                //if exists, return data in json format
                if (productsCategoryList) {
                    res.status(HTTPStatus.OK);
                    res.json(productsCategoryList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProductsCategory
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }


     //function declaration to return products subcategory list to the client if exists else return not found message
    function getAllProductsSubCategory(req, res, next) {
        productsController.getAllProductsSubCategory (req)
            .then(function(productsSubCategoryList){
                //if exists, return data in json format
                if (productsSubCategoryList) {
                    res.status(HTTPStatus.OK);
                    res.json(productsSubCategoryList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProductsSubCategory
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }



    //function declaration to return products related image list to the client if exists else return not found message
    function getAllProductsImagesByProductsID(req, res, next) {
        console.log(req.params.productsId);
        productsController.getAllProductsImagesByProductsID (req)
            .then(function(productsImageList){
                //if exists, return data in json format
                if (productsImageList) {
                    res.status(HTTPStatus.OK);
                    res.json(productsImageList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProductsImage
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }


    //function declaration to return products detail object to the client if exists else return not found message
    function getProductsDetailByTitleSlog(req, res, next) {
        productsController.getProductsDetailByTitleSlog (req)
            .then(function(productsObj){
                //if exists, return data in json format
                if (productsObj) {
                    res.status(HTTPStatus.OK);
                    res.json(productsObj);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.products.notFoundProducts
                    });
                }
            })
            .catch(function(err){
                return next(err);
            });
    }

    return productsRouter;

})();

module.exports = productsRoutes;
