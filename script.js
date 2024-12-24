const fpsCounter = document.getElementById("fps-counter")

let lastTime = 0
let frameCount = 0
let fps = 0
let grid = []
let row = 20
let col = 10
let currentPiece = null
let currentPos = {
    x: 0,
    y: 0,
}

let pieces = [
    [[1, 1], [1, 1]],       // o
    [[1, 1, 0], [0, 1, 1]], // z
    [[0, 1, 1], [1, 1, 0]], // s
    [[1, 1, 1, 1]],         // I
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 0], [1, 1, 1]], // T
]
let colorPiece = {
    1: "red",       // Square
    2: "blue",      // Z
    3: "green",     // S
    4: "yellow",    // |
    5: "orange",    // L
    6: "purple",    // !L
    7: "cyan"       // T
}
function animate(timestamp) {
    if (lastTime === 0) {
        lastTime = timestamp
    }
    const deltaTime = timestamp - lastTime

    frameCount++
    if (deltaTime >= 1000) {
        fps = frameCount
        frameCount = 0
        lastTime = timestamp
        fpsCounter.textContent = `FPS: ${fps}`
        mDown()
    }

    drawPiece()
    requestAnimationFrame(animate)
}

let currentPieceIndex = 0

function drawPiece() {
    const cells = document.querySelectorAll('.divCell')
    
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = ''
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (grid[i][j].value === 1) {
                cells[i * col + j].style.backgroundColor = grid[i][j].color
            }
        }
    }

    if (currentPiece) {
        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] === 1) {
                    const idx = (currentPos.x + i) * col + (currentPos.y + j)
                    if (idx >= 0 && idx < cells.length) {
                        cells[idx].style.backgroundColor = colorPiece[currentPieceIndex + 1]
                    }
                }
            }
        }
    }
}


function fixGridData() {
    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            if (currentPiece[i][j] === 1) {
                grid[currentPos.x + i][currentPos.y + j] = {
                    value: 1,
                    color: colorPiece[currentPieceIndex + 1]
                }
            }
        }
    }
    dropPiece()
}

function mDown() {
    if (isValidPos(1, 0)) {
        currentPos.x++
    } else {
        fixGridData()
    }
}

function dropPiece() {
    currentPieceIndex = Math.floor(Math.random() * pieces.length)
    currentPiece = pieces[currentPieceIndex]
    currentPos = {
        x: 0,
        y: Math.floor(col / 2) - Math.floor(currentPiece[0].length / 2)
    }

    if (!isValidPos(0, 0)) {
        alert("Game Over")
        play()
    }
}

function isValidPos(xMove, yMove) {
    if (!currentPiece) return false
    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            if (currentPiece[i][j] === 0) continue
            let xRow = currentPos.x + i + xMove
            let yCol = currentPos.y + j + yMove
            if (xRow >= row || yCol < 0 || yCol >= col || 
                (grid[xRow][yCol] && grid[xRow][yCol].value === 1)) return false
        }
    }
    return true
}

function createGrid() {
    gameGrid.innerHTML = ''
    for (let i = 0; i < row; i++) {
        grid[i] = []
        for (let j = 0; j < col; j++) {
            grid[i][j] = {
                value: 0,
                color: ''
            }
        }
    }

    let divs = ""
    for (let i = 0; i < row * col; i++) {
        divs += `<div class="grid border divCell"></div>`
    }
    document.getElementById("gameGrid").innerHTML = divs
    /*     divs = ""
    for (let i = -20; i < 0; i++) {
        divs += `<div class="grid" id="square${i}"></div>`
    }
    document.getElementById("spawnGrid").innerHTML = divs; */
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (isValidPos(0, -1)) {
                currentPos.y--
            }
            break
        case 'ArrowRight':
            if (isValidPos(0, 1)) {
                currentPos.y++
            }
            break
        case 'ArrowDown':
            if (isValidPos(1, 0)) {
                currentPos.x++
            }
            break
    }
})

function play() {
    createGrid()
    dropPiece()
}

async function startGame() {
    document.getElementById('backgroundMenu').classList.remove('animate-zoom-in')
    document.getElementById('backgroundMenu').classList.add('animate-zoom-out')
    setTimeout(() => {
        document.getElementById('overlay').classList.add('none')
        document.getElementById('backgroundMenu').classList.add('none')
    }, 500)
}

play()
requestAnimationFrame(animate)