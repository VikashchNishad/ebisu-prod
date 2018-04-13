/**
* @Date:   2017-02-20T16:24:36+05:30
* @Last modified time: 2017-03-14T11:45:45+05:30
*/



/**
 * Created by lakhe on 4/27/16.
 */

(function () {

    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var productsCategorySchema = new Schema({
        categoryName: {
            type:String,
            trim: true,
            required: true
        },
        categoryDescription: {
            type:String,
            trim: true
        },
         image:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductsCategoryImage'
        }],
        sourceurl:{
          type:String,
          trim:true
        },
        urlSlogCategory : {
            type:String,
            trim: true
        },
        active: {
            type:Boolean,
            default:true
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type:String,
            trim: true
        },
        updatedOn: {
            type: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type:String,
            trim: true
        },
        deletedOn: {
            type: Date
        }
    });


      var productsSubCategorySchema = new Schema({
        subCategoryName: {
            type:String,
            trim: true,
            required: true
        },
        subCategoryDescription: {
            type:String,
            trim: true
        },
        categoryID: {
            type: String,
            trim: true,
            required: true
        },
        sourceurl:{
          type:String,
          trim:true
        },
        urlSlogSubCategory : {
            type:String,
            trim: true
        },
        active: {
            type:Boolean,
            default:true
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type:String,
            trim: true
        },
        updatedOn: {
            type: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type:String,
            trim: true
        },
        deletedOn: {
            type: Date
        }
    });



    var productsSchema = new Schema({
        productsTitle: {
            type: String,
            required: true,
            trim: true
        },
        productsModel: {
            type: String,
            required: true,
            trim: true
        },
        urlSlog: {
            type: String,
            trim: true
        },
        categoryID: {
            type: String,
            trim: true,
            required: true
        },
        subCategoryID: {
            type: String,
            trim: true,
            required: true
        },
        productsSummary: {
            type: String,
            trim: true
        },
        productsDescription: {
            type: String,
            required: true,
            trim: true
        },
        productsAuthor: {
            type: String,
            trim: true
        },
        productsMobileImage: {
            type: String,
        },
        chooseYourOption: {
            type: String,
            trim: true
        },
        productsDate: {
            type: Date,
            trim: true,
            required: true,
            default: Date.now
        },
        image:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductsImage'
        }],
        pageViews: {
            type: Number,
            default: 0,
            trim: true
        },
        active: {
            type:Boolean,
            default:true
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type:String,
            trim: true
        },
        updatedOn: {
            type: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type:String,
            trim: true
        },
        deletedOn: {
            type: Date
        },
        variants: Array
		
    });

    var imageSchema = new Schema({
        imageName: {
            type:String,
            trim: true
        },
        imageTitle: {
            type:String,
            trim: true
        },
        imageAltText: {
            type:String,
            trim: true
        },
        coverImage: {
            type:Boolean,
            default:false
        },
        imageProperties: {
            imageExtension: {
                type:String,
                trim: true
            },
            imagePath: {
                type:String,
                trim: true
            }
        },
        active: {
            type:Boolean,
            default:true
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type:String,
            trim: true
        },
        updatedOn: {
            type: Date
        }
    });


    module.exports = {
        ProductsCategory : mongoose.model('ProductsCategory', productsCategorySchema, 'ProductsCategory'),
        ProductsSubCategory : mongoose.model('ProductsSubCategory', productsSubCategorySchema, 'ProductsSubCategory'),

        ProductsImage : mongoose.model('ProductsImage', imageSchema, 'ProductsImage'),
        ProductsCategoryImage : mongoose.model('ProductsCategoryImage', imageSchema, 'ProductsCategoryImage'),

        Products : mongoose.model('Products', productsSchema, 'Products')
    };

})();
