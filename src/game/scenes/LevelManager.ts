// LevelManager.ts
import { Scene } from 'phaser';

export type Level = 'Easy' | 'Hard';

export class LevelManager {
    scene: Scene;
    level: Level;
    timerEvent: Phaser.Time.TimerEvent | null = null;
    timerDuration: number;

    constructor(scene: Scene, level: Level = 'Easy') {
        this.scene = scene;
        this.level = level;
        this.timerDuration = this.level === 'Hard' ? 10000 : 0; 
    }

    setupTimer(onTimeUp: () => void) {
        if (this.level === 'Hard') {
            this.stopTimer(); 
            this.timerEvent = this.scene.time.addEvent({
                delay: this.timerDuration,
                callback: onTimeUp,
                callbackScope: this.scene,
                loop: false,
            });
        }
    }

    resetTimer() {
        this.setupTimer(() => console.log("Time's up!")); 
    }

    stopTimer() {
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }
    }
}
