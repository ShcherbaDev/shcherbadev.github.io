import GameObject from '../GameObject.js';

/**
 * Game object type for creating sprites.
 * @memberof RPGinia.World.GameObject
 * @class
 * 
 * @example
 * // spriteSheets.json
 * {
 *  "file": "path/to/your/sprite/sheet/image.png",
 *  "sprites" {
 *   {
 *     "name": "test_sprite_0",
 *     "rect": [0, 0, 506, 287]
 *   },
 *   {
 *     "name": "test_sprite_1",
 *     "rect": [506, 0, 504, 287]
 *   }
 *  }
 * }
 * 
 * // game.js
 * const app = new RPGinia();
 * const world = new RPGinia.World(app);
 * 
 * // createElement method from World class can create an object with indicated object type.
 * await world.addObjectInCurrentLevel({
 *  name: 'Test sprite',
 *  type: 'sprite',
 *  settings: {
 *    spriteSheetIndex: 0,
 *    spriteIndex: 1
 *  },
 *  coords: [10, 34, 56, 21]
 * });
 */
class Sprite extends GameObject {
	/**
     * @constructor
     * 
     * @param {object} settings - object settings.
     * @param {string} settings.name - object name.
     * 
     * @param {object} settings.settings - object settings for only this type.
     * @param {number} settings.settings.spriteSheetIndex - sprite sheet number.
     * @param {number} settings.settings.spriteIndex - sprite number.
     * @param {number} [settings.settings.frameIndex=settings.frameFrom] - frame number. Works only if current sprite have the frame list. If it is not defined - setting up value from frameFrom value.
     * @param {boolean} [settings.settings.isRepeating=false] - should animation repeating after it's ending (Works if current sprite have frame list).
     * @param {boolean} [settings.settings.isPlaying=false] - should animation playing (Works only if current sprite have frame list).
     * @param {number} [settings.settings.interval=60] - interval of changing animation frames.
     * @param {number} [settings.settings.frameFrom=0] - frame from which the animation should be played. If it is greater than the frames length - setting up to 0.
     * @param {number} [settings.settings.frameTo=frame list length] - frame to which the animation should be played.
     * 
     * @param {number[]} settings.coords - object coordinations. First value - x coord, second value - y coord, third value - width, fourth value - height. If width and/or height are not defined - they will be taken from the sprite sheet.
     * @param {string} settings.type - object type. For this object type it is "sprite".
     * @param {number} [settings.layer=1] - object layer.
     * @param {boolean} [settings.isVisible=true] - show object in the playground.
     */
	constructor(objectManagerClass, settings) {
		super(objectManagerClass, settings);

		this._init();
	}

	/**
	 * @private
	 */
	_init() {
		this._currentSpriteSheet = this._objectManager._level._spriteSheet.data[this._settings.settings.spriteSheetIndex];

		// Default width and height
		if (this._currentSpriteSheet.sprites[this._settings.settings.spriteIndex].rect !== undefined) {
			if (this._settings.coords[2] === undefined) {
				this._settings.coords[2] = this._currentSpriteSheet.sprites[this._settings.settings.spriteIndex].rect[2];
			}
			if (this._settings.coords[3] === undefined) {
				this._settings.coords[3] = this._currentSpriteSheet.sprites[this._settings.settings.spriteIndex].rect[3];
			}
		}
		else {
			if (this._settings.coords[2] === undefined) {
				this._settings.coords[2] = this._currentSpriteSheet.sprites[this._settings.settings.spriteIndex].frames[this._settings.settings.frameIndex || 0].rect[2];
			}
			if (this._settings.coords[3] === undefined) {
				this._settings.coords[3] = this._currentSpriteSheet.sprites[this._settings.settings.spriteIndex].frames[this._settings.settings.frameIndex || 0].rect[3];
			}
		}

		this._settings.image = new Image();
		this._settings.isSpriteLoaded = false;

		this._settings.image.onload = () => {
			this._settings.isSpriteLoaded = true;
			return true;
		};

		this._settings.image.src = this._appPath + this._currentSpriteSheet.file;

		this._setUpSettingsForAnimatedSprite();
	}

	/**
	 * @private
	 */
	_setUpSettingsForAnimatedSprite() {
		const currentSprite = this._currentSpriteSheet.sprites[this._settings.settings.spriteIndex];

		if (currentSprite.rect === undefined
			&& currentSprite.frames !== undefined) {
			if (this._settings.settings.interval === undefined) {
				this._settings.settings.interval = 60;
			}

			if (this._settings.settings.frameFrom === undefined
				|| this._settings.settings.frameFrom >= currentSprite.frames.length - 1) {
				this._settings.settings.frameFrom = 0;
			}

			if (this._settings.settings.frameIndex === undefined) {
				this._settings.settings.frameIndex = this._settings.settings.frameFrom;
			}

			if (this._settings.settings.frameTo === undefined) {
				this._settings.settings.frameTo = currentSprite.frames.length - 1;
			}
        
			if (this._settings.settings.isRepeating === undefined) {
				this._settings.settings.isRepeating = false;
			}

			return this._setUpAnimationInterval();
		}
		return false;
	}

	/**
	 * @private
	 */
	_setUpAnimationInterval() {
		this._settings.settings.spriteAnimation = setInterval(() => {
			if (this._settings.settings.isPlaying && this._settings.settings.frameIndex < this._settings.settings.frameTo) {
				this._settings.settings.frameIndex = this._settings.settings.frameIndex + 1;
			}
			else if (this._settings.settings.isRepeating) {
				this._settings.settings.frameIndex = this._settings.settings.frameFrom;
			}
			
			else {
				this._settings.settings.isPlaying = false;
			}
		}, this._settings.settings.interval);
		
		return this._settings.settings.spriteAnimation;
	}

	/** 
     * Drawing object on the playground. 
     */
	draw() {
		const objectSettings = this._settings;
		const spriteSheet = this._currentSpriteSheet;

		const spritePositionInSpriteSheet = spriteSheet.sprites[objectSettings.settings.spriteIndex].rect !== undefined
			? spriteSheet.sprites[objectSettings.settings.spriteIndex].rect
			: spriteSheet.sprites[objectSettings.settings.spriteIndex].frames[objectSettings.settings.frameIndex].rect;
		
		const objectCoords = [
			objectSettings.coords[0] - this._camera.x,
			objectSettings.coords[1] - this._camera.y,
			objectSettings.coords[2],
			objectSettings.coords[3]
		];

		this._context.drawImage(
			objectSettings.image, ...spritePositionInSpriteSheet, ...objectCoords
		);
	}
}

export default Sprite;
