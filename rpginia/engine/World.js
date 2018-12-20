export default class World {
	constructor() {
		this._levels = [];
		this._currentLevelId = 0;
		this._previousLevelId = null;

		this._app = null;
		this._keyboard = null;
		this._lanugages = null;
		this._audio = null;
		this._player = null;

		this._canvas = this.__proto__.canvas;
		this._context = this.__proto__.context;
		this._appPath = this.__proto__.appPath;
	}

	_doController(item) {
		if(this._levels[item].data.settings.controllerPath && item === this._levels[item].id) {
			if(!this._levels[item].controller) {
				let xml = new XMLHttpRequest();
	
				xml.onreadystatechange = () => {
					if(xml.readyState === 4)
						this._levels[item].controller = eval(`(${xml.responseText})`);
				}
	
				xml.open("get", this._appPath + this._levels[item].data.settings.controllerPath, false);
				xml.send();
			}

			this._levels[this._currentLevelId].controller({
				app: this._app,
				world: this, 
				languages: this._languages,
				keyboard: this._keyboard,
				audio: this._audio,
				player: this._player
			});
		}
	}

	_openSpriteSheet(currentItem) {
		let xml = new XMLHttpRequest();

		xml.onreadystatechange = () => {
			if(xml.readyState === 4)
				this._levels[currentItem].spriteSheets = JSON.parse(xml.responseText);
		}

		xml.open("get", this._appPath + this._levels[currentItem].data.settings.spriteSheetPath, false);
		xml.send();
	}

	initialize(options) {
		// Elements init
		this._app = options.app || null;
		this._keyboard = options.keyboard || null;
		this._languages = options.languages || null;
		this._audio = options.audio || null;
		this._player = options.player || null;

		// Levels init
		if(options.levels) {
			this._levels = Array.isArray(options.levels) ? options.levels : [options.levels];

			for(let i in this._levels) {
				// Giving an ID for each level
				this._levels[i].id = parseInt(i);
				
				// Adding a sprite sheet for each level
				if(this._levels[i].data.settings.spriteSheetPath) {
					this._openSpriteSheet(i);
					
					for(let j in this._levels[i].data.elements) {
						if(this._levels[i].data.elements[j].type === "sprite") {
							if(this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].frames) {
								if(!this._levels[i].data.elements[j].frameFrom)
									this._levels[i].data.elements[j].frameFrom = 0;
								
								if(!this._levels[i].data.elements[j].currentFrame)
									this._levels[i].data.elements[j].currentFrame = this._levels[i].data.elements[j].frameFrom;
							}

							if(!this._levels[i].data.elements[j].coords[2]) {
								if(this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect)
									this._levels[i].data.elements[j].coords[2] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect[2];
								else 
									this._levels[i].data.elements[j].coords[2] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].frames[this._levels[i].data.elements[j].currentFrame].rect[2];
							}

							if(!this._levels[i].data.elements[j].coords[3]) {
								if(this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect)
									this._levels[i].data.elements[j].coords[3] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect[3];
								else 
									this._levels[i].data.elements[j].coords[3] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].frames[this._levels[i].data.elements[j].currentFrame].rect[3];
							}


							this._levels[i].data.elements[j].image = new Image();
							this._levels[i].data.elements[j].isLoaded = false;
							this._levels[i].data.elements[j].image.onload = () => {
								this._levels[i].data.elements[j].isLoaded = true;
							}
							this._levels[i].data.elements[j].image.src = this._appPath + this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].file
						}
					}
				}

				for(let j in this._levels[i].data.elements) {
					// Setting up a "layer" property to default value, if it's not defined.
					if(this._levels[i].data.elements[j].layer === undefined)
						this._levels[i].data.elements[j].layer = 1;

					// Setting up a "isVisible" property to default value, if it's not defined.
					if(this._levels[i].data.elements[j].isVisible === undefined)
						this._levels[i].data.elements[j].isVisible = true;

					// Setting up a width and height for texts.
					if(this._levels[i].data.elements[j].type === "text") {
						if(!this._levels[i].data.elements[j].coords[2])
							this._levels[i].data.elements[j].coords[2] = this._app.context.measureText(this._levels[i].data.elements[j].settings.text).width;

						if(!this._levels[i].data.elements[j].coords[3]) 
							this._levels[i].data.elements[j].coords[3] = this._levels[i].data.elements[j].settings.size;
					}
				}

				// Sorting elements.
				if(this.allElementsInLevelLoaded(i)) {
					this._levels[i].data.elements.sort((a, b) => {
						if(a.layer > b.layer)
							return 1;
			
						if(a.layer < b.layer)
							return -1;
			
						return 0;
					});
				}
			}
		}
		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");

		this._currentLevelId = options.currentLevelId || 0;

		// Controller init
		this._doController(this._currentLevelId);
	}

	_isObjectVisible(currentLevelObjects, objectIndex, padding) {
		return currentLevelObjects[objectIndex].coords[0] <= this._app.canvas.width-padding &&
			currentLevelObjects[objectIndex].coords[1] <= this._app.canvas.height-padding &&
			currentLevelObjects[objectIndex].coords[0] + currentLevelObjects[objectIndex].coords[2] >= padding &&
			currentLevelObjects[objectIndex].coords[1] + currentLevelObjects[objectIndex].coords[3] >= padding
	}

	allElementsInLevelLoaded(levelId) {
		if(this._levels[levelId].data.elements) {
			let loadedLevelsElementsArr = [];
			let spriteElements = [];

			for(let i in this._levels[levelId].data.elements) {
				if(this._levels[levelId].data.elements[i].type === "sprite") {
					spriteElements.push(i)
				}

				if(this._levels[levelId].data.elements[i].type === "sprite" && this._levels[levelId].data.elements[i].isLoaded)
					loadedLevelsElementsArr.push(i);
			}
			return loadedLevelsElementsArr.length === spriteElements.length;
		}
		else {
			throw new Error(`There are not any elements in the ${this._levels[levelId].data.settings.name} level.`)
		}
	}

	draw() {
		const currentLevel = this._levels[this._currentLevelId];

		// Background draw
		if(currentLevel.data.settings.background) {
			this._context.fillStyle = currentLevel.data.settings.background;
			this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		}

		// Level draw
		for(let i in currentLevel.data.elements) {
			currentLevel.data.elements[i].isVisible = this._isObjectVisible(currentLevel.data.elements, i, 10);

			if(currentLevel.data.elements[i].isVisible) {
				if(currentLevel.data.elements[i].type === "sprite" && currentLevel.data.elements[i].isLoaded) {
					const spriteSheetCoords = currentLevel.spriteSheets[currentLevel.data.elements[i].spriteSheetIndex].sprites[currentLevel.data.elements[i].spriteIndex].rect ? 
											  currentLevel.spriteSheets[currentLevel.data.elements[i].spriteSheetIndex].sprites[currentLevel.data.elements[i].spriteIndex].rect :
											  currentLevel.spriteSheets[currentLevel.data.elements[i].spriteSheetIndex].sprites[currentLevel.data.elements[i].spriteIndex].frames[currentLevel.data.elements[i].currentFrame].rect;
					
					const spriteCoords = currentLevel.data.elements[i].coords;

					this._context.drawImage(
						currentLevel.data.elements[i].image,

						spriteSheetCoords[0], 
						spriteSheetCoords[1], 
						spriteSheetCoords[2], 
						spriteSheetCoords[3],
						
						spriteCoords[0], 
						spriteCoords[1], 
						spriteCoords[2] || spriteSheetCoords[2], 
						spriteCoords[3] || spriteSheetCoords[3]
					);
				}

				if(currentLevel.data.elements[i].type === "text") {
					this._context.fillStyle = currentLevel.data.elements[i].settings.color || "red";
					this._context.font = `${currentLevel.data.elements[i].settings.size}px "${currentLevel.data.elements[i].settings.font}"`;
					
					this._context.textAlign = currentLevel.data.elements[i].settings.horizontalAlign || "center";
					this._context.textBaseline = currentLevel.data.elements[i].settings.verticalAlign || "middle";
					this._context.fillText(currentLevel.data.elements[i].settings.text, currentLevel.data.elements[i].coords[0], currentLevel.data.elements[i].coords[1])
				}
			}
		}
	}

	getElementByName(elementName) {
		return this._levels[this._currentLevelId].data.elements[this._levels[this._currentLevelId].data.elements.findIndex(elem => elem.name === elementName)]
	}

	getElementsFromLayer(layerNum) {
		let arr = [];

		for(let i in this._levels[this._currentLevelId].data.elements) {
			if(this._levels[this._currentLevelId].data.elements[i].layer === layerNum)
				arr.push(this._levels[this._currentLevelId].data.elements[i])
		}

		return arr;
	}

	set level(newLevelValue) {
		this._previousLevelId = this._currentLevelId;

		if(typeof newLevelValue === "number")
			this._currentLevelId = newLevelValue;
		else if(typeof newLevelValue === "string")
			this._currentLevelId = this._levels.findIndex(level => level.data.settings.name === newLevelValue);

		this._doController(this._currentLevelId);
	}

	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelId() { return this._currentLevelId }
	get levels() { return this._levels }
}