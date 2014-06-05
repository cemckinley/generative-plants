/**
 * @module     Application
 * @desc       The application module defines our application
 * @author     cemckinley <cemckinley@gmail.com>
 * @copyright  Copyright (c) 2013 Cara McKinley
 */


var treeView = require('./views/tree.js');



var Application = {

	/* PRIVATE PROPERTIES */


	/* PUBLIC METHODS */

	/**
	 * Initializes the application
	 * @return {void}
	 */
	initialize: function () {

		treeView.initialize();

	},


	/* PRIVATE METHODS */


	/* EVENT HANDLERS */

};

module.exports = Application;