/**
* @Date:   2017-02-20T16:24:34+05:30
* @Last modified time: 2017-03-14T11:45:51+05:30
*/

/**
 * Created by lakhe on 4/27/16.
 */

var productsController = (function () {

    'use strict';

    var cloudinary = require('cloudinary'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        dataProviderHelper = require('../data/mongo.provider.helper'),
        productsModel = require('../models/products.server.model'),
        Products = productsModel.Products,
        ProductsCategoryImage = productsModel.ProductsCategoryImage,
        ProductsImage = productsModel.ProductsImage,
        ProductsCategory = productsModel.ProductsCategory,
        ProductsSubCategory = productsModel.ProductsSubCategory,
        cloudinaryHelper = require('../helpers/cloudinary.helper'),
        utilityHelper = require('../helpers/utilities.helper'),
        errorHelper = require('../helpers/error.helper'),
        Promise = require("bluebird");

    var documentFieldsProducts = '_id productsTitle  productsModel urlSlog categoryID subCategoryID productsSummary productsDescription productsAuthor productsMobileImage chooseYourOption productsDate pageViews active image addedOn variants';
    var populationFields = '_id imageName imageTitle imageAltText coverImage active';
    var documentFieldsCategory = '_id categoryName categoryDescription sourceurl urlSlogCategory active image';
    var documentFieldsSubCategory = '_id subCategoryName subCategoryDescription categoryID sourceurl urlSlogSubCategory active';


    function ProductsModule() {}

    ProductsModule.CreateProductsCategory = function (productsCategoryObj, loggedInUser, imageInfo, _slogVal) {

        var productsCategoryInfo = new ProductsCategory();
        productsCategoryInfo.categoryName = productsCategoryObj.categoryName;
        productsCategoryInfo.categoryDescription = productsCategoryObj.categoryDescription;
        productsCategoryInfo.urlSlogCategory = _slogVal;
        productsCategoryInfo.active = productsCategoryObj.active;
        productsCategoryInfo.addedBy = loggedInUser;
        productsCategoryInfo.image = imageInfo._id;
        productsCategoryInfo.addedOn = new Date();
        return productsCategoryInfo;
    };

    ProductsModule.CreateProductsSubCategory = function (productsSubCategoryObj, loggedInUser, _slogVal) {
        var productsSubCategoryInfo = new ProductsSubCategory();
        productsSubCategoryInfo.subCategoryName = productsSubCategoryObj.subCategoryName;
        productsSubCategoryInfo.categoryID = productsSubCategoryObj.categoryID;
        productsSubCategoryInfo.subCategoryDescription = productsSubCategoryObj.subCategoryDescription;
        productsSubCategoryInfo.urlSlogSubCategory = _slogVal;
        productsSubCategoryInfo.active = productsSubCategoryObj.active;
        productsSubCategoryInfo.addedBy = loggedInUser;
        productsSubCategoryInfo.addedOn = new Date();
        return productsSubCategoryInfo;
    };
    
    ProductsModule.CreateProducts = function (productsObj, productsVariants, modelHtmlObj, loggedInUser, imageInfo, _slogVal) {

        var productsInfo = new Products();
        productsInfo.productsTitle = productsObj.productsTitle;
        productsInfo.productsModel = productsObj.productsModel;
        productsInfo.urlSlog = _slogVal;
        productsInfo.categoryID = productsObj.categoryID;
        productsInfo.subCategoryID = productsObj.subCategoryID;
        productsInfo.productsSummary = productsObj.productsSummary;

        productsInfo.variants = productsVariants.concat();

        productsInfo.productsDescription = modelHtmlObj.productsDescription;
        productsInfo.productsAuthor = productsObj.productsAuthor;
        productsInfo.productsMobileImage = productsObj.productsMobileImage;
        productsInfo.chooseYourOption = productsObj.chooseYourOption;
        
        productsInfo.productsDate = ((productsObj.productsDate === "") ? new Date() : productsObj.productsDate);
        productsInfo.image = imageInfo._id;
        productsInfo.pageViews = 0;
        productsInfo.active = productsObj.active;
        productsInfo.addedBy = loggedInUser;
        productsInfo.addedOn = new Date();
        return productsInfo;
    };


    ProductsModule.CreateProductsCategoryImage = function (productsCategoryImageObj, loggedInUser, imageInfo, coverImage, activeStatus) {
        
        var ProductsCategoryImageInfo = new ProductsCategoryImage();
        ProductsCategoryImageInfo.imageName = imageInfo._imageName;
        ProductsCategoryImageInfo.imageTitle = productsCategoryImageObj.imageTitle;
        ProductsCategoryImageInfo.imageAltText = productsCategoryImageObj.imageAltText;
        ProductsCategoryImageInfo.coverImage = coverImage;
        ProductsCategoryImageInfo.imageProperties = {
            imageExtension: imageInfo._imageExtension,
            imagePath: imageInfo._imagePath
        };
        ProductsCategoryImageInfo.active = activeStatus;
        ProductsCategoryImageInfo.addedBy = loggedInUser;
        ProductsCategoryImageInfo.addedOn = new Date();

        return ProductsCategoryImageInfo;
    };

    ProductsModule.CreateProductsImage = function (productsImageObj, loggedInUser, imageInfo, coverImage, activeStatus) {
		
        var productsImageInfo = new ProductsImage();
        productsImageInfo.imageName = imageInfo._imageName;
        productsImageInfo.imageTitle = productsImageObj.imageTitle;
        productsImageInfo.imageAltText = productsImageObj.imageAltText;
        productsImageInfo.coverImage = coverImage;
        productsImageInfo.imageProperties = {
            imageExtension: imageInfo._imageExtension,
            imagePath: imageInfo._imagePath
        };
        productsImageInfo.active = activeStatus;
        productsImageInfo.addedBy = loggedInUser;
        productsImageInfo.addedOn = new Date();

        return productsImageInfo;
    };

    var _p = ProductsModule.prototype;

    _p.checkValidationErrors = function (req) {
        req.checkBody('productsTitle', messageConfig.products.validationErrMessage.productsTitle).notEmpty();
        req.checkBody('productsModel', messageConfig.products.validationErrMessage.productsModel).notEmpty();

        req.checkBody('categoryID', messageConfig.products.validationErrMessage.categoryID).notEmpty();
        req.checkBody('subCategoryID', messageConfig.products.validationErrMessage.subCategoryID).notEmpty();

        req.checkBody('productsDescription', messageConfig.products.validationErrMessage.productsDescription).notEmpty();
        req.checkBody('productsDate', messageConfig.products.validationErrMessage.productsDate).notEmpty();
        if (req.body.productsDate) {
            req.checkBody('productsDate', messageConfig.products.validationErrMessage.productsDateValid).isDate();
        }
        return req.validationErrors();
    };

    _p.getAllProductsCategory = function (req) {
        var query = {};
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;
        var sortField = {
            addedOn: -1
        };
        //console.log(NewsCategory);
        //console.log(query);
        //console.log(sortField);
        return dataProviderHelper.getAllWithDocumentFieldsNoPagination(ProductsCategory, query, documentFieldsCategory, sortField);
    };


   _p.getAllProductsSubCategory = function (req) {
        var query = {};
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;
        var sortField = {
            addedOn: -1
        };
        //console.log(NewsCategory);
        //console.log(query);

        //console.log(sortField);
        return dataProviderHelper.getAllWithDocumentFieldsNoPagination(ProductsSubCategory, query, documentFieldsSubCategory, sortField);
    };



    _p.getProductsCategoryInfoByID = function (req) {

        var query = {
            '_id': req.params.productsCategoryId
        };
        var populationQueryOpts = { coverImage: true };
        var sortOpts = { addedOn: -1 };
        var populationSelectFields = populationFields + ' imageProperties';
        var populationPath = 'image';
         
        return dataProviderHelper.getByIdWithPopulation(ProductsCategory, query, populationPath, populationQueryOpts, sortOpts, populationSelectFields, documentFieldsCategory);

        // return dataProviderHelper.findById(ProductsCategory, req.params.productsCategoryId, documentFieldsCategory);
    };

    _p.getProductsSubCategoryInfoByID = function (req) {
        console.log(req.params.productsSubCategoryId);
        return dataProviderHelper.findById(ProductsSubCategory, req.params.productsSubCategoryId, documentFieldsSubCategory);
    };

    _p.patchProductsCategory = function (req, res, next) {
        req.productsCategoryInfo.deleted = true;
        req.productsCategoryInfo.deletedOn = new Date();
        req.productsCategoryInfo.deletedBy = req.decoded.user.username;

        dataProviderHelper.save(req.productsCategoryInfo)
            .then(function () {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.products.deleteMessageProductsCategory
                });
            })
            .catch(function (err) {
                return next(err);
            });
    };

     _p.patchProductsSubCategory = function (req, res, next) {
        req.productsSubCategoryInfo.deleted = true;
        req.productsSubCategoryInfo.deletedOn = new Date();
        req.productsSubCategoryInfo.deletedBy = req.decoded.user.username;

        dataProviderHelper.save(req.productsSubCategoryInfo)
            .then(function () {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.products.deleteMessageProductsSubCategory
                });
            })
            .catch(function (err) {
                return next(err);
            });
    };


    _p.postProductsCategory = function (req, res, next) {
        req.body = JSON.parse(req.body.data);
        if (req.body.categoryName) {

            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            var _slogVal = utilityHelper.getCleanURL(modelInfo.categoryName, next);
            query.urlSlogCategory = _slogVal;
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(ProductsCategory, query)
                .then(function (count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.products.alreadyExistsCategory + '"}');
                    } else {
                        var imageInfo = utilityHelper.getFileInfo(req, null, next);
                        modelInfo.imageTitle = modelInfo.categoryName;
                        modelInfo.imageAltText = modelInfo.categoryName;
                        var image = ProductsModule.CreateProductsCategoryImage(modelInfo, req.decoded.user.username, imageInfo, true, true);   
                        var productsCategoryInfo = ProductsModule.CreateProductsCategory(modelInfo, req.decoded.user.username, image, _slogVal);
                        // return dataProviderHelper.save(productsCategoryInfo);
                        return [image, dataProviderHelper.save(productsCategoryInfo)];
                    }
                }).spread(function (image) {
                    if (image.imageName !== "") {
                        return dataProviderHelper.save(image);
                    }
                    else {
                        return Promise.resolve();
                    }
                })
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.products.saveMessageProductsCategory
                    });
                })
                .catch(Promise.CancellationError, function (cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function (err) {
                    return next(err);
                });
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.products.fieldRequiredProductsCategory
            });
        }
    };

    _p.postProductsSubCategory = function (req, res, next) {
        if (req.body.subCategoryName) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            var _slogVal = utilityHelper.getCleanURL(modelInfo.subCategoryName, next);
            query.urlSlogSubCategory = _slogVal;
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(ProductsSubCategory, query)
                .then(function (count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.products.alreadyExistsSubCategory + '"}');
                    } else {
                        var productsSubCategoryInfo = ProductsModule.CreateProductsSubCategory(modelInfo, req.decoded.user.username, _slogVal);
                        return dataProviderHelper.save(productsSubCategoryInfo);
                    }
                })
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.products.saveMessageProductsSubCategory
                    });
                })
                .catch(Promise.CancellationError, function (cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function (err) {
                    return next(err);
                });
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.products.fieldRequiredProductsSubCategory
            });
        }
    };

   
    _p.updateProductsCategory = function (req, res, next) {
        
        req.body = JSON.parse(req.body.data);


        if (req.body.categoryName) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var _slogVal = utilityHelper.getCleanURL(modelInfo.categoryName, next);

            //Check if the previously saved clean url matches with the current clean url or not, if matches, then no need to check for duplicacy
            if (req.productsCategoryInfo.urlSlogCategory !== _slogVal) {

                var query = {};
                // For checking duplicate entry
                //matches anything that exactly matches the products category title, case  insensitive
                query.categoryName = {$regex: new RegExp('^' + modelInfo.categoryName + '$', "i")};
                query.deleted = false;

                dataProviderHelper.checkForDuplicateEntry(ProductsCategory, query)
                    .then(function (count) {
                        if (count > 0) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.products.alreadyExistsCategory + '"}');
                        } else {
                            return _p.updateProductsCategoryFunc(req, res, modelInfo, _slogVal, next);
                        }
                    }).then(function () {
                        if (req.productsCategoryInfo.image.length > 0) {
                            return dataProviderHelper.save(req.productsCategoryInfo.image[0]);
                        } else {
                            return Promise.resolve();
                        }
                    })
                    .then(function () {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.products.updateMessageProductsCategory
                        });
                    })
                    .catch(Promise.CancellationError, function (cancellationErr) {
                        errorHelper.customErrorResponse(res, cancellationErr, next);
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            } else {
                _p.updateProductsCategoryFunc(req, res, modelInfo, _slogVal, next)
                    .then(function () {
                        if (req.productsCategoryInfo.image.length > 0) {
                            return dataProviderHelper.save(req.productsCategoryInfo.image[0]);
                        } else {
                            return Promise.resolve();
                        }
                    })
                    .then(function () {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.products.updateMessageProductsCategory
                        });
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            }
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.products.fieldRequiredProductsCategory
            });
        }
    };

    _p.updateProductsCategoryFunc = function (req, res, modelInfo, _slogVal, next) {
   
        var imageInfo = utilityHelper.getFileInfo(req, req.productsCategoryInfo.image[0], next);  

        req.productsCategoryInfo.categoryName = modelInfo.categoryName;
        req.productsCategoryInfo.categoryDescription = modelInfo.categoryDescription;
        req.productsCategoryInfo.urlSlogCategory = _slogVal;
        req.productsCategoryInfo.active = modelInfo.active;
        req.productsCategoryInfo.updatedBy = req.decoded.user.username;
        req.productsCategoryInfo.updatedOn = new Date();
         
         if (req.productsCategoryInfo.image.length > 0) {
            req.productsCategoryInfo.image[0].imageTitle = modelInfo.productsTitle;
            req.productsCategoryInfo.image[0].imageAltText = modelInfo.productsTitle;

            req.productsCategoryInfo.image[0].imageName = imageInfo._imageName;
            req.productsCategoryInfo.image[0].imageProperties.imageExtension = imageInfo._imageExtension;
            req.productsCategoryInfo.image[0].imageProperties.imagePath = imageInfo._imagePath;

            req.productsCategoryInfo.image[0].updatedBy = req.decoded.user.username;
            req.productsCategoryInfo.image[0].updatedOn = new Date();
        } else {
            var imageDataObj = new ProductsCategoryImage({
                imageTitle: modelInfo.productsTitle,
                imageAltText: modelInfo.productsTitle,
                imageName: imageInfo._imageName,
                imageProperties: {
                    imageExtension: imageInfo._imageExtension,
                    imagePath: imageInfo._imagePath
                },
                coverImage: true,
                active: true,
                updatedBy: req.decoded.user.username,
                updatedOn: new Date()
            });

            req.productsCategoryInfo.image.push(imageDataObj);
        }

        return dataProviderHelper.save(req.productsCategoryInfo);
    };


    _p.updateProductsSubCategory = function (req, res, next) {

        if (req.body.subCategoryName) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var _slogVal = utilityHelper.getCleanURL(modelInfo.subCategoryName, next);

            //Check if the previously saved clean url matches with the current clean url or not, if matches, then no need to check for duplicacy
            if (req.productsSubCategoryInfo.urlSlogCategory !== _slogVal) {

                var query = {};
                // For checking duplicate entry
                //matches anything that exactly matches the products category title, case  insensitive
                query.subCategoryName = {$regex: new RegExp('^' + modelInfo.subCategoryName + '$', "i")};
                query.deleted = false;

                dataProviderHelper.checkForDuplicateEntry(ProductsSubCategory, query)
                    .then(function (count) {
                        if (count > 0) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.products.alreadyExistsCategory + '"}');
                        } else {
                            return _p.updateProductsSubCategoryFunc(req, res, modelInfo, _slogVal);
                        }
                    })
                    .then(function () {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.products.updateMessageProductsSubCategory
                        });
                    })
                    .catch(Promise.CancellationError, function (cancellationErr) {
                        errorHelper.customErrorResponse(res, cancellationErr, next);
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            } else {
                _p.updateProductsSubCategoryFunc(req, res, modelInfo, _slogVal)
                    .then(function () {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.products.updateMessageProductsSubCategory
                        });
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            }
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.products.fieldRequiredProductsSubCategory
            });
        }
    };

    _p.updateProductsSubCategoryFunc = function (req, res, modelInfo, _slogVal) {
        req.productsSubCategoryInfo.subCategoryName = modelInfo.subCategoryName;
        req.productsSubCategoryInfo.subCategoryDescription = modelInfo.subCategoryDescription;
        req.productsSubCategoryInfo.categoryID = modelInfo.categoryID;
        req.productsSubCategoryInfo.urlSlogSubCategory = _slogVal;
        req.productsSubCategoryInfo.active = modelInfo.active;
        req.productsSubCategoryInfo.updatedBy = req.decoded.user.username;
        req.productsSubCategoryInfo.updatedOn = new Date();
        return dataProviderHelper.save(req.productsSubCategoryInfo);
    };




 _p.getProductsCategoryImageInfoByImageID = function (req) {
        var productsCategoryImageSelectFields = populationFields + ' imageProperties';
        return dataProviderHelper.findById(ProductsCategoryImage, req.params.imageId, productsCategoryImageSelectFields);
    };







/*---------------------------------------Products Controllers-----------------------------------------------------------------------*/

    _p.getAllProducts = function (req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {};
        // matches anything that  starts with the inputted products title, case insensitive
        if (req.query.productstitle) {
            query.productsTitle = {$regex: new RegExp('.*' + req.query.productstitle, "i")};
        }
        if (req.query.active) {
            query.active = true;
        }
        if (req.query.categoryid) {
            query.categoryID = req.query.categoryid;
        }
        if (req.query.subcategoryid) {
            query.subCategoryID = req.query.subcategoryid;
        }
        query.deleted = false;
        var populationQueryOpts = { coverImage: true };
        var populationPath = 'image';

        var productsImageSelectFields = populationFields + ' imageProperties';

        return dataProviderHelper.getAllWithFieldsPaginationPopulation(Products, query, pagerOpts, documentFieldsProducts, populationPath, productsImageSelectFields, populationQueryOpts);
    };


    _p.getProductsByID = function (req) {
        var query = {
            '_id': req.params.productsId
        };
        var populationQueryOpts = { coverImage: true };
        var sortOpts = { addedOn: -1 };
        var populationSelectFields = populationFields + ' imageProperties';
        var populationPath = 'image';
        return dataProviderHelper.getByIdWithPopulation(Products, query, populationPath, populationQueryOpts, sortOpts, populationSelectFields, documentFieldsProducts);
    };

    _p.patchProducts = function (req, res, next) {
        req.productsInfo.deleted = true;
        req.productsInfo.deletedOn = new Date();
        req.productsInfo.deletedBy = req.decoded.user.username;
        dataProviderHelper.save(req.productsInfo)
            .then(function () {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.products.deleteMessageProducts
                });
            })
            .catch(function (err) {
                return next(err);
            });
    };

    _p.postProducts = function (req, res, next) {
        req.body = JSON.parse(req.body.data);
        // var errors = _p.checkValidationErrors(req);
        // if (errors) {
            // res.status(HTTPStatus.BAD_REQUEST);
            // res.json({
                // message: errors
            // });
        // } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            var _slogVal = utilityHelper.getCleanURL(modelInfo.productsTitle, next);
            query.urlSlog = _slogVal;
            var currentDate = new Date();
            var startDate = currentDate.setHours(0, 0, 0, 0);
            var endDate = currentDate.setHours(23, 59, 59, 999);
            query.addedOn = {
                $gt: startDate,
                $lt: endDate
            };
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(Products, query)
                .then(function (count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.products.alreadyExistsProducts + '"}');
                    } else {
                        var contentInfo = {};
                        contentInfo.productsDescription = req.body.productsDescription;
                        var modelHtmlInfo = utilityHelper.sanitizeUserHtmlBodyInput(contentInfo, next);

                        var imageInfo = utilityHelper.getFileInfo(req, null, next);
                        modelInfo.imageTitle = modelInfo.productsTitle;
                        modelInfo.imageAltText = modelInfo.productsTitle;
                        var image = ProductsModule.CreateProductsImage(modelInfo, req.decoded.user.username, imageInfo, true, true);
                        var productsInfo = ProductsModule.CreateProducts(modelInfo, req.body.variants, modelHtmlInfo, req.decoded.user.username, image, _slogVal);                        
                        return [image, dataProviderHelper.save(productsInfo)];
                    }
                })
                .spread(function (image) {
                    if (image.imageName !== "") {
                        return dataProviderHelper.save(image);
                    }
                    else {
                        return Promise.resolve();
                    }
                })
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.products.saveMessageProducts
                    });
                })
                .catch(Promise.CancellationError, function (cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function (err) {
                    return next(err);
                });
        //}
    };


    _p.updateProducts = function (req, res, next) {
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkValidationErrors(req);
          console.log(req.body);

        if (errors) {

            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {

            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var _slogVal = utilityHelper.getCleanURL(modelInfo.productsTitle, next);

            if (req.productsInfo.urlSlog !== _slogVal) {
                
                var query = {};

                // For checking duplicate entry
                query.urlSlog = _slogVal;
                var currentDate = new Date();
                var startDate = currentDate.setHours(0, 0, 0, 0);
                var endDate = currentDate.setHours(23, 59, 59, 999);
                query.addedOn = {
                    $gt: startDate,
                    $lt: endDate
                };
                query.deleted = false;

                dataProviderHelper.checkForDuplicateEntry(Products, query)
                    .then(function (count) {
                        if (count > 0) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.products.alreadyExistsProducts + '"}');
                        } else {
                            return _p.updateProductsFunc(req, res, modelInfo, req.body.variants, _slogVal, next);
                        }
                    })
                    .then(function () {
                        if (req.productsInfo.image.length > 0) {
                            return dataProviderHelper.save(req.productsInfo.image[0]);
                        } else {
                            return Promise.resolve();
                        }
                    })
                    .then(function () {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.products.updateMessageProducts
                        });
                    })
                    .catch(Promise.CancellationError, function (cancellationErr) {
                        errorHelper.customErrorResponse(res, cancellationErr, next);
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            } else {

                _p.updateProductsFunc(req, res, modelInfo, req.body.variants, _slogVal, next)
                    .then(function () {
                        
                        if (req.productsInfo.image.length > 0) {
                            return dataProviderHelper.save(req.productsInfo.image[0]);
                        } else {
                            return Promise.resolve();
                        }
                    })
                    .then(function () {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.products.updateMessageProducts
                        });
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            }
        }
    };

    _p.updateProductsFunc = function (req, res, modelInfo, productsVariants, _slogVal, next) {
          
        var imageInfo = utilityHelper.getFileInfo(req, req.productsInfo.image[0], next);
        var contentInfo = {};
        contentInfo.productsDescription = req.body.productsDescription;
        var modelHtmlInfo = utilityHelper.sanitizeUserHtmlBodyInput(contentInfo, next);


        req.productsInfo.productsTitle = modelInfo.productsTitle;
        req.productsInfo.productsModel = modelInfo.productsModel;
        
        req.productsInfo.variants = productsVariants.concat();

        req.productsInfo.urlSlog = _slogVal;
        req.productsInfo.categoryID = modelInfo.categoryID;
        req.productsInfo.subCategoryID = modelInfo.subCategoryID;
        req.productsInfo.productsSummary = modelInfo.productsSummary;
        req.productsInfo.productsDescription = modelHtmlInfo.productsDescription;
        req.productsInfo.productsAuthor = modelInfo.productsAuthor;
        req.productsInfo.productsMobileImage = modelInfo.productsMobileImage;
        req.productsInfo.chooseYourOption = modelInfo.chooseYourOption;

        req.productsInfo.productsDate = modelInfo.productsDate;
        req.productsInfo.active = modelInfo.active;
        req.productsInfo.updatedBy = req.decoded.user.username;
        req.productsInfo.updatedOn = new Date();

        if (req.productsInfo.image.length > 0) {
            req.productsInfo.image[0].imageTitle = modelInfo.productsTitle;
            req.productsInfo.image[0].imageAltText = modelInfo.productsTitle;

            req.productsInfo.image[0].imageName = imageInfo._imageName;
            req.productsInfo.image[0].imageProperties.imageExtension = imageInfo._imageExtension;
            req.productsInfo.image[0].imageProperties.imagePath = imageInfo._imagePath;

            req.productsInfo.image[0].updatedBy = req.decoded.user.username;
            req.productsInfo.image[0].updatedOn = new Date();
        } else {
            var imageDataObj = new ProductsImage({
                imageTitle: modelInfo.productsTitle,
                imageAltText: modelInfo.productsTitle,
                imageName: imageInfo._imageName,
                imageProperties: {
                    imageExtension: imageInfo._imageExtension,
                    imagePath: imageInfo._imagePath
                },
                coverImage: true,
                active: true,
                updatedBy: req.decoded.user.username,
                updatedOn: new Date()
            });

            req.productsInfo.image.push(imageDataObj);
        }

            
        return dataProviderHelper.save(req.productsInfo);
    };

    _p.getAllProductsImagesByProductsID = function (req) {
        var query = {};
        if (req.params.productsId) {
            query = {
                '_id': req.params.productsId
            };
        }
        query.deleted = false;

        //  To ignore the parent document and return only the embedded object, we have to exclude the _id from the query

        var excludeFields = '-_id -productsTitle -variants -productsModel -urlSlog -categoryID -subCategoryID -productsSummary -productsDescription -productsAuthor -productsMobileImage -chooseYourOption -pageViews -active -addedOn -productsDate -addedBy -updatedBy  -updatedOn -deleted -__v ';
        var populationQueryOpts = {};
        if (req.query.active) {
            query.active = req.query.active;
            populationQueryOpts.active = true;
        }
        var sortOpts = { addedOn: -1 };
        var populationPath = 'image';

        return dataProviderHelper.getByIdWithPopulation(Products, query, populationPath, populationQueryOpts, sortOpts, populationFields, excludeFields);
    };

    _p.getProductsImageInfoByImageID = function (req) {
        var productsImageSelectFields = populationFields + ' imageProperties';
        return dataProviderHelper.findById(ProductsImage, req.params.imageId, productsImageSelectFields);
    };

    _p.postProductsImageInfo = function (req, res, next) {
        req.body = JSON.parse(req.body.data);
        var imageInfo = utilityHelper.getFileInfo(req, null, next);
        if (imageInfo._imageName) {
            var newsId = '';
            if (req.params.productsId) {
                productsId = req.params.productsId;
            }
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var productsImageInfo = ProductsModule.CreateProductsImage(modelInfo, req.decoded.user.username, imageInfo, false, modelInfo.active);

            dataProviderHelper.save(productsImageInfo)
                .then(function () {
                    var pushSchema = {
                        'image': productsImageInfo._id
                    };
                    return dataProviderHelper.findByIdAndUpdate(Products, productsId, pushSchema);
                })
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.products.saveMessageProductsImage
                    });
                })
                .catch(function (err) {
                    return next(err);
                });
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.products.fieldRequiredProductsImage
            });
        }
    };


    _p.updateProductsImageInfo = function (req, res, next) {
        req.body = JSON.parse(req.body.data);
        var imageInfo = utilityHelper.getFileInfo(req, req.productsImageInfo, next),
            modelInfo = utilityHelper.sanitizeUserInput(req, next);

        if (imageInfo._imageName) {
            var productsImageSchema = {
                'imageTitle': modelInfo.imageTitle,
                'imageAltText': modelInfo.imageAltText,
                'active': modelInfo.active,
                'updatedBy': req.decoded.user.username,
                'updatedOn': new Date()
            };
            productsImageSchema.imageName = imageInfo._imageName;
            productsImageSchema.imageProperties = {
                imageExtension: imageInfo._imageExtension,
                imagePath: imageInfo._imagePath
            };
            var updateQueryOpts = {
                _id: req.params.imageId
            };

            var multiOpts = false;

            dataProviderHelper.updateModelData(ProductsImage, updateQueryOpts, productsImageSchema, multiOpts)
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.products.updateMessageNewsImage
                    });
                })
                .catch(function (err) {
                    return next(err);
                });
        }
        else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.products.fieldRequiredNewsImage
            });
        }
    };

    _p.updateCoverImage = function (req, res, next) {
        //For checking same id of the existing cover image id and image to be updated as cover image id
       //_id is the object id of the products image data which is to be set as cover image
        if (req.body._id !== req.productsImageInfo._id) {
            req.productsImageInfo.coverImage = false;
            dataProviderHelper.save(req.productsImageInfo)
                .then(function () {
                    var productsImageSchema = {
                        'coverImage': true
                    };
                    var updateQueryOpts = {
                        _id: req.body._id
                    };

                    var multiOpts = false;

                    return dataProviderHelper.updateModelData(ProductsImage, updateQueryOpts, productsImageSchema, multiOpts);
                })
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.products.updateCoverImage
                    });
                })
                .catch(function (err) {
                    return next(err);
                });
        } else {
            res.status(HTTPStatus.NOT_MODIFIED);
            res.end();
        }
    };

    _p.removeProductsImage = function (req, res, next) {
        if (req.productsImageInfo.coverImage === false) {

            var deleteQuqeryOpts = {
                '_id': req.params.imageId
            };

            dataProviderHelper.removeModelData(ProductsImage, deleteQuqeryOpts)
                .then(function () {

                    var multiOpts = false;

                    var queryOpts = {
                        _id: req.params.productsId
                    };

                    var updateOpts =  {
                        $pull: {
                            image: req.params.imageId
                        }
                    };

                   return dataProviderHelper.updateModelData(Products, queryOpts, updateOpts, multiOpts);
                })
                .then(function(){
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.products.deleteMessageNewsImage
                    });

                    return Promise.resolve();
                })
                .then(function () {
                    cloudinaryHelper.deleteImage(req.productsImageInfo.imageName, cloudinary, req, res, function (result) {

                    });
                })
                .catch(function (err) {
                    return next(err);
                });
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.products.coverImageWarning
            });

        }
    };

    _p.updateProductsCount = function (_newsId, _pageViews) {
        var queryOpts = {
            '_id': _productsId
        };
        var updateOpts = {
            'pageViews' : _pageViews
        }
        return dataProviderHelper.updateModelData(Products, queryOpts, updateOpts, false);
    };

    _p.getProductsDetailByTitleSlog = function (req, res, next) {
        var year = '';
        var month = '';
        var day = '';
        if (req.params.year) {
            year = req.params.year;
        }
        if (req.params.month) {
            month = req.params.month;
        }
        if (req.params.day) {
            day = req.params.day;
        }

        var query = {
            'active': true,
            'deleted': false,
            'urlSlog': req.params.titleSlog
        };

        var date = year + '-' + month + '-' + day;

        if (year && month && day) {
            var formattedDate = utilityHelper.getFormattedDate(new Date(date), "/", next);
            formattedDate = new Date(formattedDate);
            formattedDate = formattedDate.setHours(0, 0, 0, 0);

            var endOfDayDateTime = new Date(date);
            endOfDayDateTime = endOfDayDateTime.setHours(23, 59, 59, 999);
            query.addedOn = {$gt: formattedDate, $lt: endOfDayDateTime};
        }

        var sortOpts = {coverImage: -1};
        var populationQueryOpts = {active: true};
        var populationPath = 'image';

        return new Promise(function (resolve, reject) {
            dataProviderHelper.getAllWithFieldsPopulation(Products, query, documentFieldsProducts, populationPath, populationFields, populationQueryOpts, sortOpts)
                .then(function (newsList) {
                    var productsDataObj = {};
                    if (productsList.length > 0) {
                        productsDataObj = productsList[0];
                        var updatedCount = (parseInt(productsDataObj.pageViews) + 1);
                        newsDataObj.pageViews = updatedCount;
                        return [productsDataObj, _p.updateProductsCount(productsDataObj._id, updatedCount)];
                    }else{
                        resolve(null);
                    }
                })
                .spread(function(productsDataObj){
                    resolve(productsDataObj);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    };




_p.getProductsgByCategory = function(req, next){
        var category = '';
        if(req.params.productsCategory){
            category = req.params.productsCategory;
        }
        var categorySlog = utilityHelper.getCleanURL(category, next);
        var query={
            'deleted' : false,
            'active' : true
        };
        query.urlSlogCategory = categorySlog;
        return new Promise(function(resolve, reject) {
            dataProviderHelper.findOne(ProductsCategory, query, documentFieldsCategory)
                .then(function(categoryObj){
                    if(categoryObj){
                        req.query.categoryid = categoryObj._id;
                        req.query.active = true;
                        return _p.getAllProducts(req, next);
                    }else{
                        return [];
                    }
                })
                .then(function(productsList){
                    resolve(productsList);
                })
                .catch(function(err){
                    reject(err);
                });
        });
    };


    _p.getProductsgBySubCategory = function(req, next){
        var subcategory = '';
        if(req.params.productsSubCategory){
            subcategory = req.params.productsSubCategory;
        }
        var subCategorySlog = utilityHelper.getCleanURL(subcategory, next);
        var query={
            'deleted' : false,
            'active' : true
        };
        query.urlSlogSubCategory = subCategorySlog;
        return new Promise(function(resolve, reject) {
            dataProviderHelper.findOne(ProductsSubCategory, query, documentFieldsSubCategory)
                .then(function(subCategoryObj){
                    if(subCategoryObj){
                        req.query.subcategoryid = subCategoryObj._id;
                        req.query.active = true;
                        return _p.getAllProducts(req, next);
                    }else{
                        return [];
                    }
                })
                .then(function(productsList){
                    resolve(productsList);
                })
                .catch(function(err){
                    reject(err);
                });
        });
    };


_p.getProductsSubCategoryByCategory = function(req, next){
        var category = '';
        if(req.params.productsCategory){
            category = req.params.productsCategory;
        }
        var categorySlog = utilityHelper.getCleanURL(category, next);
        var query={
            'deleted' : false,
            'active' : true
        };
        query.urlSlogCategory = categorySlog;
        return new Promise(function(resolve, reject) {
            dataProviderHelper.findOne(ProductsCategory, query, documentFieldsCategory)
                .then(function(categoryObj){
                    if(categoryObj){
                        req.query.categoryid = categoryObj._id;
                        req.query.active = true;
                        return _p.getAllProductsSubCat(req, next);
                    }else{
                        return [];
                    }
                })
                .then(function(productsList){
                    resolve(productsList);
                })
                .catch(function(err){
                    reject(err);
                });
        });
    };


     _p.getAllProductsSubCat = function (req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {};
        // matches anything that  starts with the inputted products title, case insensitive
        
        if (req.query.active) {
            query.active = true;
        }
        if (req.query.categoryid) {
            query.categoryID = req.query.categoryid;
        }
        
        query.deleted = false;
            console.log(query);
            console.log('test');


        return dataProviderHelper.getAllWithFieldsPaginationPopulationMy(ProductsSubCategory, query, pagerOpts, documentFieldsSubCategory);
    };



    return {
        getAllProducts: _p.getAllProducts,
        getAllProductsCategory: _p.getAllProductsCategory,
        getAllProductsSubCategory: _p.getAllProductsSubCategory,
        getAllProductsImagesByProductsID: _p.getAllProductsImagesByProductsID,
        getProductsByID: _p.getProductsByID,
        getProductsCategoryInfoByID: _p.getProductsCategoryInfoByID,
        getProductsSubCategoryInfoByID: _p.getProductsSubCategoryInfoByID,
        getProductsDetailByTitleSlog: _p.getProductsDetailByTitleSlog,
        getProductsCategoryImageInfoByImageID: _p.getProductsCategoryImageInfoByImageID,
        getProductsImageInfoByImageID: _p.getProductsImageInfoByImageID,
        patchProducts: _p.patchProducts,
        patchProductsCategory: _p.patchProductsCategory,
        patchProductsSubCategory: _p.patchProductsSubCategory,
        postProducts: _p.postProducts,
        postProductsCategory: _p.postProductsCategory,
        postProductsSubCategory: _p.postProductsSubCategory,
        postProductsImageInfo: _p.postProductsImageInfo,
        removeProductsImage: _p.removeProductsImage,
        updateCoverImage: _p.updateCoverImage,
        updateProducts: _p.updateProducts,
        updateProductsCategory: _p.updateProductsCategory,
        updateProductsSubCategory: _p.updateProductsSubCategory,
        updateProductsImageInfo: _p.updateProductsImageInfo,
        getProductsgByCategory: _p.getProductsgByCategory,
        getProductsgBySubCategory: _p.getProductsgBySubCategory,
        getProductsSubCategoryByCategory: _p.getProductsSubCategoryByCategory,
        getAllProductsSubCat: _p.getAllProductsSubCat

    };

})();

module.exports = productsController;