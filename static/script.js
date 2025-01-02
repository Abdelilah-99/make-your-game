const fpsCounter = document.getElementById("fps-counter")
let page = 1
let numOfPages = 0
let totalTime = 0
let defaultTime = 180
let leftTime = defaultTime
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
let isSpace = false
let currentPos = {
    x: 0,
    y: 0,
}
let pieceSide = 0
let frameCounts = 0;;
let lastFrameTime = 0;
const fpsDisplay = document.getElementById("fps-counter");

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
        if (deltaTime >= 1000 || isSpace) {
            isSpace = false
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
    let gameOver = document.getElementById('game_over')
    gameOver.style.display = "flex";
    
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
    totalTime += defaultTime - leftTime
    leftTime = defaultTime
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
    leftTime = defaultTime;
    createGrid()
    dropPiece()
    addEventListener("keydown", btn_press)
    pause = 0
}
requestAnimationFrame(animate)

async function submitscore() {
    let name = document.getElementById("playerName").value
    try {
        await fetch("/api/save_score", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": name,
                "time": totalTime,
                "rank": 1,
                "score": corrent_score,
            }),
        })
    } catch (err) {
        let gameOver = document.getElementById('game_over')
        gameOver.style.display = "flex";
        alert(err)
    }
    let lifeshtml = document.getElementById('Lifes')
    lifeshtml.innerHTML = "Life's: 3/3"
    let scoree = document.getElementById("score")
    scoree.innerHTML = "Score: 0"
    let left_Time = document.getElementById('leftTime')
    left_Time.innerHTML = "left time: 3:00"
    lifes = 3
    corrent_score = 0
    leftTime = defaultTime
    totalTime = 0
    let gameOver = document.getElementById('game_over')
    gameOver.style.display = "none";
    let rank = document.getElementById('rank')
    rank.style.display = "flex";
    let rows = document.getElementById('rows')
    rows.innerHTML = ""
    try{
        let res = await fetch(`/api/get_rank?page=${page}`)
        let parsedres = await res.json()
        for(let i = 0;i<parsedres.length;i++){
            rows.innerHTML += `<tr>
                    <td>${parsedres[i].rank}</td>
                    <td>${parsedres[i].name}</td>
                    <td>${parsedres[i].time}</td>
                    <td>${parsedres[i].score}</td>
                </tr>`
        }
    }catch(err){
        alert(err)
    }
    try {
        let res = await fetch(`/api/number_pages`)
        let num = await res.json()
        if (res.status == 200){
            numOfPages = num
        }
    } catch (err) {
        alert(err)
    }
    // addEventListener('keydown', btn_press)
   
    // dropPiece()
    // pause = 0
}



async function next(){
	if (numOfPages > page){
        page++
        document.getElementById('prev').style.display = "flex"
        if (numOfPages == page){
            document.getElementById('next').style.display = "none"
        }
        try{
            let rows = document.getElementById('rows')
            let res = await fetch(`/api/get_rank?page=${page}`)
            let parsedres = await res.json()
            console.log("inner html")
            rows.innerHTML = ""
            for(let i = 0;i<parsedres.length;i++){
                rows.innerHTML += `<tr>
                        <td>${parsedres[i].rank}</td>
                        <td>${parsedres[i].name}</td>
                        <td>${parsedres[i].time}</td>
                        <td>${parsedres[i].score}</td>
                    </tr>`
            }
        }catch(err){
            alert(err)
        }
    }
}

async function prev(){
	if (1 <= page){
        page--
        document.getElementById('next').style.display = "flex"
        if (1 == page){
            document.getElementById('prev').style.display = "none"
        }
        try{
            let rows = document.getElementById('rows')
            let res = await fetch(`/api/get_rank?page=${page}`)
            let parsedres = await res.json()
            console.log("inner html")
            rows.innerHTML = ""
            for(let i = 0;i<parsedres.length;i++){
                rows.innerHTML += `<tr>
                        <td>${parsedres[i].rank}</td>
                        <td>${parsedres[i].name}</td>
                        <td>${parsedres[i].time}</td>
                        <td>${parsedres[i].score}</td>
                    </tr>`
            }
        }catch(err){
            alert(err)
        }
    }
}

function newgame(){
    document.getElementById("rank").style.display = "none"
    addEventListener('keydown', btn_press)
   
    dropPiece()
    pause = 0
}