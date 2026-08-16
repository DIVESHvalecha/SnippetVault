const BASE_URL = 'http://localhost:8080';

// ─── State management ─────────────────────────────────────────────────────────

const STATES = ['loading', 'auth', 'form', 'success'];

function showState(name) {
    STATES.forEach(s => {
        const el = document.getElementById(`state-${s}`);
        el.classList.toggle('hidden', s !== name);
    });
}

function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error-msg').classList.add('hidden');
}

// ─── Language auto-detection ──────────────────────────────────────────────────

function detectLanguage(code) {
    if (!code) return 'plaintext';
    if (/^\s*</.test(code) && /<\/\w+>/.test(code)) return 'html';
    if (/\bimport\b.*\bfrom\b|const\s+\w+\s*=\s*require/.test(code))
        return /:\s*\w+(\[\])?\s*[=;{]|interface\s+\w+/.test(code) ? 'typescript' : 'javascript';
    if (/\bdef\s+\w+\(|print\(|import\s+\w+/.test(code)) return 'python';
    if (/\bpublic\s+(static\s+)?class\b|\bSystem\.out\.println\b/.test(code)) return 'java';
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE)\b/i.test(code)) return 'sql';
    if (/^\s*[\w-]+\s*:\s*.+;/.test(code) && !code.includes('{')) return 'css';
    if (/^#!/.test(code) || /\$\(|echo\s/.test(code)) return 'bash';
    return 'plaintext';
}

// ─── Auth check (use any authenticated endpoint) ──────────────────────────────

async function checkAuth() {
    try {
        const res = await fetch(`${BASE_URL}/snippets/own`, {
            method: 'GET',
            credentials: 'include',
        });
        return res.ok;
    } catch {
        return false;
    }
}

// ─── Load folders and groups dynamically ──────────────────────────────────────

async function loadFolders() {
    try {
        const res = await fetch(`${BASE_URL}/folder`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const folders = Array.isArray(data) ? data : (data.folders || []);
        const select = document.getElementById('folder');
        folders.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id ?? f.folderId;
            opt.textContent = f.name ?? f.folderName;
            select.appendChild(opt);
        });
    } catch {
        // Non-critical — just leave "No Folder" as the only option
    }
}

async function loadGroups() {
    try {
        const res = await fetch(`${BASE_URL}/groups/my-groups`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        // Backend wraps the array in a `body` field — same as GroupContext.jsx
        const groups = Array.isArray(data) ? data : (data.body || []);
        const select = document.getElementById('group');
        groups.forEach(g => {
            const opt = document.createElement('option');
            // Backend returns `id` and `name` on the group objects
            opt.value = g.id ?? g.groupId;
            opt.textContent = g.name ?? g.groupName ?? g.groupCode;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error('Failed to load groups:', e);
    }
}

// ─── Visibility toggle ────────────────────────────────────────────────────────

let currentVisibility = 'public';

function setupVisibilityToggle() {
    const buttons = document.querySelectorAll('.vis-btn');
    const groupSection = document.getElementById('group-section');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentVisibility = btn.dataset.value;

            // Show/hide group select
            if (currentVisibility === 'group') {
                groupSection.classList.add('visible');
            } else {
                groupSection.classList.remove('visible');
            }
        });
    });
}

// ─── Pending code (from context menu / keyboard shortcut) ─────────────────────

async function loadPendingCode() {
    const { pendingCode } = await chrome.storage.session.get('pendingCode');
    if (pendingCode) {
        document.getElementById('code').value = pendingCode;
        document.getElementById('language').value = detectLanguage(pendingCode);
        chrome.storage.session.remove('pendingCode');
    }
}

// ─── Save snippet ─────────────────────────────────────────────────────────────

async function saveSnippet({ title, description, code, language, visibility, groupId, folderId }) {
    // Match frontend's SnippetContext.addSnippet exactly:
    // backend expects `content` not `code`, and UPPERCASE visibility
    const body = {
        title,
        description,
        content: code,
        language,
        visibility: visibility.toUpperCase(),
    };
    if (groupId) body.groupId = groupId;

    const res = await fetch(`${BASE_URL}/create-snippet`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
    }

    const saved = await res.json();

    // If a folder was selected, link the snippet to it
    if (folderId && saved.snippetId) {
        await fetch(`${BASE_URL}/folder/${folderId}/snippet/${saved.snippetId}`, {
            method: 'POST',
            credentials: 'include',
        }).catch(() => { }); // Non-critical
    }

    return saved;
}

// ─── Reset form ───────────────────────────────────────────────────────────────

function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('language').value = 'javascript';
    document.getElementById('folder').value = '';
    document.getElementById('group').value = '';
    document.getElementById('group-section').classList.remove('visible');

    // Reset visibility to public
    document.querySelectorAll('.vis-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.vis-btn[data-value="public"]').classList.add('active');
    currentVisibility = 'public';

    hideError();
    resetSaveButton();
}

function resetSaveButton() {
    const btn = document.getElementById('btn-save');
    btn.disabled = false;
    btn.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
    Create Snippet`;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
    showState('loading');
    setupVisibilityToggle();

    const isLoggedIn = await checkAuth();
    if (!isLoggedIn) {
        showState('auth');
        return;
    }

    // Load dynamic data in parallel
    await Promise.all([loadPendingCode(), loadFolders(), loadGroups()]);
    showState('form');
}

// ─── Event listeners ──────────────────────────────────────────────────────────

document.getElementById('btn-open-app').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5173' });
    window.close();
});

document.getElementById('btn-save').addEventListener('click', async () => {
    hideError();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const code = document.getElementById('code').value.trim();
    const language = document.getElementById('language').value;
    const folderId = document.getElementById('folder').value || null;
    const groupId = currentVisibility === 'group'
        ? document.getElementById('group').value || null
        : null;

    if (!title) { showError('Please enter a title.'); return; }
    if (!description) { showError('Please enter a description.'); return; }
    if (!code) { showError('Code cannot be empty.'); return; }
    if (currentVisibility === 'group' && !groupId) {
        showError('Please select a group for group visibility.');
        return;
    }

    const btn = document.getElementById('btn-save');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    try {
        await saveSnippet({ title, description, code, language, visibility: currentVisibility, groupId, folderId });
        showState('success');
    } catch (err) {
        showError(err.message || 'Failed to save snippet. Please try again.');
        resetSaveButton();
    }
});

document.getElementById('btn-save-another').addEventListener('click', () => {
    resetForm();
    showState('form');
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();
