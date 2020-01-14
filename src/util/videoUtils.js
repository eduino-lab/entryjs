const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;
import { GEHelper } from '../graphicEngine/GEHelper';
class VideoUtils {
    constructor() {
        this.isInitialized = false;
        this.video = null;
        this.canvasVideo = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
        this.initialize();
    }

    reset() {
        this.turnOffWebcam();
        this.canvasVideo = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
    }

    async initialize() {
        console.log(this.video, this.canvasVideo);
        if (this.isInitialized) {
            return;
        }
        console.log('initialize');
        navigator.getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: 'user',
                    width: VIDEO_WIDTH,
                    height: VIDEO_HEIGHT,
                },
            });
            this.video = document.createElement('video');
            this.video.srcObject = stream;
            this.video.width = 480;
            this.video.height = 270;
            this.video.onloadedmetadata = async (e) => {
                // const mobilenet = await posenet.load({
                //     architecture: 'MobileNetV1',
                //     outputStride: 16,
                //     inputResolution: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
                //     multiplier: 1,
                // });
                // setNet(mobilenet);
                // const posenetInstance = await posenet.load();
                // setNet(posenetInstance);
                this.initialized = true;
                this.video.play();
                console.log('done initializing');
                // getPose();
            };
        } else {
            console.log('getUserMedia not supported');
        }
    }

    async checkUserCamAvailable() {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            return true;
        } catch (err) {
            return false;
        }
    }
    // camera power
    cameraSwitch(value) {
        switch (value) {
            case 'on':
                this.turnOnWebcam();
                break;
            default:
                this.turnOffWebcam();
                break;
        }
    }

    turnOffWebcam() {
        Entry.stage.canvas.removeChild(this.canvasVideo);
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }

    turnOnWebcam() {
        if (!this.canvasVideo) {
            this.canvasVideo = GEHelper.getVideoElement(this.video);
            Entry.addEventListener('dispatchEventDidToggleStop', this.reset.bind(this));
        }

        // initialOption
        this.canvasVideo.x = -240;
        this.canvasVideo.y = -135;
        this.canvasVideo.width = 480;
        this.canvasVideo.height = 270;
        this.canvasVideo.scaleX = 0.75;
        this.canvasVideo.scaleY = 0.75;
        this.canvasVideo.alpha = 0.5;
        Entry.stage.canvas.addChildAt(this.canvasVideo, 2);
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }
    // option change
    setOptions(target, value) {
        switch (target) {
            case 'brightness':
                this.setBrightness(value);
                createjs.Ticker.on('tick', Entry.stage.canvas);
                break;
            case 'opacity':
                this.setAlpha(value);
                break;
            case 'hflip':
                this.hflip();
                break;
            case 'vflip':
                this.vflip();
                break;
        }
    }
    setBrightness(brightVal) {
        GEHelper.setVideoBrightness(this.canvasVideo, brightVal);
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }
    setAlpha(alphaVal) {
        this.canvasVideo.alpha = alphaVal / 100;
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }
    hflip() {
        const { x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY } = this.canvasVideo;
        this.canvasVideo.setTransform(-x, y, -scaleX, scaleY, rotation, skewX, skewY, regX, regY);
        this.flipStatus.horizontal = !this.flipStatus.horizontal;
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }
    vflip() {
        const { x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY } = this.canvasVideo;
        this.canvasVideo.setTransform(x, -y, scaleX, -scaleY, rotation, skewX, skewY, regX, regY);
        this.flipStatus.vertical = !this.flipStatus.vertical;
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }
}

//Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new VideoUtils();
