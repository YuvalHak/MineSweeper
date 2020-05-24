'use strict'
const FLAG = '🚩';
const EMPTY = '';
const PLAY = '😃';
const WIN = '😎';
const LOSE = '😭';
const ONBOMB = '😮';

var gBoard = []

var gLevel = {   //first default start
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    flaggedCount: 0,
    secsPassed: 0,
    livescount: 0
}


function init(size, mines) {        //todolist: timer
    console.log('started');
    
    gGame.isOn = true;
    gGame.livescount = 3;
    gLevel.size = size;
    gLevel.mines = mines;

    var mineLocation = generateMines();
    var res = buildBoard(gLevel, mineLocation);
    setMinesNegsCount(mineLocation);
    renderBoard()
}


function buildBoard(gLevel, mineLocation) {
    console.log('mines in: ', mineLocation)

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

    for (var i = 0; i < gLevel.mines; i++) {

        console.log('mines in: ', mineLocation[i][0], mineLocation[i][1])
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
    for (var i = 0; i < gLevel.mines; i++) {
        var mineXCoor = mineLocation[i][0]
        var mineYCoor = mineLocation[i][1]
        var negs = getNegs(mineXCoor, mineYCoor)

        for (var j = 0; j < negs.length; j++) {
            var mineNegXCoor = negs[j][0]
            var mineNegYCoor = negs[j][1]

            if (mineNegXCoor < 0 || mineNegXCoor >= gLevel.size || mineNegYCoor < 0 || mineNegYCoor >= gLevel.size) continue
            gBoard[mineNegXCoor][mineNegYCoor].minesAroundCount++
        }
    }
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
    return negs
}



function generateMines() { //selecting mines randomly
    var result = []
    for (var i = 0; i < gLevel.mines; i++) {
        var x = getRandomInt(0, gLevel.size)
        var y = getRandomInt(0, gLevel.size) //Todolist: makesure its not the same cell
        result.push([x, y])
        console.log(x, y)
    }
    return (result)
}


function renderBoard() {
    console.log('before rendering : ', gBoard)
    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.size; j++) {
            var id = (i.toString() + ',' + j.toString())

            if (gBoard[i][j].isMine)
                strHTML += `<td class="bomb hidden" onclick="cellClicked(this)" id=${id} oncontextmenu="cellFlagged(this)">  * </td>`
            else {
                strHTML += `<td class="hidden" onclick="cellClicked(this)" id=${id} oncontextmenu="cellFlagged(this)"> ${gBoard[i][j].minesAroundCount} </td>`
            }

        }

        strHTML += '</tr>'
    }

    var elTbody = document.querySelector('.board');
    elTbody.innerHTML = strHTML;
    // var elMsg = document.querySelector('.msg')
    // elMsg.innerText = ''
}


function recursionCells(elTd) {
    var i = +elTd.id[0]     //so it will be numbers
    var j = +elTd.id[2]
    console.log('who am I? ', i, j)

    var negs = getNegs(i, j)
    console.log('my negs are', negs)

    for (var x = 0; x < negs.length; x++) {
        var negXCoor = negs[x][0]
        var negYCoor = negs[x][1]
        console.log(' a neighbour to me ', negXCoor, negYCoor)

        if (negXCoor < 0 || negXCoor >= gLevel.size || negYCoor < 0 || negYCoor >= gLevel.size) continue   //not legal negs

        if (gBoard[negXCoor][negYCoor].isShown) continue;   //neg we already showed
        if (gBoard[negXCoor][negYCoor].isFlagged) continue;  //neg we already flagged
        if (gBoard[negXCoor][negYCoor].isMine) continue;     //neg who is a bomb


        gBoard[negXCoor][negYCoor].isShown = true       //reach here only when 'countinue' didnt happen


        var id = (negXCoor.toString() + ',' + negYCoor.toString())   // build the id  based on coordiantes
        console.log('the neighbour who is legal', id)

        var el = document.getElementById(id)   //take this 'id' from the DOM
        el.classList.remove('hidden')

        if (el.innerText === '0') {  //if the neg is 0 - run this function again
            recursionCells(el)
        }
    }

}



function cellClicked(elTd) {          //(mouse left click)
    gGame.shownCount++;
    var i = elTd.id[0]
    var j = elTd.id[2]
    gBoard[i][j].isShown = true       //update the model
    elTd.classList.remove('hidden')  //update the DOM


    if (elTd.innerText === '0') {       // IF preseed on 0

        recursionCells(elTd)
    }
    else if (elTd.innerText === '*') {   // IF pressed on a bomb
        gGame.livescount--
        var elLives = document.querySelector('.lives')
        elLives.innerText = `only ${gGame.livescount} more lives`
        var elMsg = document.querySelector('.msg')
        elMsg.innerText = '😮'

        if (gGame.livescount === 0) {

            var elMsg = document.querySelector('.msg')
            elMsg.innerText = '😭'
            elLives.innerText = ``

            var elBomb = document.querySelector('.bomb') //show other bombs not yet revealed
            console.log(elBomb)
            elBomb.classList.remove('hidden')
            gGame.isOn = false
        }
    }

    else {                                      // IF pressed on regular number
        elTd.classList.remove('hidden')
        var elMsg = document.querySelector('.msg')
        elMsg.innerText = '😃'
    }
    checkWin()

}


function cellFlagged(elTd) {                  //mouse right click
    var i = elTd.id[0]
    var j = elTd.id[2]

    if (gBoard[i][j].isFlagged) {      //toggle between flagged

        elTd.classList.add('hidden')
        gGame.flaggedCount--

        if (gBoard[i][j].isMine) {
            elTd.innerText = '*'
        }
        else {
            elTd.innerText = gBoard[i][j].minesAroundCount
        }
        gBoard[i][j].isFlagged = false

    }
    else {
        elTd.classList.remove('hidden')
        elTd.innerText = '🚩'
        gGame.flaggedCount++
        gBoard[i][j].isFlagged = true
    }
    var res = checkWin()

}


function checkWin() {                          //check if all mine cells are flagged and all the rest are shown

    for (var i = 0; i < gLevel.size; i++) {
        var currCell = gBoard[i]
        console.log(currCell)

        for (var j = 0; j < gLevel.size; j++) {
            currCell = gBoard[i][j]
            console.log(currCell)
            if (!(currCell.isMine && currCell.isFlagged || !currCell.isMine && currCell.isShown)) return false
        }

    }
    var elMsg = document.querySelector('.msg')
    elMsg.innerText = '😎'
    return true

}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

