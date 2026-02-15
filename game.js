// Memory Match Game - Interactive JavaScript Mini-Game
class MemoryGame {
    constructor() {
        // Game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.gameTimer = null;
        this.seconds = 0;
        
        // High scores
        this.highScores = this.loadHighScores();
        
        // Card symbols (emojis for visual appeal)
        this.symbols = ['🎨', '📚', '🖌️', '📖', '✏️', '🎭', '🖼️', '✨'];
        
        // DOM elements
        this.gameBoard = null;
        this.movesDisplay = null;
        this.timerDisplay = null;
        this.messageDisplay = null;
        this.startButton = null;
        this.resetButton = null;
        
        // Initialize game when DOM is ready
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGame());
        } else {
            this.setupGame();
        }
    }
    
    setupGame() {
        // Get DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.movesDisplay = document.getElementById('moves');
        this.timerDisplay = document.getElementById('timer');
        this.messageDisplay = document.getElementById('game-message');
        this.startButton = document.getElementById('start-game');
        this.resetButton = document.getElementById('reset-game');
        
        // Only setup if we're on the game page
        if (this.gameBoard) {
            this.setupEventListeners();
            this.createBoard();
            this.displayHighScores();
            this.showMessage('Click "Start Game" to begin!', 'info');
        }
    }
    
    setupEventListeners() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startGame());
        }
        
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetGame());
        }
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            } else if (e.key === ' ' && !this.gameStarted) {
                e.preventDefault();
                this.startGame();
            }
        });
    }
    
    createBoard() {
        if (!this.gameBoard) return;
        
        // Clear existing board
        this.gameBoard.innerHTML = '';
        
        // Create pairs of cards
        this.cards = [];
        this.symbols.forEach(symbol => {
            this.cards.push(symbol, symbol); // Add each symbol twice
        });
        
        // Shuffle cards using Fisher-Yates algorithm
        this.shuffleArray(this.cards);
        
        // Create card elements
        this.cards.forEach((symbol, index) => {
            const card = this.createCard(symbol, index);
            this.gameBoard.appendChild(card);
        });
    }
    
    createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Card ${index + 1}, hidden`);
        
        // Create card faces
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = '?';
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = symbol;
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        // Add click event
        card.addEventListener('click', () => this.flipCard(card));
        
        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.flipCard(card);
            }
        });
        
        return card;
    }
    
    flipCard(card) {
        // Don't flip if game hasn't started or card is already flipped/matched
        if (!this.gameStarted || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        card.setAttribute('aria-label', `Card ${parseInt(card.dataset.index) + 1}, ${card.dataset.symbol}`);
        this.flippedCards.push(card);
        
        // Check for match when two cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.symbol === card2.dataset.symbol;
        
        if (match) {
            // Cards match!
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                card1.setAttribute('aria-label', `Card ${parseInt(card1.dataset.index) + 1}, ${card1.dataset.symbol}, matched`);
                card2.setAttribute('aria-label', `Card ${parseInt(card2.dataset.index) + 1}, ${card2.dataset.symbol}, matched`);
                
                this.matchedPairs++;
                this.flippedCards = [];
                
                // Check for win
                if (this.matchedPairs === this.symbols.length) {
                    this.endGame(true);
                } else {
                    this.showMessage('Great match! Keep going!', 'success');
                }
            }, 600);
        } else {
            // No match - flip cards back
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.setAttribute('aria-label', `Card ${parseInt(card1.dataset.index) + 1}, hidden`);
                card2.setAttribute('aria-label', `Card ${parseInt(card2.dataset.index) + 1}, hidden`);
                
                this.flippedCards = [];
                this.showMessage('Not a match. Try again!', 'info');
            }, 1000);
        }
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.moves = 0;
        this.matchedPairs = 0;
        this.seconds = 0;
        this.flippedCards = [];
        
        // Reset board
        this.createBoard();
        this.updateMoves();
        this.updateTimer();
        
        // Start timer
        this.gameTimer = setInterval(() => {
            this.seconds++;
            this.updateTimer();
        }, 1000);
        
        // Update UI
        if (this.startButton) {
            this.startButton.disabled = true;
        }
        if (this.resetButton) {
            this.resetButton.disabled = false;
        }
        
        this.showMessage('Game started! Match all pairs to win!', 'info');
    }
    
    resetGame() {
        // Stop timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Reset state
        this.gameStarted = false;
        this.moves = 0;
        this.matchedPairs = 0;
        this.seconds = 0;
        this.flippedCards = [];
        
        // Reset board
        this.createBoard();
        this.updateMoves();
        this.updateTimer();
        
        // Update UI
        if (this.startButton) {
            this.startButton.disabled = false;
        }
        if (this.resetButton) {
            this.resetButton.disabled = true;
        }
        
        this.showMessage('Game reset. Click "Start Game" to play again!', 'info');
    }
    
    endGame(won) {
        // Stop timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.gameStarted = false;
        
        // Update UI
        if (this.startButton) {
            this.startButton.disabled = false;
        }
        if (this.resetButton) {
            this.resetButton.disabled = false;
        }
        
        // Show win message
        if (won) {
            const minutes = Math.floor(this.seconds / 60);
            const secs = this.seconds % 60;
            const timeStr = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
            
            this.showMessage(
                `🎉 Congratulations! You won in ${this.moves} moves and ${timeStr}! 🎉`, 
                'success'
            );
            
            // Save high score
            this.saveHighScore(this.moves, this.seconds);
            
            // Add celebration animation
            this.celebrateWin();
        }
    }
    
    celebrateWin() {
        // Add celebration effect to matched cards
        const matchedCards = document.querySelectorAll('.memory-card.matched');
        matchedCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'matchPulse 0.6s ease';
            }, index * 100);
        });
    }
    
    updateMoves() {
        if (this.movesDisplay) {
            this.movesDisplay.textContent = this.moves;
        }
    }
    
    updateTimer() {
        if (this.timerDisplay) {
            const minutes = Math.floor(this.seconds / 60);
            const secs = this.seconds % 60;
            this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    showMessage(message, type = 'info') {
        if (!this.messageDisplay) return;
        
        this.messageDisplay.textContent = message;
        this.messageDisplay.className = `game-message ${type}`;
        this.messageDisplay.style.display = 'block';
        
        // Auto-hide info messages after 3 seconds
        if (type === 'info') {
            setTimeout(() => {
                if (this.messageDisplay.textContent === message) {
                    this.messageDisplay.style.display = 'none';
                }
            }, 3000);
        }
    }
    
    shuffleArray(array) {
        // Fisher-Yates shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // High Score Management
    loadHighScores() {
        const saved = localStorage.getItem('memoryGameHighScores');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading high scores:', e);
                return [];
            }
        }
        return [];
    }
    
    saveHighScore(moves, seconds) {
        const score = {
            moves: moves,
            seconds: seconds,
            date: new Date().toISOString(),
            score: this.calculateScore(moves, seconds)
        };
        
        this.highScores.push(score);
        this.highScores.sort((a, b) => b.score - a.score); // Sort by score (highest first)
        this.highScores = this.highScores.slice(0, 10); // Keep top 10
        
        localStorage.setItem('memoryGameHighScores', JSON.stringify(this.highScores));
        this.displayHighScores();
        
        // Show if it's a new high score
        if (this.highScores[0] === score) {
            setTimeout(() => {
                this.showMessage('🏆 NEW HIGH SCORE! 🏆', 'success');
            }, 2000);
        }
    }
    
    calculateScore(moves, seconds) {
        // Lower moves and time = higher score
        const moveScore = Math.max(0, 1000 - (moves * 10));
        const timeScore = Math.max(0, 500 - (seconds * 2));
        return Math.round(moveScore + timeScore);
    }
    
    displayHighScores() {
        let highScoresContainer = document.getElementById('high-scores');
        if (!highScoresContainer) {
            // Create high scores container if it doesn't exist
            highScoresContainer = document.createElement('div');
            highScoresContainer.id = 'high-scores';
            highScoresContainer.className = 'card';
            
            // Insert after game controls
            const gameControls = document.querySelector('.game-controls');
            if (gameControls && gameControls.parentNode) {
                gameControls.parentNode.insertBefore(highScoresContainer, gameControls.nextSibling);
            }
        }
        
        if (this.highScores.length === 0) {
            highScoresContainer.innerHTML = `
                <h3>🏆 High Scores</h3>
                <p>No high scores yet. Be the first to complete the game!</p>
            `;
        } else {
            let scoresHTML = '<h3>🏆 High Scores</h3><div class="scores-list">';
            
            this.highScores.slice(0, 5).forEach((score, index) => {
                const date = new Date(score.date);
                const dateStr = date.toLocaleDateString();
                const minutes = Math.floor(score.seconds / 60);
                const secs = score.seconds % 60;
                const timeStr = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
                
                scoresHTML += `
                    <div class="score-item">
                        <span class="rank">#${index + 1}</span>
                        <span class="score-details">
                            ${score.moves} moves, ${timeStr}
                        </span>
                        <span class="score-date">${dateStr}</span>
                    </div>
                `;
            });
            
            scoresHTML += '</div>';
            highScoresContainer.innerHTML = scoresHTML;
        }
    }
    
    clearHighScores() {
        if (confirm('Are you sure you want to clear all high scores?')) {
            this.highScores = [];
            localStorage.removeItem('memoryGameHighScores');
            this.displayHighScores();
            this.showMessage('High scores cleared!', 'info');
        }
    }
}

// Initialize the game when the script loads
const memoryGame = new MemoryGame();

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryGame;
}
