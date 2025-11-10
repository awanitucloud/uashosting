// static/js/js/game.js
import { Snake, Food, Barrier } from './entities.js';

export class Game {
    constructor(ui, db, assets) {
        this.ui = ui;
        this.db = db;
        this.assets = assets;

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameMusic = document.getElementById('gameMusic');
        
        this.gridSize = 20; 
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = null;
        this.foods = []; 
        this.barrier = null; 
        this.score = 0;
        this.playerName = 'Guest';
        this.running = false; 
        this.isPaused = false;
        
        this.MAX_SCORE_FOR_SPEED = 1000;
        this.START_SPEED_MS = 150; 
        this.MAX_SPEED_MS = 67; 
        this.currentSpeed = this.START_SPEED_MS;
        
        this.boundKeydownHandler = this.handleKeydown.bind(this);
    }
    
    // --- UTILITY ---
    
    getRandomEmptyPosition() {
        let pos;
        let isOccupied;
        do {
            isOccupied = false;
            pos = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            for (const segment of this.snake.body) {
                if (segment.x === pos.x && segment.y === pos.y) { isOccupied = true; break; }
            }
            if (isOccupied) continue;
            if (this.barrier && this.barrier.x === pos.x && this.barrier.y === pos.y) { isOccupied = true; continue; }
            for (const f of this.foods) {
                if (f.x === pos.x && f.y === pos.y) { isOccupied = true; break; }
            }
        } while (isOccupied);
        return pos;
    }

    spawnBarrier() {
        const pos = this.getRandomEmptyPosition();
        this.barrier = new Barrier(this.assets.batu, pos, this.gridSize);
    }

    spawnFood() {
        let type, image, scoreChange;
        const rand = Math.random();
        
        if (rand < 0.35) { 
            type = 'daging'; image = this.assets.daging; scoreChange = 10;
        } else if (rand < 0.7) { 
            type = 'buah'; image = this.assets.buah; scoreChange = 5;
        } else { 
            type = 'racun'; image = this.assets.racun; scoreChange = -10;
        }
        
        const pos = this.getRandomEmptyPosition();
        this.foods.push(new Food(type, image, scoreChange, pos, this.gridSize));
    }
    
    // --- STATE KONTROL ---

    start(config) {
        this.playerName = config.playerName;
        
        const snakeColor = (config.snakeTheme === 'hutan') ? 'lime' : 'sienna';
        const bgColor = (config.envTheme === 'hutan') ? '#004d00' : '#C2B280';
        this.canvas.style.backgroundColor = bgColor;

        this.snake = new Snake(10, 10, snakeColor);
        // ⭐ PERBAIKAN: Beri kecepatan awal agar game langsung berjalan
        this.snake.velocity = { x: 1, y: 0 }; 

        this.score = 0;
        // ⭐ PERBAIKAN: Set running = true agar game loop langsung aktif
        this.running = true; 
        this.isPaused = false;
        this.currentSpeed = this.START_SPEED_MS; 
        this.foods = [];
        this.barrier = null;

        this.ui.updateScore(this.score, false);
        
        this.spawnBarrier();
        this.spawnFood();
        this.spawnFood();
        this.spawnFood();
        
        this.draw();
        
        this.gameMusic.play().catch(e => console.log("User harus klik untuk musik"));
        
        document.addEventListener('keydown', this.boundKeydownHandler);
    }

    pause() {
        if (!this.running || this.isPaused) return;
        this.running = false;
        this.isPaused = true;
        this.gameMusic.pause();
        this.ui.showPause();
    }

    continueGame() {
        if (!this.isPaused) return;
        this.running = true;
        this.isPaused = false;
        this.gameMusic.play();
        this.ui.hidePause();
    }

    gameOver() {
        this.gameMusic.pause();
        this.running = false; 
        document.removeEventListener('keydown', this.boundKeydownHandler);
        
        this.ui.showGameOver(this.score);
        this.ui.playerName = this.playerName; // Update UI name untuk leaderboard display
        this.db.saveScore(this.playerName, this.score);
    }
    
    backToMenu() {
        window.location.reload();
    }

    // --- LOGIKA GAME LOOP ---

    gameLoop() {
        if (this.isPaused || this.ui.gameoverOverlay.style.display === 'flex') {
            setTimeout(() => this.gameLoop(), this.currentSpeed);
            return;
        }

        if (this.running) {
            this.update();
            this.draw();

            const t = Math.min(this.score, this.MAX_SCORE_FOR_SPEED) / this.MAX_SCORE_FOR_SPEED;
            this.currentSpeed = this.START_SPEED_MS + (this.MAX_SPEED_MS - this.START_SPEED_MS) * t;
        }

        setTimeout(() => this.gameLoop(), this.currentSpeed);
    }

    update() {
        this.snake.move(this.tileCount);

        const head = this.snake.body[0];
        if (this.barrier && head.x === this.barrier.x && head.y === this.barrier.y) {
            return this.gameOver();
        }

        if (this.snake.checkSelfCollision()) {
             return this.gameOver();
        }

        let foodIndex = this.foods.findIndex(f => f.x === head.x && f.y === head.y);

        if (foodIndex > -1) { 
            const ateFood = this.foods[foodIndex];
            
            this.score += ateFood.score;
            this.ui.updateScore(this.score);
            this.ui.updateLeaderboard(this.db.globalTop5, this.score);

            this.foods = [];
            this.spawnBarrier();
            this.spawnFood();
            this.spawnFood();
            this.spawnFood();
            
            if (ateFood.score < 0) {
                this.snake.shorten(2);
                if (this.snake.body.length <= 1 || this.score < 0) {
                    return this.gameOver();
                }
            }
        } else {
            this.snake.normalMove();
        }
    }
    
    draw() {
        this.ctx.fillStyle = this.canvas.style.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.barrier) {
            this.barrier.draw(this.ctx);
        }
        
        this.foods.forEach(food => food.draw(this.ctx));

        this.snake.draw(this.ctx, this.gridSize);
    }

    // --- INPUT HANDLER ---
    
    handleKeydown(e) {
        if (this.isPaused || this.ui.gameoverOverlay.style.display === 'flex') return;

        if (e.code === 'Space') {
            e.preventDefault(); 
            this.pause();
            return;
        }

        let newX = this.snake.velocity.x;
        let newY = this.snake.velocity.y;
        
        switch (e.key) {
            case 'ArrowUp': e.preventDefault(); newX = 0; newY = -1; break;
            case 'ArrowDown': e.preventDefault(); newX = 0; newY = 1; break;
            case 'ArrowLeft': e.preventDefault(); newX = -1; newY = 0; break;
            case 'ArrowRight': e.preventDefault(); newX = 1; newY = 0; break;
        }

        if (newX !== this.snake.velocity.x || newY !== this.snake.velocity.y) {
            this.snake.setDirection(newX, newY);
        }
    }
}