import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhaserGame } from '../game/phaser-game.component';
import { MainMenu } from '../game/scenes/MainMenu';
import { CommonModule } from '@angular/common';
import { EventBus } from '../game/EventBus';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from './footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, PhaserGame, HeaderComponent,FooterComponent],
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit
{

    public spritePosition = { x: 0, y: 0 };
    public canMoveSprite = false;

    
    @ViewChild(PhaserGame) phaserRef!: PhaserGame;

    ngAfterViewInit()
    {
        EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
            this.canMoveSprite = scene.scene.key !== 'MainMenu';
        });
    }

    
    public changeScene()
    {

        if (this.phaserRef.scene)
        {

            const scene = this.phaserRef.scene as MainMenu;
            scene.changeScene();

        }

    }

    public moveSprite()
    {

        if (this.phaserRef.scene)
        {

            const scene = this.phaserRef.scene as MainMenu;

            
            // scene.moveLogo(({ x, y }) => {

            //     this.spritePosition = { x, y };

            // });

        }

    }

    public addSprite()
    {

        if (this.phaserRef.scene)
        {

            const scene = this.phaserRef.scene;
            
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            
            const star = scene.add.sprite(x, y, 'star');

           
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1
            });

        }

    }

}
