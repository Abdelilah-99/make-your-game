const fpsCounter = document.getElementById("fps-counter")

const tetrisMaps = [
    {
        name: "Easy",
        image: "bg.jpg",
        config: {
            row: 20,
            col: 10,
            leftTime: 180,
            lifes: 3,
            cellStyle: {
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                borderColor: "rgba(34, 34, 34, 0.2)"
            },
            pieceColors: {
                1: "#FF0000",  // Red
                2: "#0000FF",  // Blue
                3: "#00FF00",  // Green
                4: "#FFFF00",  // Yellow
                5: "#FFA500",  // Orange
                6: "#800080",  // Purple
                7: "#00FFFF"   // Cyan
            },
            difficulty: 1000
        }
    },
    {
        name: "Medium",
        image: "bg1.jpg",
        config: {
            row: 24,
            col: 12,
            leftTime: 300,
            lifes: 2,
            cellStyle: {
                backgroundColor: "rgba(0, 26, 51, 0.85)",
                borderColor: "rgba(0, 26, 51, 0.2)"
            },
            pieceColors: {
                1: "#DC143C",  // Crimson
                2: "#4169E1",  // Royal Blue
                3: "#32CD32",  // Lime Green
                4: "#DAA520",  // Goldenrod
                5: "#FF8C00",  // Dark Orange
                6: "#8A2BE2",  // Blue Violet
                7: "#48D1CC"   // Medium Turquoise
            },
            difficulty: 200
        }
    },
    {
        name: "Hard",
        image: "bg2.jpg",
        config: {
            row: 32,
            col: 16,
            leftTime: 120,
            lifes: 1,
            cellStyle: {
                backgroundColor: "rgba(51, 0, 0, 0.85)",
                borderColor: "rgba(51, 0, 0, 0.2)"
            },
            pieceColors: {
                1: "#FF69B4",  // Hot Pink
                2: "#4B0082",  // Indigo
                3: "#98FB98",  // Pale Green
                4: "#FFD700",  // Gold
                5: "#FF4500",  // Orange Red
                6: "#9370DB",  // Medium Purple
                7: "#20B2AA"   // Light Sea Green
            },
            difficulty: 100
        }
    },
];

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
let isSpace = false
let currentPos = {
    x: 0,
    y: 0,
}
let pieceSide = 0
let frameCounts = 0;;
let lastFrameTime = 0;
const fpsDisplay = document.getElementById("fps-counter");
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
let currentPieceIndex = 0

function play() {
    createGrid()
    dropPiece()
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

function animate(timestamp) {
    const config = tetrisMaps[currentMapIndex].config;
    if (pause == 0) {
        if (lastTime === 0) {
            lastTime = timestamp
        }
        const deltaTime = timestamp - lastTime
        if (deltaTime >= config.difficulty || isSpace) {
            console.log(config.difficulty);
            
            isSpace = false
            lastTime = timestamp
            mDown()
        }
        drawPiece()
    }
    requestAnimationFrame(animate)
}

function mDown() {
    if (isValidPos(1, 0)) {
        currentPos.x++
    } else {
        fixGridData()
    }
}

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

function updateFPS(timestamp) {
    if (lastFrameTime > 0) {
        const deltaTime = timestamp - lastFrameTime;
        fps = Math.round(1000 / deltaTime);
        fpsDisplay.innerHTML = `FPS: ${fps}`;
    }

    lastFrameTime = timestamp;
    requestAnimationFrame(updateFPS);
}

requestAnimationFrame(updateFPS);

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
                grid[xRow][yCol].value === 1) return false
        }
    }
    return true
}

function conflictBetweenPiece() {
    const shifts = [[0, -1], [0, 1], [-1, 0], [1, 0]]
    for (let i = 0; i < shifts.length; i++) {

        if (isValidPos(shifts[i][0], shifts[i][1])) {
            console.log(`${shifts[i][0]}, ${shifts[i][1]}, ${currentPos.x}`);
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
    let f = false
    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            let xRow = currentPos.x + i
            let yCol = currentPos.y + j
            if (xRow >= row) {
                xShift = xRow - row
                if (xShift === 0 && grid[currentPos.x - 1][yCol].value === 1) {
                    f = true
                }
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
                        console.log("true 1");

                        f = true
                        xShift = xRow - currentPos.x
                        if (xShift === 3) xShift = 0
                        else if (xShift === 2) xShift = 1
                        else if (xShift === 1) xShift = 2
                        let c = 0
                        for (let i = currentPos.x - 1; i >= 0; i--) {
                            if (grid[i][yCol].value === 1) break
                            c++
                        }
                        for (let j = currentPos.x; j < xRow; j++) c++
                        c--
                        if (c < 3) {
                            xShift = 0
                            f = true
                            break
                        }
                        break
                    } else if (pieceSide === 1) {
                        f = true
                        console.log("true");

                        yShift = yCol - currentPos.y
                        if (yShift === 3) yShift = 0
                        else if (yShift === 2) yShift = 1
                        else if (yShift === 1) yShift = 2

                        let c = 0
                        for (let i = currentPos.y - 1; i >= 0; i--) {
                            if (grid[xRow][i].value === 1) break
                            c++
                        }
                        for (let j = currentPos.y; j < yCol; j++) c++
                        c--
                        console.log(c);

                        if (c < 3) {
                            yShift = 0
                            f = true
                            break
                        }
                        break
                    }
                }
            }
        }
        if (f === true) break
    }
    currentPos.x -= xShift
    currentPos.y -= yShift
    conflictBetweenPiece()
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
            for (; isValidPos(1, 0) && x < row;) { // row swl yassin
                mDown()
                isSpace = true
                x++
            }
            score(x)
            break
        case 'ArrowUp':
            const nextSide = (pieceSide + 1) % objPieces[currentPieceIndex].length
            original = currentPiece
            currentPiece = objPieces[currentPieceIndex][nextSide]
            if (isValidPos(0, 0)) {
                pieceSide = nextSide
            } else {
                rotateInBorder()
                pieceSide = nextSide
            }
            break;

    }
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

function pausee() {
    document.getElementById('backgroundMenu').classList.remove('animate-zoom-out')
    document.getElementById('backgroundMenu').classList.add('animate-zoom-in')
    document.getElementById('backgroundMenu').style.display = "block"
    removeEventListener('keydown', btn_press)
    pause = 1
}

function continuee() {
    document.getElementById('backgroundMenu').classList.remove('animate-zoom-in')
    document.getElementById('backgroundMenu').classList.add('animate-zoom-out')
    setTimeout(() => {
        document.getElementById('backgroundMenu').style.display = "none"
    }, 500)
    let pause_btn = document.getElementById("Pause")
    pause = 0
    addEventListener("keydown", btn_press)
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

let currentMapIndex = 0

function initializeMap(index) {
    const config = tetrisMaps[index].config
    row = config.row
    col = config.col
    leftTime = config.leftTime
    lifes = config.lifes
    colorPiece = config.pieceColors
    const gameGrid = document.getElementById('gameGrid')
    gameGrid.style.gridTemplateColumns = `repeat(${config.col}, 1fr)`
    gameGrid.style.gridTemplateRows = `repeat(${config.row}, 1fr)`
    const gameContainer = document.getElementById('game')
    gameContainer.style.backgroundColor = config.cellStyle.backgroundColor
    var body = document.body
    body.style.backgroundImage = `url(${tetrisMaps[index].image})`
    createGrid()
    resetStats()
}

function resetStats() {
    corrent_score = 0
    document.getElementById('score').innerHTML = "Score: 0"
    document.getElementById('Lifes').innerHTML = `Life's: ${lifes}/${lifes}`
    document.getElementById('leftTime').innerHTML = `left time: ${Math.floor(leftTime / 60)}:${leftTime % 60}`
}

function switchMap(direction) {
    currentMapIndex = (currentMapIndex + direction + tetrisMaps.length) % tetrisMaps.length
    initializeMap(currentMapIndex)
    const mapNameDisplay = document.getElementById('current-map')
    if (mapNameDisplay) {
        mapNameDisplay.textContent = tetrisMaps[currentMapIndex].name
    }
    dropPiece()
}

const mapControls = document.createElement('div')
mapControls.className = 'board'
mapControls.innerHTML = `
    <div style="display: flex; gap: 10px; align-items: center;">
        <button onclick="switchMap(-1)" class="green">Previous Map</button>
        <span id="current-map">${tetrisMaps[0].name}</span>
        <button onclick="switchMap(1)" class="green">Next Map</button>
    </div>
`
document.querySelector('.dashboard').appendChild(mapControls)

initializeMap(0)
play()
requestAnimationFrame(animate)
