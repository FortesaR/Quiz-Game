import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { sportQuestions, sportQuestionsHard } from '../../question';

interface Question {
    question: string;
    answers: string[];
    correctAnswer: number;
}

export class Sport extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    questionText: Phaser.GameObjects.Text | null = null;
    answerButtons: Phaser.GameObjects.Rectangle[] = [];
    questions: Question[] = [];
    currentQuestionIndex: number = 0;
    score: number = 0; 
    scoreText: Phaser.GameObjects.Text | null = null; 
    winningSound: Phaser.Sound.BaseSound | null = null; 
    timerText: Phaser.GameObjects.Text | null;
    timer: number = 30; 
    timerEvent: Phaser.Time.TimerEvent | null = null;

    constructor() {
        super('Sport');
    }

    preload() {
        this.load.image('backgroundPic', '../../assets/blackboard1.png');
        this.load.audio('winningSound', ['../../assets/winner-bell-game-show-91932.mp3']);
        this.load.audio('loseSound', ['../../assets/marimba-lose-250960.mp3']);
    }

    create(data: { level: string }) {
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

        if (data.level === 'Hard') {
            this.questions = sportQuestionsHard;
            this.startTimer(); 
        } else {
            this.questions = sportQuestions; 
        }

        this.showQuestion();
        EventBus.emit('current-scene-ready', this);
    }

    resetGame() {
        this.currentQuestionIndex = 0;
        this.score = 0; 
        this.timer = 30; 
    }

    startTimer() {
        this.timerText = this.add.text(this.camera.width - 200, 16, `Time: ${this.timer}`, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
        });

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });
    }

    resetTimer() {
        this.timer = 30; 
        this.timerText?.setText(`Time: ${this.timer}`);
        this.timerText?.setColor('#ffffff'); 
        
        if (this.timerText) {
            this.tweens.killTweensOf(this.timerText);
        }
    
        this.timerEvent?.remove(); 
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });
    }
    
    onTimerTick() {
        this.timer--;
        this.timerText?.setText(`Time: ${this.timer}`);

        if (this.timer === 10) {
            this.timerText?.setColor('#ff0000');

            
            this.tweens.add({
                targets: this.timerText,
                scaleX: 1.2,
                scaleY: 1.2,
                yoyo: true,
                repeat: -1,
                duration: 500,
                ease: 'Bounce'
            });
        }

        if (this.timer <= 0) {
            this.timerExpired();
        }
    }

    timerExpired() {
        console.log('Time expired!');
        this.timerEvent?.remove(); 
        this.currentQuestionIndex++; 
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion(); 
        } else {
            console.log('Quiz finished!');
            this.scene.start('GameOver', { finalScore: this.score });
        }
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
                fontSize: 28,
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

            this.resetTimer();
        });
    }

    checkAnswer(selectedIndex: number) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const selectedButton = this.answerButtons[selectedIndex];

        if (selectedIndex === currentQuestion.correctAnswer) {
            console.log('Correct!');
            selectedButton.setFillStyle(0x00ff00);
            this.sound.play('winningSound');

            let points = 10; // Default score
            if (this.timer < 10) {
                points = 4;
                selectedButton.setFillStyle(0xff0000); // Less than 10 seconds
            } else if (this.timer < 15) {
                points = 6; // Between 10 and 14 seconds
            } else if (this.timer < 20) {
                points = 8; // Between 15 and 19 seconds
            }

            this.score += points; 
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
                this.timerEvent?.remove();
                this.scene.start('GameOver', { finalScore: this.score });
            }
        });
    }

    changeScene() {
        this.scene.start('GameOver', { finalScore: this.score });
    }
}
