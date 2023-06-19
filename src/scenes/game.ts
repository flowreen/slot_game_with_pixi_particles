import {SceneLayer} from "../controllers/sceneController";
import {loadedFiles, resource} from "../config/resources";
import {Scene} from "../scene";
import {App} from "../app";
import {Emitter} from "../pixi-particles/Emitter";
import {EmitterConfig} from "../pixi-particles/EmitterConfig";

export class GameScene extends Scene {
    private mask: PIXI.Graphics;
    private background: PIXI.Sprite;
    private reel: PIXI.Sprite;
    private logo: PIXI.Sprite;
    private symbol: PIXI.Sprite;
    private reelContainer: PIXI.Container;
    private fpsCounter: PIXI.Text;
    private backgroundMusic: HTMLAudioElement;
    private muteClick: HTMLAudioElement;
    private particlesSpawn: HTMLAudioElement;
    private reelStop: HTMLAudioElement;
    private spinClick: HTMLAudioElement;
    private soundsArray: Array<HTMLAudioElement> = [];
    private muted: boolean = false;

    constructor(layer: SceneLayer) {
        super(layer);
        this.create();
    }

    // update FPS counter
    public update(delta: number): void {
        this.fpsCounter.text = "FPS:" + Math.round(PIXI.ticker.shared.FPS);
    }

    public startSpin(): void {
        // start spin click sound
        this.spinClick.play();

        // start ticker update to animate symbols container going down
        App.application.ticker.add(this.moveReelContainerDown, this);

        // remove the ticker and reset the container position once spin finishes
        setTimeout(() => {
            App.application.ticker.remove(this.moveReelContainerDown, this);
            this.sceneContainer.removeChild(this.reelContainer);
            this.reelContainer = null;
            this.createSymbolsColumn();
            // start reel stop sound
            this.reelStop.play();

            // start particleSpawn sound and animation after a delay
            setTimeout(() => {
                this.particlesSpawn.play();
                this.addParticleEmitters();
            }, 200);
        }, 3000);
    }

    // on mute button click enable/disable all sounds
    public muteButtonClicked(): void {
        this.muted = !this.muted;
        this.soundsArray.forEach(sound => {
            sound.muted = this.muted;
            if (this.muted) {
                sound.volume = 0;
            } else {
                sound.volume = 1;
            }
        });
        if (!this.muted) {
            this.muteClick.play();
        }
    }

    protected create(): void {
        // initialize background music
        this.backgroundMusic = new Audio(loadedFiles[resource.music].url);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.autoplay = true;

        // initialize other sounds
        this.muteClick = new Audio(loadedFiles[resource.muteClick].url);
        this.particlesSpawn = new Audio(loadedFiles[resource.particlesSpawn].url);
        this.reelStop = new Audio(loadedFiles[resource.reelStop].url);
        this.spinClick = new Audio(loadedFiles[resource.spinClick].url);

        // add all sound buttons to array to mute them
        this.soundsArray.push(this.backgroundMusic);
        this.soundsArray.push(this.muteClick);
        this.soundsArray.push(this.particlesSpawn);
        this.soundsArray.push(this.reelStop);
        this.soundsArray.push(this.spinClick);
        this.muteButtonClicked();

        // add background image and center it
        this.background = new PIXI.Sprite(loadedFiles[resource.background].texture);
        this.sceneContainer.addChild(this.background);
        this.background.x = window.innerWidth / 2 - this.background.width / 2;
        this.background.y = window.innerHeight / 2 - this.background.height / 2;

        // add fps counter on top left
        let loadingStyle = new PIXI.TextStyle({
            fill: "#00FF00",
            fontSize: 10
        });
        this.fpsCounter = new PIXI.Text("FPS:", loadingStyle);
        this.sceneContainer.addChild(this.fpsCounter);
        this.fpsCounter.x = 80;
        this.fpsCounter.y = 0;

        // add the reel in the center
        this.reel = new PIXI.Sprite(loadedFiles[resource.reel].texture);
        this.sceneContainer.addChild(this.reel);
        this.reel.x = window.innerWidth / 2 - this.reel.width / 2;
        this.reel.y = window.innerHeight / 2 - this.reel.height / 2;

        // add game logo above the reel
        this.logo = new PIXI.Sprite(loadedFiles[resource.logo].texture);
        this.sceneContainer.addChild(this.logo);
        this.logo.x = window.innerWidth / 2 - this.logo.width / 2;
        this.logo.y = this.reel.y - this.logo.height;

        // add the mask in the center of the reel
        this.mask = new PIXI.Graphics();
        this.mask.drawRect(0, 0, 150, 452);
        this.mask.lineStyle(0);
        this.sceneContainer.addChild(this.mask);
        this.mask.x = window.innerWidth / 2 - this.mask.width / 2;
        this.mask.y = window.innerHeight / 2 - this.mask.height / 2;

        this.createSymbolsColumn();
    }

    protected createSymbolsColumn(): void {
        // create a column of 30 symbols starting from the bottom, to tween vertically during spin time
        this.reelContainer = new PIXI.Container();
        for (let i = 0; i < 30; i++) {
            this.symbol = new PIXI.Sprite(loadedFiles[resource.symbol].texture);
            this.symbol.x = this.mask.x + this.mask.width - this.symbol.width;

            // vertical distance between each 2 symbols is 8.5px
            // (452px mask height-3*145px symbol height)/2 spaces between the 3 symbols = 8.5 pixels
            this.symbol.y = this.mask.y + this.mask.height - this.symbol.height - i * (8.5 + this.symbol.height);
            this.reelContainer.addChild(this.symbol);
        }
        this.sceneContainer.addChild(this.reelContainer);

        // make the mask container a mask for the symbols column
        this.reelContainer.mask = this.mask;
    }

    protected moveReelContainerDown(delta): void {
        // use delta to create frame-independent transform
        this.reelContainer.y += 20 * delta;
    }

    protected addParticleEmitters(): void {
        // create a red particles emitter and place it inside a box with a quarter of screen edge
        let redEmitter = new Emitter(this.sceneContainer, loadedFiles[resource.particle].texture, loadedFiles[resource.emitterConfigRed].data as EmitterConfig)
        redEmitter.updateSpawnPos(((Math.random() * 2 + 1) / 4) * window.innerWidth, ((Math.random() * 2 + 1) / 4) * window.innerHeight);
        redEmitter.emit = true;

        // create a yellow particles emitter and place it inside a box with a quarter of screen edge
        let yellowEmitter = new Emitter(this.sceneContainer, loadedFiles[resource.particle].texture, loadedFiles[resource.emitterConfigYellow].data as EmitterConfig)
        yellowEmitter.updateSpawnPos(((Math.random() * 2 + 1) / 4) * window.innerWidth, ((Math.random() * 2 + 1) / 4) * window.innerHeight);
        yellowEmitter.emit = true;

        // create a blue particles emitter and place it inside a box with a quarter of screen edge
        let blueEmitter = new Emitter(this.sceneContainer, loadedFiles[resource.particle].texture, loadedFiles[resource.emitterConfigBlue].data as EmitterConfig)
        blueEmitter.updateSpawnPos(((Math.random() * 2 + 1) / 4) * window.innerWidth, ((Math.random() * 2 + 1) / 4) * window.innerHeight);
        blueEmitter.emit = true;

        // start the ticker update to animate particle emitters
        App.application.ticker.add(delta => {
            redEmitter.update(0.01);
            yellowEmitter.update(0.01);
            blueEmitter.update(0.01);
        });
    }
}