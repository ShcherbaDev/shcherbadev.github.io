/**
 * Class for render current level.
 * @memberof RPGinia.World
 * @private
 * @class
 */
class Renderer {
	/**
	 * @constructor
	 * @param {object} levelManagerClass - LevelManager class.
	 * @param {object} worldClass  - World class.
	 */
	constructor(levelManagerClass, worldClass) {
		this._levelManager = levelManagerClass;
		this._world = worldClass;
		this._camera = this._world._camera;
		this._app = this._world._app;
		this._loaders = this._world._loaders;

		this._canvas = this._app._canvas;
		this._context = this._app._context;
	}

	/**
	 * Checks if the user can see the game object.
	 * @private
	 * @param {object} objectSettings - Object settings.
	 * @param {number} [padding=50] - Render padding.
	 * @returns {boolean} - True if user can see the object. False if user can't see the object.
	 */
	_isObjectVisible(objectSettings, padding = 50) {
		const {type, coords, isVisible} = objectSettings;
		
		if (isVisible) {
			if (this._camera !== undefined) {
				if (type !== 'text') {
					return coords[0] <= this._canvas.width - padding + this._camera.x
						&& coords[1] <= this._canvas.height - padding + this._camera.y
						&& coords[0] + coords[2] - this._camera.x >= padding
						&& coords[1] + coords[3] - this._camera.y >= padding;
				}
				
				return true;
			}
			
			return coords[0] <= this._canvas.width - padding
					&& coords[1] <= this._canvas.height - padding
					&& coords[0] + coords[2] >= padding
					&& coords[1] + coords[3] >= padding;
		}
		return false;
	}

	/**
	 * Checks if all sprites are loaded.
	 * @private
	 * @param {object} currentLevel - Current level.
	 * @returns {boolean} - If level contains sprites it returns boolean by condition. If level doesn't contains sprites returns true.
	 */
	_allSpritesLoaded(currentLevel) {
		const spritesArr = [];
		const loadedSpritesArr = [];
		
		if (currentLevel._objects.findIndex(item => item.settings.type === 'sprite') !== -1) {
			currentLevel._objects.forEach((item) => {
				if (item.settings.type === 'sprite') {
					spritesArr.push(item);
					if (item.settings.isSpriteLoaded) {
						loadedSpritesArr.push(item);
					}
				}
			});

			return loadedSpritesArr.length === spritesArr.length;
		}
		return true;
	}

	/**
	 * Render background of the level.
	 * @private
	 * @param {string} levelBackground - Background options from level's settings.
	 */
	_renderBackground(levelBackground) {
		this._context.fillStyle = levelBackground;
		this._context.fillRect(
			0, 0,
			this._canvas.width, this._canvas.height
		);
	}

	/**
	 * Render black background if level is not loaded.
	 * @private
	 */
	_renderEmptyBackground() {
		this._context.fillStyle = '#000000';
		this._context.fillRect(
			0, 0,
			this._canvas.width, this._canvas.height
		);
	}

	/**
	 * Render outlines of game object.
	 * @private
	 * @param {object} objectItem - game object.
	 */
	_renderBorders(objectItem) {
		const outlineCoords = [
			objectItem.settings.coords[0] - this._camera._x,
			objectItem.settings.coords[1] - this._camera._y,
			objectItem.settings.coords[2],
			objectItem.settings.coords[3]
		];

		const centralPointCoords = [
			objectItem.settings.coords[0] - this._camera._x + objectItem.settings.coords[2] / 2 - 5,
			objectItem.settings.coords[1] - this._camera._y + objectItem.settings.coords[3] / 2 - 5,
			10,
			10
		];

		// Render outline
		this._context.strokeStyle = objectItem.settings.type !== 'trigger' ? 'blue' : 'orange';
		this._context.lineWidth = 2;
		this._context.strokeRect(...outlineCoords);
		this._context.lineWidth = 1;
		this._context.strokeStyle = '#000000';

		// Render central points
		this._context.fillStyle = 'red';
		this._context.fillRect(...centralPointCoords);
		this._context.fillStyle = '#000000';
	}

	/** 
	 * Render level objects. Must be used in a loop.
	 * @async
	 * @example
	 * function loop() {
	 *  world.render();
	 * 	requestAnimationFrame(loop);
	 * }
	 * loop();
	 */
	async render() {
		const currentLevel = await this._levelManager.getActiveLevel();

		if (currentLevel !== undefined) {
			this._renderBackground(currentLevel._background);

			this._app._context.save();

			currentLevel._objects.forEach((item) => {
				const prototypeOfObject = Object.getPrototypeOf(item);

				if (this._isObjectVisible(item.settings, 0) && this._allSpritesLoaded(currentLevel)) {
					if (prototypeOfObject.draw !== undefined) {
						item.draw();

						if (this._app._debugMode) {
							this._renderBorders(item);
						}
					}
					else {
						throw new Error(`Draw function for object type "${item.settings.type}" wasn't defined!`);
					}
				}
			});

			this._app._context.restore();
		}
		else {
			this._renderEmptyBackground();
		}
	}
}

export default Renderer;
