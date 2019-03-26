/**
 * Class for move or rotate camera.
 * @memberof RPGinia.App
 * @class
 */
class Camera {
    /**
     * @hideconstructor
     */
    constructor() {
        /**
         * Link to the World class for getting elements from it. 
         * A value is assigned in World.js in "initialize" method.
         * @private
         */
        this._world = null;

        /**
         * Camera rotate degree. Value can be from 0 to 360. If value is less than 0, it will become to 360. If value is greater than 360, it will become to 0.
         * @private
         */
        this._rotateDeg = 0;

        this._x = 0;
        this._y = 0;
    }

    /**
     * Move camera.
     * @param {Number} x - X axis.
     * @param {Number} y - Y axis.
     */
    move(x, y) {
        this._x += x;
        this._y += y;
    }
    
    /**
     * Rotate camera.
     * @param {Number} deg - Value of how much the degree will increase.
     */
    rotate(deg) {
        this._rotateDeg += deg;

        if(this._rotateDeg < 0)
            this._rotateDeg = 360;

        else if(this._rotateDeg > 360)
            this._rotateDeg = 0;
    }

    /** 
	 * Get a camera rotation degree.
	 * @readonly
	 * @type {Number}
	 */
    get degree() { return this._rotateDeg }

    /** 
	 * Get camera X position.
	 * @readonly
	 * @type {Number}
	 */
    get x() { return this._x }

    /** 
	 * Get camera Y position.
	 * @readonly
	 * @type {Number}
	 */
    get y() { return this._y }

    /**
	 * Set new X position to camera.
	 * @param {Number} newX - new X coordinate.
	 */
    set x(newX) { this._x = newX }

    /**
	 * Set new Y position to camera.
	 * @param {Number} newY - new Y coordinate.
	 */
    set y(newY) { this._y = newY }
}

export default Camera;