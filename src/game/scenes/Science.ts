import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
 import {Sciencequestions } from '../../question'; 

interface Question {
    question: string;
    answers: string[];
    correctAnswer: number;
}

export class Science extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    questionText: Phaser.GameObjects.Text | null;
    answerButtons: Phaser.GameObjects.Rectangle[] = [];
    questions: Question[] = [];
    currentQuestionIndex: number = 0;
    score: number = 0; 
    scoreText: Phaser.GameObjects.Text | null; 
    winningSound: Phaser.Sound.BaseSound | null = null; 

    constructor() {
        super('Science');
    }

    preload() {
        this.load.image('backgroundPic', '../../assets/blackboard1.png');
        this.load.audio('winningSound', ['../../assets/winner-bell-game-show-91932.mp3', ]);
        this.load.audio('loseSound', ['../../assets/marimba-lose-250960.mp3'])
    }

    create() {
        this.camera = this.cameras.main;

        const centerX = this.camera.width / 2;
        const centerY = this.camera.height / 2;

        
        this.background = this.add.image(centerX, centerY, 'backgroundPic');
        this.background.setDisplaySize(this.camera.width, this.camera.height); 

        this.resetGame();

        
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
        });

        this.questions = Sciencequestions;
        
        

        this.showQuestion();
        EventBus.emit('current-scene-ready', this);
    }

    resetGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
    }

    cleanBoardAnimation(onComplete: () => void) {
        if (this.questionText) {
            this.tweens.add({
                targets: this.questionText,
                scaleY: 0,
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    this.questionText?.destroy();
                    onComplete();
                },
            });
        } else {
            onComplete();
        }
    }
    
    showQuestion() {
        const centerX = this.camera.width / 2;
        const centerY = this.camera.height / 2;
    
       
        this.cleanBoardAnimation(() => {
           
            if (this.questionText) {
                this.questionText.destroy();
                this.questionText = null; 
            }
    
            
            this.answerButtons.forEach(button => button.destroy());
            this.answerButtons = []; 
            const currentQuestion = this.questions[this.currentQuestionIndex];
    
            const questionCard = this.add.rectangle(centerX, centerY - 100, 700, 200, 0x004d00)
                .setOrigin(0.5)
                .setStrokeStyle(10, 0x8B4513);
    
            
            this.questionText = this.add.text(centerX, centerY - 100, currentQuestion.question, {
                fontFamily: 'Arial Black',
                fontSize: 22,
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5).setAlpha(0).setScale(1);
    
           
            this.tweens.add({
                targets: this.questionText,
                alpha: 1,
                scaleY: 1,
                duration: 500,
                ease: 'Power2'
            });
    
            
            currentQuestion.answers.forEach((answer, index) => {
                const buttonY = centerY + index * 60;
                const answerButton = this.add.rectangle(centerX, buttonY, 600, 50, 0x8B4513, 1)
                    .setOrigin(0.5)
                    .setInteractive()
                    .on('pointerover', () => answerButton.setFillStyle(0xe8d09f))
                    .on('pointerout', () => answerButton.setFillStyle(0x8B4513))
                    .on('pointerdown', () => this.checkAnswer(index));
    
                
                this.tweens.add({
                    targets: answerButton,
                    alpha: { from: 0, to: 1 },
                    duration: 500,
                    ease: 'Power2',
                    delay: index * 200
                });
    
                
                this.add.text(centerX, buttonY, answer, {
                    fontFamily: 'Arial Black',
                    fontSize: 28,
                    color: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);
    
                this.answerButtons.push(answerButton);
            });
        });
    }
    

    checkAnswer(selectedIndex: number) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const selectedButton = this.answerButtons[selectedIndex];

        if (selectedIndex === currentQuestion.correctAnswer) {
            console.log('Correct!');
            selectedButton.setFillStyle(0x00ff00);
            
            
            this.sound.play('winningSound');

           
            this.score += 10; 
            this.scoreText?.setText(`Score: ${this.score}`);
        } else {
            console.log('Wrong!');
            this.sound.play('loseSound');
            selectedButton.setFillStyle(0xff0000);
        }

        this.tweens.add({
            targets: selectedButton,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 300
        });

        this.time.delayedCall(1000, () => {
            this.currentQuestionIndex++;

            if (this.currentQuestionIndex < this.questions.length) {
                this.showQuestion();
            } else {
                console.log('Quiz finished!');
                this.scene.start('GameOver', { finalScore: this.score });
            }
        });
    }

    changeScene() {
        this.scene.start('GameOver', { finalScore: this.score });
    }
}
