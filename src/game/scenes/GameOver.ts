import { Scene } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    finalScoreText: Phaser.GameObjects.Text;
    playAgainButton: Phaser.GameObjects.Text;

    constructor() {
        super('GameOver');
    }

    create(data: { finalScore: number }) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        const centerX = this.camera.width / 2;
        const centerY = this.camera.height / 2;

        this.background = this.add.image(centerX, centerY, 'background');
        this.background.setAlpha(0.5);

        
        const message = data.finalScore >= 70 ? 'Congratulations! You Won!' : 'Game Over';
        
       
        this.gameOverText = this.add.text(centerX, centerY - 100, message, {
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        
        this.finalScoreText = this.add.text(centerX, centerY, `Final Score: ${data.finalScore}`, {
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        
        this.playAgainButton = this.add.text(centerX, centerY + 100, 'Play Again', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            backgroundColor: '#0000ff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        
        this.playAgainButton.on('pointerdown', () => {
            this.restartGame(); 
        });  
    }

    restartGame() {
        
        this.sound.stopAll();

       
        this.scene.start('MainMenu'); 
    }
}
