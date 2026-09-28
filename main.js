const gridBoard = document.querySelector('.game-board')
const showWinner = document.querySelector('.winner')
const inputPlayerOne = document.querySelector('#player1')
const inputPlayerTwo = document.querySelector('#player2')
const btnStart = document.querySelector('.start')
const btnRestart = document.querySelector('.restart')

// GameBoard IIFE Function
const Gameboard = (() => {
    const board = ['', '', '', '', '', '', '', '', '']

    const getBoard = () => board

    const updateBoard = (index, mark) => {
        board[index] = mark;
    }

    const resetBoard = () => {
        board.fill('')
    }
    return {
        getBoard,
        updateBoard,
        resetBoard
    }
})();

// CratePlayer Fabric Function
const createPlayer = (name, mark) => {
    return {
        name,
        mark
    };
};

// GameController IFFE Function
const game = (() => {
    let activeGame = false

    const getActiveGame = () => activeGame

    const board = Gameboard

    const players = [
        createPlayer('', 'X'),
        createPlayer('', 'O')
    ]

    let currentPlayer = players[0]
    let winner = null

    const start = (nameOne, nameTwo) => {
        if (!nameOne || !nameTwo) {
            showWinner.textContent =
                'Enter the names of both players to begin.'
            return false
        }

        players[0].name = nameOne.trim()
        players[1].name = nameTwo.trim()

        winner = null
        activeGame = true
        showWinner.textContent = `It is currently the turn of: ${currentPlayer.name}`
    }

    const winnerCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const getActivePlayer = () => currentPlayer

    const swichPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
        showWinner.textContent = `It is currently the turn of: ${currentPlayer.name}`
    }

    const checkWinner = (mark) => {
        const boardState = board.getBoard()

        return winnerCombination.some((combination) => {
            return combination.every((index) => boardState[index] === mark)
        })
    }

    const checkTie = () => {
        return board.getBoard().every((square) => square !== '')
    }

    const getWinner = () => winner

    const playRound = (index) => {
        if (!activeGame || winner) {
            return false
        }

        const mark = currentPlayer.mark
        const boardState = board.getBoard()

        if (boardState[index] !== '') {
            return false
        }

        board.updateBoard(index, mark)

        if (checkWinner(mark)) {
            winner = currentPlayer.name
            return mark
        }

        if (checkTie()) {
            winner = 'DRAW'
            return mark
        }

        swichPlayer()
        return mark
    }

    const restart = () => {
        activeGame = false
        winner = null
        currentPlayer = players[0]
        board.resetBoard()
    }


    btnStart.addEventListener('click', () => {
        const player1 = inputPlayerOne.value
        const player2 = inputPlayerTwo.value

        start(player1, player2)
    })

    btnRestart.addEventListener('click', () => {
        restart()

        displayController.squares.forEach((square) => {
            square.textContent = ''
        })

        inputPlayerOne.value = ''
        inputPlayerTwo.value = ''

        showWinner.textContent = ''
    })

    return {
        start,
        restart,
        getActiveGame,
        swichPlayer,
        getActivePlayer,
        checkWinner,
        getWinner,
        playRound
    }

})()

// DisplayController IIFE function 
const displayController = (() => {

    (() => {
        gridBoard.innerHTML = ''
        Gameboard.getBoard().forEach((squareText, index) => {
            const button = document.createElement('button')
            button.classList = 'square-button'
            button.dataset.index = index
            gridBoard.appendChild(button)
        })
    })()

    const squares = document.querySelectorAll('.square-button')
    squares.forEach((currentButton) => {
        currentButton.addEventListener('click', (event) => {
            const clickedIndex = Number(event.target.dataset.index)
            const mark = game.playRound(clickedIndex)

            if (!mark) {
                return
            }

            currentButton.textContent = mark

            game.checkWinner(mark)

            if (game.getWinner() === 'DRAW') {
                showWinner.textContent = 'There was a tie.'
            } else if (game.getWinner() !== null) {
                showWinner.textContent = `The Winning Player Is: ${game.getWinner()}`
            }
        })
    })
    return { squares }
})()
