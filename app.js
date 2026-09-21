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
  const CARD_COLORS = ['#DFF5FF', '#FFE3EC', '#E3FBEF', '#FFF3C9', '#EDE6FF', '#FFE6D6'];
  const DOUBLE_TAP_MS = 380;
  // The "Sync" menu (manual highlight delay, e.g. for Bluetooth speakers) is hidden for now to keep the
  // controls simple for students. Set to true to bring it back; while hidden, the delay is always 'auto'.
  const SHOW_SYNC_SETTING = false;

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
    const green = new Set((story.greenWords || []).map(normalize));
    const focus = new Set((story.vocabWords || []).map(normalize));
    const { words, paragraphs } = tokenize(story.text || '');

    // Resolve each word to its dictionary entry, allowing simple endings (packs → pack).
    words.forEach((w) => { w.dictKey = resolveDictKey(dict, w.key); });

    const p = {
      ...story, dict, chars, red, green, focus, words, paragraphs,
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
    fontDown: $('#fontDown'), fontUp: $('#fontUp'), redToggle: $('#redToggle'), greenToggle: $('#greenToggle'), wordModeToggle: $('#wordModeToggle'), voiceSelect: $('#voiceSelect'), syncSelect: $('#syncSelect'),
    storyText: $('#storyText'),
    drawer: $('#vocabDrawer'), drawerBody: $('#drawerBody'), drawerToggle: $('#drawerToggle'), drawerClose: $('#drawerClose'), scrim: $('#drawerScrim'),
    pop: $('#wordPop'), popWord: $('#popWord'), popTags: $('#popTags'), popDef: $('#popDef'), popSay: $('#popSay'), popClose: $('#popClose'),
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
    showRed: store.get('redWordsOn', true),
    showGreen: store.get('greenWordsOn', true),
    wordByWord: store.get('wordByWord', true), // read one word at a time (slow, clear) vs whole sentences
    sync: SHOW_SYNC_SETTING ? store.get('highlightDelay', 'auto') : 'auto', // 'auto' or a delay in ms
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
      const searchable = [...new Set([...targets, ...(s.greenWords || [])])];
      const matched = q ? searchable.filter((w) => w.toLowerCase().startsWith(q)) : [];
      const inHeading = [s.title, s.book, s.concept].some((t) => t && t.toLowerCase().includes(q));
      if (q && !inHeading && !matched.length) return;
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

  /** "Concept 33 (ss, ll, ff, zz)" → "ss, ll, ff, zz" */
  function conceptLabel(story) {
    if (!story.concept) return '';
    return story.concept.replace(/^Concept\s+\d+\s*/i, '').replace(/^\((.*)\)$/, '$1').trim();
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
    voiceURI: null,       // the chosen voice; stored as its unique URI, never as a Voice object
    current: null,        // keep a reference: Chrome drops events of garbage-collected utterances
    estTimer: null,
    graceTimer: null,
    boundaryOk: new Set(),  // voices that fire word boundary events
    boundaryNo: new Set(),  // voices that don't (e.g. Chrome's online "Google" voices)
    pace: {}                // learned ms per weight unit at 1x, per voice, for the estimator
  };

  // macOS ships joke and retro voices (Bubbles, Zarvox, Eddy, Grandma...). Hide them from kids.
  const NOVELTY_VOICE = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Princess|Deranged|Hysterical|Pipe Organ|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley)\b/i;
  // Neural and premium voices sound far more human than the standard ones.
  const NATURAL_VOICE = /natural|neural|premium|enhanced|siri/i;

  const isNatural = (v) => NATURAL_VOICE.test(v.name);
  const voiceScore = (v) =>
    (isNatural(v) ? 20 : 0) + (/^Google\b/.test(v.name) ? 6 : 0) +
    (/en[-_]US/i.test(v.lang) ? 4 : /en[-_]GB/i.test(v.lang) ? 3 : 0) +
    (v.localService ? 1 : 0) + (v.default ? 1 : 0);

  /** Always resolve the voice from the browser's current list: Voice objects go stale after `voiceschanged`. */
  function currentVoice() {
    if (!canSpeak || !tts.voiceURI) return null;
    return synth.getVoices().find((v) => v.voiceURI === tts.voiceURI) || null;
  }
  const voiceKey = () => tts.voiceURI || 'default';

  function voiceLabel(v) {
    const name = v.name
      .replace(/^(Microsoft|Google)\s+/, '')
      .replace(/\s+Online\s*\(Natural\)/i, '')
      .replace(/\s*-\s*English.*$/i, '')
      .replace(/\s*\(English[^)]*\)\s*$/i, '');
    return `${name} (${v.lang})`;
  }

  function loadVoices() {
    if (!canSpeak) return;
    const all = synth.getVoices();
    if (!all.length) return;
    const english = all.filter((v) => /^en([-_]|$)/i.test(v.lang) && !NOVELTY_VOICE.test(v.name));
    const pool = english.length ? english : all;
    const seen = new Set();
    const list = pool.filter((v) => !seen.has(v.voiceURI) && seen.add(v.voiceURI))
      .sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name));

    // Keep the current choice; otherwise restore the saved one (older saves stored the name), else the best voice.
    const savedURI = store.get('voiceURI', null);
    const savedName = store.get('voice', null);
    const pick = list.find((v) => v.voiceURI === tts.voiceURI) ||
      list.find((v) => v.voiceURI === savedURI) ||
      list.find((v) => v.name === savedName) || list[0];
    tts.voiceURI = pick ? pick.voiceURI : null;

    const option = (v) => `<option value="${escapeHtml(v.voiceURI)}">${escapeHtml(voiceLabel(v))}</option>`;
    const natural = list.filter(isNatural);
    const others = list.filter((v) => !isNatural(v));
    el.voiceSelect.innerHTML = natural.length
      ? `<optgroup label="✨ Most natural">${natural.map(option).join('')}</optgroup>` +
        (others.length ? `<optgroup label="Other voices">${others.map(option).join('')}</optgroup>` : '')
      : list.map(option).join('');
    if (tts.voiceURI) el.voiceSelect.value = tts.voiceURI;
  }

  function makeUtterance(text, rate) {
    const u = new SpeechSynthesisUtterance(text);
    const voice = currentVoice();
    u.rate = rate;
    u.pitch = 1;
    if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-US'; }
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
  // Estimator timing model (fitted to measured word events): each word costs a fixed amount plus a
  // little per letter, punctuation adds a pause, and every sentence has a short lead-in and tail.
  const EST = { base: 2.2, perLetter: 0.55, comma: 2.5, stop: 4, msPerUnit: 48, leadMs: 60, tailMs: 150 };

  /** Relative duration of each word in a sentence. */
  function chunkWeights(start, end) {
    const weights = [];
    for (let i = start; i <= end; i++) {
      const w = state.story.words[i];
      const pause = i === end ? 0 : /[.!?]/.test(w.trail) ? EST.stop : /[,;:]/.test(w.trail) ? EST.comma : 0;
      weights.push(EST.base + w.core.length * EST.perLetter + pause);
    }
    return weights;
  }

  function startEstimator(start, end, tok, t0, rate) {
    stopEstimator();
    const weights = chunkWeights(start, end);
    const msPerUnit = (tts.pace[voiceKey()] || EST.msPerUnit) / rate;
    tts.estTimer = setInterval(() => {
      if (tok !== tts.token) return stopEstimator();
      const units = (performance.now() - t0 - EST.leadMs) / msPerUnit;
      let acc = 0, k = 0;
      while (k < weights.length - 1 && acc + weights[k] < units) { acc += weights[k]; k++; }
      if (start + k !== state.index) setActive(start + k);
    }, 30);
  }

  /**
   * Word events fire when the speech engine produces a word, but the sound reaches the speakers later
   * (a few ms on built-in speakers, 150–300 ms on Bluetooth). Delay the highlight by that much.
   */
  function highlightDelay() {
    return state.sync === 'auto' ? autoLatency() : Number(state.sync) || 0;
  }

  /** Best guess at the speaker delay, from what the browser reports for its audio output. */
  function autoLatency() {
    if (!audioCtx) return 0;
    const seconds = (audioCtx.outputLatency || 0) + (audioCtx.baseLatency || 0);
    return clamp(Math.round(seconds * 1000), 0, 400);
  }

  function showWord(i, tok) {
    const d = highlightDelay();
    if (d <= 0) return setActive(i);
    setTimeout(() => { if (tok === tts.token && state.status === 'playing') setActive(i); }, d);
  }

  // ---------- Reading modes ----------
  // Word by word: each word is its own utterance, spoken slowly with a pause after it. Slower speeds
  // mean slower words *and* longer pauses. Sentence mode reads each sentence naturally in one go.
  const WORD_MODE = {
    // Word by word reads at its own fixed pace; the speed buttons only apply to sentence reading.
    // Lower this for slower words and longer pauses (0.75 → ~390 ms between words, 0.5 → ~710 ms).
    speed: 1,
    gapMs: 250,        // pause after each word at speed 1; divided by speed^1.5
    commaMs: 250,      // extra pause after a comma, divided by speed
    sentenceMs: 500,   // extra pause after . ! ?, divided by speed
    paragraphMs: 400,  // extra pause at the end of a paragraph, divided by speed
    // Spoken alone, many voices say "a" as the letter name ("ay") and "the" as "thee". These spellings
    // make the voice use the everyday sounds instead. Only the audio changes; the page still shows the word.
    sayAlone: {
      a: () => 'uh',
      the: (next) => (next && /^[aeiou]/i.test(next.core) ? 'thee' : 'thuh') // "thee end", "thuh hill"
    }
  };

  /** How to say a word when it is spoken on its own (next = the following word, if known). */
  function spokenAlone(core, next) {
    const say = WORD_MODE.sayAlone[normalize(core)];
    return say ? say(next) : core;
  }

  /** Speech rate for word-by-word reading: slower and clearer than sentence reading at the same speed. */
  // 0.5x → 0.49, 0.75x → 0.67, 1x → 0.85, 1.25x → 1.02 (voices sound distorted much below ~0.45)
  const wordRate = (speed = WORD_MODE.speed) => Math.round(0.85 * Math.pow(speed, 0.8) * 100) / 100;

  function wordGapMs(w, isParagraphEnd) {
    const speed = WORD_MODE.speed;
    let ms = WORD_MODE.gapMs / Math.pow(speed, 1.5);
    if (/[.!?]/.test(w.trail)) ms += WORD_MODE.sentenceMs / speed;
    else if (/[,;:]/.test(w.trail)) ms += WORD_MODE.commaMs / speed;
    if (isParagraphEnd) ms += WORD_MODE.paragraphMs / speed;
    return Math.round(ms);
  }

  function speakFrom(start, tok) {
    return state.wordByWord ? speakWordStep(start, tok) : speakSentence(start, tok);
  }

  /** Sentence mode: one sentence per utterance (also avoids Chrome's ~15s cut-off). */
  function speakSentence(start, tok) {
    if (tok !== tts.token) return;
    const words = state.story.words;
    if (start >= words.length) return setTimeout(() => finish(tok), highlightDelay());
    let end = start;
    while (end < words.length - 1 && !words[end].endsSentence) end++;
    speakRange(start, end, tok, state.rate, () => speakSentence(end + 1, tok));
  }

  /** Word mode: speak one word, pause, then move on. */
  function speakWordStep(i, tok) {
    if (tok !== tts.token) return;
    const words = state.story.words;
    if (i >= words.length) return setTimeout(() => finish(tok), highlightDelay());
    const w = words[i];
    const next = words[i + 1];
    const spoken = w.lead + spokenAlone(w.core, next) + w.trail;
    speakRange(i, i, tok, wordRate(), () => {
      const isParagraphEnd = !next || next.para !== w.para;
      setTimeout(() => speakWordStep(i + 1, tok), wordGapMs(w, isParagraphEnd));
    }, spoken);
  }

  /**
   * Speak words start..end as one utterance, keep the highlight in step, then call onDone.
   * `spokenText` replaces what the voice says for a single word (see WORD_MODE.sayAlone).
   */
  function speakRange(start, end, tok, rate, onDone, spokenText) {
    const words = state.story.words;
    // Build the text and remember where each token starts, to map boundary charIndex → word.
    let text = '';
    const offsets = [];
    for (let i = start; i <= end; i++) {
      offsets.push(text.length);
      text += words[i].raw + ' ';
    }
    const u = makeUtterance(spokenText || text.trim(), rate);
    const vk = voiceKey();
    let gotBoundary = false;
    let startedAt = 0;

    u.onstart = () => {
      if (tok !== tts.token) return;
      startedAt = performance.now();
      // Voices with word events announce the first word themselves, right as it is spoken.
      if (tts.boundaryOk.has(vk)) return;
      showWord(start, tok);
      if (start === end) return;
      const t0 = startedAt + highlightDelay();
      if (tts.boundaryNo.has(vk)) return startEstimator(start, end, tok, t0, rate);
      tts.graceTimer = setTimeout(() => {
        if (!gotBoundary && tok === tts.token) startEstimator(start, end, tok, t0, rate);
      }, 450);
    };
    u.onboundary = (e) => {
      if (tok !== tts.token) return;
      if (e.name && e.name !== 'word') return;
      if (!gotBoundary) { gotBoundary = true; tts.boundaryOk.add(vk); stopEstimator(); }
      let k = 0;
      while (k < offsets.length - 1 && offsets[k + 1] <= e.charIndex) k++;
      showWord(start + k, tok);
    };
    u.onend = () => {
      if (tok !== tts.token) return;
      stopEstimator();
      if (!gotBoundary && end - start >= 2 && !tts.boundaryOk.has(vk)) {
        tts.boundaryNo.add(vk);
        // Learn this voice's real pace from how long the sentence took, so estimates stop drifting.
        const units = chunkWeights(start, end).reduce((a, b) => a + b, 0);
        const speaking = performance.now() - startedAt - EST.leadMs - EST.tailMs;
        const measured = (speaking * rate) / units;
        if (startedAt && measured > 15 && measured < 200) {
          tts.pace[vk] = tts.pace[vk] ? tts.pace[vk] * 0.5 + measured * 0.5 : measured;
        }
      }
      onDone();
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
      if (audioCtx.state === 'suspended') audioCtx.resume().then(updateSyncLabel);
      updateSyncLabel();
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
    speakFrom(state.index, tok);
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
    // A word shown in the story knows the word after it ("thee end" vs "thuh hill").
    const i = wordEl ? Number(wordEl.dataset.i) : -1;
    const next = i >= 0 ? state.story.words[i + 1] : null;
    const u = makeUtterance(spokenAlone(text, next), Math.min(wordRate(), 0.85));
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
    if (story.greenWords?.length) lesson.push(`<p><strong>🟢 Green Words:</strong> ${story.greenWords.map(escapeHtml).join(', ')}</p>`);
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
        // Group quotes/punctuation with their word so a line never starts with a lone comma.
        const token = document.createElement('span');
        token.className = 'token';
        if (w.lead) token.append(w.lead);
        const span = document.createElement('span');
        span.className = 'word';
        if (w.dictKey) span.classList.add('is-vocab');
        if (story.red.has(w.key)) span.classList.add('is-red');
        if (story.green.has(w.key)) span.classList.add('is-green');
        span.dataset.i = i;
        span.tabIndex = i === 0 ? 0 : -1;
        span.textContent = w.core;
        token.append(span);
        state.wordEls[i] = span;
        if (w.trail) token.append(w.trail);
        p.append(token);
        if (n < idxs.length - 1) p.append(' ');
      });
      frag.append(p);
    });
    el.storyText.replaceChildren(frag);
    el.storyText.setAttribute('aria-label', `Story: ${story.title}`);

    renderDrawer(story);
    applyFontSize();
    applyWordColors();
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

    if (story.greenWords?.length) {
      html += `<h3><span class="dot dot--green" aria-hidden="true"></span> Green Words</h3>
        <p class="hint">Words that follow today's rule${conceptLabel(story) ? `: ${escapeHtml(conceptLabel(story))}` : ''}.</p>
        <div class="chip-row mt-2">${story.greenWords.map((w) => say(w, 'say-chip--green')).join('')}</div>`;
    }
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

  function applyReadingMode() {
    el.wordModeToggle.setAttribute('aria-pressed', String(state.wordByWord));
    // Grey out the speeds (still clickable) while Word by word sets its own pace.
    const speed = el.speedGroup.closest('.speed');
    speed.classList.toggle('is-inactive', state.wordByWord);
    speed.title = state.wordByWord ? 'Word by word uses its own slow pace. Pick a speed to read whole sentences.' : '';
  }

  function applyWordColors() {
    el.storyText.classList.toggle('show-red', state.showRed);
    el.storyText.classList.toggle('show-green', state.showGreen);
    el.redToggle.setAttribute('aria-pressed', String(state.showRed));
    el.greenToggle.setAttribute('aria-pressed', String(state.showGreen));
    el.redToggle.hidden = !state.story?.redWords?.length;
    el.greenToggle.hidden = !state.story?.greenWords?.length;
  }

  // ---------- Controls events ----------
  el.playBtn.addEventListener('click', () => (state.status === 'playing' ? pause() : play()));
  el.stopBtn.addEventListener('click', () => { stop(); announce('Stopped'); });
  el.restartBtn.addEventListener('click', () => playFrom(0));

  // Picking any speed (even the one already selected, hence 'click' as well as 'change') switches
  // Word by word off, because the speed buttons only apply to sentence reading.
  function onSpeedPicked(e) {
    const input = e.target.closest('input[name="speed"]');
    if (!input) return;
    const rate = Number(input.value);
    const leavingWordMode = state.wordByWord;
    if (!leavingWordMode && rate === state.rate) return; // click + change both fire for one pick
    state.rate = rate;
    store.set('rate', state.rate);
    if (leavingWordMode) {
      state.wordByWord = false;
      store.set('wordByWord', false);
      applyReadingMode();
    }
    if (state.status === 'playing') playFrom(state.index); // carry on from this word at the new speed
    announce(leavingWordMode ? `Reading whole sentences at speed ${rate} times` : `Speed ${rate} times`);
  }
  el.speedGroup.addEventListener('change', onSpeedPicked);
  el.speedGroup.addEventListener('click', onSpeedPicked);

  function updateSyncLabel() {
    const auto = el.syncSelect.querySelector('option[value="auto"]');
    auto.textContent = audioCtx ? `Auto (${autoLatency()} ms)` : 'Auto';
  }
  el.syncSelect.value = [...el.syncSelect.options].some((o) => o.value === String(state.sync)) ? String(state.sync) : 'auto';
  el.syncSelect.addEventListener('change', () => {
    state.sync = el.syncSelect.value === 'auto' ? 'auto' : Number(el.syncSelect.value);
    store.set('highlightDelay', state.sync);
    updateSyncLabel();
  });

  el.voiceSelect.addEventListener('change', () => {
    tts.voiceURI = el.voiceSelect.value;
    store.set('voiceURI', tts.voiceURI);
    if (state.status === 'playing') playFrom(state.index);
    else sayWord("Hi! Let's read together."); // let the child hear the new voice right away
  });

  el.fontDown.addEventListener('click', () => { state.fontSize = clamp(state.fontSize - FONT_STEP, FONT_MIN, FONT_MAX); store.set('fontSize', state.fontSize); applyFontSize(); closePopover(); });
  el.fontUp.addEventListener('click', () => { state.fontSize = clamp(state.fontSize + FONT_STEP, FONT_MIN, FONT_MAX); store.set('fontSize', state.fontSize); applyFontSize(); closePopover(); });
  el.redToggle.addEventListener('click', () => { state.showRed = !state.showRed; store.set('redWordsOn', state.showRed); applyWordColors(); });
  el.wordModeToggle.addEventListener('click', () => {
    state.wordByWord = !state.wordByWord;
    store.set('wordByWord', state.wordByWord);
    applyReadingMode();
    if (state.status === 'playing') playFrom(state.index); // switch mode from the current word
    announce(state.wordByWord ? 'Reading one word at a time' : 'Reading whole sentences');
  });
  el.greenToggle.addEventListener('click', () => { state.showGreen = !state.showGreen; store.set('greenWordsOn', state.showGreen); applyWordColors(); });

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
  const pop = { anchor: null, word: null };

  function lookupDefinition(w) {
    const s = state.story;
    const tags = [];
    let text = null;
    if (w.dictKey) { tags.push({ type: 'vocab', label: '⭐ Story word' }); text = s.dict.get(w.dictKey).def; }
    if (s.chars.has(w.key)) { tags.push({ type: 'name', label: '👋 Name' }); text ??= s.chars.get(w.key).def; }
    if (s.red.has(w.key)) { tags.push({ type: 'red', label: '🔴 Red Word' }); text ??= 'A sight word. Learn it by heart so you can read it fast!'; }
    if (s.green.has(w.key)) {
      tags.push({ type: 'green', label: '🟢 Green Word' });
      const pattern = conceptLabel(s);
      text ??= pattern ? `This word follows today's rule: ${pattern}. Sound it out!` : "This word follows today's rule. Sound it out!";
    }
    if (!tags.length) tags.push({ type: 'none', label: '🎧 Listen' });
    return { tags, text: text ?? 'Listen and say it with me! Ask your teacher what this word means.' };
  }

  function showPopover(wordEl, w) {
    const def = lookupDefinition(w);
    pop.anchor = wordEl;
    pop.word = w;
    el.popWord.textContent = w.core;
    el.popTags.innerHTML = def.tags.map((t) =>
      `<span class="word-pop__tag" data-type="${t.type}">${escapeHtml(t.label)}</span>`).join('');
    el.popDef.textContent = def.text;
    el.pop.hidden = false;
    positionPopover();
    announce(`${w.core}. ${def.tags.map((t) => t.label.replace(/^\S+\s/, '')).join(', ')}. ${def.text}`);
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
      el.voiceSelect.closest('label').parentElement.hidden = true;
    }
    el.syncSelect.closest('label').hidden = !SHOW_SYNC_SETTING;
    renderSpeedControls();
    applyReadingMode();
    renderLevelFilters();
    updateStars();
    syncDrawerInert();
    window.addEventListener('hashchange', route);
    route();
  }

  init();
})();
