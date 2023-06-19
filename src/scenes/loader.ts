import {App} from "../app";
import {SceneLayer} from "../controllers/sceneController";
import {Resources} from "../config/resources";
import {Scene} from "../scene";

export class LoadScene extends Scene {
    private loadingText: PIXI.Text;

    constructor(layer: SceneLayer) {
        super(layer);
        this.create();
    }

    public update(delta: number): void {
    }

    public startSpin(): void {
        // do nothing
    }

    public muteButtonClicked(): void {
        // do nothing
    }

    // the loading code below was already present in template
    protected create(): void {
        const loadingStyle = new PIXI.TextStyle({
            fill: "#00FF00",
            fontSize: 50
        });

        this.loadingText = new PIXI.Text('Please Wait.', loadingStyle);
        this.sceneContainer.addChild(this.loadingText);
        this.loadingText.x = window.innerWidth / 2 - this.loadingText.width / 2;
        this.loadingText.y = window.innerHeight / 2 - this.loadingText.height / 2;

        Resources.loadResources(this.onLoadProgressChange.bind(this), this.onLoadComplete.bind(this));
    }

    private onLoadProgressChange(progress: number): void {
        this.loadingText.text = 'Loading ' + progress.toFixed(0) + '%';
    }

    private onLoadComplete(): void {
        setTimeout(() => {
            App.sceneController.loadScene(App.Scenes.GameScene, SceneLayer.GAME);
            App.sceneController.loadScene(App.Scenes.UIScene, SceneLayer.UI)

            // remove loading text once scenes loaded
            this.sceneContainer.removeChild(this.loadingText);
            this.loadingText = null;
        }, 500);
    }
}