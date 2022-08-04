import { changeBalance, randInt, setBalanceField } from "./functions.js"

setBalanceField()

let active = 'roll'
let activePieceNum = 0
let currentDice = []
let currentMove = 'white'

document.querySelector('.board').style.background = 'url(../png/board_' + localStorage.getItem('chosen_back') + '.png) center/100% 100%'

let pieceMap = [
    [2, 'w'], 0, 0, 0, 0, [5, 'b'],
    0, [3, 'b'], 0, 0, 0, [5, 'w'],
    [5, 'b'], 0, 0, 0, [3, 'w'], 0,
    [5, 'w'], 0, 0, 0, 0, [2, 'b']
]

setField()

document.querySelector('.button_roll').onclick = async () => {
    if (active != 'roll') { return }

    await roll()

    if (checkPossibleMoves(currentMove)) {
        active = 'move'
    } else {
        currentMove = currentMove == 'white' ? 'black' : 'white'
        updateMove()
    }
}

document.querySelector('.board').onclick = (ev) => {
    let section = getBoardPosition(ev.pageX, ev.pageY)

    if (active != 'move') { return }

    if (!section) { return }

    if (pieceMap[section - 1] && pieceMap[section - 1][1] != currentMove[0]) { return }

    if (!activePieceNum && !pieceMap[section - 1]) { return }

    if (!activePieceNum && pieceMap[section - 1]) {
        let activePieceElem = document.querySelector('[data-board_pos="' + section + '"][data-last="true"]')
        activePieceNum = activePieceElem.dataset.num
        activePieceElem.classList.add('active')
        return
    }

    if (activePieceNum) {
        let activePieceElem = document.querySelector('[data-num="' + activePieceNum + '"]')
        let distance = section - Number(activePieceElem.dataset.board_pos)

        if ((currentMove == 'white' && distance < 0) ||
            (currentMove == 'black' && distance > 0)
        ) { return }

        if (!distance) {
            activePieceNum = 0
            activePieceElem.classList.remove('active')
            return
        }

        distance = Math.abs(distance)

        if (!(currentDice.includes(distance))) { return }
        currentDice.splice(currentDice.indexOf(distance), 1)

        let coords = pieceMap[section - 1] ? getCoords(section - 1, pieceMap[section - 1][0]) : getCoords(section - 1, 0)
        activePieceElem.style.transform = 'translate(' + coords[0] + '%, ' + coords[1] + '%)'

        let prevSection = Number(activePieceElem.dataset.board_pos)
        if (pieceMap[prevSection - 1][0] > 1) {
            pieceMap[prevSection - 1][0]--
        } else {
            pieceMap[prevSection - 1] = 0
        }

        if (pieceMap[section - 1]) {
            pieceMap[section - 1][0]++
        } else {
            pieceMap[section - 1] = [1, currentMove[0]]
        }

        activePieceElem.dataset.board_pos = section

        setTimeout(() => {
            updateField()

            if (checkVictory()) {
                gameOver(checkVictory())
            }
        }, 500);

        activePieceNum = 0
        activePieceElem.classList.remove('active')

        if (!currentDice.length || (currentDice.length && !checkPossibleMoves(currentMove))) {
            currentMove = currentMove == 'white' ? 'black' : 'white'
            updateMove()

            active = 'roll'
        }
    }
}

function setField() {
    let pieceCount = 1

    for (let i = 0; i < 24; i++) {
        if (pieceMap[i]) {
            for (let j = 0; j < pieceMap[i][0]; j++) {
                let piece = document.createElement('div')
                piece.classList.add('piece')
                piece.style.background = 'url(../png/' + (pieceMap[i][1] == 'w' ? 'white' : 'black') + '.png) center/100% 100%'

                piece.dataset.board_pos = i + 1
                piece.dataset.last = j == pieceMap[i][0] - 1
                piece.dataset.color = pieceMap[i][1] == 'w' ? 'white' : 'black'
                piece.dataset.num = pieceCount

                pieceCount++

                let coords = getCoords(i, j)
                piece.style.transform = 'translate(' + coords[0] + '%, ' + coords[1] + '%)'

                document.querySelector('.board').append(piece)
            }
        }
    }
}

function getCoords(posIndex, order) {
    let x, y

    if (posIndex < 12) {
        x = 52 + 20 * order
    } else {
        x = 815 - 20 * order
    }

    if (posIndex < 12) {
        y = posIndex * 86 + 41
    } else {
        y = 990 - (posIndex - 12) * 86
    }

    if (5 < posIndex && posIndex <= 17) {
        y += 100
    }

    return [x, y]
}

function getBoardPosition(x, y) {
    let board = document.querySelector('.board')

    let sectionStartPoints = [
        17, 45, 77, 105, 135, 163,
        230, 260, 289, 317, 347, 376
    ]

    let section = 0
    let sizeCf = 1
    let width = document.querySelector('.wrapper').offsetWidth

    if (width >= 600) {
        sizeCf = 1.3
    }

    if (width >= 800) {
        sizeCf = 1.8
    }

    if (sizeCf > 1) {
        x -= board.getBoundingClientRect().left
        y -= board.getBoundingClientRect().top
    } else {
        x -= board.offsetLeft
        y -= board.offsetTop
    }

    if (y < 17 * sizeCf || (y > 189 * sizeCf && y < 230 * sizeCf) || y > 404 * sizeCf) {
        return section
    }

    for (let i = 0; i < 12; i++) {
        if (!sectionStartPoints[i + 1]) {
            section = 12
        }

        if (sectionStartPoints[i] * sizeCf <= y && sectionStartPoints[i + 1] * sizeCf > y) {
            section = i + 1
            break
        }
    }

    if (x < 164 * sizeCf) {
        return section
    } else {
        return 25 - section
    }
}

function roll() {
    let diceElems = document.querySelectorAll('.dice')

    currentDice = [randInt(1, 6), randInt(1, 6)]
    let animCount = 0

    if (currentDice[0] == currentDice[1]) {
        currentDice.push(currentDice[0], currentDice[0])
    }

    let rollInterval = setInterval(() => {
        diceElems[0].querySelector('img').src = '../png/dice_' + randInt(1, 6) + '.png'
        diceElems[1].querySelector('img').src = '../png/dice_' + randInt(1, 6) + '.png'

        animCount++

        if (animCount == 12) {
            diceElems[0].querySelector('img').src = '../png/dice_' + currentDice[0] + '.png'
            diceElems[1].querySelector('img').src = '../png/dice_' + currentDice[1] + '.png'

            clearInterval(rollInterval)
        }
    }, 100)

    return new Promise(resolve => {
        setTimeout(() => {
            resolve('ok')
        }, 1500)
    })
}

function updateMove() {
    document.querySelector('.move').innerHTML = currentMove == 'white' ? 'White\'s move' : 'Black\'s move'
}

function updateField() {
    for (let i = 0; i < 24; i++) {
        if (pieceMap[i]) {
            let pieceRow = document.querySelectorAll('.piece[data-board_pos="' + (i + 1) + '"]')
            let best = 0

            if (i < 12) {
                for (let i = 0; i < pieceRow.length; i++) {
                    pieceRow[i].dataset.last = 'false'

                    if (pieceRow[i].getBoundingClientRect().left > pieceRow[best].getBoundingClientRect().left) {
                        best = i
                    }
                }
            } else {
                for (let i = 0; i < pieceRow.length; i++) {
                    pieceRow[i].dataset.last = 'false'

                    if (pieceRow[i].getBoundingClientRect().left < pieceRow[best].getBoundingClientRect().left) {
                        best = i
                    }
                }
            }

            pieceRow[best].dataset.last = 'true'
        }
    }
}

function checkPossibleMoves(color) {
    let res = false

    for (let dice of currentDice) {
        for (let i = 0; i < 24; i++) {
            if (pieceMap[i] && pieceMap[i][1] == color[0]) {
                if (color == 'white') {
                    if (pieceMap[i + dice] != undefined && (pieceMap[i + dice] === 0 || pieceMap[i + dice][1] == 'w')) {
                        res = true
                    }
                } else {
                    if (pieceMap[i - dice] != undefined && (pieceMap[i - dice] === 0 || pieceMap[i - dice][1] == 'b')) {
                        res = true
                    }
                }
            }
        }
    }

    return res
}

function checkVictory() {
    let [blackWin, whiteWin] = [true, true]

    for (let i = 0; i < 24; i++) {
        if (pieceMap[i]) {
            if (pieceMap[i][1] == 'w' && i < 18) {
                whiteWin = false
            }

            if (pieceMap[i][1] == 'b' && i > 5) {
                blackWin = false
            }
        }
    }

    if (blackWin) { return 'Black' }
    else if (whiteWin) { return 'White' }
}

function gameOver(winner) {
    document.querySelector('.outcome span').innerHTML = winner + '\'s victory'
    document.querySelector('.game_over').style.left = '50%'

    changeBalance(2500)
}