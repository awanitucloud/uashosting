// static/js/js/database.js
import { 
    db, ref, set, onValue, push, 
    query, orderByChild, limitToLast 
} from './firebaseInit.js';

export class Database {
    constructor() {
        this.scoresListRef = ref(db, 'scoresList'); 
        this.topScoresQuery = query(
            this.scoresListRef, 
            orderByChild('score'),
            limitToLast(5)
        );
        this.globalTop5 = []; // Menyimpan data leaderboard terbaru
    }

    saveScore(playerName, score) {
        if (score <= 0) return;
        
        const newScoreRef = push(this.scoresListRef);
        set(newScoreRef, {
            name: playerName,
            score: score
        });
    }

    listenToLeaderboard(callback) {
        onValue(this.topScoresQuery, (snapshot) => {
            let globalTop5 = [];
            snapshot.forEach(childSnapshot => {
                globalTop5.push(childSnapshot.val());
            });
            globalTop5.reverse();
            this.globalTop5 = globalTop5; // Simpan di class property
            callback(globalTop5); 
        });
    }
}