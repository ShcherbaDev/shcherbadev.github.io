import GameObject from '../GameObject.js';

/**
 * Game object type for creating triggers.
 * @memberof RPGinia.World.GameObject
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
 * await world.addObjectInCurrentLevel({
 *  name: 'Test rectangle',
 *  type: 'rectangle',
 *  settings: {
 *    fill: 'red'
 *  },
 *  coords: [10, 34, 56, 21]
 * });
 */
class Trigger extends GameObject {
	/**
	* @constructor
	* 
	* @param {Object} settings - object settings.
	* @param {String} settings.name - object name.
	* @param {Number[]} settings.coords - object coordinations. First value - x coord, second value - y coord, third value - width, fourth value - height.
	* @param {String} settings.type - object type. For this object type it is "trigger".
	*/
	constructor(objectManagerClass, settings) {
		super(objectManagerClass, settings);

		this._settings.layer = 1001;
	}
	
	/**
	 * Trigger is not drawing on the playground, 
	 * so for not engine throwing an error about non-existence of 
	 * draw method I just added a return statement for it.
	 * 
	 * @returns {boolean} Returns false.
	 */
	draw() {
		return false;
	}

	/**
	 * Check if trigger is touching other game object.
	 * @param {string} touchedObjectName - Touched object's name.
	 * @returns {boolean} If trigger is touching other object.
	 */
	isTouching(touchedObjectName) {
		const touchedObject = this._objectManager.getObjectByName(touchedObjectName);
		const touchedObjectCoords = touchedObject.settings.coords;

		const triggerCoords = this._settings.coords;

		if (
			touchedObjectCoords[0] <= triggerCoords[0] + triggerCoords[2]
			&& touchedObjectCoords[0] + touchedObjectCoords[2] >= triggerCoords[0]

			&& touchedObjectCoords[1] + touchedObjectCoords[3] >= triggerCoords[1]
			&& touchedObjectCoords[1] <= triggerCoords[1] + triggerCoords[3]
		) {
			return true;
		}
		return false;
	}
}

export default Trigger;
