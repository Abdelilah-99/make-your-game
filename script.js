const fpsCounter = document.getElementById("fps-counter")
let lastTime = 0
let frameCount = 0
let fps = 0
let grid = []
let row = 20
let col = 10
let corrent_score = 0
let currentPiece = null
let lifes = 3
let pause = 1
let leftTime = 180
let currentPos = {
    x: 0,
    y: 0,
}
let pieceSide = 0
let frameCounts = 0;;
let lastFrameTime = 0;
const fpsDisplay = document.getElementById("fps-counter");

function updateFPS(timestamp) {
    if (lastFrameTime == 0) {
        lastFrameTime = timestamp;
    }
    
    const deltaTime = timestamp - lastFrameTime;
    frameCounts++;
    
    if (deltaTime >= 16) {
        fps = Math.round(1000 / deltaTime); 
        frameCounts = 0;
        lastFrameTime = timestamp;
        fpsDisplay.innerHTML = `FPS: ${fps}`;
    }

    requestAnimationFrame(updateFPS);
}

requestAnimationFrame(updateFPS);

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
    if (pause == 0) {
        if (lastTime === 0) {
            lastTime = timestamp
        }
        const deltaTime = timestamp - lastTime
        if (deltaTime >= 1000) {
            lastTime = timestamp
            mDown()
        }
        drawPiece()
    }
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

function resume() {
    let reply = document.getElementById('reply')
    reply.style.display = "none";
    let game_over = document.getElementById('game_over')
    game_over.style.display = "none";
    dropPiece()
    addEventListener('keydown', btn_press)
    pause = 0
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

function score(add) {
    let scoree = document.getElementById("score")
    corrent_score += add
    scoree.innerHTML = 'Score: ' + corrent_score.toString()
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
        what_is_next()

    }
}

function what_is_next() {
    if (lifes > 1) {
        replay_game()
    } else {
        gameOver()
    }
    currentPieceIndex = 0
    currentPiece = 0
    currentPos = 0
    createGrid()
}

function gameOver() {
    document.getElementById("finallScore").innerHTML = "your final score was = " + corrent_score
    lifes = 3
    corrent_score = 0
    let lifeshtml = document.getElementById('Lifes')
    lifeshtml.innerHTML = "Life's: 3/3"
    let scoree = document.getElementById("score")
    scoree.innerHTML = "Score: 0"
    let gameOver = document.getElementById('game_over')
    gameOver.style.display = "flex";
    let left_Time = document.getElementById('leftTime')
    left_Time.innerHTML = "left time: 3:00"
    leftTime = 180
    removeEventListener('keydown', btn_press)
    addEventListener('keydown', continue_event)
    pause = 1
}
function replay_game() {
    lifes--
    let lifeshtml = document.getElementById('Lifes')
    lifeshtml.innerHTML = `Life's: ${lifes}/3`
    let reply = document.getElementById('reply')
    reply.style.display = "flex";
    let left_Time = document.getElementById('leftTime')
    left_Time.innerHTML = "left time: 3:00"
    leftTime = 180
    removeEventListener('keydown', btn_press)
    addEventListener("keydown", continue_event)
    pause = 1
}

function timehandler() {
    let left_time = document.getElementById('leftTime')
    setInterval(() => {
        if (pause == 0) {

            leftTime--
            if (leftTime >= 0) {
                left_time.innerHTML = `left Time = ${Math.floor(leftTime / 60)}:${Math.floor(leftTime % 60)}`
            }
            else {
                what_is_next()
            }
        }
    }, 1000)
}
timehandler()

function isValidPos(xMove, yMove) {
    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            if (currentPiece[i][j] === 0) continue
            let xRow = currentPos.x + i + xMove
            let yCol = currentPos.y + j + yMove
            if (xRow < 0 || xRow >= row || yCol < 0 || yCol >= col ||
                grid[xRow][yCol].value === 1) {
                /* console.log(xRow, yCol);
                console.log("------"); */

                return false
            }

        }
    }
    return true
}

function conflictBetweenPiece() {
    const shifts = [[0, -1], [0, 1], [-1, 0], [1, 0]]
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
                xShift = xRow - row
            } else if (yCol >= col) {
                yShift = yCol - col
                for (let i = 8; i > objPieces[currentPieceIndex][pieceSide].length + 1; i--) {
                    if (grid[xRow][i].value === 1) {
                        currentPiece === objPieces[currentPieceIndex][0]
                        yShift = 0
                    }
                }
            } else if (grid[xRow][yCol].value === 1) {
                if (currentPieceIndex === 3) {
                    if (pieceSide === 0) {
                        xShift = xRow - currentPos.x
                    }
                }
            }
        }
    }
    currentPos.x -= xShift
    currentPos.y -= yShift
    conflictBetweenPiece()
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

addEventListener('keydown', btn_press)
function btn_press(e) {
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
            e.preventDefault();
            if (isValidPos(1, 0)) {
                currentPos.x++
                score(1)
            }
            break
        case ' ':
            e.preventDefault();
            let x = 0
            for (; isValidPos(1, 0) && x < row;) {
                mDown()
                x++

            }
            score(x)
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
        case "p":
            pausee();
            break
    }
}

function play() {
    createGrid()
    dropPiece()
}

async function startGame() {
    pause = 0

    document.getElementById('backgroundMenu').classList.remove('animate-zoom-in')
    document.getElementById('backgroundMenu').classList.add('animate-zoom-out')
    setTimeout(() => {
        document.getElementById("stating").classList.add('none')
        document.getElementById('overlay').classList.add('none')
        document.getElementById('backgroundMenu').classList.add('none')
        document.getElementById("continue").classList.remove("none")
        document.getElementById("reset").classList.remove("none")
    }, 500)
}

play()

function pausee() {
    document.getElementById('backgroundMenu').classList.remove('animate-zoom-out')
    document.getElementById('backgroundMenu').classList.add('animate-zoom-in')
    document.getElementById('backgroundMenu').style.display = "block"
    removeEventListener('keydown', btn_press)
    pause = 1
    addEventListener('keydown', continue_event)
}

function continuee() {
    document.getElementById('backgroundMenu').classList.remove('animate-zoom-in')
    document.getElementById('backgroundMenu').classList.add('animate-zoom-out')
    setTimeout(() => {
        document.getElementById('backgroundMenu').style.display = "none"
    }, 500)
    let pause_btn = document.getElementById("Pause")
    pause = 0
    removeEventListener("keydown", continue_event)
    addEventListener("keydown", btn_press)
}

function continue_event(e) {
    switch (e.key) {
        case 'c':
            continuee()
            break
    }
}


function reset() {
    document.getElementById('backgroundMenu').classList.remove('animate-zoom-in')
    document.getElementById('backgroundMenu').classList.add('animate-zoom-out')
    setTimeout(() => {
        document.getElementById('backgroundMenu').style.display = "none"
    }, 500)
    currentPieceIndex = 0
    currentPiece = 0
    currentPos = 0
    lifes = 3;
    corrent_score = 0;
    let lifeshtml = document.getElementById('Lifes');
    lifeshtml.innerHTML = "Life's: 3/3";
    let scoree = document.getElementById("score");
    scoree.innerHTML = "Score: 0";
    let left_Time = document.getElementById('leftTime');
    left_Time.innerHTML = "left time: 3:00";
    leftTime = 180;
    createGrid()
    dropPiece()
    addEventListener("keydown", btn_press)
    pause = 0
}
requestAnimationFrame(animate)