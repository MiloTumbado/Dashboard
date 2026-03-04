// ==================== ROUTINE DATA ====================
// Profile-specific routines: keyed by profile name
const PROFILE_ROUTINES = {
    emilio: {
        1: { // Día 1
            name: '💪 Empuje (Pecho Alto y Hombros)', subtitle: 'Llenar la parte superior del torso',
            exercises: [
                { name: 'Press inclinado con mancuernas', sets: 4, reps: '8-10', note: '' },
                { name: 'Press de hombros en máquina (Hammer Strength)', sets: 3, reps: '10', note: '' },
                { name: 'Aperturas en máquina (Peck Deck)', sets: 3, reps: '15', note: '' },
                { name: 'Elevaciones laterales con mancuernas', sets: 4, reps: '20', note: 'Descansa solo 45 segundos' },
                { name: 'Fondos en máquina o paralelas', sets: 3, reps: 'Al fallo', note: '' },
                { name: 'Extensión de tríceps en polea (cuerda)', sets: 3, reps: '12', note: '' }
            ]
        },
        2: { // Día 2
            name: '🔗 Tracción (Espalda Ancha y Bíceps)', subtitle: 'Maximizar la anchura',
            exercises: [
                { name: 'Jalón al pecho agarre abierto', sets: 4, reps: '10', note: '' },
                { name: 'Remo en polea baja (agarre estrecho)', sets: 3, reps: '12', note: '' },
                { name: 'Remo inclinado con mancuerna a una mano', sets: 3, reps: '10/lado', note: '' },
                { name: 'Face-pulls en polea', sets: 3, reps: '15', note: 'Para hombro posterior y postura' },
                { name: 'Curl de bíceps con barra Z o predicador', sets: 3, reps: '12', note: '' },
                { name: 'Curl martillo', sets: 3, reps: '12', note: '' }
            ]
        },
        3: { // Día 3
            name: '🦵 Pierna Completa y Core', subtitle: 'Tren inferior + abdomen',
            exercises: [
                { name: 'Prensa de piernas', sets: 4, reps: '12', note: 'Pies a la anchura de hombros' },
                { name: 'Peso muerto rumano (mancuernas o barra)', sets: 4, reps: '10', note: '' },
                { name: 'Extensiones de cuádriceps', sets: 3, reps: '15', note: '' },
                { name: 'Curl de pierna acostado o sentado', sets: 3, reps: '15', note: '' },
                { name: 'Elevación de talones sentado o de pie', sets: 4, reps: '20', note: '' },
                { name: 'Plancha abdominal (Plank)', sets: 3, reps: '1 min', note: '' }
            ]
        },
        4: { // Día 4
            name: '🔺 Hipertrofia V-Taper (Hombros y Espalda)', subtitle: 'El más importante para la estética',
            exercises: [
                { name: 'Dominadas (o jalón asistido)', sets: 4, reps: 'Al fallo', note: '' },
                { name: 'Press militar de pie con barra o mancuernas', sets: 3, reps: '10', note: '' },
                { name: 'Elevaciones laterales en polea (un brazo)', sets: 4, reps: '15', note: '' },
                { name: 'Remo en máquina con apoyo al pecho', sets: 3, reps: '12', note: '' },
                { name: 'Encogimientos de hombros con mancuernas', sets: 3, reps: '15', note: '' },
                { name: 'Copa de tríceps a dos manos', sets: 3, reps: '12', note: '' }
            ]
        },
        5: { // Día HIIT
            name: '⚡ HIIT – Alta Intensidad', subtitle: 'Cardio explosivo + abdomen',
            isCardio: true,
            exercises: [
                { name: '— Circuito 20 minutos —', sets: 0, reps: '', note: '' },
                { name: 'Sprint en caminadora o Remo', sets: 10, reps: '30 seg', note: '30 seg descanso entre series' },
                { name: '— Finalizador (3 rondas) —', sets: 0, reps: '', note: '' },
                { name: 'Elevación de piernas colgado', sets: 3, reps: '15', note: '' },
                { name: 'Russian Twists', sets: 3, reps: '20', note: 'Para marcar el abdomen' }
            ]
        },
        0: { // Descanso
            name: '🧘 Descanso', subtitle: 'Recuperación activa',
            isCardio: true,
            exercises: [
                { name: 'Día de descanso o caminata ligera', sets: 1, reps: '30-40 min', note: 'Estiramiento y recuperación' }
            ]
        }
    },
    // Default routine for other profiles (karina, benjamin, iveth)
    _default: {
        1: { // Lunes
            name: '💪 Empuje (Push)', subtitle: 'Pecho, Hombros, Tríceps',
            exercises: [
                { name: 'Press Inclinado con Mancuernas', sets: 4, reps: '10', note: 'Volumen parte alta del pecho' },
                { name: 'Press Militar (máquina o barra)', sets: 3, reps: '10', note: '' },
                { name: 'Elevaciones Laterales (polea/mancuerna)', sets: 4, reps: '15-20', note: 'Clave para la anchura' },
                { name: 'Fondos en Paralelas', sets: 3, reps: 'Al fallo', note: '' },
                { name: 'Extensión de Tríceps en Polea', sets: 3, reps: '12', note: '' }
            ]
        },
        2: { // Martes
            name: '🔗 Tracción (Pull)', subtitle: 'Espalda, Bíceps',
            exercises: [
                { name: 'Dominadas / Jalón al Pecho', sets: 4, reps: '8-10', note: '' },
                { name: 'Remo con Barra / Máquina', sets: 3, reps: '10', note: '' },
                { name: 'Pullover en Polea Alta', sets: 3, reps: '15', note: 'Aísla el dorsal' },
                { name: 'Face-Pulls', sets: 3, reps: '15', note: 'Salud de hombro y postura' },
                { name: 'Curl Bíceps con Barra Z', sets: 3, reps: '12', note: '' }
            ]
        },
        3: { // Miércoles
            name: '🏊 Alberca – Intervalos', subtitle: 'Natación Miércoles',
            isCardio: true,
            exercises: [
                { name: '200m calentamiento suave', sets: 1, reps: '—', note: '' },
                { name: '50m ritmo fuerte + 30s descanso', sets: 8, reps: '2 largos', note: 'Máxima intensidad' },
                { name: '100m afloje', sets: 1, reps: '—', note: '' }
            ]
        },
        4: { // Jueves
            name: '🦵 Pierna', subtitle: 'Tren inferior completo',
            exercises: [
                { name: 'Prensa de Piernas', sets: 4, reps: '12', note: '' },
                { name: 'Peso Muerto Rumano', sets: 4, reps: '10', note: 'Femorales y glúteos' },
                { name: 'Extensiones de Cuádriceps', sets: 3, reps: '15', note: '' },
                { name: 'Curl de Pierna Acostado', sets: 3, reps: '15', note: '' },
                { name: 'Elevación de Talones (Pantorrilla)', sets: 4, reps: '20', note: '' }
            ]
        },
        5: { // Viernes
            name: '🔺 Torso Estético', subtitle: 'Enfoque V-Taper',
            exercises: [
                { name: 'Press de Hombros Sentado', sets: 3, reps: '10', note: '' },
                { name: 'Jalón al Pecho Agarre Cerrado', sets: 3, reps: '12', note: '' },
                { name: 'Elevaciones Laterales (mancuernas)', sets: 5, reps: '15-20', note: 'Bajo peso, mucha técnica' },
                { name: 'Remo a Una Mano con Mancuerna', sets: 3, reps: '12/lado', note: '' },
                { name: 'Cruces de Poleas (Crossovers)', sets: 3, reps: '15', note: '' }
            ]
        },
        6: { // Sábado
            name: '⚡ HIIT – Alta Intensidad', subtitle: 'Cardio explosivo',
            isCardio: true,
            exercises: [
                { name: 'Calentamiento', sets: 1, reps: '5 min', note: '' },
                { name: 'Sprint 30s + Descanso 30s (Caminadora)', sets: 1, reps: '20 min', note: 'Máxima velocidad' },
                { name: '— O Circuito Funcional (4 rondas) —', sets: 0, reps: '', note: '' },
                { name: 'Burpees', sets: 4, reps: '30 seg', note: '' },
                { name: 'Mountain Climbers', sets: 4, reps: '30 seg', note: '' },
                { name: 'Sentadillas con Salto', sets: 4, reps: '30 seg', note: '1 min descanso entre rondas' }
            ]
        },
        0: { // Domingo
            name: '🏊 Alberca – Largo', subtitle: 'Recuperación activa',
            isCardio: true,
            exercises: [
                { name: 'Nado continuo (Crol o Pecho)', sets: 1, reps: '30-40 min', note: 'Ritmo controlado, respiración estable' },
            ]
        }
    }
};

// Helper to get the routines for the current profile
function getRoutinesForProfile() {
    if (currentProfile && PROFILE_ROUTINES[currentProfile]) {
        return PROFILE_ROUTINES[currentProfile];
    }
    return PROFILE_ROUTINES._default;
}

// ==================== STATE ====================
let restTimerInterval = null;
let restTimeLeft = 0;
let restTimerDefault = 90;

// ==================== INIT ====================
function initRoutines() {
    updateRoutineSelector();
    renderTodayRoutine();
    bindRoutineEvents();
}

function updateRoutineSelector() {
    const routines = getRoutinesForProfile();
    const select = document.getElementById('routineDaySelect');
    select.innerHTML = '';
    // Build options from the routine keys
    const keys = Object.keys(routines).map(Number).sort((a, b) => a - b);
    keys.forEach(key => {
        const r = routines[key];
        const opt = document.createElement('option');
        opt.value = key;
        // Strip emoji for cleaner select label
        opt.textContent = r.name.replace(/^[\p{Emoji}\s]+/u, '').trim() || r.name;
        select.appendChild(opt);
    });
}

function bindRoutineEvents() {
    document.getElementById('btnStartTimer').addEventListener('click', startRestTimer);
    document.getElementById('btnStopTimer').addEventListener('click', stopRestTimer);
    document.getElementById('btnResetTimer').addEventListener('click', resetRestTimer);
    document.getElementById('restTimerInput').addEventListener('change', (e) => {
        restTimerDefault = parseInt(e.target.value) || 90;
    });
    document.getElementById('routineDaySelect').addEventListener('change', (e) => {
        renderRoutineForDay(parseInt(e.target.value));
    });
}

// ==================== RENDER ROUTINE ====================
function renderTodayRoutine() {
    const routines = getRoutinesForProfile();
    const dayOfWeek = new Date().getDay();
    const select = document.getElementById('routineDaySelect');

    // If today's day exists in routines, select it; otherwise pick first
    if (routines[dayOfWeek]) {
        select.value = dayOfWeek;
        renderRoutineForDay(dayOfWeek);
    } else {
        const firstKey = Object.keys(routines).map(Number).sort((a, b) => a - b)[0];
        select.value = firstKey;
        renderRoutineForDay(firstKey);
    }
}

function renderRoutineForDay(dayOfWeek) {
    const routines = getRoutinesForProfile();
    const routine = routines[dayOfWeek];
    if (!routine) return;

    const container = document.getElementById('routineExercises');
    const todayStr = formatDateISO(new Date());

    document.getElementById('routineDayName').textContent = routine.name;
    document.getElementById('routineDaySubtitle').textContent = routine.subtitle;

    // FIX: Filter logs by BOTH date AND routineDay to prevent data bleeding
    const todayLogs = (appData.exerciseLogs || []).filter(
        l => l.date === todayStr && l.routineDay === dayOfWeek
    );

    container.innerHTML = routine.exercises.map((ex, exIdx) => {
        if (ex.sets === 0) {
            // Section divider
            return `<div class="exercise-divider">${ex.name}</div>`;
        }

        const setInputs = [];
        for (let s = 1; s <= ex.sets; s++) {
            const log = todayLogs.find(l => l.exerciseIdx === exIdx && l.setNumber === s);
            const isDone = !!log;
            setInputs.push(`
                <div class="set-row ${isDone ? 'set-done' : ''}" id="set-${exIdx}-${s}">
                    <span class="set-label">S${s}</span>
                    <input type="number" class="set-weight-input" id="weight-${exIdx}-${s}"
                           placeholder="kg" value="${log ? log.weight : ''}" min="0" step="0.5"
                           ${isDone ? 'disabled' : ''}>
                    <input type="number" class="set-reps-input" id="reps-${exIdx}-${s}"
                           placeholder="${ex.reps}" value="${log ? log.reps : ''}" min="0"
                           ${isDone ? 'disabled' : ''}>
                    ${isDone
                    ? `<button class="btn-set btn-set-undo" onclick="undoSet(${exIdx}, ${s})">↩️</button>`
                    : `<button class="btn-set btn-set-done" onclick="completeSet(${exIdx}, ${s}, '${ex.name.replace(/'/g, "\\'")}')">✓</button>`
                }
                </div>
            `);
        }

        const completedSets = todayLogs.filter(l => l.exerciseIdx === exIdx).length;
        const allDone = completedSets >= ex.sets;

        return `
            <div class="exercise-card ${allDone ? 'exercise-complete' : ''}">
                <div class="exercise-header">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="exercise-target">${ex.sets} × ${ex.reps}</div>
                </div>
                ${ex.note ? `<div class="exercise-note">💡 ${ex.note}</div>` : ''}
                ${!routine.isCardio ? `
                    <div class="sets-container">${setInputs.join('')}</div>
                    <div class="exercise-progress-mini">
                        <div class="progress-bar" style="height:4px;margin-top:0.5rem;">
                            <div class="progress-fill" style="width:${(completedSets / ex.sets) * 100}%;background:linear-gradient(90deg,var(--color-success),#059669);"></div>
                        </div>
                    </div>
                ` : `
                    <div class="sets-container">
                        ${Array.from({ length: ex.sets }, (_, s) => {
            const log = todayLogs.find(l => l.exerciseIdx === exIdx && l.setNumber === s + 1);
            return `<div class="set-row ${log ? 'set-done' : ''}">
                                <span class="set-label">${ex.sets > 1 ? 'R' + (s + 1) : '—'}</span>
                                <span class="set-reps-display">${ex.reps}</span>
                                ${log
                    ? `<button class="btn-set btn-set-undo" onclick="undoSet(${exIdx}, ${s + 1})">↩️</button>`
                    : `<button class="btn-set btn-set-done" onclick="completeSet(${exIdx}, ${s + 1}, '${ex.name.replace(/'/g, "\\'")}', true)">✓</button>`}
                            </div>`;
        }).join('')}
                    </div>
                `}
            </div>
        `;
    }).join('');

    renderExerciseHistory(dayOfWeek);
}

// ==================== COMPLETE / UNDO SET ====================
async function completeSet(exIdx, setNum, exName, isCardio = false) {
    const todayStr = formatDateISO(new Date());
    const weight = isCardio ? 0 : parseFloat(document.getElementById(`weight-${exIdx}-${setNum}`)?.value) || 0;
    const reps = isCardio ? 0 : parseInt(document.getElementById(`reps-${exIdx}-${setNum}`)?.value) || 0;

    // Store the routineDay to prevent data bleeding between routines
    const routineDay = parseInt(document.getElementById('routineDaySelect').value);

    const log = {
        date: todayStr,
        routineDay: routineDay,
        exerciseIdx: exIdx,
        exerciseName: exName,
        setNumber: setNum,
        weight: weight,
        reps: reps,
        unit: 'kg'
    };

    // Start timer FIRST (before async save) so user sees immediate feedback
    restTimeLeft = restTimerDefault;
    startRestTimer();
    showToast(`✓ ${exName} — Serie ${setNum}`, 'success');

    try {
        appData = await DB.addExerciseLog(log);
    } catch (e) {
        console.error('Error saving log:', e);
    }

    renderRoutineForDay(routineDay);
}

async function undoSet(exIdx, setNum) {
    const todayStr = formatDateISO(new Date());
    const routineDay = parseInt(document.getElementById('routineDaySelect').value);
    const log = (appData.exerciseLogs || []).find(
        l => l.date === todayStr && l.routineDay === routineDay && l.exerciseIdx === exIdx && l.setNumber === setNum
    );
    if (log) {
        appData = await DB.deleteExerciseLog(log.id);
        renderRoutineForDay(routineDay);
    }
}

// ==================== REST TIMER ====================
function startRestTimer() {
    if (restTimerInterval) clearInterval(restTimerInterval);
    if (restTimeLeft <= 0) restTimeLeft = restTimerDefault;

    const timerOverlay = document.getElementById('timerOverlay');
    timerOverlay.classList.add('active');
    updateTimerDisplay();

    restTimerInterval = setInterval(() => {
        restTimeLeft--;
        updateTimerDisplay();
        if (restTimeLeft <= 0) {
            clearInterval(restTimerInterval);
            restTimerInterval = null;
            timerOverlay.classList.remove('active');
            // Vibrate if supported
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            showToast('⏱️ ¡Descanso terminado! Siguiente serie 💪', 'info');
        }
    }, 1000);
}

function stopRestTimer() {
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
    }
    document.getElementById('timerOverlay').classList.remove('active');
}

function resetRestTimer() {
    restTimeLeft = restTimerDefault;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = Math.floor(restTimeLeft / 60);
    const secs = restTimeLeft % 60;
    document.getElementById('timerDisplay').textContent =
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Progress ring
    const pct = restTimeLeft / restTimerDefault;
    const circle = document.getElementById('timerCircle');
    if (circle) {
        const circumference = 2 * Math.PI * 54;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference * (1 - pct);
    }
}

// ==================== EXERCISE HISTORY ====================
function renderExerciseHistory(dayOfWeek) {
    const container = document.getElementById('exerciseHistory');
    const routines = getRoutinesForProfile();
    const routine = routines[dayOfWeek];
    if (!routine || routine.isCardio) {
        container.innerHTML = '';
        return;
    }

    // FIX: Also filter by routineDay for history accuracy
    const allLogs = (appData.exerciseLogs || []).filter(l => {
        // Support old logs without routineDay (match by exercise name)
        if (l.routineDay !== undefined) {
            return l.routineDay === dayOfWeek;
        }
        return routine.exercises.some((ex) => ex.name === l.exerciseName);
    });

    if (allLogs.length === 0) {
        container.innerHTML = '<p style="color:var(--color-text-muted);font-size:0.85rem;text-align:center;padding:1rem;">Sin historial aún para esta rutina</p>';
        return;
    }

    // Group by exercise, get max weight per date
    const exerciseMap = {};
    allLogs.forEach(l => {
        if (!exerciseMap[l.exerciseName]) exerciseMap[l.exerciseName] = {};
        if (!exerciseMap[l.exerciseName][l.date] || l.weight > exerciseMap[l.exerciseName][l.date]) {
            exerciseMap[l.exerciseName][l.date] = l.weight;
        }
    });

    container.innerHTML = `<h4 style="margin-bottom:0.75rem;color:var(--color-text-secondary);">📊 Progresión de pesos</h4>` +
        Object.entries(exerciseMap).map(([exName, dateMap]) => {
            const entries = Object.entries(dateMap).sort((a, b) => a[0].localeCompare(b[0]));
            const lastWeight = entries[entries.length - 1][1];
            const firstWeight = entries[0][1];
            const diff = lastWeight - firstWeight;
            const trend = diff > 0 ? `<span style="color:var(--color-success)">↑ +${diff}kg</span>` :
                diff < 0 ? `<span style="color:var(--color-danger)">↓ ${diff}kg</span>` : '';

            const miniChart = entries.slice(-7).map(([d, w]) => {
                const max = Math.max(...entries.map(e => e[1]), 1);
                const pct = (w / max) * 100;
                return `<div class="mini-bar" style="height:${Math.max(pct, 8)}%" title="${d}: ${w}kg"></div>`;
            }).join('');

            return `
                <div class="history-exercise-row">
                    <div class="history-exercise-info">
                        <span class="history-exercise-name">${exName}</span>
                        <span class="history-exercise-best">Mejor: ${lastWeight}kg ${trend}</span>
                    </div>
                    <div class="mini-chart">${miniChart}</div>
                </div>`;
        }).join('');
}

// ==================== DB EXTENSIONS ====================
// Added to DB object in renderer.js via patch
function patchDB() {
    DB.addExerciseLog = async function (log) {
        if (window.api && window.api.addExerciseLog) return await window.api.addExerciseLog(log);
        const data = await this.load();
        if (!data.exerciseLogs) data.exerciseLogs = [];
        log.id = Date.now().toString();
        data.exerciseLogs.push(log);
        await this.save(data);
        return data;
    };
    DB.deleteExerciseLog = async function (id) {
        if (window.api && window.api.deleteExerciseLog) return await window.api.deleteExerciseLog(id);
        const data = await this.load();
        data.exerciseLogs = (data.exerciseLogs || []).filter(l => l.id !== id);
        await this.save(data);
        return data;
    };
}

// ==================== GLOBAL EXPOSURE ====================
window.completeSet = completeSet;
window.undoSet = undoSet;
