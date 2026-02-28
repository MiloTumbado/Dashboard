const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let DATA_DIR = null;
let DATA_FILE = null;

function getDataPaths() {
  if (!DATA_DIR) {
    DATA_DIR = path.join(app.getPath('userData'), 'TrainingDashboardPro');
    DATA_FILE = path.join(DATA_DIR, 'workouts.json');
  }
  return { DATA_DIR, DATA_FILE };
}

function ensureDataDir() {
  const { DATA_DIR } = getDataPaths();
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadData() {
  ensureDataDir();
  const { DATA_FILE } = getDataPaths();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (!data.calories) data.calories = [];
      return data;
    }
  } catch (e) { console.error('Error loading data:', e); }
  return { workouts: [], calories: [], settings: { weeklyGoal: 6, dailyCalories: 2450 } };
}

function saveData(data) {
  ensureDataDir();
  const { DATA_FILE } = getDataPaths();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400, height: 900, minWidth: 380, minHeight: 600,
    title: 'Training Dashboard Pro',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile('index.html');
}

// === IPC: Data ===
ipcMain.handle('load-data', () => loadData());
ipcMain.handle('save-data', (_, data) => { saveData(data); return { success: true }; });

// === IPC: Workouts ===
ipcMain.handle('add-workout', (_, workout) => {
  const data = loadData();
  workout.id = Date.now().toString();
  workout.createdAt = new Date().toISOString();
  data.workouts.push(workout);
  saveData(data);
  return data;
});
ipcMain.handle('delete-workout', (_, id) => {
  const data = loadData();
  data.workouts = data.workouts.filter(w => w.id !== id);
  saveData(data);
  return data;
});
ipcMain.handle('edit-workout', (_, updated) => {
  const data = loadData();
  const i = data.workouts.findIndex(w => w.id === updated.id);
  if (i !== -1) data.workouts[i] = { ...data.workouts[i], ...updated };
  saveData(data);
  return data;
});

// === IPC: Calories ===
ipcMain.handle('add-calorie-entry', (_, entry) => {
  const data = loadData();
  entry.id = Date.now().toString();
  data.calories.push(entry);
  saveData(data);
  return data;
});
ipcMain.handle('delete-calorie-entry', (_, id) => {
  const data = loadData();
  data.calories = data.calories.filter(c => c.id !== id);
  saveData(data);
  return data;
});
ipcMain.handle('reset-calories-for-date', (_, dateStr) => {
  const data = loadData();
  data.calories = data.calories.filter(c => c.date !== dateStr);
  saveData(data);
  return data;
});

// === IPC: Settings ===
ipcMain.handle('update-settings', (_, settings) => {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
  return data;
});

// === IPC: Exercise Logs ===
ipcMain.handle('add-exercise-log', (_, log) => {
  const data = loadData();
  if (!data.exerciseLogs) data.exerciseLogs = [];
  log.id = Date.now().toString();
  data.exerciseLogs.push(log);
  saveData(data);
  return data;
});
ipcMain.handle('delete-exercise-log', (_, id) => {
  const data = loadData();
  data.exerciseLogs = (data.exerciseLogs || []).filter(l => l.id !== id);
  saveData(data);
  return data;
});

// === IPC: Export/Import ===
ipcMain.handle('export-data', () => JSON.stringify(loadData(), null, 2));
ipcMain.handle('import-data', (_, jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.workouts && Array.isArray(data.workouts)) {
      if (!data.calories) data.calories = [];
      if (!data.exerciseLogs) data.exerciseLogs = [];
      saveData(data);
      return { success: true, data };
    }
    return { success: false, error: 'Formato de datos inválido' };
  } catch (e) { return { success: false, error: e.message }; }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
