// ==========================================================================
// AURAPAPER — CANVAS MODULE
// ==========================================================================

import { state, dom } from './state.js';
import { showToast, showLoading } from './ui.js';
import { saveHistory } from './history.js';

export function initCanvas() {
    dom.canvas.width = state.canvas.width;
    dom.canvas.height = state.canvas.height;
    dom.resolutionBadge.innerHTML = `<i class="fa-solid fa-expand"></i> ${state.canvas.width} × ${state.canvas.height}`;
}

export function setResolution(w, h, activeId) {
    state.canvas.width = w;
    state.canvas.height = h;
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(activeId);
    if (btn) btn.classList.add('active');
    initCanvas();
    renderCanvas();
    saveHistory();
}

export function loadDefaultTemplate() {
    loadGradientPreset('#0088ff', '#00d4ff');
}

export function loadGradientPreset(color1, color2) {
    showLoading(true);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1920; tempCanvas.height = 1080;
    const tempCtx = tempCanvas.getContext('2d');
    const grad = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    tempCtx.fillStyle = grad;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const img = new Image();
    img.src = tempCanvas.toDataURL();
    img.onload = () => {
        state.image = img;
        state.originalFilename = 'gradient-template.png';
        renderCanvas();
        showLoading(false);
        saveHistory();
    };
}

export function handleImageFile(file) {
    if (file.size > 15 * 1024 * 1024) {
        showToast('File terlalu besar! Maks 15MB', 'error');
        return;
    }
    showLoading(true);
    state.originalFilename = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            state.image = img;
            renderCanvas();
            showLoading(false);
            window.switchTab('adjust');
            showToast(`"${file.name}" berhasil dimuat!`);
            saveHistory();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

export function resetFilters() {
    state.filters = { brightness:100, contrast:100, saturate:100, blur:0, hueRotate:0, grayscale:0, sepia:0 };
    dom.sliders.brightness.value = 100; dom.sliders.contrast.value = 100; dom.sliders.saturate.value = 100;
    dom.sliders.blur.value = 0; dom.sliders.hue.value = 0; dom.sliders.grayscale.value = 0; dom.sliders.sepia.value = 0;
    dom.sliderVals.brightness.innerText = '100%'; dom.sliderVals.contrast.innerText = '100%';
    dom.sliderVals.saturate.innerText = '100%'; dom.sliderVals.blur.innerText = '0px';
    dom.sliderVals.hue.innerText = '0°'; dom.sliderVals.grayscale.innerText = '0%'; dom.sliderVals.sepia.innerText = '0%';

    // Reset FX
    state.fx.grain = { enabled: false, intensity: 30, scale: 1 };
    state.fx.vignette = { enabled: false, intensity: 50, radius: 50 };
    state.fx.blendMode = 'source-over';

    // Reset FX UI elements
    const grainEnabled = document.getElementById('fx-grain-enabled');
    const vignetteEnabled = document.getElementById('fx-vignette-enabled');
    const grainIntensity = document.getElementById('slider-grain-intensity');
    const grainScale = document.getElementById('slider-grain-scale');
    const vignetteIntensity = document.getElementById('slider-vignette-intensity');
    const vignetteRadius = document.getElementById('slider-vignette-radius');
    const blendSelect = document.getElementById('fx-blend-mode');
    if (grainEnabled) grainEnabled.checked = false;
    if (vignetteEnabled) vignetteEnabled.checked = false;
    if (grainIntensity) grainIntensity.value = 30;
    if (grainScale) grainScale.value = 1;
    if (vignetteIntensity) vignetteIntensity.value = 50;
    if (vignetteRadius) vignetteRadius.value = 50;
    if (blendSelect) blendSelect.value = 'source-over';
    const valGI = document.getElementById('val-grain-intensity');
    const valGS = document.getElementById('val-grain-scale');
    const valVI = document.getElementById('val-vignette-intensity');
    const valVR = document.getElementById('val-vignette-radius');
    if (valGI) valGI.innerText = '30';
    if (valGS) valGS.innerText = '1x';
    if (valVI) valVI.innerText = '50%';
    if (valVR) valVR.innerText = '50%';
    document.querySelectorAll('.blend-preview-item').forEach(item => {
        item.classList.toggle('active', item.dataset.blend === 'source-over');
    });

    renderCanvas();
    saveHistory();
    showToast('Filter direset');
}

let cachedGrain = { canvas: null, intensity: null, scale: null, width: null, height: null };

export function renderCanvas() {
    if (!state.image) return;
    const { ctx, canvas } = dom;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // ===== CSS FILTERS =====
    const f = state.filters;
    ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) hue-rotate(${f.hueRotate}deg) grayscale(${f.grayscale}%) sepia(${f.sepia}%)`;

    const imgRatio = state.image.width / state.image.height;
    const canvasRatio = width / height;
    let dw, dh, dx, dy;
    if (imgRatio > canvasRatio) {
        dh = height; dw = height * imgRatio; dx = (width - dw) / 2; dy = 0;
    } else {
        dw = width; dh = width / imgRatio; dx = 0; dy = (height - dh) / 2;
    }

    // Draw base image
    ctx.drawImage(state.image, dx, dy, dw, dh);
    ctx.filter = 'none';

    // ===== BLEND MODE (SELF-BLEND) =====
    if (state.fx.blendMode && state.fx.blendMode !== 'source-over') {
        ctx.globalCompositeOperation = state.fx.blendMode;
        // Re-apply filters for the duplicated blend layer for maximum effect
        ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) hue-rotate(${f.hueRotate}deg) grayscale(${f.grayscale}%) sepia(${f.sepia}%)`;
        ctx.drawImage(state.image, dx, dy, dw, dh);
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';
    }

    // ===== VIGNETTE =====
    if (state.fx.vignette.enabled) {
        const vig = state.fx.vignette;
        const cx = width / 2;
        const cy = height / 2;
        const maxDim = Math.max(width, height);
        const innerR = maxDim * (vig.radius / 100) * 0.5;
        const outerR = maxDim * 0.85;
        const alpha = vig.intensity / 100;

        const radGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
        radGrad.addColorStop(0, `rgba(0, 0, 0, 0)`);
        radGrad.addColorStop(0.5, `rgba(0, 0, 0, ${alpha * 0.3})`);
        radGrad.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
    }

    // ===== FILM GRAIN / NOISE =====
    if (state.fx.grain.enabled) {
        const grain = state.fx.grain;
        const scale = grain.scale;
        const grainW = Math.ceil(width / scale);
        const grainH = Math.ceil(height / scale);
        
        // Cache mechanism: only regenerate noise if settings or dimensions changed
        if (!cachedGrain.canvas || cachedGrain.intensity !== grain.intensity || 
            cachedGrain.scale !== scale || cachedGrain.width !== grainW || 
            cachedGrain.height !== grainH) {
            
            const grainCanvas = document.createElement('canvas');
            grainCanvas.width = grainW;
            grainCanvas.height = grainH;
            const gCtx = grainCanvas.getContext('2d');
            const imgData = gCtx.createImageData(grainW, grainH);
            const data = imgData.data;
            const intensity = grain.intensity / 100;

            for (let i = 0; i < data.length; i += 4) {
                const v = (Math.random() - 0.5) * 255 * intensity;
                data[i]     = 128 + v;  // R
                data[i + 1] = 128 + v;  // G
                data[i + 2] = 128 + v;  // B
                data[i + 3] = 45;       // Alpha
            }
            gCtx.putImageData(imgData, 0, 0);

            cachedGrain = { canvas: grainCanvas, intensity: grain.intensity, scale, width: grainW, height: grainH };
        }

        ctx.globalCompositeOperation = 'overlay';
        ctx.drawImage(cachedGrain.canvas, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
    }

    // ===== TEXT OVERLAY =====
    if (state.text.content.trim()) {
        const tx = (state.text.x / 100) * width;
        const ty = (state.text.y / 100) * height;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `600 ${state.text.size}px ${state.text.font}`;
        ctx.shadowColor = state.text.shadowColor;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = state.text.color;
        ctx.fillText(state.text.content, tx, ty);
        ctx.restore();
    }
}

export function downloadDirect() {
    const dataUrl = dom.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `aurapaper-${state.canvas.width}x${state.canvas.height}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    showToast('Wallpaper diunduh!');
}
