/* jshint node: true */
'use strict';

var PIXI = require('pixi');
var RNG = require('util/RNG');
var Camera = require('Camera');
var MapData = require('map/MapData');
var MapRenderer = require('map/MapRenderer');

var Game = {

    init : function(domElement) {

        // set up global stuff
        this.rng = new RNG();

        this.map = new MapData(
            generateMapData(50,50)
        );

        this.mapRenderer = new MapRenderer(this.map);

        // display objects
        this.stage = new PIXI.Stage(0xDDDDDD, true);
        this.renderer = PIXI.autoDetectRenderer(800, 600);

        this.ui = new PIXI.DisplayObjectContainer();

        this.ui.interactive = true;

        this.camera = new Camera(480, 270, this.iso);
        this.camera.setZoom(2);

        this.stage.addChild(this.camera);
        this.stage.addChild(this.ui);

        this.boundLoop = this.loop.bind(this);

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

    loop : function(time) {

        requestAnimFrame(this.boundLoop);

        this.objects.children.sort(function (a, b) {

            var zA = a.position.x + a.position.y + (a.zIndex / 10),
                zB = b.position.x + b.position.y + (b.zIndex / 10);

            return zA - zB;
        });

        this.renderer.render(this.stage);
    }

};

module.exports = Game;