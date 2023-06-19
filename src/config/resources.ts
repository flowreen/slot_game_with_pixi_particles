export class Resources {
    static filesPath =
        {
            // added here all the image files that are being used
            background: './src/assets/image/background.png',
            symbol: './src/assets/image/symbol.png',
            reel: './src/assets/image/reel.png',
            logo: './src/assets/image/logo.png',
            particle: './src/assets/image/particle.png',
            buttonInactive: './src/assets/image/buttonInactive.png',
            buttonClicked: './src/assets/image/buttonClicked.png',
            soundOn: './src/assets/image/soundOn.png',
            soundOnInactive: './src/assets/image/soundOnInactive.png',
            soundOff: './src/assets/image/soundOff.png',
            soundOffInactive: './src/assets/image/soundOffInactive.png',
            buttonDown: './src/assets/image/buttonDown.png',
            buttonOver: './src/assets/image/buttonOver.png',

            // added here all the particle emitter config files that are being used
            emitterConfigRed: './src/assets/emitter/emitterConfigRed.json',
            emitterConfigYellow: './src/assets/emitter/emitterConfigYellow.json',
            emitterConfigBlue: './src/assets/emitter/emitterConfigBlue.json',

            // added here all the sound files that are being used
            music: './src/assets/sounds/music.mp3',
            muteClick: './src/assets/sounds/muteClick.mp3',
            particlesSpawn: './src/assets/sounds/particlesSpawn.mp3',
            reelStop: './src/assets/sounds/reelStop.mp3',
            spinClick: './src/assets/sounds/spinClick.mp3'
        };

    static loadResources(cbProgress: Function, cbComplete: Function): void {
        Object.keys(Resources.filesPath).forEach(key => {
            let path = Resources.filesPath[key];
            PIXI.loader.add(key, path);
        });

        PIXI.loader.on('progress', () => {
            cbProgress(PIXI.loader.progress);
        })

        PIXI.loader.load(() => {
            loadedFiles = PIXI.loader.resources;
            cbComplete();
        });
    }
}

export let loadedFiles: PIXI.loaders.Resource | PIXI.loaders.ResourceDictionary;
export let resource = {
    title: 'title',
    background: 'background',
    symbol: 'symbol',
    buttonInactive: 'buttonInactive',
    buttonDown: 'buttonDown',
    buttonOver: 'buttonOver',
    buttonClicked: 'buttonClicked',
    soundOn: 'soundOn',
    soundOnInactive: 'soundOnInactive',
    soundOff: 'soundOff',
    soundOffInactive: 'soundOffInactive',
    particle: 'particle',
    reel: 'reel',
    logo: 'logo',
    emitterConfigRed: 'emitterConfigRed',
    emitterConfigYellow: 'emitterConfigYellow',
    emitterConfigBlue: 'emitterConfigBlue',
    music: 'music',
    muteClick: 'muteClick',
    particlesSpawn: 'particlesSpawn',
    reelStop: 'reelStop',
    spinClick: 'spinClick'
};