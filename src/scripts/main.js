/**
 * @module     main
 * @desc       Defines load sequence for main module
 * @author     cemckinley <cemckinley@gmail.com>
 * @copyright  Copyright (c) 2013 Cara McKinley
 */


/**
 * @requires modules/Application
 */
var $				= require('jquery');
var AppController	= require('./app.js');


$(function() {
	// Initialize Application
	AppController.initialize();

});



