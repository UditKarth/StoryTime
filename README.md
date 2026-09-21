# StoryTime 📖

A read-along web app for young ESL learners. Kids pick a story, listen while each word lights up, double-tap words to hear them and see their meaning, and earn a star (with confetti) when they finish.

It's plain HTML, CSS and JavaScript with no build step.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page markup. Loads Tailwind (CDN), Google Fonts, canvas-confetti, `stories.js` and `app.js` |
| `styles.css` | Playful design system: pill buttons, cards, word highlight, popover, drawer, toast |
| `stories.js` | The story collection (`window.STORIES = [...]`), Fiction Volume 1, Books 26–50 |
| `Stories/` | The source worksheet PDFs |
| `app.js` | Library, search, reader, speech engine, word popover, Word Bank, celebration |

## Run locally

Opening `index.html` directly works. To serve it instead:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to GitHub Pages

1. Push these files to the root of a GitHub repository.
2. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, and pick `main` / `(root)`.
3. The site will be at `https://<user>.github.io/<repo>/`.

Routing uses the URL hash (`#/story/<id>`), so direct links work without any server configuration.

## Adding a story

Add an object to `stories.js`. Only `id`, `title`, `level`, `icon`, `text` and `dictionary` are required.

```js
{
  "id": "bill-and-bess",                 // unique slug, used in the URL
  "title": "Bill, Bess, Tiff, and Jazz",
  "level": "Beginner",                   // any label; the filter chips are built from these
  "icon": "🏔️",
  "text": "First paragraph.\nSecond paragraph.",   // \n starts a new paragraph
  "dictionary": { "yell": "To speak or shout very loudly." },

  // optional
  "color": "#DFF5FF",                    // card colour
  "author": "Susan Clewis",
  "book": "Book 26 Fiction Volume 1",
  "concept": "Concept 33 (ss, ll, ff, zz)",
  "rule": "1-1-1 rule: …",
  "redWords": ["a", "and", "said"],      // sight words, coloured red in the text
  "greenWords": ["Bill", "hill", "mess"], // words that follow the lesson's concept, coloured green
  "vocabWords": ["chill", "fuss"],       // focus words, starred in the Word Bank
  "characters": { "Bill": "A boy in the story." }
}
```

Dictionary words are underlined in the story and matched with simple endings, so `packs` finds `pack`.

### Red Words and Green Words

- **Red Words** are the sight words listed on each worksheet. Copy them from the "Red Words" line. When the sheet writes `could (couldn’t)`, list both words.
- **Green Words** are the words in the story that follow that book's concept, such as the words ending in ss, ll, ff or zz for Book 26. The worksheets don't list them, so they were picked from each story by applying its concept. Edit `greenWords` to add or remove any.

Both colours are on by default. Readers can switch each one off with the 🔴 Red Words and 🟢 Green Words buttons, and the app remembers the choice. If a word is on both lists, it shows red.

### Levels

Levels are grouped by book number: Books 26–35 are **Beginner** (closed syllables and blends), 36–44 are **Intermediate** (y as a vowel, -ng/-nk, -ck, -tch, -dge, magic e, soft c/g, -ed), and 45–50 are **Advanced** (-s/-es, vowel teams, -ing, contractions). Change `level` on any story to regroup it; the filter chips update automatically.

## How the features work

- **Word by word (on by default).** Each word is spoken on its own, slowly, with a pause after it. Word by word reads at its own fixed pace (about 0.25 s between words, with extra pauses after commas, sentences and paragraphs), so the speed buttons are greyed out while it is on. Picking a speed switches Word by word off and reads whole sentences at that speed. To make word-by-word slower, lower `WORD_MODE.speed` in `app.js` (0.75 gives about 0.4 s between words, 0.5 about 0.7 s). Many voices say a lone "a" as the letter name ("ay") and a lone "the" as "thee", so in word-by-word reading the voice is told to say "uh" and "thuh" instead ("thee" before a vowel, as in "the end"). The page still shows the real word. The spellings are in `WORD_MODE.sayAlone` in `app.js`. Turn **Word by word** off to hear whole sentences read naturally, which is useful for fluency practice. The pause lengths and speech rates are in `WORD_MODE` and `wordRate()` in `app.js`.
- **Read-aloud with highlighting.** In sentence mode the app speaks one sentence at a time. This avoids Chrome's cut-off on long utterances and lets Pause, a speed change or a voice change pick up at the current word. Word `boundary` events drive the highlight. Some voices never fire them (for example Chrome's online "Google" voices). For those, the app estimates word timing, learns the voice's pace as it reads, and resyncs at every sentence, so expect it to be roughly in step rather than exact.
- **Highlight sync.** Word events fire when the speech engine produces a word, but the sound reaches the speakers a little later: a few milliseconds on built-in speakers, 150–300 ms on Bluetooth headphones and speakers. The app delays the highlight by the audio delay the browser reports. A **Sync** menu for setting the delay by hand is built in but hidden to keep the controls simple for students; set `SHOW_SYNC_SETTING = true` in `app.js` to show it. In that menu, **Auto** is the default; on Bluetooth, or if the highlight still runs ahead of the voice, a larger value (try 200 ms) helps. The choice is saved per device.
- **Double-click / double-tap a word.** Story playback pauses (Resume continues from that word), the word is spoken at a slower rate, and a popover shows its meaning. Meanings come from the story's `dictionary`, then `characters`, then `redWords`. Any other word shows "Listen and say it with me! Ask your teacher what this word means." To give a word a meaning, add it to that story's `dictionary`. Tablets get their own double-tap detection because `dblclick` is unreliable on iPadOS.
- **Keyboard.** The story is a single tab stop. Arrow keys move between words, and Enter or Space says the word. Search matches titles, book numbers ("book 30"), concepts ("blends") and target or Green Words. Space elsewhere plays or pauses, and Esc closes popovers and the drawer.
- **Saved in the browser.** Finished stories (stars), speed, voice, text size, and the Red Words, Green Words and Word by word toggles are kept in `localStorage`.
- **Reduced motion.** Confetti, the word scale-up and other animations are turned off when the device asks for reduced motion.

## Voices

The voice list shows English voices only and hides the joke voices macOS ships with (Bubbles, Zarvox, Grandma and so on). Natural-sounding voices are listed first, under **✨ Most natural**. Changing the voice plays a short "Hi! Let's read together." so you can hear it straight away.

How human the voice sounds depends on the device, so each classroom device may need a better voice installed:

- **Mac, iPad and iPhone:** open *System Settings → Accessibility → Spoken Content → System Voice → Manage Voices* (on iPad: *Settings → Accessibility → Spoken Content → Voices → English*). Download a **Premium** or **Enhanced** voice, such as *Ava (Premium)*, *Zoe (Premium)* or *Evan (Enhanced)*. Reload the page and it appears at the top of the list. Safari picks these up most reliably.
- **Windows or any computer with Microsoft Edge:** Edge includes free "Natural" neural voices (*Ava, Andrew, Emma, Brian…*) that sound very close to a real person. They need an internet connection.
- **Chrome:** the "Google US English" / "Google UK English" voices sound better than most built-in voices. They don't report word timing, so the app estimates it.

The app remembers the chosen voice on each device.

## Browser notes

- Chrome, Edge and Safari (macOS, iPadOS) have the best voices. Firefox works, but its voices depend on the operating system.
- iOS/iPadOS only allows speech that starts from a tap, so the first playback always begins with the Play button.
- The Tailwind Play CDN logs a "not for production" warning in the console. It's harmless here. If you'd rather avoid it, compile Tailwind once with the Tailwind CLI and swap the script for the generated CSS file.
