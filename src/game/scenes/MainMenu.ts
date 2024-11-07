import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    playButton: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    playButtonTween: Phaser.Tweens.Tween | null;
    backgroundMusic: Phaser.Sound.BaseSound; 
    isMuted: boolean; 
    muteButton: GameObjects.Image; 

    constructor() {
        super('MainMenu');
        this.logoTween = null;
        this.playButtonTween = null;
        this.isMuted = false; 
    }

    preload() {
        
        this.load.image('backgroundImage', '../../assets/Quiz.png');
        this.load.audio('backgroundMusic', '../../assets/8bit-music-for-game-68698.mp3');
        this.load.image('muteButton', '../../assets/icons8-mute-48.png');
        this.load.image('logo', '../../assets/logo12.png'); 
    }

    create() {
        const { width, height } = this.scale; 

        
        this.add.image(0, 0, 'backgroundImage').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

      
        this.logo = this.add.image(width / 2, height / 3, 'logo')
            .setDepth(100)
            .setScale(0.2)
            .setOrigin(0.5, 0.5);

        this.logoTween = this.tweens.add({
            targets: this.logo,
            y: { value: height / 3 + 20, duration: 2000, ease: 'Sine.easeInOut' }, 
            yoyo: true,
            repeat: -1
        });

       
        this.playButton = this.add.text(width / 2, height / 2, 'Play', {
            fontFamily: 'Comic Sans MS',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(100)
        .setInteractive()
        .on('pointerdown', () => this.changeScene())
        .on('pointerover', () => this.playButton.setStyle({ fill: ' #87CEEB' }))
        .on('pointerout', () => this.playButton.setStyle({ fill: '#fff' }));

        this.playButtonTween = this.tweens.add({
            targets: this.playButton,
            scaleX: { value: 1.1, duration: 800, ease: 'Quad.easeInOut' },
            scaleY: { value: 1.1, duration: 800, ease: 'Quad.easeInOut' },
            yoyo: true,
            repeat: -1
        });

        
        this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.5, loop: true });
        this.backgroundMusic.play();

        
        this.muteButton = this.add.image(width - 80, 50, 'muteButton') 
            .setOrigin(0.5)
            .setScale(1.5)  
            .setInteractive()
            .on('pointerdown', () => this.toggleMute()); 

        EventBus.emit('current-scene-ready', this);
    }

    toggleMute() {
       
        this.isMuted = !this.isMuted;

        
        if (this.backgroundMusic instanceof Phaser.Sound.WebAudioSound || this.backgroundMusic instanceof Phaser.Sound.HTML5AudioSound) {
            this.backgroundMusic.mute = this.isMuted; 
        }

        
        if (this.isMuted) {
            this.muteButton.setTint(0xff0000); 
        } else {
            this.muteButton.clearTint();         
        }
    }

    changeScene() {
        
        if (this.logoTween) this.logoTween.stop();
        if (this.playButtonTween) this.playButtonTween.stop();

    
        this.cameras.main.fadeOut(1000, 0, 0, 0); 
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CategoryMenu'); 
        });
    }

    moveLogo(vueCallback: ({ x, y }: { x: number, y: number }) => void) {
        if (this.logoTween) {
          
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
           
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 600, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 100, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                  
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
