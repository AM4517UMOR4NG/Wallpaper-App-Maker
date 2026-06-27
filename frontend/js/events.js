// ==========================================================================
// AURAPAPER — EVENTS & KEYBOARD MODULE
// ==========================================================================

import { state, dom } from './state.js';
import { handleImageFile, renderCanvas } from './canvas.js';
import { saveHistory, undoAction, redoAction } from './history.js';
import { toggleWorkspaceGrid } from '../app.js';

export function initEventListeners() {
    // Dropzone
    dom.dropzone.addEventListener('click', () => dom.imageInput.click());
    dom.dropzone.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        dom.dropzone.classList.add('dragover'); 
    });
    dom.dropzone.addEventListener('dragleave', () => { 
        dom.dropzone.classList.remove('dragover'); 
    });
    dom.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dom.dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });
    dom.imageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    });

    // Sliders
    Object.keys(dom.sliders).forEach(key => {
        dom.sliders[key].addEventListener('input', (e) => {
            const val = e.target.value;
            let displayVal = val;
            if (key === 'blur') displayVal += 'px';
            else if (key === 'hue') displayVal += '°';
            else displayVal += '%';
            dom.sliderVals[key].innerText = displayVal;

            let stateKey = key === 'hue' ? 'hueRotate' : key;
            state.filters[stateKey] = parseInt(val);
            renderCanvas();
        });
        dom.sliders[key].addEventListener('change', () => saveHistory());
    });

    // Text controls
    dom.textInput.addEventListener('input', (e) => { 
        state.text.content = e.target.value; 
        renderCanvas(); 
    });
    dom.textInput.addEventListener('change', () => saveHistory());
    
    dom.textFont.addEventListener('change', (e) => { 
        state.text.font = e.target.value; 
        renderCanvas(); 
        saveHistory(); 
    });
    
    dom.textSize.addEventListener('input', (e) => { 
        state.text.size = parseInt(e.target.value); 
        dom.valTextSize.innerText = state.text.size + 'px'; 
        renderCanvas(); 
    });
    dom.textSize.addEventListener('change', () => saveHistory());
    
    dom.textColor.addEventListener('input', (e) => { 
        state.text.color = e.target.value; 
        dom.textColorHex.innerText = e.target.value; 
        renderCanvas(); 
    });
    dom.textColor.addEventListener('change', () => saveHistory());
    
    dom.textShadowColor.addEventListener('input', (e) => { 
        state.text.shadowColor = e.target.value; 
        dom.textShadowHex.innerText = e.target.value; 
        renderCanvas(); 
    });
    dom.textShadowColor.addEventListener('change', () => saveHistory());
    
    dom.textY.addEventListener('input', (e) => { 
        state.text.y = parseInt(e.target.value); 
        dom.valTextY.innerText = state.text.y + '%'; 
        renderCanvas(); 
    });
    dom.textY.addEventListener('change', () => saveHistory());
    
    dom.textX.addEventListener('input', (e) => { 
        state.text.x = parseInt(e.target.value); 
        dom.valTextX.innerText = state.text.x + '%'; 
        renderCanvas(); 
    });
    dom.textX.addEventListener('change', () => saveHistory());
}

export function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undoAction(); }
        if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redoAction(); }
        if (e.ctrlKey && e.key === 's') { e.preventDefault(); window.saveToGallery(); }
        if (e.ctrlKey && e.key === 'd') { e.preventDefault(); window.downloadDirect(); }
        if (e.key.toLowerCase() === 'g' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            toggleWorkspaceGrid();
        }
        if (e.key.toLowerCase() === 'm' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            window.toggleSidebar();
        }
        if (e.key.toLowerCase() === 'n' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            window.toggleNavbar();
        }
    });
}
