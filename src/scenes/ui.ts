import {SceneLayer} from "../controllers/sceneController";
import {Scene} from "../scene";
import {loadedFiles, resource} from "../config/resources";
import {App} from "../app";

export class UiScene extends Scene {
    // create a sprite for the spin button
    public spinButton: PIXI.Sprite;

    // create a sprite for the mute button
    public muteButton: PIXI.Sprite;

    // create a texture for each button state
    private buttonInactiveTexture: PIXI.Texture;
    private buttonOverTexture: PIXI.Texture;
    private buttonDownTexture: PIXI.Texture;
    private soundOffTexture: PIXI.Texture;
    private soundOffInactiveTexture: PIXI.Texture;
    private soundOnTexture: PIXI.Texture;
    private soundOnInactiveTexture: PIXI.Texture;
    private isMuted: boolean = true;

    constructor(layer: SceneLayer) {
        super(layer);
        this.create();
    }

    public update(delta: number): void {
    }

    public startSpin(): void {
        // change spin button texture to disabled stop button texture
        this.spinButton.texture = loadedFiles[resource.buttonClicked].texture;

        // on click we want to not be able to click it again for 3 seconds so we remove all listeners
        // and make it non interactive
        this.spinButton.removeAllListeners();
        window.removeEventListener("keydown", this.onSpaceSpin);
        this.spinButton.interactive = false;

        // re-add the mouse and keyboard listeners once 3 seconds pass and reset texture to default
        setTimeout(() => {
            this.spinButton.texture = loadedFiles[resource.buttonInactive].texture;
            this.addSpinButtonListeners();
            this.spinButton.interactive = true;
        }, 3000);
    }

    public muteButtonClicked(): void {
        // do nothing
    }

    protected create(): void {
        // set a texture for each button state of spin button and make it clickable
        this.buttonInactiveTexture = loadedFiles[resource.buttonInactive].texture;
        this.buttonOverTexture = loadedFiles[resource.buttonOver].texture;
        this.buttonDownTexture = loadedFiles[resource.buttonDown].texture;
        this.spinButton = new PIXI.Sprite(this.buttonInactiveTexture);
        this.spinButton.buttonMode = true;
        this.spinButton.interactive = true;
        this.sceneContainer.addChild(this.spinButton);

        // move it a bit below the reel as in requirements image
        this.spinButton.x = window.innerWidth * 2 / 3;
        this.spinButton.y = window.innerHeight * 2 / 3;

        // set a texture for each button state of mute button and make it clickable
        this.soundOnTexture = loadedFiles[resource.soundOn].texture;
        this.soundOnInactiveTexture = loadedFiles[resource.soundOnInactive].texture;
        this.soundOffTexture = loadedFiles[resource.soundOff].texture;
        this.soundOffInactiveTexture = loadedFiles[resource.soundOffInactive].texture;
        this.muteButton = new PIXI.Sprite(this.soundOffInactiveTexture);
        this.muteButton.buttonMode = true;
        this.muteButton.interactive = true;
        this.sceneContainer.addChild(this.muteButton);

        // move it opposite of spin button
        this.muteButton.x = window.innerWidth * 1 / 3;
        this.muteButton.y = this.spinButton.y + this.spinButton.height / 2;

        //add listeners to click down, click release, mouseover, mouseout and click
        this.addSpinButtonListeners();
        this.addMuteButtonListeners();
    }

    protected addMuteButtonListeners(): void {
        // when specified mouse event is detected, update displayed texture with correct button
        this.muteButton.on('pointertap', () => {
            if (this.isMuted) {
                this.muteButton.texture = this.soundOnTexture;
            } else {
                this.muteButton.texture = this.soundOffTexture;
            }
            this.isMuted = !this.isMuted;
            App.sceneController.muteButtonClicked();
        });
        this.muteButton.on('mouseover', () => {
            if (this.isMuted) {
                this.muteButton.texture = this.soundOffTexture;
            } else {
                this.muteButton.texture = this.soundOnTexture;
            }
        });
        this.muteButton.on('mouseout', () => {
            if (this.isMuted) {
                this.muteButton.texture = this.soundOffInactiveTexture;
            } else {
                this.muteButton.texture = this.soundOnInactiveTexture;
            }
        });
    }

    protected addSpinButtonListeners(): void {
        // when specified mouse event is detected, update displayed texture with correct button
        this.spinButton.on('mousedown', () => {
            this.spinButton.texture = this.buttonDownTexture;
        });
        this.spinButton.on('mouseup', () => {
            this.spinButton.texture = this.buttonInactiveTexture;
        });
        this.spinButton.on('mouseover', () => {
            this.spinButton.texture = this.buttonOverTexture;
        });
        this.spinButton.on('mouseout', () => {
            this.spinButton.texture = this.buttonInactiveTexture;
        });
        this.spinButton.on('pointertap', () => {
            // call startSpin function on scene controller to start the spin on both game and ui scenes
            App.sceneController.startSpin();
        });

        // add space button listener
        window.addEventListener("keydown", this.onSpaceSpin);
    }

    protected onSpaceSpin(event: KeyboardEvent): void {
        if (event.code == 'Space') {
            // call startSpin function on scene controller to start the spin on both game and ui scenes
            App.sceneController.startSpin();
        }
    }
}