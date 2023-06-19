import {SceneController, SceneLayer} from "./controllers/sceneController";
import {LoadScene} from "./scenes/loader";
import {GameScene} from "./scenes/game";
import {UiScene} from "./scenes/ui";

export class App extends PIXI.Application {
    // use the 3 default scenes from template
    public static Scenes = {"LoadScene": LoadScene, "GameScene": GameScene, "UIScene": UiScene};
    private static instance: App;

    constructor() {
        let canvas = <HTMLCanvasElement>document.getElementById('canvas');
        super({
            view: canvas,
            // set the width/height size as half of the background image hoping it would help on resize
            width: 1080,
            height: 540,
            // Use the native window resolution as the default resolution
            // will support high-density displays when rendering
            resolution: window.devicePixelRatio,
            antialias: false,
            transparent: true,
            backgroundColor: 0x000000,
            roundPixels: true,
            autoResize: true,
        });

        document.body.appendChild(this.view);
    }

    private static _sceneController: SceneController;

    static get sceneController(): SceneController {
        return this._sceneController;
    }

    // create singleton instance
    public static get application(): App {
        if (!this.instance) {
            this.instance = new App();
            this.startControllers();
            this.instance.addListeners();
            this.instance.init();
        }
        return this.instance;
    }

    private static startControllers(): void {
        this._sceneController = new SceneController();
    }

    public resize() {
        // couldn't find a better resize function
        this.renderer.resize(window.innerWidth, window.innerHeight);
    }

    private init(): void {
        App.sceneController.loadScene(App.Scenes.LoadScene, SceneLayer.GAME);
    }

    private addListeners(): void {
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }
}

window.onload = () => {
    App.application;
};