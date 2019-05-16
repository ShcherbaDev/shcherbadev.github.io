import GameObject from '../GameObject.js';

/**
 * Game object type for creating rectangles.
 * @memberof RPGinia.World.GameObject
 * @class
 * 
 * @example
 * // Creating a simple rectangle.
 * const app = new RPGinia();
 * const world = new RPGinia.World(app);
 * 
 * // createElement method from World class can create an object with indicated object type.
 * await world.addObjectInCurrentLevel({
 *  name: 'Test rectangle',
 *  type: 'rectangle',
 *  settings: {
 *    fill: 'red'
 *  },
 *  coords: [10, 34, 56, 21]
 * });
 */
class Rectangle extends GameObject {
	/**
     * @constructor
     * 
     * @param {Object} settings - object settings.
     * @param {String} settings.name - object name.
     * 
     * @param {Object} settings.settings - object settings for only this type.
     * @param {String} [settings.settings.fill="#000000"] - object filling.
     * 
     * @param {Object} settings.settings.outline - outline settings.
     * @param {Number} settings.settings.outline.width - outline width.
     * @param {String} [settings.settings.outline.color="#ffffff"] - outline color.
     * 
     * @param {Number[]} settings.coords - object coordinations. First value - x coord, second value - y coord, third value - width, fourth value - height.
     * @param {String} settings.type - object type. For this object type it is "rectangle".
     * @param {Number} [settings.layer=1] - object layer.
     * @param {Boolean} [settings.isVisible=true] - show object in the playground.
     */
	constructor(objectManagerClass, settings) {
		super(objectManagerClass, settings);

		if (this._settings.settings === undefined || this._settings.settings.fill === undefined) {
			this._settings.settings.fill = '#000000';
		}

		if (this._settings.settings !== undefined && this._settings.settings.outline !== undefined && this._settings.settings.outline.color === undefined) {
			this._settings.settings.outline.color = '#ffffff';
		}
	}

	/** 
     * Drawing object on the playground. 
     */
	draw() {
		const objectSettings = this._settings;
		const outlineSettings = objectSettings.settings.outline;

		const objectCoords = [
			objectSettings.coords[0] - this._camera.x,
			objectSettings.coords[1] - this._camera.y,
			objectSettings.coords[2],
			objectSettings.coords[3]
		];

		// Render rectangle's filling
		this._context.fillStyle = objectSettings.settings.fill;
		this._context.fillRect(...objectCoords);
		this._context.fillStyle = '#000000';

		// Render rectangle's outline
		if (outlineSettings !== undefined) {
			this._context.lineWidth = outlineSettings.width;
			this._context.strokeStyle = outlineSettings.color;

			const outlineCoords = [
				objectCoords[0] - this._context.lineWidth / 2,
				objectCoords[1] - this._context.lineWidth / 2,
				objectCoords[2] + this._context.lineWidth,
				objectCoords[3] + this._context.lineWidth
			];

			this._context.strokeRect(...outlineCoords);
               
			this._context.strokeStyle = '#000000';
			this._context.lineWidth = 1;
		}
	}
}

export default Rectangle;
