import { state, dom } from './state.js';
import { renderCanvas } from './canvas.js';
import { showToast } from './ui.js';
export function saveHistory() {
    const snapshot = {
        filters: { ...state.filters },
        text: { ...state.text }
    };
    if (state.historyIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.historyIndex + 1);
    }
    state.history.push(snapshot);
    if (state.history.length > state.maxHistory) state.history.shift();
    state.historyIndex = state.history.length - 1;
}
export function undoAction() {
    if (state.historyIndex <= 0) { 
        showToast('Tidak ada yang bisa di-undo', 'error'); 
        return; 
    }
    state.historyIndex--;
    restoreHistory(state.history[state.historyIndex]);
    showToast('Undo berhasil');
}
export function redoAction() {
    if (state.historyIndex >= state.history.length - 1) { 
        showToast('Tidak ada yang bisa di-redo', 'error'); 
        return; 
    }
    state.historyIndex++;
    restoreHistory(state.history[state.historyIndex]);
    showToast('Redo berhasil');
}
export function restoreHistory(snapshot) {
    state.filters = { ...snapshot.filters };
    state.text = { ...snapshot.text };
    dom.sliders.brightness.value = state.filters.brightness;
    dom.sliders.contrast.value = state.filters.contrast;
    dom.sliders.saturate.value = state.filters.saturate;
    dom.sliders.blur.value = state.filters.blur;
    dom.sliders.hue.value = state.filters.hueRotate;
    dom.sliders.grayscale.value = state.filters.grayscale;
    dom.sliders.sepia.value = state.filters.sepia;
    dom.sliderVals.brightness.innerText = state.filters.brightness + '%';
    dom.sliderVals.contrast.innerText = state.filters.contrast + '%';
    dom.sliderVals.saturate.innerText = state.filters.saturate + '%';
    dom.sliderVals.blur.innerText = state.filters.blur + 'px';
    dom.sliderVals.hue.innerText = state.filters.hueRotate + '°';
    dom.sliderVals.grayscale.innerText = state.filters.grayscale + '%';
    dom.sliderVals.sepia.innerText = state.filters.sepia + '%';
    dom.textInput.value = state.text.content;
    dom.textFont.value = state.text.font;
    dom.textSize.value = state.text.size;
    dom.valTextSize.innerText = state.text.size + 'px';
    dom.textColor.value = state.text.color;
    dom.textColorHex.innerText = state.text.color;
    dom.textShadowColor.value = state.text.shadowColor;
    dom.textShadowHex.innerText = state.text.shadowColor;
    dom.textY.value = state.text.y;
    dom.valTextY.innerText = state.text.y + '%';
    dom.textX.value = state.text.x;
    dom.valTextX.innerText = state.text.x + '%';
    renderCanvas();
}
