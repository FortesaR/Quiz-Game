import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Category } from './scenes/Category';
import { Science } from './scenes/Science';
import {Geography } from  './scenes/Geography'
import { Sport } from './scenes/Sport';

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    backgroundColor: 'white',
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
