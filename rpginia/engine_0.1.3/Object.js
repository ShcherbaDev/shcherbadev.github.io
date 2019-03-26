/**
 * Class for creating game objects. The game objects are inherit from it.
 * @memberof RPGinia.App.World
 * @class
 */
class Object {
    /**
     * @constructor
     * @param {Object} settings - game object settings.
     */
    constructor(settings) {
        /**
         * Object's settings.
         * @private
         */
        this._settings = settings;

        /** 
		 * App path from the prototype given from World class.
		 * @type {String}
		 * @private
		 */
        this._appPath = this.__proto__.appPath;

        /** 
         * Get a context object for drawing.
         * @type {Object}
         * @private
         */
        this._context = this.__proto__.context;

        /**
         * Camera class for moving camera.
         * @type {Object}
         * @private
         */
        this._camera = this.__proto__.camera || {
            x: 0,
            y: 0,
            rotateDeg: 0
        };

        /**
         * World class.
         * @private
         * @type {Object}
         */
        this._world = this.__proto__.world;
        
        // Setting up width and height for text
        if(this._settings.type === 'text') {
            this._context.font = `${this._settings.settings.size}px "${this._settings.settings.font}"`;

            if(!this._settings.coords[2])
			    this._settings.coords[2] = this._context.measureText(this._settings.settings.text).width;

            if(!this._settings.coords[3])
                this._settings.coords[3] = this._settings.settings.size;
        }


        // Setting up border coordinations.
        if(this._settings.borderCoords === undefined) {
            this._settings.borderCoords = [
                0, 
                0, 
                this._settings.coords[2], 
                this._settings.coords[3]
            ];
        }

        // Setting up central point coordinations
		if(this._settings.centralPointCoords === undefined) {
			this._settings.centralPointCoords = [
				this._settings.coords[2].toFixed(0)/2,
				this._settings.coords[3].toFixed(0)/2
            ];
        }
        
        // Setting up a 'layer' property to default value, if it's not defined.
		if(this._settings.layer === undefined) this._settings.layer = 1;

        // Setting up a 'isVisible' property to default value, if it's not defined.
        if(this._settings.isVisible === undefined) this._settings.isVisible = true;
    }

    /**
     * Method for drawing game objects.
     * @returns {Boolean} false
     */
    draw() { return false }

    /**
     * Drawing object borders and their central points. Works only if debug mode in World class is turned on.
     */
    drawInDebug() {
        const objectSettings = this._settings;

        // Draw borders of elements
        this._context.strokeStyle = 'blue';
        this._context.lineWidth = 3;
        this._context.strokeRect(
            objectSettings.coords[0] + objectSettings.borderCoords[0] + this._camera.x, 
            objectSettings.coords[1] + objectSettings.borderCoords[1] + this._camera.y, 
            objectSettings.borderCoords[2], 
            objectSettings.borderCoords[3]
        );
        this._context.lineWidth = 1;
        this._context.strokeStyle = 'black';

        // Draw central points of elements
        this._context.fillStyle = 'red';
        this._context.fillRect(
            objectSettings.coords[0] + objectSettings.centralPointCoords[0]-10/2 + this._camera.x, 
            objectSettings.coords[1] + objectSettings.centralPointCoords[1]-10/2 + this._camera.y, 
            10, 10
        );
        this._context.fillStyle = 'black';
    }

    get settings() { return this._settings }
}
export default Object;