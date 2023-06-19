import {Container} from "pixi.js";
import {App} from "../app";
import {Scene} from "../scene";

export enum SceneLayer { UI, GAME}

export class SceneController {
    private lastLoadedScene: Scene;
    private loadedScenes: Scene[] = [];
    private uiLayer: PIXI.Container;
    private gameLayer: PIXI.Container;

    constructor() {
        this.gameLayer = new Container();
        this.uiLayer = new Container();
        App.application.stage.addChild(this.gameLayer);
        App.application.stage.addChild(this.uiLayer);
        App.application.ticker.add(this.mainUpdate.bind(this))
    }

    public loadScene(scene: any, layer: SceneLayer): void {
        this.lastLoadedScene = new scene(layer);
        this.loadedScenes.push(this.lastLoadedScene);
        this.addSceneContainer();
    }

    // call in all scenes the startSpin functionality
    public startSpin(): void {
        this.loadedScenes.forEach(scene => {
           scene.startSpin();
        });
    }

    // call in all scenes the startSpin functionality
    public muteButtonClicked(): void {
        this.loadedScenes.forEach(scene => {
            scene.muteButtonClicked();
        });
    }

    private addSceneContainer(): void {
        if (this.lastLoadedScene.layer == SceneLayer.UI) {
            this.uiLayer.addChild(this.lastLoadedScene.sceneContainer);
        } else {
            this.gameLayer.addChild(this.lastLoadedScene.sceneContainer);
        }
    }

    private mainUpdate(delta): void {
        this.loadedScenes.forEach(scene => {
            scene.update(delta);
        });
    }
}