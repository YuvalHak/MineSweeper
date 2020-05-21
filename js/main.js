'use strict'

console.log('test')

var gBoard = []

// var cell = {
//     isMine: false,
//     minesAroundCount: 0,
//     isShown: true,
//     isMarked: true
// }

// var mineCell = {
//     isMine: true,
//     minesAroundcount: 0,
//     isShown: true,
//     isMarked: true
// }

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    flaggedCount: 0,
    secsPassed: 0
}


function init(size, mines) {
    gGame.isOn = true;
    //todo timer
    gLevel.size = size;
    gLevel.mines = mines;
    var mineLocation = generateMines()
    var res = buildBoard(gLevel, mineLocation)
    setMinesNegsCount(mineLocation)
    renderBoard()
}


function buildBoard(gLevel, mineLocation) {
    for (var i = 0; i < gLevel.size; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            gBoard[i][j] = {
                isMine: false,
                minesAroundCount: 0,
                isShown: false,
                isFlagged: false
            }
        }
    }
    console.log(gBoard)

    for (var i = 0; i < gLevel.mines; i++) {
        console.log(mineLocation[i][0])
        console.log(mineLocation[i][1])
        console.log(gBoard[mineLocation[i][0]][mineLocation[i][1]])
        gBoard[mineLocation[i][0]][mineLocation[i][1]] = {
            isMine: true,
            minesAroundcount: 0,
            isShown: false,
            isFlagged: false
        }
    }
    return gBoard
}

function setMinesNegsCount(mineLocation) {
    console.log(mineLocation)
    for (var i = 0; i < gLevel.mines; i++) {
        var mineXCoor = mineLocation[i][0]
        var mineYCoor = mineLocation[i][1]
        var negs = getNegs(mineXCoor, mineYCoor)
        console.log('the mines: ', mineXCoor)
        console.log('the mines: ', mineYCoor)

        for (var j = 0; j < negs.length; j++) {
            var mineNegXCoor = negs[j][0]
            var mineNegYCoor = negs[j][1]

            if (mineNegXCoor < 0 || mineNegXCoor >= gLevel.size || mineNegYCoor < 0 || mineNegYCoor >= gLevel.size) continue
            console.log('putting the count in', mineNegXCoor, mineNegYCoor)
            gBoard[mineNegXCoor][mineNegYCoor].minesAroundCount++
        }
    }
    console.log(gBoard)
}


function getNegs(x, y) {
    var negs = []
    negs.push([x - 1, y - 1])
    negs.push([x - 1, y])
    negs.push([x - 1, y + 1])
    negs.push([x, y - 1])
    negs.push([x, y + 1])
    negs.push([x + 1, y - 1])
    negs.push([x + 1, y])
    negs.push([x + 1, y + 1])
    console.log(negs)
    return negs
}



function generateMines() {
    var result = []
    for (var i = 0; i < gLevel.mines; i++) {
        var x = getRandomInt(0, gLevel.size)
        var y = getRandomInt(0, gLevel.size) //Todo: makesure its not the same cell
        result.push([x, y])
    }
    return (result)
}


function renderBoard() {
    console.log('before rendering : ', gBoard)
    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isMine)
                strHTML += `<td class="hidden" onclick="cellClicked(this)" oncontextmenu="cellFlagged(this)"> * </td>`
            else {
                strHTML += `<td class="hidden" onclick="cellClicked(this)" oncontextmenu="cellFlagged(this)"> ${gBoard[i][j].minesAroundCount} </td>`
            }
            // strHTML += `<td data-i="${i}" data-j="${j}"
            // class="${className}">${cell}</td>`
        }

        strHTML += '</tr>'
    }

    var elTbody = document.querySelector('.board');
    elTbody.innerHTML = strHTML;
    // elTbody.innerHTML = '<tr><td>WOW</td></tr>';

}

function cellClicked(elTd) {
    gGame.shownCount++;

    if (elTd.innerText === '*') {
        var elMsg = document.querySelector('.msg')
        elMsg.innerText = 'game over'
        gGame.isOn = false
    }
    else {
        elTd.classList.remove('hidden')
    }
}


function cellFlagged(elTd) {
    if (elTd.classList.contains('flagged')) {
        elTd.classList.remove('flagged')
        gGame.flaggedCount--
    }
    else {
        elTd.classList.add('flagged')
        gGame.flaggedCount++
    }

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

