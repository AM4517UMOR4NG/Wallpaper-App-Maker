// ==========================================================================
// AURAPAPER — API SERVICE MODULE
// ==========================================================================

import { state, dom } from './state.js';
import { showToast, showLoading } from './ui.js';

export async function checkServerConnection() {
    try {
        const response = await fetch(`${state.backendUrl}/health`);
        const data = await response.json();
        if (data.status === 'ok') {
            state.isOnline = true;
            dom.statusDot.className = 'status-dot online';
            dom.statusLabel.innerText = 'Terhubung';
            loadGallery();
        }
    } catch (error) {
        state.isOnline = false;
        dom.statusDot.className = 'status-dot offline';
        dom.statusLabel.innerText = 'Offline';
    }
}

export async function saveToGallery() {
    if (!state.isOnline) { 
        showToast('Server offline!', 'error'); 
        return; 
    }
    showLoading(true);
    const dataUrl = dom.canvas.toDataURL('image/png');
    try {
        const response = await fetch(`${state.backendUrl}/api/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: dataUrl })
        });
        const data = await response.json();
        if (response.ok) { 
            showToast('Tersimpan ke galeri!'); 
            loadGallery(); 
        } else {
            showToast(data.error || 'Gagal menyimpan', 'error');
        }
    } catch (error) { 
        showToast('Koneksi gagal!', 'error'); 
    } finally { 
        showLoading(false); 
    }
}

export async function loadGallery() {
    if (!state.isOnline) return;
    try {
        const response = await fetch(`${state.backendUrl}/api/wallpapers`);
        const data = await response.json();
        dom.galleryGrid.innerHTML = '';
        if (data.images && data.images.length > 0) {
            data.images.forEach(img => {
                const card = document.createElement('div');
                card.className = 'gallery-card';
                card.innerHTML = `
                    <img src="${state.backendUrl}${img.url}" class="gallery-image" alt="Wallpaper" loading="lazy">
                    <div class="gallery-card-overlay">
                        <button class="gallery-action-btn" onclick="downloadImage('${state.backendUrl}${img.url}')">
                            <i class="fa-solid fa-download"></i>
                        </button>
                    </div>`;
                dom.galleryGrid.appendChild(card);
            });
        } else {
            dom.galleryGrid.innerHTML = `
                <div class="gallery-empty-state">
                    <i class="fa-regular fa-image empty-icon"></i>
                    <p>Belum ada karya tersimpan.</p>
                    <span class="empty-hint">Buat wallpaper lalu simpan ke galeri!</span>
                </div>`;
        }
    } catch (error) { 
        console.error('Gallery load failed:', error); 
    }
}

export function downloadImage(url) {
    const link = document.createElement('a');
    link.href = url; 
    link.download = url.split('/').pop(); 
    link.target = '_blank'; 
    link.click();
}
