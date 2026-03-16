const initApp = () => {
    const monthSelect = document.getElementById('month-select');
    const daySelect = document.getElementById('day-select');
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    const dateDisplay = document.getElementById('current-date-display');
    const progressFill = document.getElementById('progress-fill');

    if (!monthSelect || !daySelect || !todoInput) return;

    // 1. 날짜 선택기 초기화 (2026년)
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        monthSelect.appendChild(opt);
    }

    const updateDays = () => {
        const month = parseInt(monthSelect.value);
        const daysInMonth = new Date(2026, month, 0).getDate();
        daySelect.innerHTML = '';
        for (let d = 1; d <= daysInMonth; d++) {
            const opt = document.createElement('option');
            opt.value = d; opt.textContent = d;
            daySelect.appendChild(opt);
        }
        loadTodos();
    };

    const updateProgress = () => {
        const items = todoList.querySelectorAll('.todo-item');
        const checked = todoList.querySelectorAll('.todo-item input:checked');
        const percent = items.length === 0 ? 0 : (checked.length / items.length) * 100;
        progressFill.style.width = percent + '%';
    };

    const saveData = () => {
        const dateKey = `2026-${monthSelect.value}-${daySelect.value}`;
        const items = [];
        todoList.querySelectorAll('.todo-item').forEach(el => {
            items.push({
                text: el.querySelector('span').textContent,
                completed: el.querySelector('input').checked
            });
        });
        localStorage.setItem(dateKey, JSON.stringify(items));
        updateProgress();
    };

    const renderTodo = (text, completed) => {
        const div = document.createElement('div');
        div.className = `todo-item ${completed ? 'completed' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${completed ? 'checked' : ''}>
            <span>${text}</span>
            <button class="btn-delete">&times;</button>
        `;

        div.querySelector('input').addEventListener('change', (e) => {
            div.classList.toggle('completed', e.target.checked);
            saveData();
        });

        div.querySelector('.btn-delete').addEventListener('click', () => {
            div.remove();
            saveData();
        });

        todoList.appendChild(div);
    };

    const loadTodos = () => {
        const dateKey = `2026-${monthSelect.value}-${daySelect.value}`;
        dateDisplay.textContent = dateKey;
        todoList.innerHTML = '';
        const saved = JSON.parse(localStorage.getItem(dateKey)) || [];
        saved.forEach(item => renderTodo(item.text, item.completed));
        updateProgress();
    };

    monthSelect.addEventListener('change', updateDays);
    daySelect.addEventListener('change', loadTodos);
    
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim() !== '') {
            renderTodo(todoInput.value, false);
            saveData();
            todoInput.value = '';
        }
    });

    // 초기 실행
    monthSelect.value = 1;
    updateDays();
};

// DOM이 완전히 로드된 후 실행 보장
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
