// ==================== PROFILES ====================
const PROFILES = {
    emilio: { name: 'Emilio', initial: 'E', gradient: 'linear-gradient(135deg,#ffffff,#cccccc)' },
    karina: { name: 'Karina', initial: 'K', gradient: 'linear-gradient(135deg,#e0e0e0,#aaaaaa)' },
    benjamin: { name: 'Benjamín', initial: 'B', gradient: 'linear-gradient(135deg,#cccccc,#888888)' },
    iveth: { name: 'Iveth', initial: 'I', gradient: 'linear-gradient(135deg,#bbbbbb,#999999)' }
};
let currentProfile = null;

// ==================== DATA LAYER (Electron IPC or localStorage) ====================
const DB = {
    _key: 'trainpro_emilio', // updated per profile
    _default: { workouts: [], calories: [], exerciseLogs: [], settings: { weeklyGoal: 6, dailyCalories: 2450 } },

    async load() {
        if (window.api) return await window.api.loadData();
        try {
            const raw = localStorage.getItem(this._key);
            if (raw) {
                const data = JSON.parse(raw);
                if (!data.calories) data.calories = [];
                if (!data.exerciseLogs) data.exerciseLogs = [];
                return data;
            }
        } catch (e) { }
        return JSON.parse(JSON.stringify(this._default));
    },
    async save(data) {
        if (window.api) return await window.api.saveData(data);
        localStorage.setItem(this._key, JSON.stringify(data));
    },
    async addWorkout(workout) {
        if (window.api) return await window.api.addWorkout(workout);
        const data = await this.load();
        workout.id = Date.now().toString();
        workout.createdAt = new Date().toISOString();
        data.workouts.push(workout);
        await this.save(data);
        return data;
    },
    async deleteWorkout(id) {
        if (window.api) return await window.api.deleteWorkout(id);
        const data = await this.load();
        data.workouts = data.workouts.filter(w => w.id !== id);
        await this.save(data);
        return data;
    },
    async editWorkout(workout) {
        if (window.api) return await window.api.editWorkout(workout);
        const data = await this.load();
        const i = data.workouts.findIndex(w => w.id === workout.id);
        if (i !== -1) data.workouts[i] = { ...data.workouts[i], ...workout };
        await this.save(data);
        return data;
    },
    async addCalorieEntry(entry) {
        if (window.api) return await window.api.addCalorieEntry(entry);
        const data = await this.load();
        entry.id = Date.now().toString();
        if (!data.calories) data.calories = [];
        data.calories.push(entry);
        await this.save(data);
        return data;
    },
    async deleteCalorieEntry(id) {
        if (window.api) return await window.api.deleteCalorieEntry(id);
        const data = await this.load();
        data.calories = (data.calories || []).filter(c => c.id !== id);
        await this.save(data);
        return data;
    },
    async resetCaloriesForDate(dateStr) {
        if (window.api) return await window.api.resetCaloriesForDate(dateStr);
        const data = await this.load();
        data.calories = (data.calories || []).filter(c => c.date !== dateStr);
        await this.save(data);
        return data;
    },
    async exportJSON() {
        if (window.api) return await window.api.exportData();
        const data = await this.load();
        return JSON.stringify(data, null, 2);
    },
    async importJSON(json) {
        if (window.api) return await window.api.importData(json);
        try {
            const data = JSON.parse(json);
            if (data.workouts && Array.isArray(data.workouts)) {
                if (!data.calories) data.calories = [];
                await this.save(data);
                return { success: true, data };
            }
            return { success: false, error: 'Formato inválido' };
        } catch (e) { return { success: false, error: e.message }; }
    }
};

// ==================== STATE ====================
let appData = { workouts: [], calories: [], exerciseLogs: [], settings: { weeklyGoal: 6, dailyCalories: 2450 } };
let calendarDate = new Date();

// ==================== PROFILE INIT ====================
// Migrate old data to Emilio profile if exists
(function migrateOldData() {
    const oldKey = 'training_dashboard_pro';
    const newKey = 'trainpro_emilio';
    if (localStorage.getItem(oldKey) && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, localStorage.getItem(oldKey));
        localStorage.removeItem(oldKey);
    }
})();
document.addEventListener('DOMContentLoaded', () => {
    patchDB();
    bindProfileEvents();

    // Check if profile already selected
    const saved = localStorage.getItem('trainpro_active_profile');
    if (saved && PROFILES[saved]) {
        selectProfile(saved);
    }
    // Otherwise the profile overlay stays visible
});

function bindProfileEvents() {
    document.querySelectorAll('.profile-card').forEach(btn => {
        btn.addEventListener('click', () => selectProfile(btn.dataset.profile));
    });
    document.getElementById('btnSwitchProfile').addEventListener('click', () => {
        document.getElementById('profileOverlay').classList.remove('hidden');
        document.getElementById('appContainer').style.display = 'none';
    });
}

async function selectProfile(profileKey) {
    currentProfile = profileKey;
    localStorage.setItem('trainpro_active_profile', profileKey);
    DB._key = 'trainpro_' + profileKey;

    // Update UI
    const p = PROFILES[profileKey];
    document.getElementById('currentProfileName').textContent = p.name;
    const avatar = document.getElementById('currentProfileAvatar');
    avatar.textContent = p.initial;
    avatar.style.background = p.gradient;

    // Hide overlay, show app
    document.getElementById('profileOverlay').classList.add('hidden');
    document.getElementById('appContainer').style.display = '';

    // Load profile data
    appData = await DB.load();
    if (!appData.calories) appData.calories = [];
    if (!appData.exerciseLogs) appData.exerciseLogs = [];
    updateDate();
    refreshAll();
    bindEvents();
    initRoutines();
}

// ==================== EVENT BINDING ====================
let eventsbound = false;
function bindEvents() {
    if (eventsbound) return;
    eventsbound = true;
    document.getElementById('btnLogWorkout').addEventListener('click', openLogWorkout);
    document.getElementById('btnLogCalories').addEventListener('click', openCaloriesModal);
    document.getElementById('btnExport').addEventListener('click', exportData);
    document.getElementById('btnImport').addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', importData);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('closeDayModal').addEventListener('click', () => document.getElementById('dayModal').classList.remove('active'));
    document.getElementById('closeCalModal').addEventListener('click', () => document.getElementById('caloriesModal').classList.remove('active'));
    document.getElementById('workoutForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('caloriesForm').addEventListener('submit', handleCaloriesSubmit);
    document.getElementById('btnPrevMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('btnNextMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); });
    document.getElementById('btnToday').addEventListener('click', () => { calendarDate = new Date(); renderCalendar(); });

    // Quick-add calories
    document.getElementById('btnQuickAddCal').addEventListener('click', quickAddCalories);
    document.getElementById('quickCalInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); quickAddCalories(); } });
    document.getElementById('btnResetCals').addEventListener('click', resetTodayCalories);

    // Close modals on backdrop
    ['workoutModal', 'dayModal', 'caloriesModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', (e) => {
            if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
        });
    });

    // Tab navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            document.getElementById(btn.dataset.tab).classList.add('active');
            btn.classList.add('active');
        });
    });
}

// ==================== DATE ====================
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES', options);
}

function formatDateISO(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// ==================== CALORIES ====================
function getCaloriesForDate(dateStr) {
    return (appData.calories || []).filter(c => c.date === dateStr);
}

function getTotalCaloriesForDate(dateStr) {
    return getCaloriesForDate(dateStr).reduce((sum, c) => sum + (parseInt(c.amount) || 0), 0);
}

async function quickAddCalories() {
    const input = document.getElementById('quickCalInput');
    const amount = parseInt(input.value);
    if (!amount || amount <= 0) return;
    const entry = { date: formatDateISO(new Date()), description: 'Rápido', amount: amount };
    appData = await DB.addCalorieEntry(entry);
    input.value = '';
    updateCaloriesCard();
    renderCalendar();
    showToast(`+${amount} kcal registradas`, 'success');
}

async function resetTodayCalories() {
    const today = formatDateISO(new Date());
    appData = await DB.resetCaloriesForDate(today);
    updateCaloriesCard();
    renderCalendar();
    showToast('Calorías del día reiniciadas', 'info');
}

function updateCaloriesCard() {
    const today = formatDateISO(new Date());
    const goal = appData.settings.dailyCalories || 2450;
    const consumed = getTotalCaloriesForDate(today);
    const remaining = Math.max(0, goal - consumed);
    const pct = Math.min(100, (consumed / goal) * 100);

    document.getElementById('caloriesRemaining').textContent = remaining.toLocaleString();
    document.getElementById('calGoalDisplay').textContent = goal.toLocaleString();
    document.getElementById('calConsumedDisplay').textContent = consumed.toLocaleString();
    document.getElementById('calProgress').style.width = pct + '%';

    // Color change when over goal (monochrome)
    const fill = document.getElementById('calProgress');
    if (consumed >= goal) {
        fill.style.background = 'linear-gradient(90deg, #666666, #333333)';
    } else if (consumed >= goal * 0.8) {
        fill.style.background = 'linear-gradient(90deg, #999999, #666666)';
    } else {
        fill.style.background = 'linear-gradient(90deg, #cccccc, #ffffff)';
    }
}

function openCaloriesModal() {
    document.getElementById('caloriesForm').reset();
    document.getElementById('calDate').value = formatDateISO(new Date());
    renderCalEntriesToday();
    document.getElementById('caloriesModal').classList.add('active');
}

async function handleCaloriesSubmit(e) {
    e.preventDefault();
    const entry = {
        date: document.getElementById('calDate').value,
        description: document.getElementById('calDescription').value,
        amount: parseInt(document.getElementById('calAmount').value)
    };
    appData = await DB.addCalorieEntry(entry);
    document.getElementById('caloriesForm').reset();
    document.getElementById('calDate').value = formatDateISO(new Date());
    updateCaloriesCard();
    renderCalendar();
    renderCalEntriesToday();
    showToast(`+${entry.amount} kcal: ${entry.description}`, 'success');
}

function renderCalEntriesToday() {
    const container = document.getElementById('calEntriesToday');
    const dateVal = document.getElementById('calDate').value || formatDateISO(new Date());
    const entries = getCaloriesForDate(dateVal);
    if (entries.length === 0) {
        container.innerHTML = '<p style="color:var(--color-text-muted);font-size:0.85rem;text-align:center;padding:0.5rem;">Sin registros para este día</p>';
        return;
    }
    container.innerHTML = entries.map(e => `
        <div class="workout-item" style="cursor:default;padding:0.6rem 0.8rem;margin-bottom:0.4rem;">
            <div class="workout-info">
                <h3 style="font-size:0.9rem">${e.description}</h3>
                <div class="workout-meta">${e.amount} kcal</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteCalEntry('${e.id}')">🗑️</button>
        </div>
    `).join('');
}

async function deleteCalEntry(id) {
    appData = await DB.deleteCalorieEntry(id);
    updateCaloriesCard();
    renderCalendar();
    renderCalEntriesToday();
    showToast('Entrada eliminada', 'info');
}

// ==================== METRICS ====================
function updateMetrics() {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const weekWorkouts = appData.workouts.filter(w => new Date(w.date) >= startOfWeek && new Date(w.date) <= now);
    const goal = appData.settings.weeklyGoal || 6;

    document.getElementById('totalWorkouts').textContent = weekWorkouts.length;
    document.getElementById('workoutProgress').style.width = Math.min(100, (weekWorkouts.length / goal) * 100) + '%';
    document.getElementById('weeklyGoalLabel').textContent = goal;

    const totalMin = weekWorkouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0);
    document.getElementById('totalTime').textContent = (totalMin / 60).toFixed(1) + 'h';
    document.getElementById('timeProgress').style.width = Math.min(100, (totalMin / (goal * 60)) * 100) + '%';

    const streak = calculateStreak();
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('streakProgress').style.width = Math.min(100, (streak / 30) * 100) + '%';

    updateCaloriesCard();
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    d.setHours(0, 0, 0, 0);
    return d;
}

function calculateStreak() {
    if (appData.workouts.length === 0) return 0;
    const workoutDates = [...new Set(appData.workouts.map(w => w.date))].sort().reverse();
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    if (!workoutDates.includes(formatDateISO(checkDate))) checkDate.setDate(checkDate.getDate() - 1);
    while (workoutDates.includes(formatDateISO(checkDate))) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
    return streak;
}

// ==================== CALENDAR ====================
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    const year = calendarDate.getFullYear(), month = calendarDate.getMonth();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.getElementById('calendarTitle').textContent = `📅 ${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const todayStr = formatDateISO(new Date());

    // Index workouts and calories by date for this month
    const monthWorkouts = {}, monthCals = {};
    appData.workouts.forEach(w => {
        const d = new Date(w.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
            if (!monthWorkouts[w.date]) monthWorkouts[w.date] = [];
            monthWorkouts[w.date].push(w);
        }
    });
    (appData.calories || []).forEach(c => {
        const d = new Date(c.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
            monthCals[c.date] = (monthCals[c.date] || 0) + (parseInt(c.amount) || 0);
        }
    });

    // Day headers
    ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach(n => {
        const el = document.createElement('div');
        el.className = 'calendar-day day-header';
        el.innerHTML = `<span style="color:var(--color-text-muted);font-weight:600;">${n}</span>`;
        grid.appendChild(el);
    });

    for (let i = 0; i < startOffset; i++) {
        const el = document.createElement('div');
        el.className = 'calendar-day empty';
        grid.appendChild(el);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const el = document.createElement('div');
        el.className = 'calendar-day';
        const workouts = monthWorkouts[dateStr];
        const cals = monthCals[dateStr] || 0;

        if (workouts) el.classList.add('completed');
        if (dateStr === todayStr) el.classList.add('today');

        el.innerHTML = `
            <span class="day-number">${day}</span>
            ${workouts ? '<div class="day-marker" style="background:white;"></div>' : ''}
            ${cals > 0 ? `<span class="day-calories">${cals}</span>` : ''}
        `;
        el.addEventListener('click', () => showDayDetail(dateStr, workouts, cals));
        grid.appendChild(el);
    }
}

function showDayDetail(dateStr, workouts, cals) {
    const modal = document.getElementById('dayModal');
    const content = document.getElementById('dayModalContent');
    const date = new Date(dateStr + 'T12:00:00');
    document.getElementById('dayModalTitle').textContent = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let html = '';
    if (cals > 0) {
        const entries = getCaloriesForDate(dateStr);
        html += `<div style="margin-bottom:1rem;padding:0.75rem;background:var(--color-bg-tertiary);border-radius:8px;">
            <div style="font-weight:600;margin-bottom:0.5rem;color:var(--color-pink);">🔥 Calorías: ${cals} kcal</div>
            ${entries.map(e => `<div style="font-size:0.82rem;color:var(--color-text-muted)">${e.description}: ${e.amount} kcal</div>`).join('')}
        </div>`;
    }
    if (workouts && workouts.length > 0) {
        html += workouts.map(w => `
            <div class="workout-item" style="cursor:default;">
                <div class="workout-info">
                    <h3>${w.type}</h3>
                    <div class="workout-meta">${w.duration} min • <span class="intensity-badge intensity-${w.intensity}">${w.intensity}</span></div>
                    ${w.notes ? `<div class="workout-meta" style="margin-top:0.25rem">${w.notes}</div>` : ''}
                </div>
            </div>
        `).join('');
    }
    if (!workouts && cals === 0) {
        html = `<div class="empty-state"><span>📭</span><p>Sin actividad este día</p>
            <button class="btn btn-primary btn-sm" style="margin-top:1rem" onclick="document.getElementById('dayModal').classList.remove('active'); openLogWorkoutForDate('${dateStr}')">➕ Registrar</button></div>`;
    }
    content.innerHTML = html;
    modal.classList.add('active');
}

// ==================== WEEKLY CHART ====================
function renderWeeklyChart() {
    const chart = document.getElementById('weeklyChart');
    chart.innerHTML = '';
    const startOfWeek = getStartOfWeek(new Date());
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const dailyMinutes = Array(7).fill(0);

    appData.workouts.forEach(w => {
        const d = new Date(w.date);
        if (d >= startOfWeek) {
            const dow = d.getDay();
            const idx = dow === 0 ? 6 : dow - 1;
            if (idx >= 0 && idx < 7) dailyMinutes[idx] += parseInt(w.duration) || 0;
        }
    });

    const maxMin = Math.max(...dailyMinutes, 1);
    dailyMinutes.forEach((min, i) => {
        const w = document.createElement('div');
        w.className = 'bar-wrapper';
        w.innerHTML = `
            <div class="bar-value">${min > 0 ? min + 'm' : ''}</div>
            <div class="bar" style="height: ${Math.max((min / maxMin) * 100, 3)}%"></div>
            <span class="bar-label">${dayNames[i]}</span>`;
        chart.appendChild(w);
    });
}

// ==================== WORKOUT HISTORY ====================
function renderWorkoutHistory() {
    const container = document.getElementById('workoutHistory');
    const sorted = [...appData.workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        container.innerHTML = `<div class="empty-state"><span>🏃</span><p>No hay entrenamientos registrados.<br>¡Comienza ahora!</p></div>`;
        return;
    }
    container.innerHTML = sorted.slice(0, 20).map(w => {
        const dateStr = new Date(w.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        return `
            <div class="workout-item">
                <div class="workout-info">
                    <h3>${w.type}</h3>
                    <div class="workout-meta">${dateStr} • ${w.duration} min • <span class="intensity-badge intensity-${w.intensity}">${w.intensity}</span></div>
                    ${w.notes ? `<div class="workout-meta" style="margin-top:0.25rem;font-style:italic;">"${w.notes}"</div>` : ''}
                </div>
                <div class="workout-actions">
                    <div class="workout-status status-completed">✓</div>
                    <button class="btn btn-secondary btn-sm" onclick="editWorkout('${w.id}')">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteWorkout('${w.id}')">🗑️</button>
                </div>
            </div>`;
    }).join('');
}

// ==================== MODALS ====================
function openLogWorkout() {
    document.getElementById('editWorkoutId').value = '';
    document.getElementById('modalTitle').textContent = 'Registrar Entrenamiento';
    document.getElementById('workoutForm').reset();
    document.getElementById('workoutDate').value = formatDateISO(new Date());
    document.getElementById('workoutModal').classList.add('active');
}

function openLogWorkoutForDate(dateStr) {
    openLogWorkout();
    document.getElementById('workoutDate').value = dateStr;
}

function closeModal() {
    document.getElementById('workoutModal').classList.remove('active');
    document.getElementById('workoutForm').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('editWorkoutId').value;
    const workout = {
        date: document.getElementById('workoutDate').value,
        type: document.getElementById('workoutType').value,
        duration: document.getElementById('duration').value,
        intensity: document.getElementById('intensity').value,
        notes: document.getElementById('notes').value
    };
    if (editId) {
        workout.id = editId;
        appData = await DB.editWorkout(workout);
        showToast('Entrenamiento actualizado ✏️', 'success');
    } else {
        appData = await DB.addWorkout(workout);
        showToast('¡Entrenamiento registrado! 💪', 'success');
    }
    closeModal();
    refreshAll();
}

async function deleteWorkout(id) {
    if (!confirm('¿Eliminar este entrenamiento?')) return;
    appData = await DB.deleteWorkout(id);
    showToast('Entrenamiento eliminado', 'info');
    refreshAll();
}

function editWorkout(id) {
    const w = appData.workouts.find(w => w.id === id);
    if (!w) return;
    document.getElementById('editWorkoutId').value = w.id;
    document.getElementById('modalTitle').textContent = 'Editar Entrenamiento';
    document.getElementById('workoutDate').value = w.date;
    document.getElementById('workoutType').value = w.type;
    document.getElementById('duration').value = w.duration;
    document.getElementById('intensity').value = w.intensity;
    document.getElementById('notes').value = w.notes || '';
    document.getElementById('workoutModal').classList.add('active');
}

// ==================== EXPORT / IMPORT ====================
async function exportData() {
    const json = await DB.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training_data_${formatDateISO(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Datos exportados 📤', 'success');
}

async function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const result = await DB.importJSON(text);
    if (result.success) { appData = result.data; refreshAll(); showToast('Datos importados 📥', 'success'); }
    else showToast('Error: ' + result.error, 'error');
    e.target.value = '';
}

// ==================== UTILITIES ====================
function refreshAll() {
    updateMetrics();
    renderCalendar();
    renderWeeklyChart();
    renderWorkoutHistory();
}

function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Global handlers for inline onclick
window.editWorkout = editWorkout;
window.deleteWorkout = deleteWorkout;
window.deleteCalEntry = deleteCalEntry;
window.openLogWorkoutForDate = openLogWorkoutForDate;
