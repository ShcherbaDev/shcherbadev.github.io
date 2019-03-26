import Object from '../Object.js';

/**
 * Game object type for creating texts.
 * @memberof RPGinia.App.World.Object
 * @class
 * 
 * @example
 * // Creating a simple text.
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
 *  name: 'Test text',
 *  type: 'text',
 *  settings: {
 *    text: 'This is a test text',
 *    size: 32,
 *    font: 'Arial',
 *    color: 'green'
 *  },
 *  coords: [10, 34]
 * });
 */
class Text extends Object {
    /**
     * @constructor
     * 
     * @param {Object} settings - object settings.
     * @param {String} settings.name - object name.
     * 
     * @param {Object} settings.settings - object settings for only this type.
     * @param {String} settings.settings.text - object's text.
     * @param {String} settings.settings.font - object's font.
     * @param {Number} settings.settings.size - object's size.
     * @param {String} settings.settings.color - object color.
     * 
     * @param {Number[]} settings.coords - object coordinations. First value - x coord, second value - y coord, third value - width, fourth value - height. If width and/or height are not defined - they will be taken automatically.
     * @param {String} settings.type - object type. For this object type it is "rectangle".
     * @param {Number} [settings.layer=1] - object layer.
     * @param {Boolean} [settings.isVisible=true] - show object in the playground.
     */
    constructor(settings) {
        super(settings);
    }

    /** 
     * Drawing object on the playground. 
     */
    draw() {
        if(this._settings.type === 'text') {
            const textSettings = this._settings.settings;

            this._context.fillStyle = textSettings.color;
            this._context.font = `${textSettings.size}px "${textSettings.font}"`;
            
            this._context.textAlign = 'left';
            this._context.textBaseline = 'top';

            this._context.fillText(textSettings.text, this._settings.coords[0]+this._camera.x, this._settings.coords[1]+this._camera.y)
        }
    }

    /**
     * Drawing object borders and their central points. Works only if debug mode in World class is turned on.
     */
    drawInDebug() {
        super.drawInDebug();
    }
}

export default Text;