const board = document.getElementById('board');
const timerDisplay = document.getElementById('timer');
const actionBtn = document.getElementById('action-btn');
const historyBody = document.getElementById('history-body');

let tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]; // 0 là ô đen
let isPlaying = false;
let seconds = 0;
let timerId = null;
let moveCount = 0;
let historyCount = 1;

// Các class màu sắc theo yêu cầu đề bài
const colorClasses = {
    1: "bg-green-100 text-green-500", 2: "bg-red-100 text-red-500",
    3: "bg-blue-100 text-blue-500", 4: "bg-purple-100 text-purple-500",
    5: "bg-yellow-100 text-yellow-500", 6: "bg-pink-100 text-pink-500",
    7: "bg-indigo-100 text-indigo-500", 8: "bg-gray-100 text-gray-500",
    9: "bg-emerald-100 text-emerald-500", 10: "bg-amber-100 text-amber-500",
    11: "bg-lime-100 text-lime-500"
};

// Render bàn cờ
function render() {
    board.innerHTML = '';
    tiles.forEach(num => {
        const div = document.createElement('div');
        div.className = `tile w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-lg font-bold text-xl shadow-sm border border-white/50`;
        if (num === 0) {
            div.classList.add('empty-tile');
        } else {
            div.className += ` ${colorClasses[num]}`;
            div.innerText = num;
        }
        board.appendChild(div);
    });
}

// Logic di chuyển (2đ Chức năng)
// Logic di chuyển (Sửa lỗi ngược hướng và nút mũi tên)
function move(direction) {
    if (!isPlaying) return;
    const emptyIdx = tiles.indexOf(0);
    let targetIdx = -1;

    // Chú ý: Khi bấm "Lên", ô đen đổi chỗ với ô "Dưới" nó
    // Khi bấm "Xuống", ô đen đổi chỗ với ô "Trên" nó
    switch (direction) {
        case 'arrowdown':
        case 's':
            if (emptyIdx < 8) targetIdx = emptyIdx + 4; // Ô đen đổi chỗ với ô bên dưới
            break;
        case 'arrowup':
        case 'w':
            if (emptyIdx > 3) targetIdx = emptyIdx - 4; // Ô đen đổi chỗ với ô bên trên
            break;
        case 'arrowright':
        case 'd':
            if (emptyIdx % 4 !== 3) targetIdx = emptyIdx + 1; // Ô đen đổi chỗ với ô bên phải
            break;
        case 'arrowleft':
        case 'a':
            if (emptyIdx % 4 !== 0) targetIdx = emptyIdx - 1; // Ô đen đổi chỗ với ô bên trái
            break;
    }

    if (targetIdx !== -1) {
        [tiles[emptyIdx], tiles[targetIdx]] = [tiles[targetIdx], tiles[emptyIdx]];
        moveCount++;
        render();
        checkWin();
    }
}

// Trộn mảng 100 lần (0.5đ)
function shuffle() {
    const moves = ['w', 'a', 's', 'd'];
    for (let i = 0; i < 100; i++) {
        const randomMove = moves[Math.floor(Math.random() * 4)];
        // Giả lập di chuyển để đảm bảo puzzle luôn giải được
        const emptyIdx = tiles.indexOf(0);
        let tIdx = -1;
        if (randomMove === 'w' && emptyIdx < 8) tIdx = emptyIdx + 4;
        if (randomMove === 's' && emptyIdx > 3) tIdx = emptyIdx - 4;
        if (randomMove === 'a' && emptyIdx % 4 !== 3) tIdx = emptyIdx + 1;
        if (randomMove === 'd' && emptyIdx % 4 !== 0) tIdx = emptyIdx - 1;
        if (tIdx !== -1) [tiles[emptyIdx], tiles[tIdx]] = [tiles[tIdx], tiles[emptyIdx]];
    }
}

// Đồng hồ (0.5đ)
function startTimer() {
    seconds = 0;
    clearInterval(timerId);
    timerId = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${m}:${s}`;
    }, 1000);
}

// Nút Bắt đầu / Kết thúc
actionBtn.onclick = () => {
    if (!isPlaying) {
        shuffle();
        render();
        startTimer();
        moveCount = 0;
        isPlaying = true;
        actionBtn.innerText = "Kết thúc";
        actionBtn.className = actionBtn.className.replace('bg-green-500', 'bg-red-500');
    } else {
        location.reload(); // Reset game
    }
};

// Kiểm tra thắng (2đ)
// Kiểm tra thắng và hiển thị lịch sử (2đ + 1đ)
function checkWin() {
    const winPattern = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
    
    // Kiểm tra xem mảng hiện tại có khớp với mảng thắng không
    if (tiles.every((val, index) => val === winPattern[index])) {
        clearInterval(timerId); // Dừng đồng hồ (0.5đ)
        isPlaying = false;
        
        alert("YOU WIN!");
        
        // Gọi hàm lưu vào bảng lịch sử
        saveHistory();
        
        // Đổi nút thành "Chơi lại"
        actionBtn.innerText = "Chơi lại";
        actionBtn.className = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded shadow-lg mb-6 transition";
    }
}

function saveHistory() {
    const historyBody = document.getElementById('history-body');
    const currentTime = document.getElementById('timer').innerText;

    // Tạo một hàng mới cho bảng
    const newRow = document.createElement('tr');
    newRow.className = "border-b hover:bg-gray-50 transition";
    
    newRow.innerHTML = `
        <td class="py-3 border-r font-medium">${historyCount}</td>
        <td class="py-3 border-r">${moveCount} bước</td>
        <td class="py-3">${currentTime}</td>
    `;

    // Thêm hàng mới vào đầu danh sách lịch sử (để lượt mới nhất ở trên cùng)
    // Hoặc dùng appendChild(newRow) nếu muốn ở dưới cùng
    historyBody.prepend(newRow); 

    historyCount++; // Tăng số thứ tự cho lượt sau
}

// Sự kiện bàn phím
window.addEventListener('keydown', (e) => move(e.key.toLowerCase()));

// Khởi tạo bàn cờ ban đầu
render();
