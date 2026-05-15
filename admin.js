// ==========================================
// ADMIN PANEL - JavaScript Utilities
// ==========================================

// ──── Theme Toggle ────────────────────────
const THEME_KEY = 'admin_theme';

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeBtn');
    if (btn) {
        btn.innerHTML = theme === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ──── Toast Notifications ──────────────────
function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>
        <span class="toast-text">${msg}</span>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 4000);
}

function createToastContainer() {
    const c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
}

// ──── Modal System ─────────────────────────
function openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
            m.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
});

// ──── Image Preview ────────────────────────
function initImageUpload(inputId, previewId, placeholderId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            const placeholder = document.getElementById(placeholderId);
            if (preview) { preview.src = e.target.result; preview.parentElement.classList.add('visible'); }
            if (placeholder) placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
}

// ──── Drag & Drop Upload Zone ──────────────
function initDropzone(zoneId) {
    const zone = document.getElementById(zoneId);
    if (!zone) return;
    
    ['dragenter','dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('dragover'); }));
    ['dragleave','drop'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.remove('dragover'); }));
    
    zone.addEventListener('drop', (ev) => {
        const input = zone.querySelector('input[type="file"]');
        if (input && ev.dataTransfer.files.length) {
            input.files = ev.dataTransfer.files;
            input.dispatchEvent(new Event('change'));
        }
    });
}

// ──── Sortable Projects Drag & Drop ────────
function initSortable(listId, updateUrl) {
    const el = document.getElementById(listId);
    if (!el || typeof Sortable === 'undefined') return;
    
    Sortable.create(el, {
        handle: '.drag-handle',
        animation: 200,
        ghostClass: 'sortable-ghost',
        onEnd: () => {
            const ids = [...el.querySelectorAll('[data-id]')].map((r, i) => ({ id: r.dataset.id, order: i }));
            fetch(updateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reorder', items: ids })
            }).then(r => r.json()).then(d => {
                if (d.success) showToast('Ordre sauvegardé !');
            });
        }
    });
}

// ──── CSRF Token Helper ───────────────────
function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : '';
}

// ──── Confirm Delete (Updated with CSRF) ───
function confirmDelete(id, name, url = window.location.pathname) {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=delete&id=${id}&csrf_token=${getCsrfToken()}`
    }).then(r => r.json()).then(d => {
        if (d.success) {
            showToast(d.message || 'Supprimé avec succès !');
            const row = document.querySelector(`[data-id="${id}"]`);
            if (row) { row.style.transition = 'all .3s'; row.style.opacity = '0'; setTimeout(() => row.remove(), 300); }
            updateCounters(); // Update stats if present
        } else {
            showToast(d.message || 'Erreur lors de la suppression', 'error');
        }
    }).catch(e => showToast('Erreur réseau', 'error'));
}

// ──── Projects Toggle Functions ────────────
function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=toggle_status&id=${id}&csrf_token=${getCsrfToken()}`
    }).then(r => r.json()).then(d => {
        if (d.success) {
            showToast(`Statut mis à jour: ${newStatus}`);
            const badge = document.querySelector(`[data-id="${id}"] .status-badge`);
            if (badge) {
                badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                badge.className = `badge status-badge badge-${d.new_status_color}`;
                badge.dataset.status = newStatus;
            }
        } else {
            showToast(d.message || 'Erreur', 'error');
        }
    });
}

function toggleFeatured(id, current) {
    const newVal = current ? 0 : 1;
    fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=toggle_featured&id=${id}&csrf_token=${getCsrfToken()}`
    }).then(r => r.json()).then(d => {
        if (d.success) {
            showToast(`Featured: ${newVal ? 'activé' : 'désactivé'}`);
            const star = document.querySelector(`[data-id="${id}"] .featured-star`);
            if (star) {
                star.classList.toggle('active', !!newVal);
                star.style.color = newVal ? 'var(--primary)' : 'var(--text-s)';
            }
        } else {
            showToast(d.message || 'Erreur', 'error');
        }
    });
}

// ──── Edit Project Inline ──────────────────
function editProjectInline(p) {
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> ' + __admin('edit_project');
    document.getElementById('projectIdInline').value = p.id;
    document.getElementById('titleFrInline').value = p.title || '';
    document.getElementById('titleEnInline').value = p.title_en || '';
    document.getElementById('titleArInline').value = p.title_ar || '';
    document.getElementById('shortDescInline').value = p.short_description || '';
    document.getElementById('descInline').value = p.description || '';
    document.getElementById('techInline').value = p.technologies || '';
    document.getElementById('urlInline').value = p.project_url || '';
    document.getElementById('githubInline').value = p.github_url || '';
    document.getElementById('projectStatusInline').value = p.status || 'draft';
    document.getElementById('projectCategoryInline').value = p.category || 'other';
    document.getElementById('featuredInline').checked = !!p.featured;
    
    // Image preview
    const preview = document.getElementById('imagePreviewInline');
    if (p.image) {
        preview.innerHTML = `<img src="${p.image}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`;
    } else {
        preview.innerHTML = '📷';
    }
    
    // Gallery
    if (p.gallery_images) {
        try {
            window.galleryItems = JSON.parse(p.gallery_images); // Use global for inline form
            renderGallery();
        } catch(e) { console.error('Gallery parse error:', e); }
    }
    
    document.getElementById('inlineForm').classList.remove('hidden');
    document.getElementById('inlineForm').scrollIntoView({ behavior: 'smooth' });
}

// ──── Update Counters (for filters) ────────
function updateCounters() {
    // Will be called after AJAX success to refresh counts
    // Implementation depends on page stats elements
    console.log('Counters need update - refresh page or implement live count');
}


// ──── Trilingual Tabs ──────────────────────
function initTrilingualTabs() {
    document.querySelectorAll('.trilingual-tabs').forEach(tabs => {
        tabs.querySelectorAll('.trilingual-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const group = tab.closest('.trilingual-group');
                const lang = tab.dataset.lang;
                group.querySelectorAll('.trilingual-tab').forEach(t => t.classList.remove('active'));
                group.querySelectorAll('.trilingual-pane').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                group.querySelector(`.trilingual-pane[data-lang="${lang}"]`)?.classList.add('active');
            });
        });
    });
}

// ──── Range Sliders ────────────────────────
function initRangeSliders() {
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const display = input.parentElement.querySelector('.range-val');
        if (display) {
            display.textContent = input.value + '%';
            input.addEventListener('input', () => display.textContent = input.value + '%');
        }
    });
}

// ──── Mobile Sidebar Toggle ────────────────
function toggleSidebar() {
    document.querySelector('.admin-sidebar')?.classList.toggle('open');
    document.querySelector('.sidebar-overlay')?.classList.toggle('active');
}

// ──── Search Filter ────────────────────────
function initTableSearch(inputId, tableBodyId) {
    const input = document.getElementById(inputId);
    const tbody = document.getElementById(tableBodyId);
    if (!input || !tbody) return;
    
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        tbody.querySelectorAll('tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    });
}

// ──── Auto dismiss flash messages ─────────
function initFlashDismiss() {
    const alerts = document.querySelectorAll('.alert[data-auto-dismiss]');
    alerts.forEach(a => setTimeout(() => { a.style.transition = 'opacity .5s'; a.style.opacity = '0'; setTimeout(() => a.remove(), 500); }, 4000));
}

// ──── Init on DOM Ready ────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTrilingualTabs();
    initRangeSliders();
    initFlashDismiss();
});
