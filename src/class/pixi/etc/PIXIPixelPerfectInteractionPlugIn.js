/**
 * PIXI-js v4.xx pixel perfect interaction plugin
 */


const tempPoint = new PIXI.Point();
const hitTestCanvas = document.createElement('canvas');
hitTestCanvas.width = 1;
hitTestCanvas.height = 1;
const hitTestConText = hitTestCanvas.getContext("2d");

export class PIXIPixelPerfectInteractionPlugIn {
    constructor() {
        this._overwriteHitTestMethod(PIXI.Sprite.prototype);
    }

    /**
     * @private
     */
    _overwriteHitTestMethod(p) {
        /**
         * if true use pixel-perfect hit test
         * @type {boolean}
         */
        p.pixelPerfect = false;
        /**
         *
         * @type {number} not ratio. 16 bit value.
         */
        p.pixelPerfectAlpha = 0;

        
        p.containsPoint = function(point) //overwrite PIXI.Sprite.containsPoint
        {
            this.worldTransform.applyInverse(point, tempPoint);

            const width = this._texture.orig.width;
            const height = this._texture.orig.height;
            const x1 = -width * this.anchor.x;
            let y1 = 0;

            if (tempPoint.x >= x1 && tempPoint.x < x1 + width)
            {
                y1 = -height * this.anchor.y;

                if (tempPoint.y >= y1 && tempPoint.y < y1 + height)
                {
                    if(this.pixelPerfect) {
                        return this._pixelHasAlpha(tempPoint.x, tempPoint.y);
                    }
                    return true;
                }
            }
            return false;
        };// end p.containsPoint


        p._pixelHasAlpha = function(x, y) { //add method into PIXI.Sprite
            let texture = this.texture;
            let anchor = this.anchor;
            let frame = texture.frame;

            if (anchor.x !== 0)
            {
                x -= -frame.width * anchor.x;
            }

            if (anchor.y !== 0)
            {
                y -= -frame.height * anchor.y;
            }

            x += frame.x;
            y += frame.y;

            let ctx = hitTestConText;

            ctx.clearRect(0, 0, 1, 1);
            ctx.drawImage(texture.baseTexture.source, x, y, 1, 1, 0, 0, 1, 1);
            let rgb = ctx.getImageData(0, 0, 1, 1);
            return rgb.data[3] > this.pixelPerfectAlpha;
        }; //end p._checkPixel


    }
}