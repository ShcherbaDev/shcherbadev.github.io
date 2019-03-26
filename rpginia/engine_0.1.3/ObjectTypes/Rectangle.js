import Object from '../Object.js';

/**
 * Game object type for creating rectangles.
 * @memberof RPGinia.App.World.Object
 * @class
 * 
 * @example
 * // Creating a simple rectangle.
 * const engine = new RPGinia();
 * const app = new engine.App();
 * const world = new app.World();
 * 
 * world.initialize({
 *  // Your options here...
 * });
 * 
 * // createElement method from World class can create an object with indicated object type.
 * world.createElement({
 *  name: 'Test rectangle',
 *  type: 'rectangle',
 *  settings: {
 *    fill: 'red'
 *  },
 *  coords: [10, 34, 56, 21]
 * });
 */
class Rectangle extends Object {
    /**
     * @constructor
     * 
     * @param {Object} settings - object settings.
     * @param {String} settings.name - object name.
     * 
     * @param {Object} settings.settings - object settings for only this type.
     * @param {String} [settings.settings.fill="#000000"] - object filling.
     * 
     * @param {Number[]} settings.coords - object coordinations. First value - x coord, second value - y coord, third value - width, fourth value - height.
     * @param {String} settings.type - object type. For this object type it is "rectangle".
     * @param {Number} [settings.layer=1] - object layer.
     * @param {Boolean} [settings.isVisible=true] - show object in the playground.
     */
    constructor(settings) {
        super(settings);

        if(!this._settings.settings.fill) this._settings.settings.fill = '#000000';
    }

    /** 
     * Drawing object on the playground. 
     */
    draw() {
        if(this._settings.type === 'rectangle') {
            const rectSettings = this._settings.settings;
            
            this._context.fillStyle = rectSettings.fill;
            this._context.fillRect(
                this._settings.coords[0] + this._camera.x, 
                this._settings.coords[1] + this._camera.y,
                this._settings.coords[2], this._settings.coords[3],  
            );
        }
    }

    /**
     * Drawing object borders and their central points. Works only if debug mode in World class is turned on.
     */
    drawInDebug() {
        super.drawInDebug();
    }
}

export default Rectangle;