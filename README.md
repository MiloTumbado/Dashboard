# 💪 Training Dashboard Pro

> 🌐 **Tu app**: [https://milotumbado.github.io/Dashboard/](https://milotumbado.github.io/Dashboard/)

Aplicación personal de seguimiento de entrenamientos y calorías. Funciona como **app de escritorio** (Electron) y como **PWA en tu iPhone** (funciona offline en el gym).

---

## 📱 Usarla en tu iPhone (PWA)

### Opción A: Desde GitHub Pages (recomendada)

1. Abre **Safari** en tu iPhone
2. Ve a: `https://milotumbado.github.io/Dashboard/`
3. Toca **Compartir** (⬆️) → **Agregar a pantalla de inicio**
4. Ponle nombre "TrainPro" y toca **Agregar**
5. ✅ ¡Listo! Se instala como app y funciona **sin internet**

> **Nota:** Los datos se guardan localmente en tu iPhone. No necesitas cuenta ni servidor.

### Opción B: Desde tu red local

```bash
cd ~/Documents/Dasboard
npm run serve
```

Abre la URL de "Red" que aparece en la terminal desde Safari en tu iPhone (misma WiFi).

---

## 🖥️ Usarla en escritorio (Mac)

```bash
cd ~/Documents/Dasboard
npm install        # solo la primera vez
npm start          # abre la app de escritorio
```

> Si aparece un error de permisos la primera vez, ejecuta:
> ```bash
> xattr -cr node_modules/electron/dist/Electron.app
> ```

---

## ✨ Funcionalidades

| Función | Descripción |
|---------|-------------|
| 📝 **Registrar entrenamientos** | Tipo, duración, intensidad, notas, fecha |
| ✏️ **Editar/eliminar** | Modifica o borra entrenamientos pasados |
| 🔥 **Calorías diarias** | Input rápido + modal detallado con descripción |
| 📅 **Calendario** | Navegación por meses, días verdes = entrenamiento, muestra kcal |
| 📈 **Gráfico semanal** | Visualiza minutos por día |
| 🔥 **Racha** | Días consecutivos entrenando |
| 📤 **Exportar/Importar** | Backup como JSON |
| 📴 **Modo offline** | Funciona sin internet desde el iPhone |

### Tipos de entrenamiento

- **Empuje** — Pecho, Hombros, Tríceps
- **Tracción** — Espalda, Bíceps
- **Pierna** — Tren inferior
- **Torso Estético** — Hombros y Espalda
- **HIIT** — Alta Intensidad
- **Alberca** — Natación

---

## 🚀 Deploy a GitHub Pages

El deploy es **automático** con GitHub Actions. Cada vez que hagas push a `main`, se actualiza la PWA.

### Setup inicial (solo una vez):

```bash
# 1. Inicializar repositorio
cd ~/Documents/Dasboard
git init
git add .
git commit -m "Initial commit: Training Dashboard Pro"

# 2. Crear repo en GitHub y subir
gh repo create Dashboard --public --source=. --push

# 3. Activar GitHub Pages
gh api repos/MiloTumbado/Dashboard/pages \
  -X POST \
  -f "build_type=workflow" \
  --silent && echo "✅ GitHub Pages activado"
```

4. Espera ~2 minutos y tu app estará en:
   **`https://milotumbado.github.io/Dashboard/`**

### Actualizar la app:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Se actualiza automáticamente en ~1 minuto.

---

## 📁 Estructura del proyecto

```
Dasboard/
├── index.html         # Interfaz principal
├── styles.css         # Estilos y responsive
├── renderer.js        # Lógica del frontend (dual Electron/PWA)
├── main.js            # Proceso principal de Electron
├── preload.js         # Bridge seguro Electron
├── server.js          # Servidor HTTP para acceso local
├── manifest.json      # PWA manifest
├── sw.js              # Service Worker (modo offline)
├── package.json       # Configuración del proyecto
├── icons/             # Iconos de la app
│   ├── icon-192.png
│   └── icon-512.png
└── .github/
    └── workflows/
        └── deploy.yml # Deploy automático a GitHub Pages
```

## 💾 Dónde se guardan los datos

| Plataforma | Ubicación |
|-----------|-----------|
| **Mac (Electron)** | `~/Library/Application Support/training-dashboard-pro/` |
| **iPhone (PWA)** | localStorage del navegador Safari |

> ⚠️ Los datos de Mac y iPhone son independientes. Usa Exportar/Importar para sincronizar.

---

## Tecnologías

- **Electron** — App de escritorio Mac
- **PWA** — Progressive Web App para iPhone
- **Service Worker** — Funcionalidad offline
- **GitHub Pages** — Hosting gratuito
- **localStorage** — Almacenamiento local en iPhone
