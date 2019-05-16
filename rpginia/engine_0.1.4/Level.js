import ObjectManager from './ObjectManager.js';

/**
 * Level's class
 * @memberof RPGinia.World.LevelManager
 * @private
 * @class
 */
class Level {
	/**
	 * @constructor
	 * @async
	 * @param {object} worldClass - World class. 
	 * @param {object} levelJsonObject - JSON object of level. 
	 */
	constructor(worldClass, levelJsonObject) {
		return (async () => {
			const {settings, elements} = levelJsonObject;
			const {name, background, controllerPath, spriteSheetName, spriteSheetPath} = settings;

			this._world = worldClass;

			this._appPath = this._world._app._appPath;

			this._name = name;
			this._background = background;

			this._spriteSheetName = spriteSheetName;
			this._spriteSheetPath = spriteSheetPath;
			this._spriteSheet = this._spriteSheetName !== undefined ? this._findSpriteSheetByName() : await this._defineSpriteSheetByPath();

			this._originalObjectList = elements;
			this._objectManager = new ObjectManager(this);
			this._objects = this._objectManager._objects;

			if (this._world._levelManager._loadControllers && controllerPath !== undefined) {
				this._controller = await this._defineController(controllerPath);
			}

			this._isActive = false;
            
			return this;
		})();
	}

	/**
	 * Find sprite sheet by name.
	 * @private
	 * @returns {object} Found sprite sheet.
	 * @throws {Error} If didn't find a searched sprite sheet.
	 */
	_findSpriteSheetByName() {
		const indexOfRequiredSpriteSheet = this._world._loaders.spriteSheets.findIndex(spriteSheet => spriteSheet.name === this._spriteSheetName);

		// If can found a required sprite sheet.
		if (indexOfRequiredSpriteSheet !== -1) {
			return this._world._loaders.spriteSheets[indexOfRequiredSpriteSheet];
		}
		throw new Error(`Can't find sprite sheet with name "${this._spriteSheetName}"`);
	}

	/**
	 * Define sprite sheet by it's path.
	 * @private
	 * @async
	 * @returns {object} Searched sprite sheet.
	 */
	async _defineSpriteSheetByPath() {
		const indexOfRequiredSpriteSheet = this._world._loaders.spriteSheets.findIndex(spriteSheet => spriteSheet.url === this._appPath + this._spriteSheetPath);

		// If can found a required sprite sheet.
		if (indexOfRequiredSpriteSheet !== -1) {
			return this._world._loaders.spriteSheets[indexOfRequiredSpriteSheet];
		}
        
		const newSpriteSheet = await this._world._app._loaders.loadSpriteSheet(this._spriteSheetPath, this._spriteSheetPath);
		return newSpriteSheet;
	}

	/**
	 * Load level's controller.
	 * @private
	 * @async
	 * @param {string} controllerPath - Path to controller.
	 * @returns {function} Loaded controller function.
	 */
	async _defineController(controllerPath) {
		const defineFile = await fetch(`${this._appPath}${controllerPath}`);
		const response = await defineFile.text();
		
		const parseLevelControllerFunction = eval;
		return parseLevelControllerFunction(`(${response})`);
	}

	/**
	 * Find a game object by name.
	 * @param {string} objectName - The name of a searched game object.
	 * @returns {object} Searched game object.
	 */
	getObjectByName(objectName) {
		return this._objects[this._objects.findIndex(item => item.settings.name === objectName)];
	}

	/**
	 * Get game objects by layer.
	 * @param {number} layerNumber - The number of a searched layer.
	 * @returns {object[]} Game objects array which were in searched layer.
	 */
	getObjectsFromLayer(layerNumber) {
		const resultArr = [];

		this._objects.forEach((item) => {
			if (item.settings.layer === layerNumber) {
				resultArr.push(item);
			}
		});

		return resultArr;
	}

	/**
	 * Get the level's name.
	 * @readonly
	 * @type {string}
	 */
	get name() { return this._name; }
}

export default Level;
