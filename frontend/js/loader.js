export async function loadHtmlComponents() {
    const components = [
        { id: 'splash-container', url: 'components/splash.html' },
        { id: 'header-container', url: 'components/header.html' },
        { id: 'sidebar-container', url: 'components/sidebar.html' },
        { id: 'workspace-container', url: 'components/workspace.html' }
    ];
    const promises = components.map(async (comp) => {
        const response = await fetch(comp.url);
        if (!response.ok) throw new Error(`Gagal memuat komponen HTML: ${comp.url}`);
        const html = await response.text();
        const element = document.getElementById(comp.id);
        if (element) {
            element.outerHTML = html;
        }
    });
    await Promise.all(promises);
}
