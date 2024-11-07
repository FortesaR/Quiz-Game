import { AUTO, Game, Types } from 'phaser'; // Consolidate imports from Phaser
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Category } from './scenes/Category';
import { Science } from './scenes/Science';
import { Game as MainGame } from './scenes/Game';
import { Geography } from './scenes/Geography';
import { Sport } from './scenes/Sport';
import { GameOver } from './scenes/GameOver';

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 668, 
    backgroundColor: '#ffffff',  
    parent: 'game-container',    
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Category,
        Science,
        MainGame,
        Geography,
        Sport,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};


const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
