/* jshint node: true */
'use strict';

var PIXI = require('pixi');
var RNG = require('util/RNG');
var Camera = require('Camera');
var MapGenerator = require('map/MapGenerator');
var MapRenderer = require('map/MapRenderer');
var Player = require('Player');

var Game = {

    init : function(domElement) {

        // set up global stuff
        this.rng = new RNG();

        var generator = new MapGenerator();

        this.map = generator.generate(50,50);

        this.mapRenderer = new MapRenderer(this.map);

        this.player = new Player();

        // display objects
        this.stage = new PIXI.Stage(0xDDDDDD, true);
        this.renderer = PIXI.autoDetectRenderer(800, 600);

        this.ui = new PIXI.DisplayObjectContainer();
        this.ui.interactive = true;

        this.camera = new Camera(480, 270, this.mapRenderer);
        this.camera.setZoom(2);

        this.stage.addChild(this.camera);
        this.stage.addChild(this.ui);

        // bind loop
        this.loop = this._loop.bind(this);

        this.addToDom(domElement);
    },


    addToDom : function(element) {

        this.domElement = element;

        this.domElement.appendChild(this.renderer.view);

        // disable context menu
        this.domElement.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            return false;
        });
    },


    _loop : function(time) {

        requestAnimationFrame(this.loop);

        this.mapRenderer.sort();

        this.renderer.render(this.stage);
    }

};

module.exports = Game;