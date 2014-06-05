/**
 * @module     berryTree
 * @desc       Controls the berry tree rendering and form behavior
 * @author     cemckinley <cemckinley@gmail.com>
 * @copyright  Copyright (c) 2013 Cara McKinley
 */

var mathUtil = require('../utils/math');


var berryTree = {

	/* PUBLIC PROPERTIES */

	canvas: null,
	ctx: null,
	cWidth: null,
	cHeight: null,

	// plant drawing options
	options: {
		avgSegments: 32,
		segmentVariability: 2, // max number possible + or - branch segments
		maxBranches: 2,
		startLineWidth: 14,
		startingBranchProbability: 0.6, // a decimal between 0-1 to indicate probability of another branch starting from the same point
		branchProbabilityReductionRate: 0.92, // how fast the probability reduces toward the end of a branch
		leafLength: 20
	},

	// cached dom references
	ui: {
		avgSegments: null,
		segmentVariability: null,
		maxBranches: null,
		startLineWidth: null,
		startingBranchProbability: null,
		branchProbabilityReductionRate: null
	},


	/* PRIVATE PROPERTIES */


	/* PUBLIC METHODS */

	/**
	 * Initializes the application
	 */
	initialize: function () {

		this._setupCanvas();
		this._addUIElements();
		this._setOptions();

		this._addEventHandlers();

		this.draw();
	},

	/**
	 * Draw the plant (kick off a series of recursive function calls)
	 */
	draw: function(){
		// recursive function for branching
		this._createBranch( this.options.avgSegments, 0, this.options.startingBranchProbability, this.options.leafLength );
	},


	/* PRIVATE METHODS */

	/**
	 * Set canvas references and assign default draw styles
	 */
	_setupCanvas: function(){

		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.cWidth = this.canvas.width;
		this.cHeight = this.canvas.height;

		this.ctx.fillStyle = 'white';
		this.ctx.strokeStyle = 'white';
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
		this.ctx.lineWidth = this.options.startLineWidth;
		this.ctx.translate(this.cWidth/2, this.cHeight);
	},

	/**
	 * Add cached dom references to elements that will be referenced
	 */
	_addUIElements: function(){
		this.ui.avgSegments = document.getElementById('avgSegments');
		this.ui.segmentVariability = document.getElementById('segmentVariability');
		this.ui.maxBranches = document.getElementById('maxBranches');
		this.ui.startLineWidth = document.getElementById('startLineWidth');
		this.ui.startingBranchProbability = document.getElementById('startingBranchProbability');
		this.ui.branchProbabilityReductionRate = document.getElementById('branchProbabilityReductionRate');
	},

	_addEventHandlers: function(){
		document.getElementById( 'regenerateTree' ).addEventListener( 'click', this._onRegenerateClick.bind(this) );
	},

	/**
	 * Set plant draw options based on contents of form fields
	 */
	_setOptions: function(){
		this.options.avgSegments = parseInt(this.ui.avgSegments.value);
		this.options.segmentVariability = parseInt(this.ui.segmentVariability.value);
		this.options.maxBranches = parseInt(this.ui.maxBranches.value);
		this.options.startLineWidth = parseInt(this.ui.startLineWidth.value);
		this.options.startingBranchProbability = parseFloat(this.ui.startingBranchProbability.value);
		this.options.branchProbabilityReductionRate = parseFloat(this.ui.branchProbabilityReductionRate.value);
	},

	/**
	 * Clear everything from the canvas and reset styles
	 */
	_resetCanvas: function(){
		this.ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		this.ctx.clearRect( 0, 0, this.cWidth, this.cHeight);
		this.ctx.translate( this.cWidth/2, this.cHeight );
		this.ctx.lineWidth = this.options.startLineWidth;
	},

	/**
	 * Draw a branch(es) as a series of segments which may recursively spawn a child branch
	 * @param  {Number} segments          Number of segments the branch has
	 * @param  {Number} branches          Number of branches being created at this joint
	 * @param  {Number} branchProbability Probability of creating another branch
	 * @param  {Number} berrySize         Diameter of the berry, at 100% canvas scale
	 */
	_createBranch: function(segments, branches, branchProbability, leafLength){
		var segmentVariation = mathUtil.getRandomNumInRange(0, this.options.segmentVariability, true),
			segmentLength = mathUtil.getRandomNumInRange(-75, -55, false);

		this.ctx.save();
		this.ctx.rotate( mathUtil.getRandomAngle( 0, 25, true ) );
		this.ctx.beginPath();
		this.ctx.lineTo( 0, 0);
		this.ctx.lineTo( 0, segmentLength );
		this.ctx.translate( 0, segmentLength);
		this.ctx.stroke();

		// berries
		if( segments <= this.options.avgSegments / 1.7 ){ // only add berries on upper portion of branches
			this._drawLeaves(segmentLength, leafLength);
		}

		segments--;
		if( segments + segmentVariation > 0 ){ // recursively call next branch segment
			this.ctx.scale(0.9, 0.9); // scale each subsequent segment to 90% via scaling the canvas before drawing
			// next will branch randomly within maxBranch number of times. Leaf length needs to incrementally increase to compensate for segment size shrink
			this._createBranch( segments, this.options.maxBranches, branchProbability * this.options.branchProbabilityReductionRate, leafLength*1.07 );
		}

		this.ctx.restore();

		branches--;
		if(branches > 0 && Math.random() <= branchProbability){ // start another branch from last saved coordinate
			this._createBranch( segments, branches, branchProbability, leafLength );
		}
	},

	/**
	 * Somewhat complex maths for drawing leaves on the branches, apologies for the magic numbers
	 * @param  {[type]} segmentLength [description]
	 * @param  {[type]} leafLength    [description]
	 * @return {[type]}               [description]
	 */
	_drawLeaves: function(segmentLength, leafLength){
		var berryCount = Math.random() * this.options.maxBerriesPerSegment,
			posX = mathUtil.getRandomNumInRange( this.options.startLineWidth + 10, this.options.startLineWidth + 20, true ), // random X position just outside of the segment on either side
			posY = mathUtil.getRandomNumInRange( 0, segmentLength, false ), // random Y position along length of segment
			xMult = posX > 0 ? 1 : -1, // gives us the direction the leaf is facing, for drawing bezier curves
			bezVariant = leafLength / 2; // offset of the control points, at nice right angles

		// stem
		this.ctx.lineWidth = 3;
		this.ctx.beginPath();
		this.ctx.moveTo(0, posY + 20); // angle stem upward by adding a bit of value
		this.ctx.lineTo(posX, posY);
		this.ctx.stroke();
		this.ctx.lineWidth = this.options.startLineWidth;

		// leaf
		this.ctx.beginPath();
		this.ctx.moveTo(posX, posY);
		this.ctx.bezierCurveTo(posX, posY - bezVariant, posX + (bezVariant * xMult), posY - leafLength, posX + (leafLength * xMult), posY - leafLength );
		this.ctx.bezierCurveTo(posX + (leafLength * xMult), posY - bezVariant, posX + (bezVariant * xMult), posY, posX, posY );
		this.ctx.fill();
	},


	/* EVENT HANDLERS */

	_onRegenerateClick: function(event){
		event.preventDefault();

		this._setOptions();
		this._resetCanvas();
		this.draw();
	}
};


module.exports = berryTree;

