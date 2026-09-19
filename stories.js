/**
 * StoryTime story collection.
 *
 * Loaded as a plain <script> (not fetched) so the app works both on GitHub Pages
 * and when index.html is opened straight from disk.
 *
 * Required fields per story:
 *   id          unique, URL-safe slug (used in the address bar: #/story/<id>)
 *   title       story title
 *   level       reading level shown on the badge ("Beginner", "Intermediate", "Advanced", ...)
 *   icon        an emoji for the story card
 *   text        the story; separate paragraphs with a newline (\n)
 *   dictionary  { "word": "kid-friendly meaning" }; these are the target words
 *
 * Optional fields (shown when present):
 *   author      "Written by" credit
 *   book        book / series name
 *   concept     phonics concept being practised
 *   rule        the spelling / phonics rule for this lesson
 *   redWords    sight words ("Red Words") to learn by heart
 *   vocabWords  the lesson's focus vocabulary (marked with a star in the Word Bank)
 *   characters  { "Name": "who they are" }; shown when a child double-clicks a name
 *   color       card background colour (any CSS colour)
 */
window.STORIES = [
  {
    "id": "bill-and-bess",
    "title": "Bill, Bess, Tiff, and Jazz",
    "level": "Beginner",
    "icon": "🏔️",
    "color": "#DFF5FF",
    "author": "Susan Clewis",
    "book": "Book 26 Fiction Volume 1",
    "concept": "Concept 33 (ss, ll, ff, zz)",
    "rule": "1-1-1 rule: One syllable, one short vowel, and the word ends with s, l, f, or z. Double the final consonant!",
    "redWords": ["a", "and", "do", "his", "is", "like", "said", "see", "the", "to", "went"],
    "vocabWords": ["chill", "fuss"],
    "text": "Bill can yell up the hill to Bess. Bill said to Bess, “That is a mess! Chill!”\nSo, Bess did chill on the hill. Then, Tiff went up the hill to see Bess.\nTiff had a fuss with Bess and said, “I do not like this mess, Bess.”\n“Jazz the dog did it and got his fuzz on me,” said Bess.\n“Get Jazz off the hill, and get that fuzz and mess up,” said Tiff.\nShe went off the hill in a huff. Bill said to Bess, Tiff, and Jazz, “Chill, chill, chill!”",
    "dictionary": {
      "yell": "To speak or shout very loudly.",
      "mess": "Untidy or dirty conditions.",
      "chill": "To relax and calm down.",
      "fuss": "A lot of unnecessary worry or excitement.",
      "fuzz": "Fluffy, short hairs or fibers.",
      "huff": "To be angry or annoyed.",
      "hill": "A place where the ground goes up high, like a small mountain."
    },
    "characters": {
      "Bill": "A boy in the story. He likes to yell!",
      "Bess": "Bill's friend. She chills on the hill.",
      "Tiff": "A girl who does not like the mess.",
      "Jazz": "The fuzzy dog who made the mess."
    }
  },
  {
    "id": "pip-and-the-big-fish",
    "title": "Pip and the Big Fish",
    "level": "Beginner",
    "icon": "🐟",
    "color": "#E3FBEF",
    "author": "StoryTime Team (sample story)",
    "concept": "Short i (CVC words)",
    "rule": "When a short word has one vowel between two consonants, the vowel usually makes its short sound: i as in pig.",
    "redWords": ["a", "and", "his", "I", "in", "said", "the", "was", "do"],
    "vocabWords": ["net", "slip"],
    "text": "Pip has a big red net. Pip and his dad sit on a dock. “I wish I had a fish,” said Pip.\nDad said, “Sit still, Pip. Do not kick.” Pip did sit still.\nThen, zip! The net did tip. A big fish was in it!\n“I did it! I got a fish!” said Pip. The fish did flip and flop.\nPip let the fish slip back in. “Swim, fish, swim!” said Pip.",
    "dictionary": {
      "net": "A bag made of string with holes, used to catch fish.",
      "dock": "A wooden path that goes out over the water.",
      "still": "Not moving at all.",
      "tip": "To lean over to one side.",
      "flip": "To turn over quickly.",
      "flop": "To fall or move in a floppy way.",
      "slip": "To slide away quickly and easily."
    },
    "characters": {
      "Pip": "A boy who wants to catch a fish.",
      "Dad": "Pip's dad. He helps Pip fish."
    }
  },
  {
    "id": "the-duck-in-the-truck",
    "title": "The Duck in the Truck",
    "level": "Intermediate",
    "icon": "🦆",
    "color": "#FFF3C9",
    "author": "StoryTime Team (sample story)",
    "concept": "Words ending in -ck",
    "rule": "After a short vowel at the end of a one-syllable word, the /k/ sound is spelled ck: duck, truck, sack.",
    "redWords": ["a", "the", "said", "of", "he", "what", "you", "my", "to", "was"],
    "vocabWords": ["peck", "chuckle"],
    "text": "Jack has a black truck. He packs it with a sack of rocks and a big clock.\n“Quack!” A duck is in the back of the truck! “What luck!” said Jack. “A duck in my truck!”\nThe duck did not like the rocks. It gave the sack a peck. Peck, peck, peck! The rocks fell out of the sack.\n“Stop that, Duck!” said Jack. The duck just sat on the clock and said, “Quack, quack!”\nJack had to chuckle. He gave the duck a snack and let it stick with him. “You can be my truck duck,” said Jack.",
    "dictionary": {
      "truck": "A big car that carries heavy things.",
      "sack": "A big, strong bag.",
      "quack": "The sound a duck makes.",
      "luck": "Something good that happens by chance.",
      "peck": "When a bird hits something quickly with its beak.",
      "chuckle": "To laugh quietly.",
      "snack": "A small bit of food between meals.",
      "stick": "To stay close to someone."
    },
    "characters": {
      "Jack": "A man with a black truck.",
      "Duck": "A duck who rides in Jack's truck."
    }
  }
];
