function initializeBoard () {
    return [
        [0,0,0], 
        [0,0,0], 
        [0,0,0],
    ];
}
function changeBoard () {
    let GameBoard = initializeBoard ();
    //Token "1" is for player 1 and token "2" is for player2
    const playMove = (player, move) => {
        console.log(move);
        const tokenOneOrTwo = player === "player1" ? 1 : 2;
        const row = move.row - 1;
        const column = move.column - 1;
        //See if the selected spot of the player is not taken
        if (GameBoard[row][column] === 0) {
            GameBoard[row][column] = tokenOneOrTwo;
            return true;
        } else {
            return false;
        }
    }
    const getBoard = () => GameBoard;
    const resetBoard = () => {
        GameBoard = initializeBoard();
    }
    return {playMove, getBoard, resetBoard};
}
function inputAndCheckMove () {
    const board = initializeBoard();
    const maxRows = board.length;
    const maxColumns = board[0].length;
    const takeMoveFromInput = (board,[row,column]) => {
        /*
        ////The commented sections are controllers for console game
        ////Not the DOM
        // let row = prompt("Enter row: ");
        // let column = prompt("Enter column: ");
        if (!Number.isInteger(+row)) {
            return "invalidRow";
        }
        if (!Number.isInteger(+column)) {
            return "invalidColumn";
        }
        //Check if the selected row and column are out of range
        if (+row > maxRows) {
            return "rowOutOfRange";
        }
        if (+column > maxColumns) {
            return "columnOutOfRange";
        }
        //Check if the room is not empty
        if (board[+row-1][+column-1] !== 0) {
            return "pointNotEmpty";
        }
        if (+row <= maxRows &&
            +column <= maxColumns &&
            board[+row-1][+column-1] === 0){
                return {row,column};
            }
        */
        
        return false;
    }
    return {takeMoveFromInput};
}
const gameController = (function () {
    // const player1 = "player1";
    // const player2 = "player2";
    const players = [
        {
            name: "player1",
            sign: 1,
        },
        {
            name: "player2",
            sign: 2,
        },
    ];
    let activePlayer = players[0];
    const board = changeBoard()
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn \n`);
        console.table(board.getBoard());
    }
    const printInvalidMove = (errorType) => {
        switch (errorType) {
            case 'invalidRow':
                console.log("The input row is invalid. Try again!");
                break;
            case 'invalidColumn':
                console.log("The input Column is invalid. Try again!");
                break;
            case 'rowOutOfRange':
                console.log("The input row is out of range. Try again!");
                break;
            case 'columnOutOfRange':
                console.log("The input column is out of range. Try again!");
                break;
            case 'pointNotEmpty' :
                console.log("The selected point is not empty. Try again!");
                break;
        }
    }
    const playRound = ([row, column, playerTurn]) => {
        //If encounters error, rowAndColumn is a string indicating the error
        // const rowAndColumn = inputAndCheckMove().takeMoveFromInput(board.getBoard());
        if (typeof rowAndColumn === "string") {
            printInvalidMove(rowAndColumn);
        } else if (rowAndColumn !== false) {
            board.playMove(activePlayer.name, rowAndColumn);
            let winner = checkWinner();
            switchPlayerTurn();
            printNewRound();
            if (winner !== false) {
                console.log(`${winner.name} won the game!`);
                board.resetBoard();
                activePlayer = players[0];
            }
        }
    }
    const checkWinner = () => {
        const boardStatus = board.getBoard();
        let winnerSign;
        //Check for row take over possibilty
        boardStatus.forEach ( (row) => {
            const firstSign = row[0];
            if (firstSign !== 0) {
                let checkedArray = row.filter( (item) => {
                    return item === firstSign;
                } )
                if (checkedArray.length === row.length) {
                    winnerSign = firstSign;
                }
            }
        } );
        //Check for column take over possibility 
        ( () => { 
            for (let i = 0; i<boardStatus.length; i++) {
                let checkSpotVal = boardStatus[0][i];
                let repeatCounter = 0;
                if (checkSpotVal === 0) continue;
                for (let j=0; j<boardStatus.length; j++) {    
                    if (boardStatus[j][i] === 0) break;
                    if (boardStatus[j][i] === checkSpotVal) repeatCounter++;
                }
                if (repeatCounter === boardStatus.length) winnerSign = checkSpotVal;
            }
        })();
        //Check for cross take over posibility
        /* 
        * 0 0
        0 * 0
        0 0 *
        */
        ( () => { 
            let repeatCounter = 0;
            for (let i = 0; i<boardStatus.length; i++) {
                let checkSpotVal = boardStatus[0][0];
                if (checkSpotVal === 0) break;
                if (boardStatus[i][i] === 0) break;
                if (boardStatus[i][i] === checkSpotVal) repeatCounter++;
                if (repeatCounter === boardStatus.length) winnerSign = checkSpotVal;
            }
        })();
        //Check for reverse cross take over posibility
        /* 
        0 0 *
        0 * 0
        * 0 0
        */
        ( () => { 
            let repeatCounter = 0;
            for (let i = 0; i<boardStatus.length; i++) {
                let checkSpotVal = boardStatus[0][boardStatus.length-1];
                if (checkSpotVal === 0) break;
                if (boardStatus[i][boardStatus.length-i-1] === 0) break;
                if (boardStatus[i][boardStatus.length-i-1] === checkSpotVal) repeatCounter++;
                if (repeatCounter === boardStatus.length) winnerSign = checkSpotVal;
            }
        })();
        if (winnerSign === players[0].sign) {
            return players[0]
        } else if (winnerSign === players[1].sign) {
            return players[1];
        } else {
            return false
        }
    }
    //Initialize
    printNewRound();
    return {playRound,getActivePlayer};
})();
function ScreenController () {
    const board = gameController();
}