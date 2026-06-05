let turn = 'O';
let mode = 'PvC'; // Default mode is Player vs Computer
let isGameOver = false; // Flag to easily stop clicks when someone wins

let winner = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let board_array = new Array(9).fill("E");

// --- Select Elements ---
const board = document.querySelector('.board');
const winningMessage = document.getElementById('winningMessage');
const btnPvP = document.getElementById('btn-pvp');
const btnPvC = document.getElementById('btn-pvc');
const restartBtn = document.getElementById('restart-btn');
const playerXName = document.getElementById('player-x-name');

// --- Helper Functions ---
function checkWinner() {
    for (let [index0, index1, index2] of winner) {
        if (board_array[index0] == board_array[index1] && 
            board_array[index1] == board_array[index2] && 
            board_array[index0] != "E") {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return !board_array.includes("E");
}

function updateActiveProfile() {
    if (turn === 'O') {
        document.getElementById('profile-O').classList.add('active');
        document.getElementById('profile-X').classList.remove('active');
    } else {
        document.getElementById('profile-X').classList.add('active');
        document.getElementById('profile-O').classList.remove('active');
    }
}

// --- Game Logic ---
function playMove(cellId, currentPlayer) {
    if (isGameOver) return;

    // Update Array and DOM
    board_array[cellId] = currentPlayer;
    document.getElementById(cellId).innerHTML = currentPlayer;

    // Check Win/Draw
    if (checkWinner()) {
        winningMessage.innerHTML = `Winner is ${currentPlayer}! 🎉`;
        isGameOver = true;
        return;
    }
    if (checkDraw()) {
        winningMessage.innerHTML = "It's a Draw! 🤝";
        isGameOver = true;
        return;
    }

    // Switch turns
    turn = (currentPlayer === 'O') ? 'X' : 'O';
    updateActiveProfile();
}

function computerMove() {
    if (isGameOver) return;

    // 1. Find all empty spots on the board
    let emptySpots = [];
    for (let i = 0; i < board_array.length; i++) {
        if (board_array[i] === "E") {
            emptySpots.push(i);
        }
    }

    // 2. Pick a random empty spot
    if (emptySpots.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptySpots.length);
        let chosenCellId = emptySpots[randomIndex];
        
        // 3. Play the move as 'X'
        playMove(chosenCellId, 'X');
    }
}

// --- Event Listeners ---
board.addEventListener('click', (event) => {
    if (isGameOver) return;

    const element = event.target;
    if (!element.classList.contains('cell')) return;

    // If cell is empty, Human plays
    if (board_array[element.id] === "E") {
        playMove(element.id, turn);

        // If it's Computer mode, the game isn't over, and it's X's turn, trigger AI
        if (mode === 'PvC' && !isGameOver && turn === 'X') {
            // setTimeout adds a tiny delay so the computer feels "human" 
            setTimeout(computerMove, 500); 
        }
    }
});

// Restart Game Logic
function resetGame() {
    board_array.fill("E");
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
    winningMessage.innerHTML = '';
    turn = 'O';
    isGameOver = false;
    updateActiveProfile();
}

restartBtn.addEventListener('click', resetGame);

// Mode Selection Logic
btnPvP.addEventListener('click', () => {
    mode = 'PvP';
    btnPvP.classList.add('active');
    btnPvC.classList.remove('active');
    playerXName.innerText = 'Player X';
    resetGame();
});

btnPvC.addEventListener('click', () => {
    mode = 'PvC';
    btnPvC.classList.add('active');
    btnPvP.classList.remove('active');
    playerXName.innerText = 'Computer (X)';
    resetGame();
});