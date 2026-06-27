import { state } from './state.js';
import { renderCanvas } from './canvas.js';
import { saveHistory } from './history.js';
export function initFxControls() {
    const grainEnabled   = document.getElementById('fx-grain-enabled');
    const grainIntensity = document.getElementById('slider-grain-intensity');
    const grainScale     = document.getElementById('slider-grain-scale');
    const valGrainInt    = document.getElementById('val-grain-intensity');
    const valGrainScale  = document.getElementById('val-grain-scale');
    if (grainEnabled) {
        grainEnabled.addEventListener('change', (e) => {
            state.fx.grain.enabled = e.target.checked;
            renderCanvas();
            saveHistory();
        });
    }
    if (grainIntensity) {
        grainIntensity.addEventListener('input', (e) => {
            state.fx.grain.intensity = parseInt(e.target.value);
            if (valGrainInt) valGrainInt.innerText = e.target.value;
            renderCanvas();
        });
        grainIntensity.addEventListener('change', () => saveHistory());
    }
    if (grainScale) {
        grainScale.addEventListener('input', (e) => {
            state.fx.grain.scale = parseInt(e.target.value);
            if (valGrainScale) valGrainScale.innerText = e.target.value + 'x';
            renderCanvas();
        });
        grainScale.addEventListener('change', () => saveHistory());
    }
    const vignetteEnabled   = document.getElementById('fx-vignette-enabled');
    const vignetteIntensity = document.getElementById('slider-vignette-intensity');
    const vignetteRadius    = document.getElementById('slider-vignette-radius');
    const valVigInt          = document.getElementById('val-vignette-intensity');
    const valVigRadius       = document.getElementById('val-vignette-radius');
    if (vignetteEnabled) {
        vignetteEnabled.addEventListener('change', (e) => {
            state.fx.vignette.enabled = e.target.checked;
            renderCanvas();
            saveHistory();
        });
    }
    if (vignetteIntensity) {
        vignetteIntensity.addEventListener('input', (e) => {
            state.fx.vignette.intensity = parseInt(e.target.value);
            if (valVigInt) valVigInt.innerText = e.target.value + '%';
            renderCanvas();
        });
        vignetteIntensity.addEventListener('change', () => saveHistory());
    }
    if (vignetteRadius) {
        vignetteRadius.addEventListener('input', (e) => {
            state.fx.vignette.radius = parseInt(e.target.value);
            if (valVigRadius) valVigRadius.innerText = e.target.value + '%';
            renderCanvas();
        });
        vignetteRadius.addEventListener('change', () => saveHistory());
    }
    const blendSelect = document.getElementById('fx-blend-mode');
    if (blendSelect) {
        blendSelect.addEventListener('change', (e) => {
            setBlendMode(e.target.value);
        });
    }
}
export function setBlendMode(mode) {
    state.fx.blendMode = mode;
    const select = document.getElementById('fx-blend-mode');
    if (select) select.value = mode;
    document.querySelectorAll('.blend-preview-item').forEach(item => {
        item.classList.toggle('active', item.dataset.blend === mode);
    });
    renderCanvas();
    saveHistory();
}
