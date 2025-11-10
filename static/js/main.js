// static/js/js/main.js
import { Game } from './game.js';
import { UI } from './ui.js';
import { Database } from './database.js';

window.addEventListener('DOMContentLoaded', async () => {
    
    // 0. Ambil Aset
    const assetsToLoad = {
        daging: new Image(),
        buah: new Image(),
        racun: new Image(),
        batu: new Image()
    };
    assetsToLoad.daging.src = 'static/daging.png'; 
    assetsToLoad.buah.src = 'static/buah.png';
    assetsToLoad.racun.src = 'static/racun.png';
    assetsToLoad.batu.src = 'static/batu.png';

    // 1. Inisialisasi Class Utama
    const ui = new UI();
    const db = new Database();
    
    // Tunggu sampai semua aset dimuat
    const loadedAssets = await ui.loadAssets(assetsToLoad); 
    
    // Inisialisasi Game
    const game = new Game(ui, db, loadedAssets);
    
    // Mulai Game Loop (ini hanya memanggil loop sekali, loop akan memanggil dirinya sendiri)
    game.gameLoop();

    // 2. Hubungkan (bind) event
    
    ui.bindStartGame(() => {
        const config = ui.getPlayerConfig();
        
        // ⭐ PERBAIKAN: Sembunyikan menu melalui UI dan panggil start game
        ui.hideMenu(); 
        game.start(config);
    });
    
    ui.bindContinueGame(game.continueGame.bind(game));
    ui.bindRestartGame(() => {
        const config = ui.getPlayerConfig();
        ui.gameoverOverlay.style.display = 'none';
        game.start(config);
    });

    ui.bindBackToMenu(game.backToMenu.bind(game));
    
    ui.bindCreditEvents();

    // 3. Mulai listener database
    db.listenToLeaderboard((globalTop5) => {
        // Panggil update leaderboard UI dengan data baru dari Firebase dan skor game saat ini
        ui.updateLeaderboard(globalTop5, game.score);
    });
    
    // Tampilkan menu awal
    ui.showMenu();
});