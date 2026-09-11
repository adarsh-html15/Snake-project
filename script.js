const board = document.querySelector('.board')
const blockHight = 20
const blockWidth = 20
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')
const startButton = document.querySelector('.btn-start')
const modal = document.querySelector('.modal')
const restartButton = document.querySelector('.btn-restart')
const speedButtons = document.querySelectorAll('.btn-speed')

const highScoreElement = document.querySelector('.high-score')
const scoreElement = document.querySelector('.score')
const timeElement = document.querySelector('.time')

let highScore = 0
let score = 0

// Score and high-score display logic
highScore = Number(localStorage.getItem('snakeHighScore')) || 0
highScoreElement.textContent = highScore

function updateScore() {
    score += 1
    scoreElement.textContent = score

    if (score > highScore) {
        highScore = score
        highScoreElement.textContent = highScore
        localStorage.setItem('snakeHighScore', highScore)
    }
}

function resetScore() {
    score = 0
    scoreElement.textContent = score
}

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockWidth);

let intervalId = null;
let gameSpeed = 300
let isGameRunning = false
const blocks = []
let snake = [{
    x: 1, y: 3
}
    //     , {
    //     x: 1, y: 4
    // }, {
    //     x: 1, y: 5
    // }
]
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

let direction = 'down'

// Snake head color logic
let snakeHeadColor = '#ffffff'

function generateRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
}

function changeSnakeHeadColor() {
    snakeHeadColor = generateRandomColor()
    const snakeHead = blocks[`${snake[0].x}-${snake[0].y}`]

    if (isGameRunning && snakeHead) {
        snakeHead.style.backgroundColor = snakeHeadColor
    }

    setTimeout(changeSnakeHeadColor, 2000)
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        }
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
}

function startGameLoop() {
    clearInterval(intervalId)
    isGameRunning = true
    intervalId = setInterval(render, gameSpeed)
}

function stopGame() {
    clearInterval(intervalId)
    intervalId = null
    isGameRunning = false
}

function clearSnakeFromBoard() {
    snake.forEach(segment => {
        const block = blocks[`${segment.x}-${segment.y}`]
        block.classList.remove('fill')
        block.style.backgroundColor = ''
    })
}

// for (let i = 0; i < rows*cols ; i++){

//     const block = document.createElement('div')
//     block.classList.add("block");
//     board.appendChild(block);
// }

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row}-${col}`
        blocks[`${row}-${col}`] = block
    }
}

function render() {
    let head = null

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearSnakeFromBoard()
        stopGame()

        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"
        return;
    }

    const ateFood = head.x === food.x && head.y === food.y

    if (ateFood) {
        updateScore()
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        placeFood()
    }

    clearSnakeFromBoard()

    snake.unshift(head)
    if (!ateFood) {
        snake.pop()
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })

    blocks[`${snake[0].x}-${snake[0].y}`].style.backgroundColor = snakeHeadColor
    blocks[`${food.x}-${food.y}`].classList.add("food")
}

// intervalId = setInterval(() => {
//     render()

// }, 300)

startButton.addEventListener('click', () => {

    modal.style.display = 'none'
    startGameLoop()
})

restartButton.addEventListener('click', restartGame)
function restartGame() {
    stopGame()
    blocks[`${food.x}-${food.y}`].classList.remove("food")
    clearSnakeFromBoard()

    modal.style.display = 'none'
    resetScore()
    direction = 'down'
    snake = [{
        x: 1,
        y: 3
    }]
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    }
    startGameLoop()

}

speedButtons.forEach(button => {
    button.addEventListener('click', () => {
        const speeds = { slow: 500, normal: 300, fast: 150 }
        gameSpeed = speeds[button.dataset.speed]

        speedButtons.forEach(item => item.classList.toggle('is-active', item === button))

        // Running game mein interval ko nayi speed ke saath dobara start karte hain.
        if (isGameRunning) {
            startGameLoop()
        }
    })
})


addEventListener('keydown', (event) => {
    // console.log(event.key);
    if (event.key === 'ArrowUp') {
        direction = 'up'
    } else if (event.key === 'ArrowRight') {
        direction = 'right'
    } else if (event.key === 'ArrowLeft') {
        direction = 'left'
    } else if (event.key === 'ArrowDown') {
        direction = 'down'
    }
})

changeSnakeHeadColor()
