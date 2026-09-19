/* ==========================================================================
   StoryTime: read-along app for young ESL learners
   Vanilla JS, no build step. Data comes from window.STORIES (stories.js).
   ========================================================================== */
(() => {
  'use strict';

  // ---------- Config ----------
  const STORIES = Array.isArray(window.STORIES) ? window.STORIES : [];
  const SPEEDS = [0.5, 0.75, 1, 1.25];
  const FONT_MIN = 22, FONT_MAX = 44, FONT_STEP = 2, FONT_DEFAULT = 30;
  const ONLINE_DICTIONARY = true; // fall back to dictionaryapi.dev for words not in the story dictionary
  const CARD_COLORS = ['#DFF5FF', '#FFE3EC', '#E3FBEF', '#FFF3C9', '#EDE6FF', '#FFE6D6'];
  const DOUBLE_TAP_MS = 380;

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileDrawer = window.matchMedia('(max-width: 1023px)');
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normalize = (w) => String(w).toLowerCase().replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}']/gu, '').replace(/^'+|'+$/g, '');
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  // localStorage can throw (private mode, blocked storage), so never depend on it.
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('storytime:' + key); return v == null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('storytime:' + key, JSON.stringify(value)); } catch { /* ignore */ }
    }
  };

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" class="icon"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" class="icon"><rect x="5.5" y="4" width="4.5" height="16" rx="1.6" fill="currentColor"/><rect x="14" y="4" width="4.5" height="16" rx="1.6" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 24 24" class="icon"><path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M4 4v5h5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="m20 20-4-4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>'
  };

  // ---------- Story model ----------
  const prepared = new Map();

  /** Split text into paragraphs of word tokens, keeping punctuation outside the word core. */
  function tokenize(text) {
    const words = [];
    const paragraphs = [];
    String(text).split(/\n+/).map((p) => p.trim()).filter(Boolean).forEach((para, pi) => {
      const idxs = [];
      para.split(/\s+/).forEach((raw) => {
        const m = raw.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
        const [, lead, core, trail] = m || ['', '', raw, ''];
        if (!core) { // punctuation-only token, e.g. a dash: attach it to the previous word
          const prev = words[words.length - 1];
          if (prev && prev.para === pi) { prev.trail += ' ' + raw; prev.raw += ' ' + raw; }
          return;
        }
        idxs.push(words.length);
        words.push({ raw, lead, core, trail, key: normalize(core), para: pi, endsSentence: false });
      });
      if (idxs.length) words[idxs[idxs.length - 1]].endsSentence = true;
      paragraphs.push(idxs);
    });
    words.forEach((w) => { if (/[.!?…]/.test(w.trail)) w.endsSentence = true; });
    return { words, paragraphs };
  }

  function prepare(story, index = 0) {
    if (prepared.has(story.id)) return prepared.get(story.id);
    const dict = new Map();
    Object.entries(story.dictionary || {}).forEach(([word, def]) => dict.set(normalize(word), { word, def }));
    const chars = new Map();
    Object.entries(story.characters || {}).forEach(([name, def]) => chars.set(normalize(name), { word: name, def }));
    const red = new Set((story.redWords || []).map(normalize));
    const focus = new Set((story.vocabWords || []).map(normalize));
    const { words, paragraphs } = tokenize(story.text || '');

    // Resolve each word to its dictionary entry, allowing simple endings (packs → pack).
    words.forEach((w) => { w.dictKey = resolveDictKey(dict, w.key); });

    const p = {
      ...story, dict, chars, red, focus, words, paragraphs,
      color: story.color || CARD_COLORS[index % CARD_COLORS.length],
      targetWords: [...dict.values()].map((d) => d.word)
    };
    prepared.set(story.id, p);
    return p;
  }

  function resolveDictKey(dict, key) {
    const candidates = [key, key.replace(/'s$/, ''), key.replace(/es$/, ''), key.replace(/s$/, ''),
      key.replace(/ed$/, ''), key.replace(/d$/, ''), key.replace(/ing$/, ''), key.replace(/ing$/, 'e')];
    return candidates.find((c) => c && dict.has(c)) || null;
  }

  const allStories = () => STORIES.map((s, i) => prepare(s, i));

  // ---------- DOM refs ----------
  const el = {
    libraryView: $('#libraryView'), readerView: $('#readerView'),
    libraryTitle: $('#libraryTitle'), searchInput: $('#searchInput'), searchClear: $('#searchClear'),
    levelFilters: $('#levelFilters'), storyGrid: $('#storyGrid'), emptyState: $('#emptyState'), resultCount: $('#resultCount'),
    starNum: $('#starNum'), starCount: $('#starCount'), speechWarning: $('#speechWarning'),
    storyIcon: $('#storyIcon'), storyTitle: $('#storyTitle'), storyMeta: $('#storyMeta'),
    lessonCard: $('#lessonCard'), lessonBody: $('#lessonBody'),
    controls: $('#controls'), playBtn: $('#playBtn'), playIcon: $('#playIcon'), playLabel: $('#playLabel'),
    stopBtn: $('#stopBtn'), restartBtn: $('#restartBtn'), speedGroup: $('#speedGroup'),
    progress: $('#progress'), progressFill: $('#progressFill'), progressPct: $('#progressPct'), progressRunner: $('#progressRunner'),
    fontDown: $('#fontDown'), fontUp: $('#fontUp'), redToggle: $('#redToggle'), voiceSelect: $('#voiceSelect'),
    storyText: $('#storyText'),
    drawer: $('#vocabDrawer'), drawerBody: $('#drawerBody'), drawerToggle: $('#drawerToggle'), drawerClose: $('#drawerClose'), scrim: $('#drawerScrim'),
    pop: $('#wordPop'), popWord: $('#popWord'), popTag: $('#popTag'), popDef: $('#popDef'), popSay: $('#popSay'), popClose: $('#popClose'),
    toast: $('#toast'), srLive: $('#srLive')
  };

  // ---------- App state ----------
  const state = {
    story: null,          // prepared story in the reader
    wordEls: [],          // span per word index
    status: 'idle',       // idle | playing | paused | done
    index: -1,            // current word index
    activeEl: null,
    rate: SPEEDS.includes(store.get('rate', 1)) ? store.get('rate', 1) : 1,
    fontSize: clamp(store.get('fontSize', FONT_DEFAULT), FONT_MIN, FONT_MAX),
    showRed: store.get('showRed', false),
    query: '',
    level: 'All',
    focusIndex: 0
  };

  function announce(msg) {
    el.srLive.textContent = '';
    requestAnimationFrame(() => { el.srLive.textContent = msg; });
  }

  let toastTimer = null;
  function toast(msg, ms = 3200) {
    el.toast.textContent = msg;
    el.toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('is-show'), ms);
  }

  // ======================================================================
  //  Library view
  // ======================================================================
  function completedMap() { return store.get('completed', {}); }

  function updateStars(bump = false) {
    const done = completedMap();
    el.starNum.textContent = STORIES.filter((s) => done[s.id]).length;
    if (bump) {
      el.starCount.classList.remove('is-bump');
      void el.starCount.offsetWidth; // restart animation
      el.starCount.classList.add('is-bump');
    }
  }

  function renderLevelFilters() {
    const levels = ['All', ...new Set(STORIES.map((s) => s.level).filter(Boolean))];
    el.levelFilters.innerHTML = levels.map((lv) =>
      `<button type="button" class="filter-chip" data-level="${escapeHtml(lv)}" aria-pressed="${lv === state.level}">${escapeHtml(lv)}</button>`
    ).join('');
  }

  function renderLibrary() {
    const q = state.query.trim().toLowerCase();
    const done = completedMap();
    const results = [];

    allStories().forEach((s) => {
      if (state.level !== 'All' && s.level !== state.level) return;
      const targets = [...new Set([...s.targetWords, ...(s.vocabWords || [])])];
      const matched = q ? targets.filter((w) => w.toLowerCase().startsWith(q)) : [];
      if (q && !s.title.toLowerCase().includes(q) && !matched.length) return;
      results.push({ s, targets, matched });
    });

    el.storyGrid.innerHTML = results.map(({ s, targets, matched }) => {
      const chips = [...matched, ...targets.filter((w) => !matched.includes(w))].slice(0, 6);
      return `
      <li>
        <a class="story-card" href="#/story/${encodeURIComponent(s.id)}" style="--card:${escapeHtml(s.color)}">
          ${done[s.id] ? '<span class="story-card__star">⭐ Read it!</span>' : ''}
          <span class="story-card__icon" aria-hidden="true">${escapeHtml(s.icon || '📘')}</span>
          <h2 class="story-card__title">${escapeHtml(s.title)}</h2>
          <div class="flex flex-wrap gap-2">
            <span class="badge badge--${slug(s.level || '')}">${levelEmoji(s.level)} ${escapeHtml(s.level || 'Story')}</span>
            ${s.concept ? `<span class="tag">${escapeHtml(s.concept)}</span>` : ''}
          </div>
          <p class="story-card__meta">${s.words.length} words · ${s.targetWords.length} target words</p>
          <ul class="chip-row" aria-label="Target words">
            ${chips.map((w) => `<li class="chip${matched.includes(w) ? ' is-match' : ''}">${escapeHtml(w)}</li>`).join('')}
          </ul>
          <span class="story-card__go" aria-hidden="true">Read ${ICONS.play.replace('class="icon"', 'class="icon" style="width:1em;height:1em"')}</span>
        </a>
      </li>`;
    }).join('');

    el.emptyState.hidden = results.length > 0;
    el.resultCount.textContent = `${results.length} ${results.length === 1 ? 'story' : 'stories'} found`;
    el.searchClear.hidden = !state.query;
  }

  function levelEmoji(level) {
    return { beginner: '🌱', intermediate: '🌿', advanced: '🌳' }[slug(level || '')] || '📘';
  }

  el.searchInput.addEventListener('input', () => { state.query = el.searchInput.value; renderLibrary(); });
  el.searchClear.addEventListener('click', () => {
    el.searchInput.value = ''; state.query = ''; renderLibrary(); el.searchInput.focus();
  });
  el.levelFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-level]');
    if (!btn) return;
    state.level = btn.dataset.level;
    renderLevelFilters();
    renderLibrary();
  });

  // ======================================================================
  //  Speech engine
  // ======================================================================
  const synth = window.speechSynthesis;
  const canSpeak = !!synth && 'SpeechSynthesisUtterance' in window;
  const tts = {
    token: 0,             // bumped on every stop/pause so stale callbacks are ignored
    voices: [],
    voice: null,
    current: null,        // keep a reference: Chrome drops events of garbage-collected utterances
    estTimer: null,
    graceTimer: null,
    boundaryOk: new Set(),  // voices that fire word boundary events
    boundaryNo: new Set()   // voices that don't (e.g. Chrome's online "Google" voices)
  };
  const voiceKey = () => (tts.voice ? tts.voice.voiceURI || tts.voice.name : 'default');

  function loadVoices() {
    if (!canSpeak) return;
    const all = synth.getVoices();
    if (!all.length) return;
    const english = all.filter((v) => /^en([-_]|$)/i.test(v.lang));
    const list = (english.length ? english : all).slice();
    const score = (v) => (/en[-_]US/i.test(v.lang) ? 4 : /en[-_]GB/i.test(v.lang) ? 3 : 0) +
      (v.localService ? 3 : 0) + (v.default ? 1 : 0) +
      (/samantha|aria|jenny|ava|allison|zira|karen|daniel/i.test(v.name) ? 1 : 0);
    list.sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
    tts.voices = list;
    const saved = store.get('voice', null);
    tts.voice = list.find((v) => v.name === saved) || list[0] || null;
    el.voiceSelect.innerHTML = list.map((v) =>
      `<option value="${escapeHtml(v.name)}">${escapeHtml(v.name.replace(/^(Microsoft|Google)\s+/, ''))} (${escapeHtml(v.lang)})</option>`
    ).join('');
    if (tts.voice) el.voiceSelect.value = tts.voice.name;
  }

  function makeUtterance(text, rate) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.05;
    if (tts.voice) { u.voice = tts.voice; u.lang = tts.voice.lang; } else { u.lang = 'en-US'; }
    return u;
  }

  /**
   * Speak an utterance. Chrome can drop a speak() issued right after cancel(), so wait a beat
   * in that case. When nothing was speaking we speak synchronously, which keeps iOS Safari happy
   * (it only allows speech that starts inside a user gesture).
   */
  function speakNow(u, tok) {
    const busy = synth.speaking || synth.pending;
    synth.cancel();
    tts.current = u;
    const go = () => {
      if (tok !== tts.token) return;
      if (synth.paused) synth.resume();
      synth.speak(u);
    };
    if (busy) setTimeout(go, 70); else go();
  }

  function stopEstimator() {
    clearInterval(tts.estTimer); tts.estTimer = null;
    clearTimeout(tts.graceTimer); tts.graceTimer = null;
  }

  /** Fallback highlighter for voices without boundary events: estimate word timing from length. */
  function startEstimator(start, end, tok, t0) {
    stopEstimator();
    const weights = [];
    for (let i = start; i <= end; i++) {
      const w = state.story.words[i];
      weights.push(w.core.length + 2 + (/[.!?]/.test(w.trail) ? 7 : /[,;:]/.test(w.trail) ? 4 : 0));
    }
    const msPerUnit = 56 / state.rate;
    tts.estTimer = setInterval(() => {
      if (tok !== tts.token) return stopEstimator();
      const units = (performance.now() - t0) / msPerUnit;
      let acc = 0, k = 0;
      while (k < weights.length - 1 && acc + weights[k] < units) { acc += weights[k]; k++; }
      if (start + k !== state.index) setActive(start + k);
    }, 60);
  }

  /** Speak the story from `start`, one sentence per utterance (avoids Chrome's ~15s cut-off). */
  function speakChunk(start, tok) {
    if (tok !== tts.token) return;
    const words = state.story.words;
    if (start >= words.length) return finish(tok);

    let end = start;
    while (end < words.length - 1 && !words[end].endsSentence) end++;

    // Build the sentence and remember where each token starts, to map boundary charIndex → word.
    let text = '';
    const offsets = [];
    for (let i = start; i <= end; i++) {
      offsets.push(text.length);
      text += words[i].raw + ' ';
    }
    const u = makeUtterance(text.trim(), state.rate);
    const vk = voiceKey();
    let gotBoundary = false;

    u.onstart = () => {
      if (tok !== tts.token) return;
      const t0 = performance.now();
      setActive(start);
      if (tts.boundaryOk.has(vk)) return;
      if (tts.boundaryNo.has(vk)) return startEstimator(start, end, tok, t0);
      tts.graceTimer = setTimeout(() => {
        if (!gotBoundary && tok === tts.token) startEstimator(start, end, tok, t0);
      }, 450);
    };
    u.onboundary = (e) => {
      if (tok !== tts.token) return;
      if (e.name && e.name !== 'word') return;
      if (!gotBoundary) { gotBoundary = true; tts.boundaryOk.add(vk); stopEstimator(); }
      let k = 0;
      while (k < offsets.length - 1 && offsets[k + 1] <= e.charIndex) k++;
      setActive(start + k);
    };
    u.onend = () => {
      if (tok !== tts.token) return;
      stopEstimator();
      if (!gotBoundary && end - start >= 2 && !tts.boundaryOk.has(vk)) tts.boundaryNo.add(vk);
      speakChunk(end + 1, tok);
    };
    u.onerror = (e) => {
      if (tok !== tts.token || e.error === 'interrupted' || e.error === 'canceled') return;
      stopEstimator();
      state.status = 'paused';
      updateControls();
      toast(e.error === 'not-allowed' ? '👆 Tap Play to start reading' : '😕 Oops! The voice stopped. Tap Play to try again.');
    };
    speakNow(u, tok);
  }

  // ---------- Player controls ----------
  let audioCtx = null;
  function unlockAudio() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch { /* no Web Audio */ }
  }

  function playFrom(start) {
    if (!canSpeak || !state.story) return;
    unlockAudio();
    closePopover();
    const tok = ++tts.token;
    stopEstimator();
    state.status = 'playing';
    setActive(clamp(start, 0, state.story.words.length - 1));
    updateControls();
    speakChunk(state.index, tok);
  }

  function play() {
    const n = state.story.words.length;
    playFrom(state.status === 'done' || state.index < 0 || state.index >= n ? 0 : state.index);
  }

  function pause() {
    if (state.status !== 'playing') return;
    ++tts.token;
    stopEstimator();
    synth.cancel();
    state.status = 'paused';
    updateControls();
    announce('Paused');
  }

  function stop() {
    ++tts.token;
    stopEstimator();
    if (canSpeak) synth.cancel();
    state.status = 'idle';
    state.index = -1;
    clearActive();
    updateProgress(0);
    updateControls();
  }

  function finish(tok) {
    if (tok !== tts.token) return;
    stopEstimator();
    state.status = 'done';
    state.index = state.story.words.length;
    clearActive();
    updateProgress(100);
    updateControls();
    celebrate();
  }

  function updateControls() {
    const s = state.status;
    const playing = s === 'playing';
    el.playBtn.classList.toggle('is-playing', playing);
    el.playIcon.innerHTML = playing ? ICONS.pause : s === 'done' ? ICONS.replay : ICONS.play;
    el.playLabel.textContent = playing ? 'Pause' : s === 'paused' ? 'Resume' : s === 'done' ? 'Again!' : 'Play';
    el.playBtn.setAttribute('aria-label', playing ? 'Pause reading' : s === 'paused' ? 'Resume reading' : s === 'done' ? 'Read the story again' : 'Read the story aloud');
    el.stopBtn.disabled = s === 'idle';
    el.playBtn.disabled = el.restartBtn.disabled = !canSpeak;
  }

  function updateProgress(pct) {
    pct = clamp(Math.round(pct), 0, 100);
    el.progressFill.style.width = pct + '%';
    el.progressPct.textContent = pct + '%';
    el.progress.setAttribute('aria-valuenow', pct);
    el.progress.setAttribute('aria-valuetext', `${pct}% read`);
  }

  function clearActive() {
    if (state.activeEl) state.activeEl.classList.remove('is-active');
    state.activeEl = null;
  }

  function setActive(i) {
    const wordEl = state.wordEls[i];
    if (!wordEl) return;
    if (state.activeEl !== wordEl) {
      clearActive();
      wordEl.classList.add('is-active');
      state.activeEl = wordEl;
    }
    state.index = i;
    updateProgress((i / state.story.words.length) * 100);
    keepInView(wordEl);
  }

  /** Scroll only when the active word slips under the sticky controls or off the bottom. */
  function keepInView(target) {
    const r = target.getBoundingClientRect();
    const topLimit = el.controls.getBoundingClientRect().bottom + 16;
    const bottomLimit = window.innerHeight - 40;
    if (r.top < topLimit || r.bottom > bottomLimit) {
      const y = window.scrollY + r.top - (topLimit + (bottomLimit - topLimit) / 3);
      window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  // ---------- Single word pronunciation ----------
  function sayWord(text, wordEl) {
    if (!canSpeak) { toast('🔇 This browser cannot speak words.'); return; }
    if (state.status === 'playing') pause();
    const tok = ++tts.token;
    stopEstimator();
    const u = makeUtterance(text, clamp(state.rate, 0.6, 0.85));
    if (wordEl) {
      wordEl.classList.remove('is-saying');
      void wordEl.offsetWidth;
      wordEl.classList.add('is-saying');
      setTimeout(() => wordEl.classList.remove('is-saying'), 700);
    }
    speakNow(u, tok);
  }

  // ---------- Celebration ----------
  function playCheer() {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const t = now + i * 0.13;
        const len = i === 3 ? 0.7 : 0.22;
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        o.connect(g).connect(audioCtx.destination);
        o.start(t);
        o.stop(t + len + 0.05);
      });
    } catch { /* ignore */ }
  }

  function fireConfetti() {
    if (typeof window.confetti !== 'function' || reduceMotion.matches) return;
    const colors = ['#7C5CFF', '#5CC8FF', '#3DDC97', '#FFD84D', '#FF7A7A', '#FFB3D1'];
    const end = Date.now() + 1400;
    window.confetti({ particleCount: 120, spread: 90, startVelocity: 45, origin: { y: 0.65 }, colors, disableForReducedMotion: true });
    (function frame() {
      window.confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, disableForReducedMotion: true });
      window.confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, disableForReducedMotion: true });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  function celebrate() {
    const s = state.story;
    const done = completedMap();
    const first = !done[s.id];
    done[s.id] = { at: Date.now(), times: (done[s.id]?.times || 0) + 1 };
    store.set('completed', done);
    updateStars(first);

    fireConfetti();
    playCheer();
    toast(first ? `🎉 Great reading! You earned a star for “${s.title}”!` : '🎉 Great reading! You did it again!', 4200);
    announce('Great reading! You finished the story.');

    const tok = tts.token;
    setTimeout(() => {
      if (tok !== tts.token || !canSpeak) return;
      speakNow(makeUtterance('Great reading! Well done!', 1), tok);
    }, 900);
  }

  // ======================================================================
  //  Reader view
  // ======================================================================
  function renderReader(story) {
    state.story = story;
    state.status = 'idle';
    state.index = -1;
    state.activeEl = null;
    state.focusIndex = 0;

    document.title = `${story.title} · StoryTime`;
    el.readerView.style.setProperty('--card', story.color);
    el.storyIcon.textContent = story.icon || '📘';
    el.storyTitle.textContent = story.title;
    el.storyMeta.innerHTML = [
      `<span class="badge badge--${slug(story.level || '')}">${levelEmoji(story.level)} ${escapeHtml(story.level || 'Story')}</span>`,
      story.concept ? `<span class="tag">${escapeHtml(story.concept)}</span>` : '',
      story.author ? `<span class="story-head__meta">✏️ by ${escapeHtml(story.author)}</span>` : ''
    ].join('');

    // Lesson card
    const lesson = [];
    if (story.book) lesson.push(`<p><strong>📘 Book:</strong> ${escapeHtml(story.book)}</p>`);
    if (story.rule) lesson.push(`<p><strong>📏 Rule:</strong> ${escapeHtml(story.rule)}</p>`);
    if (story.vocabWords?.length) lesson.push(`<p><strong>⭐ Focus words:</strong> ${story.vocabWords.map(escapeHtml).join(', ')}</p>`);
    if (story.redWords?.length) lesson.push(`<p><strong>🔴 Red Words:</strong> ${story.redWords.map(escapeHtml).join(', ')}</p>`);
    el.lessonBody.innerHTML = lesson.join('');
    el.lessonCard.hidden = !lesson.length;
    el.lessonCard.open = window.innerWidth >= 640; // keep the story above the fold on phones

    // Story text: each word core is its own span; punctuation stays outside so the highlight hugs the word
    const frag = document.createDocumentFragment();
    state.wordEls = [];
    story.paragraphs.forEach((idxs) => {
      const p = document.createElement('p');
      idxs.forEach((i, n) => {
        const w = story.words[i];
        if (w.lead) p.append(w.lead);
        const span = document.createElement('span');
        span.className = 'word';
        if (w.dictKey) span.classList.add('is-vocab');
        if (story.red.has(w.key)) span.classList.add('is-red');
        span.dataset.i = i;
        span.tabIndex = i === 0 ? 0 : -1;
        span.textContent = w.core;
        p.append(span);
        state.wordEls[i] = span;
        if (w.trail) p.append(w.trail);
        if (n < idxs.length - 1) p.append(' ');
      });
      frag.append(p);
    });
    el.storyText.replaceChildren(frag);
    el.storyText.setAttribute('aria-label', `Story: ${story.title}`);

    renderDrawer(story);
    applyFontSize();
    applyRedWords();
    updateProgress(0);
    updateControls();
  }

  function renderDrawer(story) {
    const vocab = [...story.dict.entries()].sort(([a], [b]) => (story.focus.has(b) - story.focus.has(a)));
    const say = (word, cls = '') =>
      `<button type="button" class="say-chip ${cls}" data-say="${escapeHtml(word)}" aria-label="Hear the word ${escapeHtml(word)}">${ICONS.speaker}${escapeHtml(word)}</button>`;

    let html = `<p class="hint">Tap 🔊 to hear a word. Tap 🔍 to find it in the story.</p>`;
    html += `<ul class="vocab-list">${vocab.map(([key, { word, def }]) => `
      <li class="vocab-item">
        <div class="vocab-item__top">
          <button type="button" class="btn btn--round btn--small btn--grape" data-say="${escapeHtml(word)}" aria-label="Hear the word ${escapeHtml(word)}">${ICONS.speaker}</button>
          <span class="vocab-item__word">${escapeHtml(word)}</span>
          ${story.focus.has(key) ? '<span class="focus-tag">⭐ Focus</span>' : ''}
          <button type="button" class="btn btn--round btn--small find-btn" data-find="${escapeHtml(key)}" aria-label="Find ${escapeHtml(word)} in the story">${ICONS.search}</button>
        </div>
        <p class="vocab-item__def">${escapeHtml(def)}</p>
      </li>`).join('')}</ul>`;

    if (story.redWords?.length) {
      html += `<h3><span class="dot dot--red" aria-hidden="true"></span> Red Words</h3>
        <p class="hint">Sight words to know by heart.</p>
        <div class="chip-row mt-2">${story.redWords.map((w) => say(w, 'say-chip--red')).join('')}</div>`;
    }
    if (story.chars.size) {
      html += `<h3>👋 Who's in the story?</h3>
        <ul class="vocab-list">${[...story.chars.values()].map(({ word, def }) => `
          <li class="vocab-item">
            <div class="vocab-item__top">${say(word)}</div>
            <p class="vocab-item__def">${escapeHtml(def)}</p>
          </li>`).join('')}</ul>`;
    }
    el.drawerBody.innerHTML = html;
  }

  function renderSpeedControls() {
    el.speedGroup.innerHTML = SPEEDS.map((s) => `
      <label class="speed__opt" title="${s === 0.5 ? 'Slow practice' : s === 1 ? 'Normal' : s > 1 ? 'Fast' : 'A bit slow'}">
        <input type="radio" name="speed" value="${s}" ${s === state.rate ? 'checked' : ''} aria-label="Speed ${s} times">
        <span>${s}x</span>
      </label>`).join('');
  }

  function applyFontSize() {
    el.storyText.style.setProperty('--story-size', state.fontSize + 'px');
    el.fontDown.disabled = state.fontSize <= FONT_MIN;
    el.fontUp.disabled = state.fontSize >= FONT_MAX;
  }

  function applyRedWords() {
    el.storyText.classList.toggle('show-red', state.showRed);
    el.redToggle.setAttribute('aria-pressed', String(state.showRed));
  }

  // ---------- Controls events ----------
  el.playBtn.addEventListener('click', () => (state.status === 'playing' ? pause() : play()));
  el.stopBtn.addEventListener('click', () => { stop(); announce('Stopped'); });
  el.restartBtn.addEventListener('click', () => playFrom(0));

  el.speedGroup.addEventListener('change', (e) => {
    state.rate = Number(e.target.value);
    store.set('rate', state.rate);
    if (state.status === 'playing') playFrom(state.index); // re-speak at the new speed from this word
    announce(`Speed ${state.rate} times`);
  });

  el.voiceSelect.addEventListener('change', () => {
    tts.voice = tts.voices.find((v) => v.name === el.voiceSelect.value) || tts.voice;
    store.set('voice', tts.voice?.name);
    if (state.status === 'playing') playFrom(state.index);
  });

  el.fontDown.addEventListener('click', () => { state.fontSize = clamp(state.fontSize - FONT_STEP, FONT_MIN, FONT_MAX); store.set('fontSize', state.fontSize); applyFontSize(); closePopover(); });
  el.fontUp.addEventListener('click', () => { state.fontSize = clamp(state.fontSize + FONT_STEP, FONT_MIN, FONT_MAX); store.set('fontSize', state.fontSize); applyFontSize(); closePopover(); });
  el.redToggle.addEventListener('click', () => { state.showRed = !state.showRed; store.set('showRed', state.showRed); applyRedWords(); });

  // ---------- Word interaction: double-click / double-tap / keyboard ----------
  let lastTap = { el: null, time: 0 };
  let lastTouchOpen = 0;

  // Stop the browser selecting text on double-click.
  el.storyText.addEventListener('mousedown', (e) => { if (e.detail > 1) e.preventDefault(); });

  el.storyText.addEventListener('dblclick', (e) => {
    const w = e.target.closest('.word');
    if (!w || Date.now() - lastTouchOpen < 600) return; // already handled as a touch double-tap
    openWord(w);
  });

  // Touch/pen double-tap (dblclick is unreliable on tablets, especially iPadOS).
  el.storyText.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') return;
    const w = e.target.closest('.word');
    if (!w) return;
    const now = Date.now();
    if (lastTap.el === w && now - lastTap.time < DOUBLE_TAP_MS) {
      e.preventDefault();
      lastTap = { el: null, time: 0 };
      lastTouchOpen = now;
      openWord(w);
    } else {
      lastTap = { el: w, time: now };
    }
  });

  // Roving tabindex: one tab stop for the story, arrows move word to word.
  el.storyText.addEventListener('keydown', (e) => {
    const w = e.target.closest('.word');
    if (!w) return;
    const i = Number(w.dataset.i);
    const last = state.wordEls.length - 1;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(last, i + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, i - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWord(w); return; }
    if (next != null) { e.preventDefault(); focusWord(next); }
  });

  el.storyText.addEventListener('focusin', (e) => {
    const w = e.target.closest('.word');
    if (w) focusWord(Number(w.dataset.i), false);
  });

  function focusWord(i, move = true) {
    const prev = state.wordEls[state.focusIndex];
    if (prev) prev.tabIndex = -1;
    state.focusIndex = i;
    const w = state.wordEls[i];
    if (!w) return;
    w.tabIndex = 0;
    if (move) w.focus({ preventScroll: false });
  }

  function openWord(wordEl) {
    const i = Number(wordEl.dataset.i);
    const w = state.story.words[i];
    // 1. stop story playback (keeps the place so Resume carries on), 2. say the word, 3. show its meaning
    sayWord(w.core, wordEl);
    focusWord(i, false);
    showPopover(wordEl, w);
  }

  // ---------- Popover ----------
  const pop = { anchor: null, word: null, req: 0 };
  const defCache = new Map();

  async function lookupDefinition(w) {
    const s = state.story;
    if (w.dictKey) return { type: 'vocab', tag: '⭐ Story word', text: s.dict.get(w.dictKey).def };
    if (s.chars.has(w.key)) return { type: 'name', tag: '👋 Name', text: s.chars.get(w.key).def };
    if (s.red.has(w.key)) return { type: 'red', tag: '🔴 Red Word', text: 'A sight word. Learn it by heart so you can read it fast!' };

    const online = ONLINE_DICTIONARY ? await fetchDefinition(w.key) : null;
    if (online) return { type: 'online', tag: `📖 ${online.pos || 'Dictionary'}`, text: online.text };
    return { type: 'none', tag: '🎧 Listen', text: 'Listen and say it with me! Ask your teacher what this word means.' };
  }

  async function fetchDefinition(key) {
    if (!key || /\d/.test(key)) return null;
    if (defCache.has(key)) return defCache.get(key);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`, { signal: ctrl.signal });
      if (!res.ok) { if (res.status === 404) defCache.set(key, null); return null; }
      const data = await res.json();
      const meaning = data?.[0]?.meanings?.[0];
      // Prefer the shortest of the first few definitions: they tend to be the simplest for kids.
      const defs = (meaning?.definitions || []).slice(0, 3).map((d) => d.definition).filter(Boolean);
      const text = defs.sort((a, b) => a.length - b.length)[0];
      const result = text ? { text, pos: meaning.partOfSpeech } : null;
      defCache.set(key, result);
      return result;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async function showPopover(wordEl, w) {
    const req = ++pop.req;
    pop.anchor = wordEl;
    pop.word = w;
    el.popWord.textContent = w.core;
    el.popTag.textContent = '…';
    el.popTag.dataset.type = '';
    el.popDef.textContent = 'Looking it up…';
    el.popDef.classList.add('is-loading');
    el.pop.hidden = false;
    positionPopover();

    const def = await lookupDefinition(w);
    if (req !== pop.req || el.pop.hidden) return;
    el.popTag.textContent = def.tag;
    el.popTag.dataset.type = def.type;
    el.popDef.textContent = def.text;
    el.popDef.classList.remove('is-loading');
    positionPopover();
    announce(`${w.core}. ${def.text}`);
  }

  function positionPopover() {
    if (el.pop.hidden || !pop.anchor) return;
    const r = pop.anchor.getBoundingClientRect();
    const p = el.pop.getBoundingClientRect();
    const gap = 16;
    let place = 'top';
    let top = r.top - p.height - gap;
    if (top < 8) { place = 'bottom'; top = r.bottom + gap; }
    const left = clamp(r.left + r.width / 2 - p.width / 2, 12, window.innerWidth - p.width - 12);
    el.pop.dataset.place = place;
    el.pop.style.top = `${Math.round(top)}px`;
    el.pop.style.left = `${Math.round(left)}px`;
    el.pop.style.setProperty('--arrow-x', `${clamp(r.left + r.width / 2 - left, 22, p.width - 22)}px`);
  }

  function closePopover(returnFocus = false) {
    if (el.pop.hidden) return;
    el.pop.hidden = true;
    pop.req++;
    if (returnFocus && pop.anchor) pop.anchor.focus();
    pop.anchor = null;
  }

  el.popClose.addEventListener('click', () => closePopover(true));
  el.popSay.addEventListener('click', () => pop.word && sayWord(pop.word.core, pop.anchor));
  document.addEventListener('pointerdown', (e) => {
    if (el.pop.hidden) return;
    if (el.pop.contains(e.target) || e.target.closest('.word') === pop.anchor) return;
    closePopover();
  });
  window.addEventListener('scroll', positionPopover, { passive: true });
  window.addEventListener('resize', positionPopover);

  // ---------- Word Bank drawer ----------
  function setDrawer(open) {
    el.drawer.classList.toggle('is-open', open);
    el.drawerToggle.setAttribute('aria-expanded', String(open));
    el.scrim.hidden = !open;
    syncDrawerInert();
    if (open) el.drawerClose.focus();
  }
  function syncDrawerInert() {
    // Off-canvas on tablets: keep it out of the tab order while closed.
    el.drawer.inert = mobileDrawer.matches && !el.drawer.classList.contains('is-open');
  }
  mobileDrawer.addEventListener?.('change', () => { if (!mobileDrawer.matches) setDrawer(false); syncDrawerInert(); });

  el.drawerToggle.addEventListener('click', () => setDrawer(true));
  el.drawerClose.addEventListener('click', () => { setDrawer(false); el.drawerToggle.focus(); });
  el.scrim.addEventListener('click', () => setDrawer(false));

  el.drawerBody.addEventListener('click', (e) => {
    const sayBtn = e.target.closest('[data-say]');
    if (sayBtn) {
      const key = normalize(sayBtn.dataset.say);
      const inStory = state.wordEls.find((w, i) => state.story.words[i].key === key);
      sayWord(sayBtn.dataset.say, inStory);
      return;
    }
    const findBtn = e.target.closest('[data-find]');
    if (findBtn) findInStory(findBtn.dataset.find);
  });

  function findInStory(key) {
    const hits = state.wordEls.filter((_, i) => state.story.words[i].dictKey === key);
    if (!hits.length) return;
    if (mobileDrawer.matches) setDrawer(false);
    hits.forEach((h) => {
      h.classList.remove('is-flash');
      void h.offsetWidth;
      h.classList.add('is-flash');
      setTimeout(() => h.classList.remove('is-flash'), 1900);
    });
    const r = hits[0].getBoundingClientRect();
    const topLimit = el.controls.getBoundingClientRect().bottom + 16;
    if (r.top < topLimit || r.bottom > window.innerHeight - 40) {
      window.scrollTo({ top: window.scrollY + r.top - topLimit - 60, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
    announce(`Found ${hits.length} ${hits.length === 1 ? 'time' : 'times'} in the story`);
  }

  // ---------- Global keys ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!el.pop.hidden) { closePopover(true); return; }
      if (el.drawer.classList.contains('is-open')) { setDrawer(false); el.drawerToggle.focus(); }
      return;
    }
    // Space toggles playback when nothing interactive has focus.
    if (e.key === ' ' && !el.readerView.hidden && (e.target === document.body || e.target === document.documentElement)) {
      e.preventDefault();
      if (canSpeak) (state.status === 'playing' ? pause() : play());
    }
  });

  // ======================================================================
  //  Routing (hash based, works on GitHub Pages without server config)
  // ======================================================================
  let firstRoute = true;

  function route() {
    const m = location.hash.match(/^#\/story\/([^/?#]+)/);
    const story = m && allStories().find((s) => s.id === decodeURIComponent(m[1]));
    if (story) showReader(story); else showLibrary();
    firstRoute = false;
  }

  function leaveReader() {
    stop();
    closePopover();
    setDrawer(false);
  }

  function showLibrary() {
    if (state.story) leaveReader();
    state.story = null;
    document.title = 'StoryTime Read-Along';
    el.readerView.hidden = true;
    el.libraryView.hidden = false;
    updateStars();
    renderLibrary();
    if (!firstRoute) { window.scrollTo(0, 0); el.libraryTitle.focus({ preventScroll: true }); }
  }

  function showReader(story) {
    if (state.story) leaveReader();
    el.libraryView.hidden = true;
    el.readerView.hidden = false;
    renderReader(story);
    window.scrollTo(0, 0);
    if (!firstRoute) el.storyTitle.focus({ preventScroll: true });
  }

  // Stop talking if the tab is closed or reloaded mid-story.
  window.addEventListener('pagehide', () => canSpeak && synth.cancel());

  // ---------- Init ----------
  function init() {
    if (canSpeak) {
      synth.cancel(); // clear anything left over from a previous page load
      loadVoices();
      synth.addEventListener?.('voiceschanged', loadVoices);
    } else {
      el.speechWarning.hidden = false;
      el.voiceSelect.closest('label').hidden = true;
    }
    renderSpeedControls();
    renderLevelFilters();
    updateStars();
    syncDrawerInert();
    window.addEventListener('hashchange', route);
    route();
  }

  init();
})();
