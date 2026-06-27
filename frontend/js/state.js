export const state = {
    backendUrl: window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5000',
    isOnline: false,
    canvas: { width: 1920, height: 1080, presetId: 'preset-desktop' },
    image: null,
    originalFilename: 'gradient-template.png',
    filters: { brightness:100, contrast:100, saturate:100, blur:0, hueRotate:0, grayscale:0, sepia:0 },
    fx: {
        grain: { enabled: false, intensity: 30, scale: 1 },
        vignette: { enabled: false, intensity: 50, radius: 50 },
        blendMode: 'source-over'
    },
    text: { content:'', font:'Inter', size:48, color:'#ffffff', shadowColor:'#000000', x:50, y:50 },
    history: [],
    historyIndex: -1,
    maxHistory: 30,
    showGrid: true
};
export const dom = {};
