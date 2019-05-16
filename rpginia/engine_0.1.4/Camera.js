/**
 * Class for move or rotate camera.
 * @memberof RPGinia.World
 * @private
 * @class
 */
class Camera {
	/**
     * @hideconstructor
     */
	constructor() {
		this._x = 0;
		this._y = 0;
	
		return this;
	}

	/**
     * Move camera.
     * @param {Number} x - X axis.
     * @param {Number} y - Y axis.
     */
	move(x, y) {
		this._x = this._x + x;
		this._y = this._y + y;
	}

	/** 
	 * Get camera X position.
	 * @readonly
	 * @type {Number}
	 */
	get x() { return this._x; }

	/** 
	 * Get camera Y position.
	 * @readonly
	 * @type {Number}
	 */
	get y() { return this._y; }

	/**
	 * Set new X position to camera.
	 * @param {Number} newX - new X coordinate.
	 */
	set x(newX) { this._x = newX; }

	/**
	 * Set new Y position to camera.
	 * @param {Number} newY - new Y coordinate.
	 */
	set y(newY) { this._y = newY; }
}

export default Camera;
