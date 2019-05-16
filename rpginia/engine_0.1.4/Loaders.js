/**
 * Class for loading files.
 * @memberof RPGinia
 * @class
 */
class Loaders {
	/**
	 * @constructor
	 * @param {object} [appClass] - RPGinia app.
	 */
	constructor(rpginiaApp) {
		this._app = rpginiaApp;

		/** 
		 * App path from the prototype given from App class.
		 * @type {String}
		 * @private
		 */
		this._appPath = this._app._appPath;

		this._debugMode = this._app._debugMode;

		/**
		 * Files array.
		 * @type {Object[]}
		 * @private
		 */
		this._files = [];

		this._app._loaders = this;
	}

	/**
	 * Check if level is passing the conditions.
	 * @private
	 * @param {object} json - Level's JSON.
	 * @returns {boolean} If level is passing the conditions.
	 */
	_checkLevelCondition(json) {
		const {settings, elements} = json;
		const {name} = settings;

		return settings !== undefined && name !== undefined && elements.length >= 0;
	}

	/**
	 * Check if sprite sheet is passing the condition.
	 * @private
	 * @param {object} json - Sprite sheet's JSON.
	 * @returns {boolean} If sprite sheet is passing the conditions.
	 */
	_checkSpriteSheetCondition(json) {
		return json.length >= 1;
	}

	/**
	 * Check if file is passing the conditions.
	 * @private
	 * @param {string} type - File's type.
	 * @param {string} url - File's URL.
	 * @param {object} json - File's JSON content.
	 * @returns {boolean} If level is passing the conditions - returns true, else - returns false.
	 */
	_checkFileConditions(type, url, json) {
		const isUnique = () => this._files.indexOf(url) === -1;
		
		// If file is not exist
		if (isUnique()) {
			if (type === 'level') {
				return this._checkLevelCondition(json);
			}
			if (type === 'spriteSheet') {
				return this._checkSpriteSheetCondition(json);
			}
			// There aren't any rules for json only files.
			if (type === 'json') {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get files by type.
	 * @private
	 * @param {string} type - files type.
	 * @returns {object[]} Result array.
	 */
	_getFilesByType(type) {
		const resultArr = [];

		this._files.forEach((file) => {
			if (file.type === type) {
				resultArr.push(file);
			}
		});

		return resultArr;
	}

	/**
	 * Load new JSON file.
	 * @async
	 * @private
	 * @param {string} type - File's type.
	 * @param {string} path - Path to file.
	 * @param  {...any} args - Additional arguments. The first one is a name.
	 * @returns {object} Loaded file.
	 * @throws {Error} If file didn't passed the conditions.
	 */
	async _loadJsonFile(type, path, ...args) {
		const request = await fetch(`${this._appPath}${path}`);
		const json = await request.json();

		if (this._checkFileConditions(type, request.url, json)) {
			const settings = {
				type,
				url: request.url,
				data: json
			};

			if (type === 'spriteSheet' || type === 'json') {
				settings.name = args[0];
			}

			this._files.push(settings);

			const newFile = this._files[this._files.length - 1];

			// Log to console if debug mode is enabled.
			if (this._app._debugMode) {
				let fileName = null;

				if (type === 'level') {
					fileName = newFile.data.settings.name;
				}
				else if (type === 'spriteSheet' || type === 'json') {
					fileName = args[0];
				}

				console.info(`${type.toUpperCase()} "${fileName}" has been loaded!`);
			}

			return newFile;
		}
		
		throw new Error(`${type.toUpperCase()} didn't passed the conditions!`);
	}

	/**
	 * Load new level.
	 * @async
	 * @param {string} path - Path to level. 
	 */
	async loadLevel(path) {
		const loadedLevel = await this._loadJsonFile('level', path);
		return loadedLevel;
	}

	/**
	 * Load new sprite sheet.
	 * @async
	 * @param {string} name - Sprite sheet's name. 
	 * @param {string} path - Path to sprite sheet.
	 */
	async loadSpriteSheet(name, path) {
		const loadedSpriteSheet = await this._loadJsonFile('spriteSheet', path, name);
		return loadedSpriteSheet;
	}

	/**
	 * Load new JSON file.
	 * @async
	 * @param {string} name - JSON file's name.
	 * @param {string} path - Path to JSON file.
	 */
	async loadJsonFile(name, path) {
		const loadedJsonFile = await this._loadJsonFile('json', path, name);
		return loadedJsonFile;
	}

	/** 
	 * Get an array of loaded levels.
	 * @readonly
	 * @type {object[]}
	 */
	get levels() {
		return this._getFilesByType('level');
	}

	/** 
	 * Get an array of loaded sprite sheets.
	 * @readonly
	 * @type {object[]}
	 */
	get spriteSheets() {
		return this._getFilesByType('spriteSheet');
	}

	/**
	 * Get an array of files that are not processed by the engine.
	 * @readonly
	 * @type {object[]}
	 */
	get jsonFiles() {
		return this._getFilesByType('json');
	}
	
	/** 
	 * Get an array of files.
	 * @readonly
	 * @type {object[]}
	 */
	get files() { return this._files; }
}

export default Loaders;
