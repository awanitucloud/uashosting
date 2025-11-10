// static/js/js/ui.js

export class UI {
    constructor() {
        this.menuOverlay = document.getElementById('menu-overlay');
        this.pauseOverlay = document.getElementById('pause-overlay');
        this.gameoverOverlay = document.getElementById('gameover-overlay');
        this.creditOverlay = document.getElementById('credit-overlay');
        
        this.scoreDisplay = document.getElementById('score');
        this.finalScoreElement = document.getElementById('final-score');
        this.playerNameInput = document.getElementById('playerNameInput');

        this.startButton = document.getElementById('startGameButton');
        this.restartButton = document.getElementById('restart-button');
        this.continueButton = document.getElementById('continue-button');
        this.creditButton = document.getElementById('credit-button');
        this.closeCreditButton = document.getElementById('close-credit-button');
        this.backToMenuPauseButton = document.getElementById('back-to-menu-pause');
        this.backToMenuGameOverButton = document.getElementById('back-to-menu-gameover');
        
        this.leaderboardRanks = [
            document.getElementById('rank-1'),
            document.getElementById('rank-2'),
            document.getElementById('rank-3'),
            document.getElementById('rank-4'),
            document.getElementById('rank-5'),
        ];
        
        this.assets = {}; 
        this.playerName = 'Guest';
    }

    loadAssets(assetsToLoad) {
        this.assets = assetsToLoad;
        const TOTAL_ASSETS = Object.keys(this.assets).length;
        let assetsLoaded = 0;

        this.startButton.disabled = true;
        this.startButton.innerText = 'Loading Assets...';

        return new Promise((resolve) => {
            const onAssetLoad = () => {
                assetsLoaded++;
                if (assetsLoaded === TOTAL_ASSETS) {
                    this.startButton.disabled = false;
                    this.startButton.innerText = 'Mulai Game';
                    resolve(this.assets);
                }
            };
            
            for (const key in this.assets) {
                this.assets[key].onload = onAssetLoad;
                this.assets[key].onerror = () => {
                    console.error(`Gagal memuat: ${this.assets[key].src}.`);
                    onAssetLoad(); 
                };
            }
        });
    }

    updateScore(score, isInitial = false) {
        let message = `Pemain: ${this.playerName} | Skor: ${score}`;
        if (isInitial) {
            message += " (Tekan Panah untuk Mulai)";
        }
        this.scoreDisplay.innerText = message;
    }

    showMenu() {
        this.menuOverlay.style.display = 'flex';
        this.gameoverOverlay.style.display = 'none';
        this.pauseOverlay.style.display = 'none';
        this.creditOverlay.style.display = 'none';
    }

    hideMenu() {
        this.menuOverlay.style.display = 'none';
    }

    showPause() {
        this.pauseOverlay.style.display = 'flex';
    }

    hidePause() {
        this.pauseOverlay.style.display = 'none';
    }
    
    showGameOver(score) {
        this.finalScoreElement.innerText = score;
        this.gameoverOverlay.style.display = 'flex';
    }
    
    updateLeaderboard(globalTop5, currentScore = 0) {
        let displayArray = [...globalTop5]; 
        let playerInListIndex = displayArray.findIndex(item => item.name === this.playerName);
        
        if (playerInListIndex > -1) {
             if (currentScore > displayArray[playerInListIndex].score) {
                 displayArray[playerInListIndex].score = currentScore;
             }
        } else if (currentScore > 0) {
            displayArray.push({
                name: this.playerName,
                score: currentScore,
                isPlayer: true
            });
        }

        displayArray.sort((a, b) => b.score - a.score);
        const top5 = displayArray.slice(0, 5);
        
        this.leaderboardRanks.forEach((rankElement, i) => {
            const nameElement = rankElement.querySelector('.name');
            const scoreElement = rankElement.querySelector('.score');
            const item = top5[i]; 

            if (item) {
                let name = item.name;
                const isCurrentPlayer = (item.name === this.playerName && item.score === currentScore);
                
                nameElement.innerText = name.length > 10 ? name.substring(0, 10) + "..." : name;
                scoreElement.innerText = item.score;

                if (isCurrentPlayer) {
                    rankElement.style.backgroundColor = '#666'; 
                    nameElement.innerText = name.length > 7 ? name.substring(0, 7) + "... (You)" : name + " (You)";
                } else {
                    rankElement.style.backgroundColor = '#444'; 
                }
            } else {
                nameElement.innerText = "---";
                scoreElement.innerText = "";
                rankElement.style.backgroundColor = '#444';
            }
        });
    }

    // --- INPUT & EVENT BINDING ---
    
    bindCreditEvents() {
        this.creditButton.addEventListener('click', () => {
            this.menuOverlay.style.display = 'none'; 
            this.creditOverlay.style.display = 'flex'; 
        });
        this.closeCreditButton.addEventListener('click', () => {
            this.creditOverlay.style.display = 'none'; 
            this.menuOverlay.style.display = 'flex'; 
        });
    }
    
    bindStartGame(handler) {
        this.startButton.addEventListener('click', handler);
    }
    
    bindContinueGame(handler) {
        this.continueButton.addEventListener('click', handler);
    }
    
    bindRestartGame(handler) {
        this.restartButton.addEventListener('click', handler);
    }

    bindBackToMenu(handler) {
        this.backToMenuPauseButton.addEventListener('click', handler);
        this.backToMenuGameOverButton.addEventListener('click', handler);
    }

    getPlayerConfig() {
        this.playerName = this.playerNameInput.value.trim() || 'Guest';
        
        const envTheme = document.querySelector('input[name="envTheme"]:checked').value;
        const snakeTheme = document.querySelector('input[name="snakeTheme"]:checked').value;
        
        return {
            playerName: this.playerName,
            envTheme: envTheme,
            snakeTheme: snakeTheme
        };
    }
}