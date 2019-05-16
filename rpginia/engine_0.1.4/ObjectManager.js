import Rectangle from './ObjectTypes/Rectangle.js';
import Sprite from './ObjectTypes/Sprite.js';
import Text from './ObjectTypes/Text.js';
import Trigger from './ObjectTypes/Trigger.js';

/**
 * Class for creating game objects in level.
 * @memberof RPGinia.World
 * @private
 * @class
 */
class ObjectManager {
	/**
	 * @constructor
	 * @param {object} levelClass - Level class. 
	 */
	constructor(levelClass) {
		this._level = levelClass;
		this._world = this._level._world;

		this._objects = this._defineObjectList();
	}

	/**
	 * Sort game objects by layer.
	 * @private
	 * @param {object[]} [objectList=level's object list] - Game object list.
	 * @returns {object[]} Sorted game object list.
	 */
	_sortObjectsByLayer(objectList = this._objects) {
		return objectList.sort((a, b) => {
			if (a.settings.layer > b.settings.layer) {
				return 1;
			}
			if (a.settings.layer < b.settings.layer) {
				return -1;
			}

			return 0;
		});
	}

	/**
	 * Create new game object.
	 * @private
	 * @param {string} type - Game object type.
	 * @param {object} settings - Game object settings.
	 * @returns {object} Created game object.
	 */
	_createObjectFromType(type, settings) {
		if (type === 'rectangle') {
			return new Rectangle(this, settings);
		}
		if (type === 'sprite') {
			return new Sprite(this, settings);
		}
		if (type === 'text') {
			return new Text(this, settings);
		}
		if (type === 'trigger') {
			return new Trigger(this, settings);
		}
		throw new Error('Can\'t add a new object!');
	}

	/**
	 * Create new object method which using in forEach cycle.
	 * @private
	 * @param {object} settings - Game object settings.
	 * @returns {object} Created game object.
	 */
	_setNewObjectByType(settings) {
		const {type} = settings;
		const createdObject = this._createObjectFromType(type, settings);
		return createdObject;
	}

	/**
	 * Create game objects.
	 * @private
	 * @returns {object[]} Array with created and sorted game objects.
	 */
	_defineObjectList() {
		const originalObjectList = this._level._originalObjectList;

		let resArr = [];

		originalObjectList.forEach(item => resArr.push(this._setNewObjectByType(item)));
		resArr = this._sortObjectsByLayer(resArr);

		return resArr;
	}

	/**
	 * Sort game objects by layer.
	 * @param {object[]} [objectList=level's object list] - Game object list.
	 * @returns {object[]} Sorted game object list.
	 */
	sortObjectsByLayer(objectList = this._objects) {
		this._sortObjectsByLayer(objectList);
	}

	/**
	 * Find a game object by name.
	 * @param {string} name - The name of a searched game object.
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
	 * Add a new game object.
	 * @param {object} settings - See game object's types documentation for full list of their settings.
	 * @returns {object} Created game object.
	 */
	addObject(settings) {
		const {type} = settings;
		const createdObject = this._createObjectFromType(type, settings);
		this._objects.push(createdObject);
		this._objects = this._sortObjectsByLayer();

		return createdObject;
	}

	/**
	 * Delete game object by name.
	 * @param {string} name - The name of a deleting game object.
	 * @returns {boolean} True if delete was successful.
	 */
	deleteObject(name) {
		this._objects.splice(this._objects.findIndex(item => item.settings.name === name), 1);
		this._objects = this._sortObjectsByLayer();
		return true;
	}
}

export default ObjectManager;
