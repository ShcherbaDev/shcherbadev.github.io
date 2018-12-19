/**
 * Class for defining player.
 * @memberof RPGinia.App
 * @class
 */
class Player {
    /**
     * @constructor
     * @param {Object} spriteSheet - Information about sprite sheet with sprites data.
     * @param {number[]} sizes - In-game sizes. If they are not defined - takes them from the sprite sheet.
     */
    constructor(spriteSheet, sizes) {
        this._spriteSheet = spriteSheet !== undefined && typeof spriteSheet === "object" ? spriteSheet : null;
        this._sizes = sizes !== undefined && sizes.length === 2 ? sizes : null;
    }

    get spriteSheet() { return this._spriteSheet }
    get sizes() { return this._sizes }

    set spriteSheet(newValue) {
        this._spriteSheet = newValue !== undefined && typeof newValue === "object" ? newValue : null;
    }

    set sizes(newValue) {
        this._sizes = newValue !== undefined && newValue.length === 2 ? newValue : null;
    }
}

export default Player;