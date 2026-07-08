// game.js - Phiên bản nâng cấp

// ---------- DỮ LIỆU THẺ BÀI ----------
const CARD_DATA = [
    // Naruto
    { id: 1, name: "Naruto Uzumaki", anime: "Naruto", hp: 140, attack: 22, rarity: "rare", emoji: "🍥" },
    { id: 2, name: "Sasuke Uchiha", anime: "Naruto", hp: 120, attack: 28, rarity: "rare", emoji: "⚡" },
    { id: 3, name: "Sakura Haruno", anime: "Naruto", hp: 100, attack: 18, rarity: "common", emoji: "🌸" },
    { id: 4, name: "Kakashi Hatake", anime: "Naruto", hp: 130, attack: 25, rarity: "uncommon", emoji: "📖" },
    
    // One Piece
    { id: 5, name: "Monkey D. Luffy", anime: "One Piece", hp: 160, attack: 20, rarity: "legendary", emoji: "🏴‍☠️" },
    { id: 6, name: "Roronoa Zoro", anime: "One Piece", hp: 140, attack: 24, rarity: "epic", emoji: "⚔️" },
    { id: 7, name: "Sanji", anime: "One Piece", hp: 125, attack: 22, rarity: "uncommon", emoji: "🔥" },
    { id: 8, name: "Nami", anime: "One Piece", hp: 95, attack: 16, rarity: "common", emoji: "🍊" },
    
    // Jujutsu Kaisen
    { id: 9, name: "Satoru Gojo", anime: "Jujutsu Kaisen", hp: 150, attack: 32, rarity: "legendary", emoji: "👁️" },
    { id: 10, name: "Yuji Itadori", anime: "Jujutsu Kaisen", hp: 135, attack: 26, rarity: "epic", emoji: "👊" },
    { id: 11, name: "Megumi Fushiguro", anime: "Jujutsu Kaisen", hp: 120, attack: 23, rarity: "rare", emoji: "🐕" },
    
    // Demon Slayer
    { id: 12, name: "Tanjiro Kamado", anime: "Demon Slayer", hp: 130, attack: 24, rarity: "rare", emoji: "🌊" },
    { id: 13, name: "Nezuko Kamado", anime: "Demon Slayer", hp: 115, attack: 20, rarity: "uncommon", emoji: "🔥" },
    { id: 14, name: "Inosuke Hashibira", anime: "Demon Slayer", hp: 135, attack: 27, rarity: "uncommon", emoji: "🐗" },
    { id: 15, name: "Kyojuro Rengoku", anime: "Demon Slayer", hp: 145, attack: 29, rarity: "epic", emoji: "🔥" },
    
    // Bleach
    { id: 16, name: "Ichigo Kurosaki", anime: "Bleach", hp: 150, attack: 28, rarity: "epic", emoji: "⚔️" },
    { id: 17, name: "Rukia Kuchiki", anime: "Bleach", hp: 115, attack: 22, rarity: "uncommon", emoji: "❄️" },
    
    // My Hero Academia
    { id: 18, name: "Izuku Midoriya", anime: "My Hero Academia", hp: 125, attack: 26, rarity: "rare", emoji: "💪" },
    { id: 19, name: "Katsuki Bakugo", anime: "My Hero Academia", hp: 130, attack: 30, rarity: "epic", emoji: "💥" },
    
    // Seven Deadly Sins
    { id: 20, name: "Escanor", anime: "Seven Deadly Sins", hp: 170, attack: 35, rarity: "ex", emoji: "☀️" },
    { id: 21, name: "Meliodas", anime: "Seven Deadly Sins", hp: 155, attack: 30, rarity: "legendary", emoji: "⚡" },
    
    // Solo Leveling
    { id: 22, name: "Sung Jin-Woo", anime: "Solo Leveling", hp: 160, attack: 33, rarity: "ex", emoji: "👑" },
];

// ---------- LỚP THẺ BÀI ----------
class Card {
    constructor(data) {
        this.id = data.id + Date.now(); // ID duy nhất
        this.name = data.name;
        this.anime = data.anime;
        this.hp = data.hp;
        this.maxHp = data.hp;
        this.attack = data.attack;
        this.rarity = data.rarity || 'common';
        this.emoji = data.emoji || '🃏';
        this.isAlive = true;
        this.originalAttack = data.attack;
    }
}

// ---------- LỚP NGƯỜI CHƠI ----------
class Player {
    constructor(name) {
        this.name = name;
        this.health = 1000;
        this.maxHealth = 1000;
        this.board = [];
        this.hand = [];
        this.gold = 0;
        this.wins = 0;
        this.totalWaves = 0;
    }
}

// ---------- ENGINE GAME ----------
class GameEngine {
    constructor() {
        this.player = new Player("Người chơi");
        this.enemies = [];
        this.boss = null;
        this.wave = 0;
        this.turn = 0;
        this.gameOver = false;
        this.isPlayerTurn = true;
        this.message = "Chào mừng! Hãy bắt đầu hành trình của bạn!";
        this.bossDefeated = false;
        this.isBossWave = false;
        
        this.startGame();
    }

    startGame() {
        // Reset trạng thái
        this.player = new Player("Người chơi");
        this.enemies = [];
        this.boss = null;
        this.wave = 0;
        this.turn = 0;
        this.gameOver = false;
        this.isPlayerTurn = true;
        this.bossDefeated = false;
        this.isBossWave = false;
        
        // Chia bài ban đầu
        this.player.hand = this.getRandomCards(5);
        // Tự động đưa 2 thẻ ra sân
        for (let i = 0; i < Math.min(2, this.player.hand.length); i++) {
            this.playCard(0);
        }
        
        this.nextWave();
        this.render();
    }

    getRandomCards(n) {
        const shuffled = [...CARD_DATA].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n).map(data => new Card(data));
    }

    playCard(index) {
        if (index < 0 || index >= this.player.hand.length) return;
        if (this.player.board.length >= 5) {
            this.setMessage("⚠️ Sân đã đầy (tối đa 5 thẻ)!");
            this.render();
            return;
        }
        
        const card = this.player.hand.splice(index, 1)[0];
        this.player.board.push(card);
        this.setMessage(`✅ Đã đưa ${card.emoji} ${card.name} ra sân!`);
        this.render();
    }

    nextWave() {
        if (this.gameOver) return;
        
        this.wave++;
        this.player.totalWaves++;
        
        // Kiểm tra boss (sóng 10, 20, 30, 50)
        if (this.wave % 10 === 0 || this.wave === 50) {
            this.isBossWave = true;
            this.boss = this.generateBoss();
            this.setMessage(`👑 BOSS XUẤT HIỆN! Sóng ${this.wave} - ${this.boss.name}!`);
            this.enemies = [];
        } else {
            this.isBossWave = false;
            this.boss = null;
            this.generateEnemies();
            this.setMessage(`🌊 Sóng ${this.wave} bắt đầu! (${this.enemies.length} quái vật)`);
        }
        
        // Hồi phục cho người chơi
        const healAmount = 50 + this.wave * 5;
        this.player.health = Math.min(this.player.maxHealth, this.player.health + healAmount);
        
        // Thưởng vàng
        this.player.gold += 10 + this.wave;
        
        this.render();
    }

    generateEnemies() {
        const count = Math.min(3 + Math.floor(this.wave / 3), 6);
        this.enemies = [];
        for (let i = 0; i < count; i++) {
            const baseHp = 40 + this.wave * 12 + Math.floor(Math.random() * 20);
            const baseAtk = 8 + this.wave * 3 + Math.floor(Math.random() * 5);
            const enemy = new Card({
                id: 1000 + i,
                name: `Quái vật C${i+1}`,
                anime: `Sóng ${this.wave}`,
                hp: baseHp,
                attack: baseAtk,
                rarity: 'common',
                emoji: '👾'
            });
            // Thêm tên đặc biệt cho đa dạng
            const names = ['Goblin', 'Orc', 'Slime', 'Skeleton', 'Demon', 'Shadow', 'Frost', 'Flame'];
            enemy.name = `${names[i % names.length]} Lv.${this.wave}`;
            this.enemies.push(enemy);
        }
    }

    generateBoss() {
        const bossNames = [
            { name: 'Vua Quỷ', emoji: '👿', hp: 300, atk: 30 },
            { name: 'Rồng Bóng Tối', emoji: '🐉', hp: 400, atk: 35 },
            { name: 'Thần Hủy Diệt', emoji: '💀', hp: 500, atk: 40 },
            { name: 'Kẻ Thống Trị', emoji: '👑', hp: 600, atk: 45 },
        ];
        const bossIndex = Math.min(Math.floor(this.wave / 10) - 1, bossNames.length - 1);
        const bossData = bossNames[bossIndex] || bossNames[0];
        
        const waveBonus = this.wave * 5;
        const boss = new Card({
            id: 9999,
            name: bossData.name,
            anime: `BOSS Sóng ${this.wave}`,
            hp: bossData.hp + waveBonus,
            attack: bossData.atk + Math.floor(waveBonus / 3),
            rarity: 'ex',
            emoji: bossData.emoji
        });
        
        // Boss sóng 50 đặc biệt
        if (this.wave === 50) {
            boss.name = 'Chaos - Kẻ Hủy Diệt Vũ Trụ';
            boss.hp = 2000;
            boss.attack = 60;
            boss.emoji = '👾';
        }
        
        return boss;
    }

    playerAttack(cardIndex) {
        if (this.gameOver || !this.isPlayerTurn) return;
        
        const attacker = this.player.board[cardIndex];
        if (!attacker || !attacker.isAlive) {
            this.setMessage("⚠️ Thẻ này đã bị đánh bại!");
            this.render();
            return;
        }

        // Xác định mục tiêu: ưu tiên boss nếu có, không thì quái vật đầu tiên
        let target = null;
        if (this.boss && this.boss.isAlive) {
            target = this.boss;
        } else if (this.enemies.length > 0) {
            target = this.enemies[0];
        } else {
            this.setMessage("🎉 Không còn kẻ địch! Chuyển sang sóng mới...");
            this.nextWave();
            return;
        }

        // Gây sát thương (có thể crit)
        const isCrit = Math.random() < 0.15;
        let damage = attacker.attack;
        if (isCrit) damage = Math.floor(damage * 1.8);
        
        target.hp -= damage;
        this.turn++;
        
        // Log
        const critText = isCrit ? '💥 CHÍ MẠNG! ' : '';
        this.setMessage(`${attacker.emoji} ${attacker.name} tấn công ${target.emoji} ${target.name}: ${critText}-${damage} máu!`);
        
        // Kiểm tra target chết
        if (target.hp <= 0) {
            target.isAlive = false;
            if (target === this.boss) {
                this.setMessage(`🎉 ${target.emoji} ${target.name} đã bị đánh bại! Chúc mừng!`);
                this.boss = null;
                this.player.gold += 50 + this.wave * 5;
            } else {
                this.enemies = this.enemies.filter(e => e.isAlive);
                this.player.gold += 5 + this.wave;
                this.setMessage(`💀 ${target.emoji} ${target.name} đã bị tiêu diệt!`);
            }
        }

        this.isPlayerTurn = false;
        this.render();

        // Lượt của kẻ địch sau 0.5s
        setTimeout(() => {
            this.enemyTurn();
        }, 500);
    }

    enemyTurn() {
        if (this.gameOver) return;

        // Tất cả kẻ địch tấn công
        const enemies = [...this.enemies];
        if (this.boss && this.boss.isAlive) enemies.push(this.boss);
        
        for (let enemy of enemies) {
            if (!enemy.isAlive) continue;
            
            // Chọn mục tiêu ngẫu nhiên trên sân của người chơi
            const aliveCards = this.player.board.filter(c => c.isAlive);
            let target = null;
            
            if (aliveCards.length > 0) {
                target = aliveCards[Math.floor(Math.random() * aliveCards.length)];
            } else {
                // Tấn công trực tiếp
                const damage = Math.floor(enemy.attack * 0.7);
                this.player.health -= damage;
                this.setMessage(`💢 ${enemy.emoji} ${enemy.name} tấn công trực tiếp: -${damage} máu!`);
                continue;
            }
            
            const damage = Math.floor(enemy.attack * (0.6 + Math.random() * 0.4));
            target.hp -= damage;
            
            if (target.hp <= 0) {
                target.isAlive = false;
                this.player.board = this.player.board.filter(c => c.isAlive);
                this.setMessage(`💀 ${target.emoji} ${target.name} đã bị ${enemy.emoji} ${enemy.name} đánh bại!`);
            } else {
                this.setMessage(`⚔️ ${enemy.emoji} ${enemy.name} tấn công ${target.emoji} ${target.name}: -${damage} máu!`);
            }
        }

        // Kiểm tra game over
        if (this.player.health <= 0 || this.player.board.length === 0) {
            this.gameOver = true;
            this.setMessage("💀 GAME OVER! Bạn đã thua ở sóng " + this.wave);
            this.render();
            return;
        }

        // Kiểm tra hết quái
        const enemiesAlive = this.enemies.filter(e => e.isAlive);
        const bossAlive = this.boss && this.boss.isAlive;
        
        if (enemiesAlive.length === 0 && !bossAlive) {
            this.setMessage(`🎉 Sóng ${this.wave} đã được dọn sạch!`);
            // Chuyển sóng sau delay
            setTimeout(() => {
                if (!this.gameOver) this.nextWave();
            }, 1000);
        }

        this.isPlayerTurn = true;
        this.render();
    }

    drawCard() {
        if (this.player.hand.length >= 8) {
            this.setMessage("⚠️ Tay bài đã đầy (tối đa 8)!");
            this.render();
            return;
        }
        
        const newCard = new Card(CARD_DATA[Math.floor(Math.random() * CARD_DATA.length)]);
        this.player.hand.push(newCard);
        this.setMessage(`🃏 Đã rút được ${newCard.emoji} ${newCard.name}!`);
        this.render();
    }

    setMessage(msg) {
        this.message = msg;
    }

    // ---------- HIỂN THỊ UI ----------
    render() {
        const area = document.getElementById('game-area');
        if (!area) return;

        let html = '';

        // ---- Thông tin người chơi ----
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        html += `
            <div id="player-info">
                <div class="player-name">⚔️ ${this.player.name}</div>
                <div class="health-bar-container">
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${healthPercent}%;"></div>
                        <span class="health-text">❤️ ${Math.max(0, this.player.health)} / ${this.player.maxHealth}</span>
                    </div>
                </div>
                <div class="player-stats">
                    <span>⭐ Sóng: <span class="value">${this.wave}</span></span>
                    <span>💰 Vàng: <span class="value">${this.player.gold}</span></span>
                    <span>🔄 Lượt: <span class="value">${this.turn}</span></span>
                </div>
            </div>
        `;

        // ---- Thông báo ----
        html += `
            <div id="message-log">
                ${this.message}
            </div>
        `;

        // ---- Boss announcement ----
        if (this.isBossWave && this.boss && this.boss.isAlive) {
            html += `
                <div class="boss-announce">
                    <h2>👑 ${this.boss.emoji} ${this.boss.name} 👑</h2>
                    <p>❤️ ${this.boss.hp} / ${this.boss.maxHp} | ⚔️ ATK: ${this.boss.attack}</p>
                </div>
            `;
        }

        // ---- Sân của người chơi ----
        html += `
            <div class="section-title">⚔️ Đội của bạn <span class="badge">${this.player.board.filter(c => c.isAlive).length} thẻ</span></div>
            <div class="card-area" id="player-board">
        `;
        
        if (this.player.board.filter(c => c.isAlive).length === 0) {
            html += `<p style="color: #ff6b6b; width: 100%; text-align: center;">⚠️ Không còn thẻ nào!</p>`;
        } else {
            this.player.board.forEach((card, index) => {
                if (!card.isAlive) return;
                const hpPercent = (card.hp / card.maxHp) * 100;
                const rarityClass = `rarity-${card.rarity}`;
                html += `
                    <div class="card ${rarityClass}" onclick="window.game.playerAttack(${index})" title="Nhấn để tấn công">
                        <div class="card-name">${card.emoji} ${card.name}</div>
                        <div class="card-anime">${card.anime}</div>
                        <div class="health-bar">
                            <div class="health-fill" style="width: ${hpPercent}%;"></div>
                        </div>
                        <div class="card-stats">
                            <span>❤️ ${Math.max(0, card.hp)}</span>
                            <span>⚔️ ${card.attack}</span>
                        </div>
                        <div class="action-hint">👆 Tấn công</div>
                    </div>
                `;
            });
        }
        html += `</div>`;

        // ---- Tay bài ----
        html += `
            <div class="section-title">🃏 Tay bài <span class="badge">${this.player.hand.length} thẻ</span></div>
            <div class="card-area" id="player-hand">
        `;
        
        if (this.player.hand.length === 0) {
            html += `<p style="color: #aaa; width: 100%; text-align: center;">Hết bài! Hãy rút thêm.</p>`;
        } else {
            this.player.hand.forEach((card, index) => {
                const rarityClass = `rarity-${card.rarity}`;
                html += `
                    <div class="card ${rarityClass}" onclick="window.game.playCard(${index})" title="Nhấn để ra sân">
                        <div class="card-name">${card.emoji} ${card.name}</div>
                        <div class="card-anime">${card.anime}</div>
                        <div class="card-stats">
                            <span>❤️ ${card.hp}</span>
                            <span>⚔️ ${card.attack}</span>
                        </div>
                        <div style="font-size: 0.6rem; color: #4ecdc4; margin-top: 5px;">👆 Ra sân</div>
                    </div>
                `;
            });
        }
        html += `</div>`;

        // ---- Kẻ địch ----
        const enemyCount = this.enemies.filter(e => e.isAlive).length;
        const bossAlive = this.boss && this.boss.isAlive;
        const totalEnemies = enemyCount + (bossAlive ? 1 : 0);
        
        html += `
            <div class="section-title">👾 Kẻ địch <span class="badge">${totalEnemies} con</span></div>
            <div class="card-area" id="enemy-area">
        `;
        
        if (totalEnemies === 0 && !this.gameOver) {
            html += `<p style="color: #4ecdc4; width: 100%; text-align: center;">✨ Sạch sẽ! Đợi chuyển sóng...</p>`;
        } else {
            // Hiển thị boss trước
            if (bossAlive && this.boss) {
                const hpPercent = (this.boss.hp / this.boss.maxHp) * 100;
                html += `
                    <div class="card enemy rarity-ex" style="border-color: #ff6b6b; box-shadow: 0 0 30px rgba(255,107,107,0.3);">
                        <div class="card-name">👑 ${this.boss.emoji} ${this.boss.name}</div>
                        <div class="card-anime" style="color: #ff6b6b;">BOSS Sóng ${this.wave}</div>
                        <div class="health-bar">
                            <div class="health-fill" style="width: ${hpPercent}%; background: linear-gradient(90deg, #ff0000, #ff6b6b);"></div>
                        </div>
                        <div class="card-stats">
                            <span>❤️ ${Math.max(0, this.boss.hp)}</span>
                            <span>⚔️ ${this.boss.attack}</span>
                        </div>
                    </div>
                `;
            }
            
            // Hiển thị quái vật
            this.enemies.forEach((enemy) => {
                if (!enemy.isAlive) return;
                const hpPercent = (enemy.hp / enemy.maxHp) * 100;
                html += `
                    <div class="card enemy">
                        <div class="card-name">${enemy.emoji} ${enemy.name}</div>
                        <div class="card-anime">${enemy.anime}</div>
                        <div class="health-bar">
                            <div class="health-fill" style="width: ${hpPercent}%; background: linear-gradient(90deg, #ff0000, #ff6b6b);"></div>
                        </div>
                        <div class="card-stats">
                            <span>❤️ ${Math.max(0, enemy.hp)}</span>
                            <span>⚔️ ${enemy.attack}</span>
                        </div>
                    </div>
                `;
            });
        }
        html += `</div>`;

        // ---- Nút bấm ----
        html += `
            <div class="button-group">
                <button onclick="window.game.drawCard()">🃏 Rút bài</button>
                <button onclick="window.game.nextWave()" class="secondary">⏭️ Sóng tiếp</button>
                <button onclick="window.game.startGame()" class="danger">🔄 Chơi lại</button>
            </div>
        `;

        // ---- Game Over ----
        if (this.gameOver) {
            html += `
                <div style="margin-top: 20px; padding: 20px; background: rgba(255,0,0,0.1); border-radius: 20px; border: 2px solid #ff6b6b;">
                    <h2 style="color: #ff6b6b; text-align: center;">💀 GAME OVER</h2>
                    <p style="text-align: center; color: #aaa;">Bạn đã sống sót đến sóng <span style="color: #f5c842; font-weight: bold;">${this.wave}</span></p>
                    <p style="text-align: center; color: #aaa;">💰 Vàng kiếm được: <span style="color: #f5c842; font-weight: bold;">${this.player.gold}</span></p>
                </div>
            `;
        }

        area.innerHTML = html;
    }
}

// ---------- KHỞI TẠO GAME ----------
window.game = new GameEngine();

// Hàm để console debug
console.log("🎮 Anime Card Brawler đã sẵn sàng! Gõ game.render() để làm mới.");
