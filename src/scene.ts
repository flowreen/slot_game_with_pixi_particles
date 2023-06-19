import {SceneLayer} from "./controllers/sceneController";

export abstract class Scene {
    public sceneContainer: PIXI.Container;
    public readonly layer: SceneLayer;

    constructor(layer: SceneLayer) {
        this.sceneContainer = new PIXI.Container();
        this.layer = layer;
    }

    public show() {
        this.sceneContainer.visible = true;
    }

    public hide() {
        this.sceneContainer.visible = false;
    }

    public destroy() {
        this.sceneContainer.removeAllListeners();
        this.sceneContainer.removeChildren();
    }

    public abstract update(delta: number): void;

    protected abstract create(): void;

    // add a startSpin method to be able communicate between scenes
    public abstract startSpin():void;

    // add a muteButtonClicked method to be able communicate between scenes
    public abstract muteButtonClicked():void;
}