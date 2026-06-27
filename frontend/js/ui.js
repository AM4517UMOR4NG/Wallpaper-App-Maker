// ==========================================================================
// AURAPAPER — UI MODULE
// ==========================================================================

import { dom } from './state.js';

export function cacheDomElements() {
    dom.canvas = document.getElementById('wallpaper-canvas');
    dom.ctx = dom.canvas.getContext('2d');
    dom.connectionStatus = document.getElementById('connection-status');
    dom.statusDot = document.getElementById('status-dot');
    dom.statusLabel = document.getElementById('status-label');

    dom.imageInput = document.getElementById('image-input');
    dom.dropzone = document.getElementById('upload-dropzone');

    dom.sliders = {
        brightness: document.getElementById('slider-brightness'),
        contrast: document.getElementById('slider-contrast'),
        saturate: document.getElementById('slider-saturate'),
        blur: document.getElementById('slider-blur'),
        hue: document.getElementById('slider-hue'),
        grayscale: document.getElementById('slider-grayscale'),
        sepia: document.getElementById('slider-sepia')
    };
    dom.sliderVals = {
        brightness: document.getElementById('val-brightness'),
        contrast: document.getElementById('val-contrast'),
        saturate: document.getElementById('val-saturate'),
        blur: document.getElementById('val-blur'),
        hue: document.getElementById('val-hue'),
        grayscale: document.getElementById('val-grayscale'),
        sepia: document.getElementById('val-sepia')
    };

    dom.textInput = document.getElementById('text-input');
    dom.textFont = document.getElementById('text-font');
    dom.textSize = document.getElementById('slider-text-size');
    dom.valTextSize = document.getElementById('val-text-size');
    dom.textColor = document.getElementById('text-color');
    dom.textColorHex = document.getElementById('text-color-hex');
    dom.textShadowColor = document.getElementById('text-shadow-color');
    dom.textShadowHex = document.getElementById('text-shadow-hex');
    dom.textY = document.getElementById('slider-text-y');
    dom.valTextY = document.getElementById('val-text-y');
    dom.textX = document.getElementById('slider-text-x');
    dom.valTextX = document.getElementById('val-text-x');

    dom.loading = document.getElementById('canvas-loading');
    dom.toast = document.getElementById('notification-toast');
    dom.toastMessage = document.getElementById('toast-message');
    dom.resolutionBadge = document.getElementById('canvas-resolution-badge');
    dom.galleryGrid = document.getElementById('saved-gallery-grid');
}

export function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => { 
        el.classList.remove('active'); 
        el.setAttribute('aria-selected', 'false'); 
    });
    const content = document.getElementById(`tab-content-${tabName}`);
    if (content) content.classList.add('active');
    
    const btn = document.getElementById(`tab-btn-${tabName}`);
    if (btn) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
    }
}

export function showLoading(show) { 
    if (dom.loading) dom.loading.classList.toggle('active', show); 
}

export function showToast(message, type = 'success') {
    if (!dom.toastMessage || !dom.toast) return;
    dom.toastMessage.innerText = message;
    dom.toast.className = 'notification-toast active' + (type === 'error' ? ' error' : '');
    clearTimeout(dom._toastTimer);
    dom._toastTimer = setTimeout(() => { 
        dom.toast.classList.remove('active'); 
    }, 2500);
}
