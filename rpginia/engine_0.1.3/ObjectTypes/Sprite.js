import Object from '../Object.js';

/**
 * Game object type for creating sprites.
 * @memberof RPGinia.App.World.Object
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
 * const engine = new RPGinia();
 * const app = new engine.App();
 * const world = new app.World();
 * 
 * world.initialize({
 *  // Your options here...
 * });
 * 
 * // createElement method from World class can create an object with indicated object type.
 * world.createElement({
 *  name: 'Test sprite',
 *  type: 'sprite',
 *  settings: {
 *    spriteSheetIndex: 0,
 *    spriteIndex: 1
 *  },
 *  coords: [10, 34, 56, 21]
 * });
 */
class Sprite extends Object {
    /**
     * @constructor
     * 
     * @param {Object} settings - object settings.
     * @param {String} settings.name - object name.
     * 
     * @param {Object} settings.settings - object settings for only this type.
     * @param {Number} settings.settings.spriteSheetIndex - sprite sheet number.
     * @param {Number} settings.settings.spriteIndex - sprite number.
     * @param {Number} [settings.settings.frameIndex=settings.frameFrom] - frame number. Works only if current sprite have the frame list. If frameFrom is not defined - setting up value to 0.
     * @param {Boolean} [settings.settings.isRepeating=false] - should animation repeating after it's ending (Works if current sprite have frame list).
     * @param {Boolean} [settings.settings.isPlaying=false] - should animation playing (Works only if current sprite have frame list).
     * @param {Number} [settings.settings.interval=60] - interval of changing animation frames.
     * @param {Number} [settings.settings.frameFrom=0] - frame from which the animation should be played.
     * @param {Number} [settings.settings.frameTo=frame list length] - frame to which the animation should be played.
     * 
     * @param {Number[]} settings.coords - object coordinations. First value - x coord, second value - y coord, third value - width, fourth value - height. If width and/or height are not defined - they will be taken from the sprite sheet.
     * @param {String} settings.type - object type. For this object type it is "sprite".
     * @param {Number} [settings.layer=1] - object layer.
     * @param {Boolean} [settings.isVisible=true] - show object in the playground.
     */
    constructor(settings) {
        super(settings);

        this._spriteSheets = this._world.currentLevel.data.spriteSheets;
        this._init();
    }

    _init() {
        if(!this._settings.coords[2]) {
            if(this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect)
                this._settings.coords[2] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect[2];
            else 
                this._settings.coords[2] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames[this._settings.settings.frameIndex].rect[2];
        }

        if(!this._settings.coords[3]) {
            if(this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect)
                this._settings.coords[3] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect[3];
            else 
                this._settings.coords[3] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames[this._settings.settings.frameIndex].rect[3];
        }

        this._settings.image = new Image();
        this._settings.isLoaded = false;
        
        this._settings.image.onload = () => this._settings.isLoaded = true;
        this._settings.image.src = this._appPath + this._spriteSheets[this._settings.settings.spriteSheetIndex].file;	
    
        this._setUpSettingsForAnimatedSprite();
    }

    _setUpSettingsForAnimatedSprite() {
        if(this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames) {
            if(!this._settings.settings.interval) 
                this._settings.settings.interval = 60;

            if(!this._settings.settings.frameFrom)
                this._settings.settings.frameFrom = 0;

            if(!this._settings.settings.frameTo)
                this._settings.settings.frameTo = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames.length-1;
            
            if(!this._settings.settings.frameIndex)
                this._settings.settings.frameIndex = this._settings.settings.frameFrom;
        
            if(!this._settings.settings.isRepeating)
                this._settings.settings.isRepeating = false;

            this._setUpAnimationInterval();
        }
    }

    _setUpAnimationInterval() {
        this._settings.settings.spriteAnimation = setInterval(() => {
            if(this._settings.settings.isPlaying) {
                if(this._settings.settings.frameIndex < this._settings.settings.frameTo)
                    this._settings.settings.frameIndex += 1;
                
                else {
                    if(this._settings.settings.isRepeating)
                        this._settings.settings.frameIndex = this._settings.settings.frameFrom;
                
                    else {
                        this._settings.settings.isPlaying = false;
                        clearInterval(this._settings.settings.spriteAnimation);
                        delete this._settings.settings.spriteAnimation;
                    }
                }
            }
            
            else {
                this._settings.settings.isPlaying = false;
                clearInterval(this._settings.settings.spriteAnimation);
                delete this._settings.settings.spriteAnimation;
            }
        }, this._settings.settings.interval);
    }

    /** 
     * Drawing object on the playground. 
     */
    draw() {
        if(this._settings.type === 'sprite' && this._settings.isLoaded) {
            const currentSprite = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex];        
            const spriteSheetCoords = currentSprite.rect ? currentSprite.rect : currentSprite.frames[this._settings.settings.frameIndex].rect;
            const spriteCoords = this._settings.coords;

            if(this._settings.settings.isPlaying && !this._settings.settings.spriteAnimation) {
                this._setUpAnimationInterval();
            }

            this._context.drawImage(
                this._settings.image,

                spriteSheetCoords[0], 
                spriteSheetCoords[1], 
                spriteSheetCoords[2], 
                spriteSheetCoords[3],
                
                spriteCoords[0] + this._camera.x, 
                spriteCoords[1] + this._camera.y, 
                spriteCoords[2] || spriteSheetCoords[2], 
                spriteCoords[3] || spriteSheetCoords[3]
            );
        }
    }

    /**
     * Drawing object borders and their central points. Works only if debug mode in World class is turned on.
     */
    drawInDebug() {
        super.drawInDebug();
    }
}

export default Sprite;