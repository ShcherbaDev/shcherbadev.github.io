import GameObject from '../GameObject.js';

/**
 * Game object type for creating texts.
 * @memberof RPGinia.World.GameObject
 * @class
 * 
 * @example
 * // Creating a simple text.
 * const app = new RPGinia();
 * const world = new RPGinia.World(app);
 * 
 * // createElement method from World class can create an object with indicated object type.
 * await world.addObjectInCurrentLevel({
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
class Text extends GameObject {
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
	constructor(objectManagerClass, settings) {
		super(objectManagerClass, settings);
          
		this._init();
	}
	
	/**
	 * @private
	 */
	_init() {
		const textSettings = this._settings.settings;

		if (this._settings.coords[2] === undefined) {
			this._context.font = `${textSettings.size}px "${textSettings.font}"`;
			this._settings.coords[2] = this._context.measureText(textSettings.text).width;
		}

		if (this._settings.coords[3] === undefined) {
			this._settings.coords[3] = textSettings.size;
		}
	}

	/** 
     * Drawing object on the playground.
     */
	draw() {
		const objectSettings = this._settings;
		const textSettings = objectSettings.settings;

		const objectCoords = [
			objectSettings.coords[0] - this._camera.x,
			objectSettings.coords[1] - this._camera.y
		];

		this._context.textBaseline = 'top';
		this._context.fillStyle = textSettings.color;
		this._context.font = `${textSettings.size}px "${textSettings.font}"`;
		this._context.textAlign = 'left';

		this._context.fillText(textSettings.text, ...objectCoords);
	}
}

export default Text;
