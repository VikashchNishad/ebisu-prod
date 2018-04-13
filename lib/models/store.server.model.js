/**
 * Created by lakhe on 4/14/16.
 */

(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var storeSchema = new Schema({
        storeName: {
            type: String,
            required: true,
            trim: true
        },
        
		addressLine1: {
            type: String,
            required: true,
            trim: true
        },
		addressLine2: {
            type: String,
            required: true,
            trim: true
        },
		storeArea: {
            type: String,
            required: true,
            trim: true
        },
		pincode: {
            type: String,
            required: true,
            trim: true
        },
        latitude: {
            type: String,
            required: true,
            trim: true
        },
		longitude: {
            type: String,
            required: true,
            trim: true
        },
        email:{
            type:String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(email) {
                    if(email){
                        return regex.emailRegex.test(email);
                    }else{
                        return true;
                    }
                },
                message: '{VALUE} is not a valid email address!'
            }
        },
        facebookURL: {
            type:String,
            trim: true
        },
        websiteURL: {
            type:String,
            trim: true
        },
        imageName: {
            type:String,
            trim: true
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

    module.exports = mongoose.model('Store', storeSchema, 'Store');

})();