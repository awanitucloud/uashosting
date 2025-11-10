// static/js/js/entities.js

class Food {
    constructor(type, image, scoreChange, pos, gridSize) {
        this.x = pos.x; 
        this.y = pos.y;
        this.type = type;
        this.image = image; 
        this.score = scoreChange;
        this.gridSize = gridSize;
        this.newSize = gridSize * 1.2;
        this.offset = (this.newSize - gridSize) / 2;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image, 
            this.x * this.gridSize - this.offset, 
            this.y * this.gridSize - this.offset, 
            this.newSize, 
            this.newSize
        );
    }
}

class Barrier {
    constructor(image, pos, gridSize) {
        this.x = pos.x;
        this.y = pos.y;
        this.image = image;
        this.gridSize = gridSize;
        this.newSize = gridSize * 1.2;
        this.offset = (this.newSize - gridSize) / 2;
    }
    
    draw(ctx) {
        ctx.drawImage(
            this.image, 
            this.x * this.gridSize - this.offset, 
            this.y * this.gridSize - this.offset, 
            this.newSize, 
            this.newSize
        );
    }
}

class Snake {
    constructor(startX, startY, color) {
        this.body = [{ x: startX, y: startY }];
        this.velocity = { x: 0, y: 0 };
        this.color = color;
    }

    move(tileCount) {
        let headX = this.body[0].x + this.velocity.x;
        let headY = this.body[0].y + this.velocity.y;
        
        if (headX >= tileCount) { headX = 0; }
        else if (headX < 0) { headX = tileCount - 1; }
        if (headY >= tileCount) { headY = 0; }
        else if (headY < 0) { headY = tileCount - 1; }
        
        this.body.unshift({ x: headX, y: headY });
    }
    
    checkSelfCollision() {
        if (this.velocity.x === 0 && this.velocity.y === 0) return false;
        
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true; 
            }
        }
        return false;
    }
    
    shorten(count = 1) {
        for(let i=0; i < count; i++) {
            if (this.body.length > 1) {
                this.body.pop();
            }
        }
    }
    
    normalMove() {
        this.body.pop();
    }
    
    draw(ctx, gridSize) {
        const vel = this.velocity;
        const themeColors = { snake: this.color };
        
        const drawHead = (x, y, vel) => {
            ctx.fillStyle = themeColors.snake;
            ctx.fillRect(x, y, gridSize, gridSize);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, gridSize, gridSize);
            
            let eyeX = x + 8, eyeY = y + 8;
            if (vel.x === 1) { eyeX = x + 12; eyeY = y + 8; } 
            else if (vel.x === -1) { eyeX = x + 4; eyeY = y + 8; } 
            else if (vel.y === 1) { eyeX = x + 8; eyeY = y + 12; } 
            else if (vel.y === -1) { eyeX = x + 8; eyeY = y + 4; }
            
            ctx.fillStyle = 'white';
            ctx.fillRect(eyeX, eyeY, 4, 4);
            ctx.fillStyle = 'black';
            ctx.fillRect(eyeX + 1, eyeY + 1, 2, 2);

            if (vel.x !== 0 || vel.y !== 0) {
                ctx.strokeStyle = 'black'; 
                ctx.lineWidth = 2; 
                ctx.beginPath();
                if (vel.x === 1) { ctx.moveTo(x + gridSize, y + 10); ctx.lineTo(x + gridSize + 4, y + 10); } 
                else if (vel.x === -1) { ctx.moveTo(x, y + 10); ctx.lineTo(x - 4, y + 10); } 
                else if (vel.y === 1) { ctx.moveTo(x + 10, y + gridSize); ctx.lineTo(x + 10, y + gridSize + 4); } 
                else if (vel.y === -1) { ctx.moveTo(x + 10, y); ctx.lineTo(x + 10, y - 4); }
                ctx.stroke();
            }
        };

        const drawBody = (x, y) => {
            ctx.fillStyle = themeColors.snake;
            ctx.fillRect(x, y, gridSize, gridSize);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, gridSize, gridSize);
        };

        const drawTail = (x, y) => {
            ctx.fillStyle = themeColors.snake;
            ctx.fillRect(x, y, gridSize, gridSize);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, gridSize, gridSize);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 4, y + 4, gridSize - 8, gridSize - 8);
        };

        this.body.forEach((segment, index) => {
            const x_pos = segment.x * gridSize;
            const y_pos = segment.y * gridSize;

            if (index === 0) {
                drawHead(x_pos, y_pos, vel);
            } else if (index === this.body.length - 1 && this.body.length > 1) {
                drawTail(x_pos, y_pos);
            } else {
                drawBody(x_pos, y_pos);
            }
        });
    }

    setDirection(newX, newY) {
        if (this.velocity.x + newX !== 0 && this.velocity.y + newY !== 0) {
            this.velocity = { x: newX, y: newY };
            return true;
        }
        return false;
    }
}

export { Snake, Food, Barrier };