const fpsCounter = document.getElementById("fps-counter")

let lastTime = 0
let frameCount = 0
let fps = 0
let grid = []
let row = 20
let col = 10
let corrent_score = 0
let currentPiece = null
let currentPos = {
    x: 0,
    y: 0,
}
let pieceSide = 0
let objPieces = [
    [
        [[1, 1],
        [1, 1]]
    ],

    [
        [[1, 1, 0],
        [0, 1, 1]],

        [[0, 1],
        [1, 1],
        [1, 0]]
    ],

    [
        [[0, 1, 1],
        [1, 1, 0]],

        [[1, 0],
        [1, 1],
        [0, 1]]
    ],

    [
        [[1, 1, 1, 1]],

        [[1],
        [1],
        [1],
        [1]]
    ],

    [
        [[1, 1, 1],
        [1, 0, 0]],

        [[1, 1],
        [0, 1],
        [0, 1]],

        [[0, 0, 1],
        [1, 1, 1]],

        [[1, 0],
        [1, 0],
        [1, 1]]
    ],

    [
        [[1, 1, 1],
        [0, 0, 1]],

        [[0, 1],
        [0, 1],
        [1, 1]],

        [[1, 0, 0],
        [1, 1, 1]],

        [[1, 1],
        [1, 0],
        [1, 0]]
    ],

    [
        [[0, 1, 0],
        [1, 1, 1]],

        [[1, 0],
        [1, 1],
        [1, 0]],

        [[1, 1, 1],
        [0, 1, 0]],

        [[0, 1],
        [1, 1],
        [0, 1]]
    ]
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

function clearLines() {
    let c = 0
    for (let i = row - 1; i >= 0; i--) {
        c = 0
        for (let j = 0; j < col; j++) {
            if (grid[i][j].value === 1) {
                c++
            }
        }
        if (c === col) {
            grid.splice(i, 1)
            grid.unshift(Array(col).fill(0))
            score(100)
            i++
        }
    }
}

function score(add){
    let scoree = document.getElementById("score")
    console.log(add)
    corrent_score += add
    scoree.innerHTML = corrent_score.toString()
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
    clearLines()
    dropPiece()
    pieceSide = 0
}

function mDown() {
    if (isValidPos(1, 0)) {
        currentPos.x++
    } else {
        fixGridData()
    }
}

function dropPiece() {
    currentPieceIndex = Math.floor(Math.random() * 7)
    currentPiece = objPieces[currentPieceIndex][0]    
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
    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            if (currentPiece[i][j] === 0) continue
            let xRow = currentPos.x + i + xMove
            let yCol = currentPos.y + j + yMove
            if (xRow < 0 || xRow >= row || yCol < 0 || yCol >= col ||
                grid[xRow][yCol].value === 1) return false
        }
    }
    return true
}

function conflictBetweenPiece() {
    const shifts = [[0, -1],[0, 1],[-1, 0],[1, 0]]
    for (let i = 0; i < shifts.length; i++) {
        if (isValidPos(shifts[i][0], shifts[i][1])) {
            currentPos.x += shifts[i][0]
            currentPos.y += shifts[i][1]
            return
        }
    }
    currentPiece = original
}

function rotateInBorder() {
    let xShift = 0;
    let yShift = 0;

    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            let xRow = currentPos.x + i
            let yCol = currentPos.y + j
            if (xRow >= row) {
                xShift = Math.max(xShift, xRow - row + 1)
            } else if (yCol >= col) {
                yShift = Math.max(yShift, yCol - col + 1)
            } else if (grid[xRow][yCol].value === 1) {
                conflictBetweenPiece()
                return
            }
        }
    }
    currentPos.x -= xShift;
    currentPos.y -= yShift;
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
                score(1)
            }
            break
        case ' ':
            for (; isValidPos(1, 0);) {
                mDown()
            }
            score(20)
            break
            case 'ArrowUp':
                const nextSide = (pieceSide + 1) % objPieces[currentPieceIndex].length
                original = currentPiece
                currentPiece = objPieces[currentPieceIndex][nextSide]
                if (isValidPos(0, 0)) {
                    //console.log(currentPiece);
    
                    pieceSide = nextSide
                } else {
                    //currentPiece = objPieces[currentPieceIndex][0]
                    rotateInBorder()
                    pieceSide = nextSide
                }
                break;
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