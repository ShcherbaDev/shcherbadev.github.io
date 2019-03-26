/* Note:
 * This class uses a synchronous type of loading files. 
 * Actually, I don't know, which of types I need to use: synchronous or asynchronous. 
 * Maybe I'll add a new branch with asynchronous type of loading. 
 */

/**
 * Class for loading files. Mostly JSON files.
 * @memberof RPGinia.App
 * @class
 */

class Loaders {
	/**
	 * @constructor
	 * @param {Boolean} [enableDebugMode=false] - Enable debug mode to display load or error notifications in console.
	 */
	constructor(enableDebugMode = false) {
		/**
		 * Files array.
		 * @type {Object[]}
		 * @private
		 */
		this._files = [];

		/**
		 * XMLHttpRequest to load files.
		 * @type {Object}
		 * @private
		 */
		this._xml = new XMLHttpRequest();

		/** 
		 * App path from the prototype given from App class.
		 * @type {String}
		 * @private
		 */
		this._appPath = this.__proto__.appPath;

		this._debugMode = enableDebugMode;
	}

	/**
	 * Type checking. Allowed values: "level", "language", "spriteSheet".
	 * @private
	 * @param {String} type 
	 */
	_checkFileType(type) {
		return type === "level" || type === "language" || type === "spriteSheet";
	}
	
	/**
	 * Deletes repeating files.
	 * @private
	 * @param {Object[]} arr 
	 */
	_filterFiles(arr) {
		let tmp = {};
		return arr.filter(a => a.path in tmp ? 0 : tmp[a.path] = 1);
	}

	/**
	 * Loads JSON file and setting up needable settings.
	 * @private
	 * @param {String} filePath - File path to the file.
	 * @param {String} fileType - File type. Can be "level", "language" or "spriteSheet".
	 * @param {Function} callback - Actions after file loading.
	 */
	_loadSignleFile(filePath, fileType, callback) {
		if(this._checkFileType(fileType)) {
			const xml = new XMLHttpRequest();
			
			let lastFile;
			xml.onreadystatechange = () => {
				if(xml.readyState === 1) {
					this._files.push({
						type: fileType,
						isLoaded: false,
						path: this._appPath + filePath,
						data: {}
					});
					lastFile = this._files[this._files.length-1];
				}

				if(xml.readyState === 4) {
					let output = JSON.parse(xml.responseText);

					if(this._debugMode)
						console.info(`${fileType} loaded! Path: ${this._appPath + filePath}`)

					if(callback)
						callback(output, lastFile);

					else {
						lastFile.isLoaded = true;
						lastFile.data = output;
					}
				}
			}
			xml.open("get", this._appPath + filePath, false);
			xml.send();

			this._files = this._filterFiles(this._files);
		}
	}

	/**
	 * Load one JSON file.
	 * @param {String} fileType - File type. Can access only types "level", "language" and "spriteSheet".
	 * @param {String} filePath - Defines a file path. 
	 * @throws Will throw an error if the "fileType" argument is not equals "level" or "language" or "spriteSheet".
	 */
	jsonFile(fileType, filePath) {
		const changedFilePath = filePath.replace(this._appPath, '');
		if(this._checkFileType(fileType)) {
			this._loadSignleFile(changedFilePath, fileType, (output, lastFile) => {
				if(fileType === 'level' && output.settings.spriteSheetPath) 
					this._loadSignleFile(output.settings.spriteSheetPath.replace(this._appPath, ''), 'spriteSheet', (spriteSheet) => output.spriteSheets = spriteSheet);

				lastFile.isLoaded = true;
				lastFile.data = output;
			});
			return this._files[this._files.findIndex(item => item.path === this._appPath + filePath)];
		}

		else
			throw new Error(`The ${fileType} type is undefined!`);
	}

	/** 
	 * Get an array of loaded levels.
	 * @readonly
	 * @type {Object[]}
	 */
	get levels() {
		let resultArr = [];
		for(let i in this._files) {
			if(this._files[i].type === "level" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}

	/** 
	 * Get an array of loaded languages.
	 * @readonly
	 * @type {Object[]}
	 */
	get languages() {
		let resultArr = [];
		for(let i in this._files) {
			if(this._files[i].type === "language" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}

	/** 
	 * Get an array of loaded sprite sheets.
	 * @readonly
	 * @type {Object[]}
	 */
	get spriteSheets() {
		let resultArr = [];
		for(let i in this._files) {
			if(this._files[i].type === "spriteSheet" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}
	
	/** 
	 * Get an array of files.
	 * @readonly
	 * @type {Object[]}
	 */
	get files() { return this._files }
}

export default Loaders;