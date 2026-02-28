const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loadData: () => ipcRenderer.invoke('load-data'),
    saveData: (data) => ipcRenderer.invoke('save-data', data),
    addWorkout: (workout) => ipcRenderer.invoke('add-workout', workout),
    deleteWorkout: (id) => ipcRenderer.invoke('delete-workout', id),
    editWorkout: (workout) => ipcRenderer.invoke('edit-workout', workout),
    addCalorieEntry: (entry) => ipcRenderer.invoke('add-calorie-entry', entry),
    deleteCalorieEntry: (id) => ipcRenderer.invoke('delete-calorie-entry', id),
    resetCaloriesForDate: (dateStr) => ipcRenderer.invoke('reset-calories-for-date', dateStr),
    addExerciseLog: (log) => ipcRenderer.invoke('add-exercise-log', log),
    deleteExerciseLog: (id) => ipcRenderer.invoke('delete-exercise-log', id),
    updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
    exportData: () => ipcRenderer.invoke('export-data'),
    importData: (json) => ipcRenderer.invoke('import-data', json)
});
