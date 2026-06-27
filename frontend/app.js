import { state } from './js/state.js';
import { cacheDomElements, switchTab, showToast } from './js/ui.js';
import { checkServerConnection, saveToGallery, downloadImage } from './js/api.js';
import { initCanvas, setResolution, loadDefaultTemplate, loadGradientPreset, resetFilters, downloadDirect, renderCanvas } from './js/canvas.js';
import { undoAction, redoAction } from './js/history.js';
import { initEventListeners, initKeyboardShortcuts } from './js/events.js';
import { initFxControls, setBlendMode } from './js/fx.js';

import { loadHtmlComponents } from './js/loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadHtmlComponents();
        cacheDomElements();
        initEventListeners();
        initCanvas();
        checkServerConnection();
        loadDefaultTemplate();
        initFxControls();
        initSplashScreen();
        initKeyboardShortcuts();
    } catch (err) {
        console.error("Gagal memuat komponen HTML:", err);
    }
});

function initSplashScreen() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app-container');
    setTimeout(() => {
        if (splash) splash.classList.add('hidden');
        if (app) app.classList.add('visible');
    }, 2200);
}

export function fitCanvasView() {
    renderCanvas();
    showToast('Tampilan disesuaikan');
}

export function toggleSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle-btn i');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        if (toggleBtn) {
            if (isCollapsed) {
                toggleBtn.className = 'fa-solid fa-angles-right';
            } else {
                toggleBtn.className = 'fa-solid fa-bars';
            }
        }
        showToast(isCollapsed ? 'Panel Kontrol disembunyikan' : 'Panel Kontrol ditampilkan');
        
        // Sesuaikan ukuran canvas setelah animasi slide-out selesai (300ms)
        setTimeout(() => {
            renderCanvas();
        }, 300);
    }
}

export function toggleNavbar() {
    const container = document.getElementById('app-container');
    if (container) {
        container.classList.toggle('header-collapsed');
        const isCollapsed = container.classList.contains('header-collapsed');
        showToast(isCollapsed ? 'Navbar disembunyikan' : 'Navbar ditampilkan');
        
        // Sesuaikan ukuran canvas setelah animasi selesai (300ms)
        setTimeout(() => {
            renderCanvas();
        }, 300);
    }
}

export function toggleWorkspaceGrid() {
    state.showGrid = !state.showGrid;
    const workspace = document.getElementById('workspace-area');
    const toggleBtn = document.getElementById('btn-grid-toggle');
    if (workspace) workspace.classList.toggle('no-grid', !state.showGrid);
    if (toggleBtn) toggleBtn.classList.toggle('active', state.showGrid);
    showToast(state.showGrid ? 'Grid diaktifkan' : 'Grid dinonaktifkan');
}

export function showShortcutsInfo() {
    showToast('Shortcuts: Ctrl+Z | Ctrl+Y | Ctrl+S (Simpan) | Ctrl+D (Download) | G (Grid) | M (Toggle Menu) | N (Toggle Navbar)');
}

window.switchTab = switchTab;
window.setResolution = setResolution;
window.loadGradientPreset = loadGradientPreset;
window.resetFilters = resetFilters;
window.undoAction = undoAction;
window.redoAction = redoAction;
window.saveToGallery = saveToGallery;
window.downloadDirect = downloadDirect;
window.toggleWorkspaceGrid = toggleWorkspaceGrid;
window.showShortcutsInfo = showShortcutsInfo;
window.downloadImage = downloadImage;
window.fitCanvasView = fitCanvasView;
window.toggleSidebar = toggleSidebar;
window.toggleNavbar = toggleNavbar;
window.setBlendMode = setBlendMode;
