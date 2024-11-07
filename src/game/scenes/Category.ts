import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Category extends Scene {
    categories: string[];
    categoryButtons: GameObjects.Text[];
    selectedCategory: string | null = null;
    titleText: GameObjects.Text | null = null;
    backButton: GameObjects.Image | null = null; 

    constructor() {
        super('CategoryMenu');
        this.categories = ['Science', 'Game', 'Geography', 'Sport'];
        this.categoryButtons = [];
    }

    preload() {
        this.load.image('backgroundImage', '../../assets/Quiz.png');
        this.load.image('backButtonImage', '../../assets/icons8-back-button-48.png'); 
    }

    create() {
        const { width, height } = this.scale;

        this.add.image(0, 0, 'backgroundImage').setOrigin(0, 0).setDisplaySize(width, height);

     
        this.titleText = this.add.text(width / 2, height / 4, 'Choose Category', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

       
        const buttonHeight = 40;
        const spacing = 20;
        const totalButtonHeight = this.categories.length * buttonHeight + (this.categories.length - 1) * spacing;
        const startY =  (height - totalButtonHeight) / 2;

        this.categories.forEach((category, index) => {
            const button = this.add.text(width / 2, startY + index * (buttonHeight + spacing), category, {
                fontFamily: 'Arial Black',
                fontSize: 32,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.selectCategory(category))
            .on('pointerover', () => button.setStyle({ fill: '#ff0' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));

            this.categoryButtons.push(button);
        });

        
        this.backButton = this.add.image(50, height - 50, 'backButtonImage') 
            .setOrigin(0.5) 
            .setInteractive()
            .on('pointerdown', () => this.goBack())
            .setScale(1.5); 

        EventBus.emit('current-scene-ready', this);
    }

    
    selectCategory(category: string) {
        console.log(`Selected category: ${category}`);
        this.selectedCategory = category;

        
        this.titleText?.destroy();
        this.categoryButtons.forEach(button => button.destroy());
        this.backButton?.destroy(); 

        
        this.showLevelSelection();
    }

    showLevelSelection() {
        const { width, height } = this.scale;

        this.titleText = this.add.text(width / 2, height / 4, 'Choose Level', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        const levelSpacing = 100;
        ['Easy', 'Hard'].forEach((level, index) => {
            const button = this.add.text(width / 2, height / 3 + index * levelSpacing, level, {
                fontFamily: 'Arial Black',
                fontSize: 32,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.startQuizScene(level))
            .on('pointerover', () => button.setStyle({ fill: '#ff0' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));

            this.categoryButtons.push(button);
        });

       
        this.backButton = this.add.image(50, height - 50, 'backButtonImage') 
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.goBack())
            .setScale(1.5); 
    }

    
    goBack() {
        console.log('Going back to the previous scene');
        this.scene.start('MainMenu'); 
    }


    startQuizScene(level: string) {
        if (this.selectedCategory) {
            console.log(`Starting ${this.selectedCategory} with ${level} level`);
            this.scene.start(this.selectedCategory, { level });
        }
    }
}
