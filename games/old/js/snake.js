const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
let food = {};
let direction;
let nextDirection;
let score = 0;
let game;
let isPaused = false;
let currentLevel = 0;
let gameSpeed = 100;
let lastUpdateTime = 0;

const levels = {
    1: { name: "HORROROSO", speed: 150, color: "#4ECDC4" },
    2: { name: "MUITO PODRE", speed: 120, color: "#FFE66D" },
    3: { name: "DÁ PRO GALHO", speed: 90, color: "#FFA36B" },
    4: { name: "MALDITO", speed: 60, color: "#FF6B6B" }
};

const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

// Inicialização do jogo
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const level = parseInt(button.dataset.level);
        startGame(level);
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

function startGame(level = 1) {
    currentLevel = level;
    snake = [{x: 9*box, y: 10*box}];
    food = generateFood();
    direction = undefined;
    nextDirection = undefined;
    score = 0;
    isPaused = false;
    gameSpeed = levels[level].speed;
    
    scoreDisplay.textContent = score;
    levelDisplay.textContent = levels[level].name;
    
    if (game) cancelAnimationFrame(game);
    lastUpdateTime = performance.now();
    game = requestAnimationFrame(gameLoop);
}

function generateFood() {
    let newFood;
    let maxAttempts = 100;
    let attempts = 0;
    
    do {
        newFood = {
            x: Math.floor(Math.random()*20)*box,
            y: Math.floor(Math.random()*20)*box,
            color: levels[currentLevel].color
        };
        attempts++;
        if (attempts > maxAttempts) break;
    } while (collision(newFood, snake));
    
    return newFood;
}

function handleKeyDown(event) {
    if (event.key === ' ') {
        event.preventDefault();
    }

    switch(event.key) {
        case ' ':
            if (currentLevel === 0) return;
            togglePause();
            break;
            
        case 'r':
        case 'R':
            if (currentLevel > 0) startGame(currentLevel);
            break;
            
        case 'ArrowLeft':
            if (direction !== 'RIGHT') nextDirection = 'LEFT';
            break;
        case 'ArrowUp':
            if (direction !== 'DOWN') nextDirection = 'UP';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') nextDirection = 'RIGHT';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') nextDirection = 'DOWN';
            break;
    }
}

function togglePause() {
    isPaused = !isPaused;
    
    if (isPaused) {
        cancelAnimationFrame(game);
        game = undefined;
        drawPauseScreen();
    } else {
        lastUpdateTime = performance.now();
        game = requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', handleKeyDown);

function gameLoop(timestamp) {
    if (isPaused) {
        drawPauseScreen();
        game = undefined;
        return;
    }
    
    const deltaTime = timestamp - lastUpdateTime;
    
    if (deltaTime >= gameSpeed) {
        if (!updateGame()) {
            return; // Se updateGame retornar false, houve game over
        }
        lastUpdateTime = timestamp - (deltaTime % gameSpeed);
    }
    
    drawGame();
    game = requestAnimationFrame(gameLoop);
}

function updateGame() {
    if (nextDirection) {
        direction = nextDirection;
        nextDirection = undefined;
    }
    
    if (!direction) return true;
    
    const head = {
        x: snake[0].x + (direction === 'LEFT' ? -box : direction === 'RIGHT' ? box : 0),
        y: snake[0].y + (direction === 'UP' ? -box : direction === 'DOWN' ? box : 0)
    };
    
    // Verificação de colisão com paredes
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        gameOver();
        return false;
    }
    
    // Verificação de colisão com o próprio corpo
    if (collision(head, snake)) {
        gameOver();
        return false;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }
    
    return true;
}

function drawGame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha a comida
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);
    
    // Desenha a cobra
    snake.forEach((segment, index) => {
        ctx.fillStyle = (index === 0) ? '#FF6B6B' : '#4ECDC4';
        ctx.fillRect(segment.x, segment.y, box, box);
        
        if (index === 0) {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(segment.x + 5, segment.y + 5, 4, 4);
            ctx.fillRect(segment.x + 11, segment.y + 5, 4, 4);
        }
    });
    
    // Desenha o score
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSADO', canvas.width/2, canvas.height/2 - 20);
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('Pressione ESPAÇO para continuar', canvas.width/2, canvas.height/2 + 20);
    ctx.textAlign = 'start';
}

function gameOver() {
    cancelAnimationFrame(game);
    game = undefined;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 40);
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2);
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText('Pressione R para reiniciar', canvas.width/2, canvas.height/2 + 40);
    ctx.textAlign = 'start';
}

function collision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}