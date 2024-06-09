'use strict';

class Sudoku {
    constructor(input) {
        this.board = this.twoDee(input) //2d array of inputs
        this.boardSize = this.board.length;
    }

    /**
     * Attempt to solve the problem
     * @param {*} row - row in this.board
     * @param {*} col - column in this.board
     * @returns {boolean} - return true if solved, otherwise false.
     */
    solve(row, col) {
        if(row == this.boardSize-1 && col == this.boardSize)
        {
            return true;
        }

        if(col == this.boardSize)
        {
            col = 0;
            row++;
        }

        if(this.board[row][col] != 0)
        {
            return this.solve(row, col+1);
        }

        for(let answer=1; answer<=this.boardSize; answer++) //check for a possible answer between 1 -> size
        {
            if(this.validAnswer(row, col, answer))
            {
                this.board[row][col] = answer;
                
                //Recursive call
                if(this.solve(row, col+1))
                    return true;
            }
            //backtracking, make this cell 0 again
            this.board[row][col] = 0;
        }
        return false;
    }

    /**
     * Checks if the answer has any duplicate in its row, col, and block
     * @param {*} row - row in this.board
     * @param {*} col - column in this.board
     * @param {*} answer - number in this.board[row][col]
     * @returns 
     */
    validAnswer(row, col, answer)
    {
        //Check ROW
        for(let col=0; col<this.boardSize; col++)
        {
            if(this.board[row][col] == answer)
            {
                return false;
            }
        }
        
        //Check COLUMN
        for(let row=0; row<this.boardSize; row++)
        {
            if(this.board[row][col] == answer)
                return false;
        }
        
        //check BLOCK
        let blockSize = Math.sqrt(this.boardSize);
        let blockRow = row - (row % blockSize);
        let blockCol = col - (col % blockSize);
        for(let blockR=blockRow; blockR<blockRow+blockSize; blockR++)
        {
            for(let blockC=blockCol; blockC<blockCol + blockSize; blockC++)
            {
                if(this.board[blockR][blockC] == answer)
                    return false;
            }
        }
        
        return true; //No duplicate
    }

    /**
     * Convert the given 1D array into a 2D array
     * @param {Array} oneDee - A 1D array containing the values of the board
     * @returns - 2D array version of oneDee
     */
    twoDee(oneDee) {
        let result = [];
        let size = Math.sqrt(oneDee.length);

        for(let row=0; row<size; row++) //Row
        {
            let temp = [];
            let pos = row * size; //current position in the array
            
            for(let col=0; col<size; col++) //Column
            {    
                if(oneDee[pos] != "") {
                    let num = parseInt(oneDee[pos]);
                    
                    if(num > 0 && num <= size) {    //valid number for the board size
                        temp.push(num);

                    } else {  // contains a number that is invalid for board size
                        message.innerText = "Row: " + row + " Col: " + col + " is an invalid value";
                        message.style.visibility = "visible";
                        squares[pos].classList.add('error');
                        while(squares[pos].value) {}

                        return;
                    }

                } else {
                    temp.push(0);
                }
                pos++;
            }
            result.push(temp);
        }
        return result;
    }
}


//Data
const clear_btn = document.querySelector('.clear-btn');
const solve_btn = document.querySelector('.solve-btn');
const squares = Array.from(document.querySelectorAll('.square'));
const message = document.querySelector('.msg');
const boardSize = Math.sqrt(squares.length);
let values;
let sudokuBoard;

/**
 * Add or remove error on the given row
 * @param {Number} row - row to add the errors at
 * @param {Boolean} add - if true, it's adding the errors. Otherwise, removing.
 */
let errorRow = (row, add) => {
    let index = row*boardSize;
    for(let i=0; i<boardSize; i++)
    {
        if(add)
            squares[index++].classList.add('error');
        else
            squares[index++].classList.remove('error');
    }
}

/**
 * Add or remove error on the given column
 * @param {Number} col - column to add the error on
 * @param {Boolean} add - if true, it's adding the error. Otherwise, removing.
 */
let errorCol = (col, add) => {
    for(let i=0; i<boardSize; i++)
    {
        if(add)
            squares[i*boardSize+col].classList.add('error');
        else
            squares[i*boardSize+col].classList.remove('error');
    }
}

/**
 * Add or remove errors on the block where the square is located.
 * @param {Number} row - is the row of the square 
 * @param {Number} col - is the column of the square
 * @param {Boolean} add - if true, add errors. Otherwise, remove.
 */
let errorBlock = (row, col, add) => {
    let blockSize = Math.sqrt(boardSize);
    let blockRow = row - (row % blockSize);
    let blockCol = col - (col % blockSize);
    for(let blockR=blockRow; blockR<blockRow+blockSize; blockR++)
    {
        let pos = blockR * boardSize;
        for(let blockC=blockCol; blockC<blockCol + blockSize; blockC++)
        {
            if(add)
            {
                squares[pos + blockC].classList.add('error');
            }
            else
            {
                squares[pos + blockC].classList.remove('error');
            }
        }
    }
}

/**
 * Initialize the variables
 */
let initializeVariables = () => {
    values = [];
    message.style.visibility = "none";
    squares.forEach((square) => {
        values.push(square.value);
    })
    sudokuBoard = new Sudoku(values);
}

/**
 * The function called when solving the problem
 */
let solveSudoku = () => {
    for(let i=0; i<squares.length; i++)
    {
        //cannot solve the problem with errors
        if(squares[i].classList.contains('error'))
            return;
    }

    initializeVariables();
    let size = sudokuBoard.boardSize;
    if(sudokuBoard.solve(0, 0)) {
        for(let row=0; row<size; row++)
        {
            let pos = row * size;
            for(let col=0; col<size; col++)
            {
                squares[pos++].value = sudokuBoard.board[row][col];
            }
        }
    }
    else{
        message.innerText = "The problem is unsolvable.";
        message.style.visibility = "visible";
    }
}

/**
 * Remove every input
 */
let clearBoard = () => {
    squares.forEach((square) => {
        square.value = "";
        
        if(square.classList.contains('error')){
            square.classList.remove('error')
        }
    })
    message.style.visibility = "hidden";
}

/**
 * Make sure the inputs from the user have no duplicates in its row, column, and block
 * @param {Object} square - is the square to check if its value is valid
 * @param {Number} index - is the position of the square in squares array
 * @returns 
 */
let checkState = (square, index) => {
    let col = index % boardSize;
    let row = Math.floor(index / boardSize);
    let badRow = false;
    let badCol = false;
    let badBlock = false;

    //Remove the errors
    errorRow(row, badRow);
    errorCol(col, badCol);
    errorBlock(row, col, badBlock);

    if(square.value == '')  //do nothing
        return;

    //Check ROW
    for(let c=0; c<boardSize; c++)
    {
        if(index != (row*boardSize+c) && square.value == squares[row*boardSize+c].value)
        {
            badRow = true;
        }
    }
    
    //Check COLUMN
    for(let r=0; r<squares.length; r+=boardSize)
    {
        if(index != (col+r) && square.value == squares[col+r].value)
        {
            badCol = true;
        }
    }

    //Check BLOCK
    let blockSize = Math.sqrt(boardSize);
    let blockRow = row - (row % blockSize);
    let blockCol = col - (col % blockSize);
    for(let blockR=blockRow; blockR<blockRow+blockSize; blockR++)
    {
        let pos = blockR * boardSize;
        for(let blockC=blockCol; blockC<blockCol + blockSize; blockC++)
        {

            if(index != (pos+blockC) && square.value == squares[pos+blockC].value)
            {
                badBlock = true;
            }
        }
    }

    //Add the errors if needed
    if(badRow)
        errorRow(row, badRow);
    if(badCol)
        errorCol(col, badCol)
    if(badBlock)
        errorBlock(row, col, badBlock)
}

/**
 * Add Event Listener to each Square to make sure the inputs are valid
 */
squares.forEach((square, index) => {
    square.addEventListener('keyup', () => {

        checkState(square, index);

        if(square.value == "")
        {
            square.classList.remove('error');
        }
        else
        {
            let num = Number.parseInt(square.value);
            if(Number.isNaN(num) || num <= 0 || num > boardSize)
            {
                square.classList.add('error');
            }
        }
    })
})

solve_btn.addEventListener('click', solveSudoku);
clear_btn.addEventListener('click', clearBoard)


