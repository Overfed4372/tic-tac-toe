function initializeBoard () {
    return [
        [0,0,0], 
        [0,0,0], 
        [0,0,0],
    ];

}
function changeBoard () {
    let gameBoard = initializeBoard ();
    //Token "1" is for player 1 and token "2" is for player2
    const playMove = (player, move) => {
        const tokenOneOrTwo = player === "player1" ? 1 : 2;
        const row = move.row;
        const column = move.column;
        //See if the selected spot of the player is not taken
        if (gameBoard[row][column] === 0) {
            gameBoard[row][column] = tokenOneOrTwo;
            return true;
        } else {
            return false;
        }
    }
    const getBoard = () => gameBoard;
    const resetBoard = () => {
        gameBoard = initializeBoard();
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
    let winner = false;
    let gameEndedOrNot;
    const board = changeBoard()
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        // console.log(`${getActivePlayer().name}'s turn \n`);
        // console.table(board.getBoard());
    }
    /*
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
    */
    const playRound = ([row, column]) => {
        //If encounters error, rowAndColumn is a string indicating the error
        // const rowAndColumn = inputAndCheckMove().takeMoveFromInput(board.getBoard());
        // if (typeof rowAndColumn === "string") {
        //     printInvalidMove(rowAndColumn);
        // console.log([row,column]);
        board.playMove(activePlayer.name, {row,column});
        checkWinner();
        switchPlayerTurn();
        printNewRound();
        if (winner !== false) {
            // console.log(`${winner.name} won the game!`);
            // board.resetBoard();
            activePlayer = players[0];
        }
    }
    const resetBoard = () => {
        board.resetBoard();
        winner = false;
        gameEndedOrNot = false;
        activePlayer = players[0];
    }
    const getWinner = () => {
        return winner;
    }
    const getGameEndedOrNot = () => {
        return gameEndedOrNot;
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
        //Check for draw when there is no empty field
        ( () => {
            let emptyFieldsCounter = 0;
            boardStatus.forEach (
                (row) => { 
                    let rowEmptyFields = row.filter( (field) => field === 0 );
                    // console.log("khhoeu", rowEmptyFields);
                    emptyFieldsCounter += rowEmptyFields.length;
                }
            )
            if (!winnerSign && emptyFieldsCounter === 0) {
                winnerSign = 0;
            }
        }
        )();
        if (winnerSign) gameEndedOrNot = true;
        if (winnerSign === players[0].sign) {
            winner = players[0]
        } else if (winnerSign === players[1].sign) {
            winner = players[1];
        } else if (winnerSign === 0){
            winner = {name: "draw", sign:0};
        } else {
            winner = false
        }
    }
    //Initialize
    // printNewRound();
    return {board: board.getBoard
        ,playRound
        ,getActivePlayer
        ,resetBoard
        ,getWinner
        ,getGameEndedOrNot};
});
(function ScreenController () {
    const game = gameController();
    const boardInitialStructure = initializeBoard();
    const createFields = ( () => {
        const gameSection = document.querySelector("div.container > div.game-section > div.fields");
        let fieldNumber = boardInitialStructure.length * boardInitialStructure[0].length;
        console.log(fieldNumber);
        const field = document.createElement("button");
        field.classList.add("field");
        for (let i=0; i<fieldNumber; i++) {
            gameSection.innerHTML+="<button class='field'></button>";
        } 
    } )();

    function updateScreen () {
        const board = game.board();
        const activePlayer = game.getActivePlayer();
        const winner = game.getWinner();
        // console.log(board);
        const resultSection = document.querySelector("div.container > div.result-section > div.result");
        const playerTurnSection = document.querySelector("div.container > div.result-section > div.player-turn");
        
        board.forEach ( (row, rowIndex) => {
            row.forEach ( (field, colIndex) => {
                if (field === 1) btnSorted[rowIndex][colIndex].innerText = "X";
                if (field === 2) btnSorted[rowIndex][colIndex].innerText = "O"; 
                if (field === 0) btnSorted[rowIndex][colIndex].innerText = ""; 
            } )
        } );
        
        playerTurnSection.textContent = activePlayer.name === "player1" ? "Player1's turn" :
        activePlayer.name === "player2" ? "Player2's turn" : "";

        // console.log(winner);
        if (winner) {
            if (winner.name === "draw") resultSection.textContent = "The game is a draw!";
            else {
                let capitalizedName = winner.name.charAt(0).toUpperCase() + winner.name.slice(1);
                resultSection.textContent = `${capitalizedName} won the game!`;
            }
            playerTurnSection.textContent = "";
        } else {
            resultSection.textContent = "";
        }
    }
    //Sorting button nodes as row and column arrays [ [...], [...], ... , [...]]

    
    const btnSorted = (() => {
        //All the lines in this function are about to
        //put button nodes into a structured [row*column] array
        const bttnNodes = document.querySelectorAll("div.game-section > div.fields > button");
        const bttnArr=[];
        let counter = 0;
        for (let i=0; i<boardInitialStructure.length; i++) {
            bttnArr.push([]);
            for (let j=0; j<boardInitialStructure[i].length; j++) {
                bttnArr[i].push(bttnNodes[counter]);
                counter++;
            }
        }
        return bttnArr;
    })();
    

    //Reset button
    const resetBtn = document.querySelector("div.game-section > div.reset > button");
    //Initial screen updating
    updateScreen();
    //Functionality for buttons
    (function addBtnfunctionality() {
        btnSorted.forEach( (bttnRow,rowIndex) => {
            bttnRow.forEach( (btn,colIndex) => {
                btn.addEventListener( "click", (event)=>{
                    // console.log(gameEndedOrNot);
                    if (!game.getGameEndedOrNot()) { 
                        if (game.board()[rowIndex][colIndex] === 0) {
                            game.playRound([rowIndex,colIndex]);
                            updateScreen();
                            // console.log("winner", winner);
                        } else {
                            window.alert("Pick another sopt!");
                        }
                    }
                } )
            })
        })
        resetBtn.addEventListener( "click", (event) => {
            game.resetBoard(); 
            // console.log(game.getWinner());
            updateScreen();
        })
    })();
})();