/**
 * StoryTime story collection (Fiction Volume 1, Books 26–50).
 *
 * Loaded as a plain <script> (not fetched) so the app works both on GitHub Pages
 * and when index.html is opened straight from disk. Stories appear in the order listed here.
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
 *   redWords    sight words ("Red Words") to learn by heart; coloured red in the story
 *   greenWords  words that follow this lesson's concept ("Green Words"); coloured green in the story
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
    "greenWords": ["Bill", "yell", "hill", "Bess", "mess", "chill", "Tiff", "fuss", "fuzz", "off", "huff", "Jazz"],
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
    "id": "seth-dad-and-the-fish",
    "title": "Seth, Dad, and the Fish",
    "level": "Beginner",
    "icon": "🐟",
    "color": "#FFE3EC",
    "author": "Susan Clewis",
    "book": "Book 27 Fiction Volume 1",
    "concept": "Concept 34 (Compound Words)",
    "rule": "A compound word is two small words put together to make a new word: cat + fish = catfish.",
    "redWords": ["a", "and", "blue", "do", "for", "good", "have", "is", "put", "said", "the", "to", "want", "you"],
    "greenWords": ["catfish", "catnip", "bathtub", "dishpan", "cannot", "upset"],
    "vocabWords": ["catfish", "catnip"],
    "text": "Dad said to Seth, “I have a blue fish and a catfish for you. Put the catfish in the bathtub,” said Dad.\n“But Dad, I want to put the blue fish in the bathtub,” said Seth.\nDad said, “No, Seth, it will not be good to put the blue fish with the catfish. You cannot do that. It will upset the catfish if the blue fish is in the bathtub. The catfish will get mad at the blue fish. You can put the blue fish in the dishpan,” said Dad.\n“Yes,” said Seth, “I will put the blue fish in the dishpan. The catfish will fit in the bathtub. He is big, and the blue fish is not. I will get catnip for the catfish,” said Seth.\n“No,” said Dad. “Catnip is for a cat, not a fish.”\n“So, no catnip for the catfish, Dad?” said Seth.\n“No catnip for the catfish,” said Dad.",
    "dictionary": {
      "catfish": "A fish with long whiskers, like a cat.",
      "catnip": "A plant that cats love to sniff and play with.",
      "bathtub": "A big tub you sit in to take a bath.",
      "dishpan": "A pan you wash dishes in."
    },
    "characters": {
      "Seth": "A boy who gets two fish.",
      "Dad": "Seth's dad. He gives Seth the fish."
    }
  },
  {
    "id": "jill-and-dennis-make-a-muffin",
    "title": "Jill and Dennis Make a Muffin",
    "level": "Beginner",
    "icon": "🧁",
    "color": "#E3FBEF",
    "author": "Susan Clewis",
    "book": "Book 28 Fiction Volume 1",
    "concept": "Concept 35 (Closed/Open Two-Syllable Words)",
    "rule": "Split a two-syllable word into its parts. A closed syllable ends with a consonant, so its vowel is short (muf-fin). An open syllable ends with a vowel, so its vowel says its name (ba-sic, jum-bo).",
    "redWords": ["a", "and", "do", "done", "for", "good", "have", "help", "like", "put", "said", "see", "the", "there", "they", "to", "want", "was", "went", "were", "you"],
    "greenWords": ["muffin", "picnic", "Dennis", "nutmeg", "basic", "jumbo", "jello", "basket", "sunset", "upset"],
    "vocabWords": ["jumbo", "nutmeg"],
    "text": "Jill and Dennis had to have a muffin for a picnic. There was no muffin mix, so they had to go to a shop to get a mix.\nWhen they got to the shop, Jill said, “I want a muffin mix with nutmeg in it.”\nDennis said that he did not like nutmeg.\nJill said, “It will be good in the muffin mix.”\nJill was upset that there was not a mix with nutmeg. They had to get a basic muffin mix and get nutmeg to put in the mix. Dennis said to Jill, “I will go get the nutmeg. Do you want a jumbo bag?”\nJill said, “Yes, get a jumbo bag. I will go get jello.” Jill got the jello and went to get Dennis.\n“Help me, Jill. I do not see the nutmeg!” said Dennis.\nJill said to him, “Dennis, I see the nutmeg.” She put a jumbo bag of nutmeg in the basket. They got in the van to go.\nIt was fun to put the nutmeg in the muffin mix. When the jello and muffin were done, Jill put them in the picnic basket.\nDennis said to Jill, “Let us go on a picnic. We can see the sunset on the hill.” Jill and Dennis got in the van and went to the hill. They had a picnic and got to see the sunset.",
    "dictionary": {
      "jumbo": "Very big.",
      "nutmeg": "A brown spice that makes food taste warm and sweet.",
      "picnic": "A meal you eat outside.",
      "sunset": "When the sun goes down in the evening."
    },
    "characters": {
      "Jill": "A girl who wants a nutmeg muffin.",
      "Dennis": "Jill's friend. He does not like nutmeg."
    }
  },
  {
    "id": "a-trip-for-brin",
    "title": "A Trip for Brin",
    "level": "Beginner",
    "icon": "🚌",
    "color": "#FFF3C9",
    "author": "Susan Clewis",
    "book": "Book 29 Fiction Volume 1",
    "concept": "Concept 36 (Beginning R Blends)",
    "rule": "In an r blend, two consonants sit together and you hear both sounds: br, cr, dr, fr, gr, pr, tr.",
    "redWords": ["a", "and", "for", "from", "her", "said", "see", "the", "to", "was", "went", "you"],
    "greenWords": ["Brin", "Gram", "Fran", "trip", "Brad", "brat", "grin", "grab", "grub", "drum", "trumpet", "drab"],
    "vocabWords": ["drab", "grub"],
    "text": "Brin got a trip from her Gram, Fran. Brin said, “It will be a trip on a bus. I will see if I can go. Mom and Dad, can I go on a trip to see Gram?”\nMom said, “Yes, you can go.”\nDad said, “Brad the dog can go with you. He will want to see Gram.”\nBrin got the stuff for Brad for the trip to see Gram. “Brad will not be a brat,” Brin said. “It will be fun.” Brin had a grin.\nBrin got her stuff. Brin and Brad will grab grub for the trip.\nBrin and Brad went on the bus. A man with a drum and trumpet sat on the bus. It was fun to see the drum and trumpet. Brin had a grin.\nBrin and Brad got to hug Gram. The trip was not drab. It was fun!",
    "dictionary": {
      "drab": "Dull and boring.",
      "grub": "A funny word for food.",
      "brat": "A child who behaves badly.",
      "grin": "A big smile."
    },
    "characters": {
      "Brin": "A girl who takes a bus trip.",
      "Gram": "Brin's grandma. Her name is Fran.",
      "Fran": "Gram's name.",
      "Brad": "Brin's dog."
    }
  },
  {
    "id": "glen-and-the-sled",
    "title": "Glen and the Sled",
    "level": "Beginner",
    "icon": "🛷",
    "color": "#EDE6FF",
    "book": "Book 30 Fiction Volume 1",
    "concept": "Concept 37 (Beginning L Blends)",
    "rule": "In an l blend, two consonants sit together and you hear both sounds: bl, cl, fl, gl, pl, sl.",
    "redWords": ["a", "and", "blue", "do", "down", "his", "into", "is", "said", "the", "to", "was", "went"],
    "greenWords": ["Glen", "sled", "slip", "slid", "slam", "bled"],
    "vocabWords": ["brush", "sled"],
    "text": "Glen went to the big hill with his blue sled. He was with his mom. He went down the hill on the sled. Mom said, “Do not slip on the hill.”\nGlen went down, down, down the hill! The sled did slip. The sled slid down the hill. Glen and the sled went slam into the brush.\nGlen bled on his leg. Mom ran to Glen. “It is not a bad cut, Glen,” said Mom.\n“I am OK,” said Glen. “I still had fun!”\nGlen and Mom went down the hill.",
    "dictionary": {
      "brush": "Lots of small bushes and plants growing close together.",
      "sled": "A board you ride on to slide down a snowy hill.",
      "slam": "To hit something hard.",
      "bled": "When blood came out of a cut."
    },
    "characters": {
      "Glen": "A boy who rides his blue sled.",
      "Mom": "Glen's mom."
    }
  },
  {
    "id": "the-skit-and-the-muffin",
    "title": "The Skit and the Muffin",
    "level": "Beginner",
    "icon": "🎭",
    "color": "#FFE6D6",
    "book": "Book 31 Fiction Volume 1",
    "concept": "Concept 38 (Beginning S Blends)",
    "rule": "In an s blend, s sits next to another consonant and you hear both sounds: sk, sm, sn, sp, st, sw.",
    "redWords": ["a", "and", "do", "done", "for", "good", "have", "his", "is", "my", "now", "of", "oven", "said", "the", "to", "want", "was", "went", "you"],
    "greenWords": ["Stan", "skit", "step", "skip", "snap", "spin", "sniff", "smell"],
    "vocabWords": ["skit"],
    "text": "Stan began to do a skit for his mom and dad. He said, “Step in so I can do a skit for you.” Mom and Dad went in to see the skit.\nStan did his skit. “I will skip, snap, and spin,” he said. Then Stan got a sniff of a good smell. “That is a good smell,” said Stan.\nMom said, “I have a big muffin in the oven.” Stan and Dad got a sniff. The smell was good.\nThe muffin was done. Mom said, “Stan, can we have the muffin now?”\nStan said, “Let us have the muffin. My skit is done. The smell is so good.”\nStan, Mom, and Dad had the muffin.",
    "dictionary": {
      "skit": "A short, funny play.",
      "sniff": "To breathe in through your nose to smell something."
    },
    "characters": {
      "Stan": "A boy who puts on a skit.",
      "Mom": "Stan's mom. She bakes a muffin.",
      "Dad": "Stan's dad."
    }
  },
  {
    "id": "a-dog-a-grill-and-a-hot-dog",
    "title": "A Dog, a Grill, and a Hot Dog",
    "level": "Beginner",
    "icon": "🌭",
    "color": "#DFF5FF",
    "author": "Susan Clewis",
    "book": "Book 32 Fiction Volume 1",
    "concept": "Concept 39 (Beginning W Blends)",
    "rule": "In a w blend, a consonant sits next to w and you hear both sounds: dw, sw, tw.",
    "redWords": ["a", "and", "both", "do", "for", "from", "have", "his", "of", "one", "or", "park", "put", "said", "saw", "some", "the", "to", "want", "was", "went", "what"],
    "greenWords": ["twig", "dwell", "swig"],
    "vocabWords": ["Crisco", "pop"],
    "text": "Stan and his dog, Spot, went to the park for fun. The park had a twig for Stan to toss to Spot.\nStan had a hot dog to grill. He had to get the grill hot for his hot dog. Then he had to put some Crisco® on the grill for the hot dog. The Crisco® was in his van. He went to the van to get the Crisco®.\nSpot the dog saw the hot dog. Spot did want a hot dog. Spot got a sniff of the hot dog. He ran to grab it from the grill.\nStan said, “Stop, Spot! Drop that hot dog!” Spot did not stop or drop the hot dog. Spot ran to the trash can to drop the hot dog in it. Then he ran back to Stan at the van.\n“What will we do?” Stan said to Spot. “I have one hot dog. I will not dwell on it.” Spot was sad. “We can have one hot dog, Spot,” said Stan.\nStan put the hot dog on the grill until it was hot. “We can both have a hot dog,” said Stan. “Then we can have a swig of pop. What fun we had at the park!” said Stan.",
    "dictionary": {
      "crisco": "A kind of cooking fat, so food does not stick.",
      "pop": "A fizzy, sweet drink. Also called soda.",
      "twig": "A small, thin stick from a tree.",
      "dwell": "To keep thinking about something.",
      "swig": "A big gulp of a drink."
    },
    "characters": {
      "Stan": "A boy who goes to the park.",
      "Spot": "Stan's dog. He loves hot dogs!"
    }
  },
  {
    "id": "kent-went-on-a-rant",
    "title": "Kent Went on a Rant",
    "level": "Beginner",
    "icon": "⛺",
    "color": "#FFE3EC",
    "book": "Book 33 Fiction Volume 1",
    "concept": "Concept 40 (Ending T Blends)",
    "rule": "In a t blend, t comes at the end after another consonant and you hear both sounds: -nt, -st, -ft, -lt, -ct.",
    "redWords": ["a", "and", "could", "for", "from", "have", "his", "is", "my", "over", "said", "the", "to", "want", "was", "were", "would", "you"],
    "greenWords": ["Kent", "felt", "melt", "plant", "wilt", "cast", "fact", "draft", "pact", "rant", "dentist", "trust", "tent"],
    "vocabWords": ["draft", "pact", "rant", "wilt"],
    "text": "Kent felt he would melt from the hot sun. Even the plant began to wilt from the sun.\n“I wish I could swim, but my leg is in a cast,” said Kent. The fact was that he could not swim. “I want to yell and rant,” said Kent. He said, “If I draft a pact with Mom, I will not go on a rant.”\nThe pact said that if he could have Brad and Fred over to grill, he would not rant. Brad and Fred were at the dentist and could not grill with Kent. Kent began to rant.\nHis mom said, “If I can trust that you will stop the rant, we can plan a trip in a tent.”\nKent was glad for the pact with his mom. The cast did not stop them from a tent trip.",
    "dictionary": {
      "draft": "To write down a first try of something.",
      "pact": "A promise or deal between people.",
      "rant": "To talk in a loud, angry way for a long time.",
      "wilt": "When a plant droops because it is hot or dry.",
      "cast": "A hard cover that keeps a broken bone still."
    },
    "characters": {
      "Kent": "A boy with a cast on his leg.",
      "Mom": "Kent's mom.",
      "Brad": "Kent's friend.",
      "Fred": "Kent's friend."
    }
  },
  {
    "id": "the-glass-of-spilt-milk",
    "title": "The Glass of Spilt Milk",
    "level": "Beginner",
    "icon": "🥛",
    "color": "#E3FBEF",
    "book": "Book 34 Fiction Volume 1",
    "concept": "Concept 41 (Ending L Blends)",
    "rule": "In an l blend at the end of a word, l comes before another consonant and you hear both sounds: -ld, -lk, -lf, -lp, -lt.",
    "redWords": ["a", "and", "for", "her", "of", "my", "out", "some", "the", "there", "to", "want", "was"],
    "greenWords": ["held", "milk", "shelf", "felt", "yelp", "help", "spilt"],
    "vocabWords": ["huff", "lap"],
    "text": "Kim held the jug of skim milk. She said, “I want milk with my hot dog, but I can not get a glass off the top shelf.” Dad felt sad for Kim, so he got the glass off the shelf for her.\nWhen Dad left, Kim held the glass to get the milk. The cat, Fred, sat on the dishpan to get the milk. When Kim got the milk, Fred let out a yelp. Then there was a spill.\nKim ran off in a big huff and left the mess for Dad. Fred sat in the mess and got the milk. Dad ran in to help but let Fred lap up the milk.\nDad did not want Kim to be upset, so he got her a cup of milk and a hot dog. Kim was not upset with Fred and the glass of spilt milk.",
    "dictionary": {
      "huff": "To be angry or annoyed.",
      "lap": "To drink by licking, like a cat.",
      "yelp": "A short, sharp cry.",
      "spilt": "Fell out of a cup by accident."
    },
    "characters": {
      "Kim": "A girl who wants milk.",
      "Dad": "Kim's dad.",
      "Fred": "Kim's cat."
    }
  },
  {
    "id": "fun-at-the-pond",
    "title": "Fun at the Pond",
    "level": "Beginner",
    "icon": "🐸",
    "color": "#FFF3C9",
    "author": "Susan Clewis",
    "book": "Book 35 Fiction Volume 1",
    "concept": "Concept 42 (Ending Blends)",
    "rule": "In an ending blend, two consonants sit together at the end of a word and you hear both sounds: -nd, -mp, -nt, -st, -sk, -lp, -nch.",
    "redWords": ["a", "both", "day", "do", "down", "for", "have", "his", "into", "is", "of", "out", "put", "said", "saw", "see", "some", "the", "there", "they", "to", "want", "was", "you"],
    "greenWords": ["camp", "pond", "tent", "went", "grand", "fast", "jump", "hunch", "lunch", "lunchbox", "gulp", "milk", "brisk", "wind", "windmill", "swept", "slept"],
    "vocabWords": ["brisk", "hunch", "windmill"],
    "text": "Levi and Sam went to camp at the pond. They put up the tent.\nIt was a grand day to go to the pond. So Levi and Sam went to the pond for a swim. They got into the pond.\nLevi said, “Do you see that frog?” They both saw the frog. The frog had to hop fast to get out of the pond. Levi and Sam had to jump out of the pond. They ran to the tent.\n“I have a hunch that Levi will want lunch,” Sam said to himself. Sam went to get his lunchbox. He had a muffin and a cup of milk for both of them.\nLevi had a gulp of milk and a fresh muffin. Some of the muffin fell on the grass and in the tent.\n“Let us get this mess in the trash can and go to the pond for a swim,” said Sam. Sam swept the muffin out of the tent and into the trash can. “We can go for a swim,” said Sam. Into the pond they went.\nLevi said, “Sam, there is a windmill on the hill. The wind is brisk, but we can still swim.”\nThey swam and swam until the sun went down. Then Levi and Sam slept in the tent.",
    "dictionary": {
      "brisk": "Cool and fresh.",
      "hunch": "A feeling or guess about something.",
      "windmill": "A tall building with big blades that the wind turns.",
      "gulp": "A big swallow."
    },
    "characters": {
      "Levi": "Sam's friend. They camp at the pond.",
      "Sam": "Levi's friend. He brings lunch."
    }
  },
  {
    "id": "the-shy-fly",
    "title": "The Shy Fly",
    "level": "Intermediate",
    "icon": "🪰",
    "color": "#EDE6FF",
    "book": "Book 36 Fiction Volume 1",
    "concept": "Concept 43 (y as a vowel /ī/)",
    "rule": "When y comes at the end of a short word, it can say the long i sound: my, shy, fly.",
    "redWords": ["a", "all", "could", "do", "from", "have", "his", "is", "of", "people", "said", "the", "there", "to", "under", "want", "was", "who", "would", "you"],
    "greenWords": ["shy", "fly", "cry", "try", "sky", "my"],
    "vocabWords": ["fly", "shy"],
    "text": "There was a shy fly who would cry a lot. His mom said, “It is OK. You do not have to be shy and cry. Just try.”\nHe said, “I could try not to be shy. I do not want to cry.”\nDid the fly try not to be shy? Yes! When he was in the sky, he said hi to all of the people under him.\nMom said, “My fly, you did it! You said hi and did not cry.”\n“Yes, Mom,” said the shy fly. “I did it with help from you. I am still shy, but I will try.”",
    "dictionary": {
      "fly": "A small bug with wings. It can also mean to move through the air.",
      "shy": "Feeling nervous around other people."
    }
  },
  {
    "id": "frank-and-hank",
    "title": "Frank and Hank",
    "level": "Intermediate",
    "icon": "🎤",
    "color": "#FFE6D6",
    "author": "Susan Clewis",
    "book": "Book 37 Fiction Volume 1",
    "concept": "Concept 44 (-ng, -nk)",
    "rule": "ng and nk come at the end of a word: sing, song, honk, wink.",
    "redWords": ["a", "as", "day", "good", "have", "his", "like", "over", "play", "said", "saw", "see", "sign", "the", "there", "they", "to", "was", "what", "where", "would", "you"],
    "greenWords": ["Frank", "Hank", "Tank", "songfest", "sing", "sang", "song", "ring", "honk", "wink", "blink", "rink", "king", "long", "drink"],
    "vocabWords": ["pop", "ring", "rink", "songfest"],
    "text": "Frank and Hank went to a songfest. They saw a sign that said, “Honk if you like to sing!” So the horn went honk, and Hank began to sing.\nHank sang a song. “Ring, Ring, Ring Went the Bell” was his song. It was a fun song to sing. Next, Frank sang a song. “Frank the Tank” was his song. His song was not good. With a wink, and in a blink, Hank had to help Frank with his song so it would be good.\nWhen they got to the songfest, Hank said, “Frank, I see the big rink where the band will play. Let us go see the band.”\nIn the rink, there was a man who had on a hat like a king. He had to stand in the rink and sing. The band began to play with the man as he sang. The song was so long.\nIt was a hot day. Frank and Hank went to get a drink. They had to get to a drink stand. Hank said, “I see a drink stand at the end of the rink.” The drink was $3.00. They did not have cash.\nThe man at the drink stand said, “You can just have the pop. You do not have to have cash.” The pop was good, and the songfest was over.\n“What a good day we had,” said Frank.\n“Yes,” said Hank, “it was a good day.”",
    "dictionary": {
      "pop": "A fizzy, sweet drink. Also called soda.",
      "ring": "The sound a bell makes.",
      "rink": "A big, flat place for skating or shows.",
      "songfest": "A party where people sing lots of songs.",
      "honk": "The loud sound a car horn makes."
    },
    "characters": {
      "Frank": "Hank's friend. His song was not good.",
      "Hank": "Frank's friend. He loves to sing."
    }
  },
  {
    "id": "the-black-pickup-truck",
    "title": "The Black Pickup Truck",
    "level": "Intermediate",
    "icon": "🛻",
    "color": "#DFF5FF",
    "author": "Susan Clewis",
    "book": "Book 38 Fiction Volume 1",
    "concept": "Concept 45 (-ck)",
    "rule": "After a short vowel at the end of a one-syllable word, the /k/ sound is spelled ck: truck, dock, Jack.",
    "redWords": ["a", "as", "could", "for", "from", "good", "has", "his", "into", "is", "one", "of", "out", "put", "should", "some", "the", "there", "they", "to", "was", "way", "which", "would", "you", "your"],
    "greenWords": ["Jack", "black", "pickup", "truck", "dock", "back", "shack", "flock", "Rick", "quack"],
    "vocabWords": ["flock", "landfill"],
    "text": "Jack has a big black pickup truck. He will get some mulch to put by the dock at the pond. He went to the landfill to get the mulch.\nWhen he got to the landfill, Jack had to back up to the shack, which was in the back of the landfill. He had to get the mulch into his truck. There was no one to help him.\nThe mulch was so wet. It was not fun for him with no one to help dump the mulch into the bed of the truck. At last, he got the mulch into the truck bed. He left the landfill with the mulch and went back to the pond.\nHis buddy Rick was back at the pond to help him with the mulch. But Jack could not get to the dock. There was a flock that would not get out of the way.\nJack had to stop and honk to get the flock to go. They did not go. He got out of the truck and began to yell at the flock. They began to quack. It was a big mess!\nJack ran to get the flock out of the way, but he fell flat on his back. He got up as the flock began to run. He got the truck next to the dock. Jack and his buddy Rick got the mulch off the truck bed. They put the mulch next to the dock.\n“It is good, Rick,” said Jack. “Thank you for your help.”",
    "dictionary": {
      "flock": "A group of birds.",
      "landfill": "A place where trash is taken and buried.",
      "mulch": "Bits of wood or leaves put on the ground around plants.",
      "shack": "A small, simple hut."
    },
    "characters": {
      "Jack": "A man with a black pickup truck.",
      "Rick": "Jack's buddy. He helps with the mulch."
    }
  },
  {
    "id": "mitch-and-rick-catch-fish",
    "title": "Mitch and Rick Catch Fish",
    "level": "Intermediate",
    "icon": "🎣",
    "color": "#FFE3EC",
    "book": "Book 39 Fiction Volume 1",
    "concept": "Concept 46 (-tch)",
    "rule": "After a short vowel, the /ch/ sound at the end of a word is often spelled tch: catch, latch.",
    "redWords": ["a", "as", "both", "for", "have", "is", "now", "of", "said", "the", "to", "want", "what", "you"],
    "greenWords": ["Mitch", "catch", "latch", "match"],
    "vocabWords": ["latch", "match"],
    "text": "Mitch and Rick went to the pond to catch fish. Mitch said, “My mom sent a basket with a snack for both of us. We can have the snack at the pond.”\nRick said, “My dad sent a box with a latch.”\n“What is in the box?” said Mitch.\nRick said, “It is stuff to catch the fish. It is a net and a stick with a plastic fly at the end.”\nMitch said, “Let us open the latch so we can catch the fish.”\nRick said, “Let us have the snack as well.” Mitch and Rick had the snack. “Now let us catch the fish,” said Rick.\nRick said, “I want to match the fish you catch!” Mitch got ten fish. Rick got six fish.\nMitch and Rick had fun at the pond and got a lot of fish.",
    "dictionary": {
      "latch": "A small lock that keeps a box or door shut.",
      "match": "To do the same as someone else."
    },
    "characters": {
      "Mitch": "Rick's friend. He catches ten fish.",
      "Rick": "Mitch's friend. He catches six fish."
    }
  },
  {
    "id": "the-batch-of-fudge",
    "title": "The Batch of Fudge",
    "level": "Intermediate",
    "icon": "🍫",
    "color": "#E3FBEF",
    "author": "Susan Clewis",
    "book": "Book 40 Fiction Volume 1",
    "concept": "Concept 47 (-dge)",
    "rule": "After a short vowel, the /j/ sound at the end of a word is spelled dge: fudge, bridge.",
    "redWords": ["a", "all", "as", "chair", "could", "done", "down", "for", "from", "good", "have", "of", "out", "oven", "over", "put", "said", "saw", "see", "some", "the", "there", "to", "today", "was", "were", "what", "would"],
    "greenWords": ["bridge", "dodge", "fudge", "edge", "judge"],
    "vocabWords": ["batch", "ditch", "judge"],
    "text": "My mom said there would be a snack for me today. When I got off the bus, I ran as fast as I could. I went over the bridge and the ditch.\nWhen I got in, I had to dodge a dog that was in my path. I ran to Mom. She got a hug from me.\nI could see that Mom had a box mix for fudge. She had to mix a cup of milk in with it and put it in a pan.\nMom put the pan of fudge in the oven. I could smell it! It was a good smell.\nMom got the fudge out of the oven when it was done. I sat down on the edge of a chair. Mom got me a glass of milk and some fudge. It was so good. Mom saw me grin.\nIt was a good snack. If I had to judge, my mom would win for best fudge! We will have all the fudge and drink the milk.",
    "dictionary": {
      "batch": "A group of things made at the same time.",
      "ditch": "A long, narrow hole in the ground.",
      "judge": "To decide who is the best.",
      "dodge": "To move out of the way quickly."
    },
    "characters": {
      "Mom": "She makes a batch of fudge."
    }
  },
  {
    "id": "mike-at-the-rink",
    "title": "Mike at the Rink",
    "level": "Intermediate",
    "icon": "🛼",
    "color": "#FFF3C9",
    "author": "Susan Clewis",
    "book": "Book 41 Fiction Volume 1",
    "concept": "Concept 48 (Magic E)",
    "rule": "Magic e at the end of a word is silent, but it makes the vowel before it say its name: bik → bike, mak → make.",
    "redWords": ["a", "all", "around", "day", "done", "first", "for", "going", "good", "his", "is", "of", "one", "out", "said", "see", "some", "the", "there", "they", "to", "was", "were", "who", "would", "you"],
    "greenWords": ["Mike", "rode", "bike", "home", "make", "take", "bake", "skate", "drove", "entire", "came", "game", "prize", "five", "line", "Kate", "made", "cupcake", "time", "smile"],
    "vocabWords": ["dash", "event"],
    "text": "Mike rode his bike home. He had to make a snack to take to an event. He was going to skate at a rink. The snack had to bake. When it was done, his mom drove him to the rink to skate.\nWhen they got to the rink, Mike said, “Mom, I see my entire class.” He got out and ran to see them.\n“Hello,” said Mike. “This is going to be a fun time for all of us.”\nThey came up with a game. They had to skate around the rink and not trip to win a prize. They all began to skate. One by one they fell as they went around the rink. There were five who did not trip.\nTo see who would win, Mike said, “Let us see who can skate fast. The one who is around the rink first will win.” They all got in a line.\nThen Mike had his mom say, “1, 2, 3, GO!” The five went fast. Mike was one of the five. They all went so fast. Some fell. Some made a mad dash to the finish line. Mike and Kate got there first.\nKate came in first. Kate got the prize. Mike said to Kate, “Good job, Kate! That was a good contest!”\nThey all had a cupcake that Mike made for them. At last, it was time to go home. Mike said with a big smile, “Thank you all for a fun day!”",
    "dictionary": {
      "dash": "To run very fast.",
      "event": "A special thing that happens, like a party or a race.",
      "entire": "All of it; the whole thing.",
      "prize": "Something you win."
    },
    "characters": {
      "Mike": "A boy who goes skating.",
      "Kate": "A girl in Mike's class. She wins the race."
    }
  },
  {
    "id": "kelly-and-the-tiny-pony",
    "title": "Kelly and the Tiny Pony",
    "level": "Intermediate",
    "icon": "🐴",
    "color": "#EDE6FF",
    "book": "Book 42 Fiction Volume 1",
    "concept": "Concept 49 (y as a vowel /ē/)",
    "rule": "When y comes at the end of a longer word, it can say the long e sound: happy, tiny, pony.",
    "redWords": ["a", "all", "could", "for", "from", "good", "her", "his", "is", "of", "said", "saw", "see", "the", "to", "want", "was", "you"],
    "greenWords": ["baby", "babysit", "babysat", "Kelly", "happy", "lucky", "tiny", "pony", "fussy", "suddenly", "simply"],
    "vocabWords": ["fussy", "lucky", "panic", "suddenly"],
    "text": "Maxwell had to babysit. He had babysat in the past and was good at it.\nKelly the baby was happy all the time. Kelly did not cry. Maxwell said, “I am lucky that baby Kelly is so happy.”\nKelly had a tiny plastic pony. Maxwell could not locate the pony. Suddenly, Kelly began to get fussy. Maxwell did not want to panic, but he simply did not want to see the baby cry.\nHe did not see the pony by the crib. He did not see the pony by the bathtub. Maxwell did not see the pony by the blanket. Kelly was so fussy!\nAt last, Maxwell saw the tiny plastic pony. Lucky the dog had it in his bed. “No, Lucky,” said Maxwell. “That is not for you. That is for Kelly.”\nMaxwell got the tiny pony from Lucky. Maxwell gave the pony to Kelly. The baby was not fussy! Kelly was happy.",
    "dictionary": {
      "fussy": "Upset and hard to make happy.",
      "lucky": "Having good things happen to you.",
      "panic": "To get very scared and worried all at once.",
      "suddenly": "All at once, very quickly.",
      "babysit": "To take care of a child while the parents are away."
    },
    "characters": {
      "Maxwell": "A boy who babysits Kelly.",
      "Kelly": "A happy baby with a tiny pony.",
      "Lucky": "A dog. He took the pony!"
    }
  },
  {
    "id": "the-race",
    "title": "The Race",
    "level": "Intermediate",
    "icon": "🏃",
    "color": "#FFE6D6",
    "author": "Susan Clewis",
    "book": "Book 43 Fiction Volume 1",
    "concept": "Concept 50 (Soft c and g)",
    "rule": "When c or g comes before e, i or y, it makes a soft sound: c says /s/ (race, city) and g says /j/ (stage).",
    "redWords": ["a", "center", "could", "day", "done", "down", "from", "going", "her", "his", "look", "of", "put", "saw", "see", "the", "they", "to", "too", "was", "were", "where", "would"],
    "greenWords": ["race", "city", "Nancy", "Geffry", "stage", "brace", "face", "ice", "success"],
    "vocabWords": ["pothole", "sibling", "success"],
    "text": "The day of the race was here! Geffry was happy to run in the city race. His sibling, Nancy, was going to run too.\nNancy and Geffry went to the stage where the race would begin. Then they got in line. The fake race gun gave a blast, and off they went. Nancy ran fast.\nNancy saw that Geffry was in the back. She did not look to see where she was going. She did not see the pothole on the path.\nNancy fell. She put her hand down to brace herself and protect her face from the pavement. By the time Geffry got to her, she was up.\nShe had a cut in the center of her hand, and her leg was red. It was not too bad, so Nancy kept on with the race. She could get ice and help for her hand and leg when she was done.\nGeffry and Nancy were done with the race. They did not win a prize, but they were glad they did not quit. Geffry gave Nancy a hug. The race was a success!",
    "dictionary": {
      "pothole": "A hole in a road or path.",
      "sibling": "A brother or sister.",
      "success": "When something goes well.",
      "brace": "To get ready to hold yourself up."
    },
    "characters": {
      "Geffry": "A boy who runs in the race.",
      "Nancy": "Geffry's sister. She falls but keeps going."
    }
  },
  {
    "id": "max-and-the-glass",
    "title": "Max and the Glass",
    "level": "Intermediate",
    "icon": "🧹",
    "color": "#DFF5FF",
    "author": "Susan Clewis",
    "book": "Book 44 Fiction Volume 1",
    "concept": "Concept 51 (Suffix -ed)",
    "rule": "The suffix -ed shows something already happened. It can say /t/ (asked), /d/ (yelled) or /ed/ (wanted).",
    "redWords": ["a", "are", "as", "could", "for", "from", "good", "have", "his", "into", "of", "or", "said", "should", "some", "the", "to", "want", "what", "you", "your"],
    "greenWords": ["happened", "yelled", "wanted", "asked", "helped", "brushed", "dumped", "commented"],
    "vocabWords": ["dustpan", "plastic"],
    "text": "Crash! Bang! Bam!\n“What happened?” yelled Mom.\n“I made a glass drop from the shelf, and it broke,” said Max. “I just wanted to get milk before I went to bed.”\n“Are you OK?” asked Mom. “You should have asked for some help, Max. Dad or I could have helped you get the glass.”\nMom wanted to yell at Max, but she did not. Mom said, “Let me help with the mess of glass. It can cut your hand.” Mom brushed up the glass into a dustpan. She went to the trash can to dump the glass.\nMax held the trash can lid open for Mom as she dumped the glass into the can. Mom commented to Dad on what a good job Max did.\nDad said, “Yes, Max did a good job!”\n“Next time, you can get the plastic cup, or you can ask for help,” said Mom. “The plastic will not cut you.”\n“Thank you, Mom. It was good that you helped me,” said Max. “The glass would have cut my hand. Next time, Mom, I will ask you or Dad for help or get a plastic cup to drink my milk.”\nMax got a plastic cup for the milk from the shelf so he could have a drink before he went to bed. He drank his cup of milk and went to bed.\n“Thank you, Mom. The milk was good,” said Max. Max went to bed and slept well.",
    "dictionary": {
      "dustpan": "A flat pan you sweep dirt or broken things into.",
      "plastic": "A strong material that does not break like glass.",
      "commented": "Said something about it."
    },
    "characters": {
      "Max": "A boy who drops a glass.",
      "Mom": "Max's mom. She helps clean up.",
      "Dad": "Max's dad."
    }
  },
  {
    "id": "the-shops",
    "title": "The Shops",
    "level": "Advanced",
    "icon": "🛍️",
    "color": "#FFE3EC",
    "book": "Book 45 Fiction Volume 1",
    "concept": "Concept 52 (Suffix -s, -es)",
    "rule": "Add -s or -es to show more than one, or to show what someone does. Use -es after s, x, sh, ch: dishes, foxes, wishes.",
    "redWords": ["a", "all", "another", "are", "around", "both", "boy", "could", "for", "girl", "good", "has", "have", "is", "look", "love", "of", "one", "people", "see", "the", "their", "they", "to", "use", "would"],
    "greenWords": ["shops", "bathtubs", "socks", "cribs", "swings", "moms", "dads", "things", "sells", "bells", "pens", "rings", "dishes", "dolls", "lashes", "gifts", "boys", "girls", "likes", "snacks", "cakes", "cupcakes", "puffs", "muffins", "loves", "cats", "dogs", "frogs", "snakes", "wishes", "foxes", "thinks", "lots"],
    "vocabWords": ["fancy", "lashes", "puffs"],
    "text": "Kalin and Leron opened shops in the city. They had a lot of shops to see.\nAt one shop, they sell baby things like bathtubs, socks, cribs, and swings. Moms and dads like to go see all of the baby things. The shop has lots of things moms and dads can use.\nAnother shop sells fancy things like bells, pens, rings, dishes, dolls, bling, and lashes. This shop is good for gifts. They have things for both boys and girls.\nKalin likes the shop that sells snacks. They sell cakes, cupcakes, puffs, muffins, and candy. They are all so yummy! She loves to go inside and smell them.\nLeron likes the pet shop with cats, dogs, frogs, and snakes. He wishes they could sell foxes, but that would be silly. He thinks the pet shop is a fun place to look around.\nKalin and Leron have a lot of shops for lots of people. Their shops are fun to explore!",
    "dictionary": {
      "fancy": "Very pretty and special.",
      "lashes": "The little hairs on the edge of your eyelids.",
      "puffs": "Soft, light snacks or pastries.",
      "bling": "Shiny, sparkly jewelry."
    },
    "characters": {
      "Kalin": "She opened shops. She likes the snack shop.",
      "Leron": "He opened shops. He likes the pet shop."
    }
  },
  {
    "id": "jean-and-brinlee-at-the-beach",
    "title": "Jean and Brinlee at the Beach",
    "level": "Advanced",
    "icon": "🏖️",
    "color": "#E3FBEF",
    "author": "Susan Clewis",
    "book": "Book 46 Fiction Volume 1",
    "concept": "Concept 53 (ea, ee)",
    "rule": "ee and ea are vowel teams. They usually say the long e sound: beach, deep, sweet.",
    "redWords": ["a", "all", "as", "day", "first", "for", "from", "give", "have", "of", "one", "out", "over", "said", "saw", "some", "the", "there", "they", "to", "too", "want", "was", "wash", "were", "what", "where", "would"],
    "greenWords": ["Brinlee", "beach", "breeze", "deep", "team", "seagull", "seagulls", "sweet", "peanuts", "peanut", "treat", "eat", "clear", "sea", "cleaned", "clean", "least", "sneak", "needed", "tea", "coffee"],
    "vocabWords": ["seagull", "sunshade", "tide", "timid"],
    "text": "It was a sunny day, so Brinlee and I drove to the shore. When we got there, we went to the beach. The sand was hot, but the breeze was nice. We dug a hole deep in the sand for the sunshade.\nWe saw a big team of seagulls on the sand and rocks. I said, “They see us, too, Brinlee.”\nI had a bag of sweet peanuts with me as a treat. I began to think that the seagulls would like to have some peanuts. The one seagull on the rock saw the peanuts and ran over to us. He made it clear that he wanted a peanut! Then, they all began to run to us.\nI was a bit timid to give them some at first, but I gave the seagulls the peanuts to eat. They made a mess. They ate the peanuts but left the shells on the beach.\nThe tide came up to where the peanut shells were left by the seagulls. Just then, a big wave crashed on the shells and washed them out to sea. The waves cleaned all of the shells off the beach. At least the beach was clean.\nThe gulls wanted peanuts, but I had given them all from the bag. I had to sneak to the trash can to get rid of the peanut bag.\nIt was time to go home. I needed tea, and Brinlee needed coffee. We left for the drive back home. What a fun day at the beach!",
    "dictionary": {
      "seagull": "A white and gray bird that lives near the sea.",
      "sunshade": "A big umbrella that keeps the sun off you.",
      "tide": "The rising and falling of the sea on the beach.",
      "timid": "Shy and a little scared."
    },
    "characters": {
      "Jean": "She tells the story (she is “I”). She feeds the seagulls.",
      "Brinlee": "Jean's friend at the beach."
    }
  },
  {
    "id": "the-hayride",
    "title": "The Hayride",
    "level": "Advanced",
    "icon": "🎃",
    "color": "#FFF3C9",
    "author": "Susan Clewis",
    "book": "Book 47 Fiction Volume 1",
    "concept": "Concept 54 (ai, ay)",
    "rule": "ai and ay are vowel teams. They say the long a sound. Use ai in the middle of a word and ay at the end: day, hay.",
    "redWords": ["a", "all", "around", "as", "could", "down", "first", "for", "going", "his", "look", "of", "one", "or", "orange", "over", "pull", "said", "saw", "school", "the", "their", "there", "they", "to", "tractor", "was", "were", "what", "where", "would", "you"],
    "greenWords": ["Friday", "Jayvon", "hayride", "delay", "freeway", "day", "hay", "lay", "play", "swayed"],
    "vocabWords": ["bales", "buggy", "delay", "freeway", "sway"],
    "text": "It was Friday, and Jayvon was set to go to a pumpkin patch with his class for a hayride. He was going to school on the bus. There was a delay on the freeway, so he was late. By the time he got to school, his classmates were on the bus that would take them to the pumpkin patch.\nWhen they got to the pumpkin patch, Jayvon and the rest of his class got off the bus. The first thing they saw was a tractor with a big buggy. There was a pile of hay bales in the buggy. “This is where you will sit,” said the man on the tractor. “Just sit on the hay. Do not lay down or play around.”\nThe kids got on the buggy and sat on the hay. The tractor began to pull the buggy. There were a lot of bumps on the path. The kids swayed with each bump.\nThe man on the tractor said, “Hang on!” They kept going until they came to a big pumpkin patch. All they could see were orange pumpkins all over the place! The man on the tractor said, “You can all take one pumpkin home.”\nJayvon said to his class, “Let us go get a pumpkin!” They all got one to take home. They got back on the buggy, and the tractor kept going down the path.\nThe man on the tractor made a stop and said, “Shhh, look at the deer by the trees!” The kids were all silent. The tractor began to go again, and the kids held their pumpkins as it went down the path.\nWhen they finished the ride, they got on the bus and went back to school. What a fun day for a hayride!",
    "dictionary": {
      "bales": "Big bundles of hay tied up tight.",
      "buggy": "A wagon that people ride in, pulled by a tractor.",
      "delay": "When something makes you late.",
      "freeway": "A big, fast road for cars.",
      "sway": "To move slowly from side to side."
    },
    "characters": {
      "Jayvon": "A boy who goes on a hayride with his class."
    }
  },
  {
    "id": "doe-tracks",
    "title": "Doe Tracks",
    "level": "Advanced",
    "icon": "🦌",
    "color": "#EDE6FF",
    "author": "Susan Clewis",
    "book": "Book 48 Fiction Volume 1",
    "concept": "Concept 55 (oa, oe)",
    "rule": "oa and oe are vowel teams. They say the long o sound: boat, doe, hoe.",
    "redWords": ["a", "again", "are", "as", "could", "from", "going", "her", "into", "of", "said", "saw", "the", "there", "to", "too", "want", "was", "were", "would", "you"],
    "greenWords": ["doe", "hoe", "Roscoe", "Moe", "Joe"],
    "vocabWords": ["doe", "hoe", "rake", "trail", "wail"],
    "text": "Friday, when I came home from school, Roscoe was on my steps. He gave me a wave as I got off the bus. Roscoe said, “Let us go to the trail to see if there are doe tracks.”\nI went inside to tell my dad that I was home and we were going to the trail. Dad said “OK, Joe. I will be in the back if you need me.” He went to get a rake and hoe. I asked Dad if we could take Moe, my dog, with us. He said, “Yes, but keep him close to you. A doe and her baby were on the trail, and Moe will chase them.”\nRoscoe and I went on the trail with Moe. A lot of tree branches were on the trail path. A branch broke to the left of us.\n“Shhhh,” I said. I saw the doe and her baby by a tree. I held on to Moe. Roscoe crept close to the doe to see if he could pet her.\nRoscoe got too close, and the doe wailed! The doe and baby ran deep into the trees.\n“Let us go back home. I want to tell my dad,” I said.\nWhen we got back, Dad was there. “We saw the doe and baby!” we yelled.\nDad said, “That was fun! Maybe the next time you go, you will see them again.”\nRoscoe and I said, “Yes, we would like that.”",
    "dictionary": {
      "doe": "A mother deer.",
      "hoe": "A garden tool for digging.",
      "rake": "A garden tool for pulling leaves together.",
      "trail": "A path through the woods.",
      "wail": "To make a long, loud cry."
    },
    "characters": {
      "Joe": "The boy telling the story.",
      "Roscoe": "Joe's friend.",
      "Moe": "Joe's dog.",
      "Dad": "Joe's dad."
    }
  },
  {
    "id": "the-fun-weekend",
    "title": "The Fun Weekend",
    "level": "Advanced",
    "icon": "🏕️",
    "color": "#FFE6D6",
    "book": "Book 49 Fiction Volume 1",
    "concept": "Concept 56 (Suffix -ing)",
    "rule": "The suffix -ing shows something is happening now or keeps happening: sing → singing, fish → fishing.",
    "redWords": ["a", "again", "all", "any", "around", "both", "every", "everything", "for", "friend", "from", "good", "have", "our", "said", "the", "there", "to", "want", "was", "were", "what"],
    "greenWords": ["needing", "going", "honking", "singing", "camping", "fixing", "sleeping", "grilling", "sniffing", "smelling", "eating", "drinking", "fishing", "catching", "relaxing", "playing", "wishing"],
    "vocabWords": ["pop"],
    "text": "My friend Ross and I were needing to have a fun weekend trip. We were going on a Friday.\nWe were going to a quiet place outside of the city. We were so happy to go that we began honking and singing on our way there. We were going to have a nice time!\nWe went camping. Ross spent time fixing up the tent. He got the sleeping bags in the tent. At last, the campsite was all set up for us. We had everything we needed.\nWhile Ross was fixing up the tent, I was grilling the meal. Ross was sniffing the good smell. He said, “Ray, I am smelling a good meal. I am hungry.”\nBefore long, we were eating hot dogs and drinking pop. Next, we went fishing with our rods in the pond by the campsite. We did not have any luck catching fish, but it was still so relaxing.\nWe spent lots of time playing music and singing around the campfire. It was so much fun! We were wishing that we did not have to go back to the city. This trip was just what we had needed. We both want to go camping again next year!",
    "dictionary": {
      "pop": "A fizzy, sweet drink. Also called soda.",
      "relaxing": "Calm and restful.",
      "campsite": "A place where you put up a tent."
    },
    "characters": {
      "Ray": "He tells the story.",
      "Ross": "Ray's friend. He sets up the tent."
    }
  },
  {
    "id": "a-plan-for-a-hike",
    "title": "A Plan for a Hike",
    "level": "Advanced",
    "icon": "🥾",
    "color": "#DFF5FF",
    "book": "Book 50 Fiction Volume 1",
    "concept": "Concept 57 (Contractions with am, is, are, has, not)",
    "rule": "A contraction joins two words and uses an apostrophe (’) for the missing letters: that is → that’s, did not → didn’t.",
    "redWords": ["a", "all", "are", "been", "could", "couldn’t", "for", "forgot", "friend", "has", "hasn’t", "have", "her", "his", "is", "of", "one", "other", "our", "said", "should", "shouldn’t", "the", "there", "to", "was", "who", "would", "you"],
    "greenWords": ["that’s", "I’m", "didn’t"],
    "vocabWords": ["compact", "exclaim", "hike"],
    "text": "Dean, Brandy, and I are best friends. We like to spend time with each other on weekends, so we made plans to take a big hike.\nDean is the best one to plan the trail, so that’s his job. Brandy is the best one to plan the meal, so that’s her job. I’m the best one to plan the packing, so that’s my job.\nWe each began to plan. Suddenly, Dean asked, “Did one of you rent the truck?”\n“We forgot!” we exclaimed. We had to take so much stuff that we would need a truck to get it all there.\nBrandy had a friend, Beth, who had a truck. We had asked her to go, but she couldn’t go that weekend. “Shouldn’t we plan a weekend when Beth can go?” I asked. We need her truck, and it will be fun to have her with us.\nWe picked a weekend that Beth could go and began the plans. Beth hasn’t been on a long hike, so this will be fun! She was glad we picked a date that she can go.\nWe made all of our plans, and that’s when it was time to go! We packed our things in compact bags, so we didn’t need to take the truck. Off we went on the long hike!",
    "dictionary": {
      "compact": "Small and packed tight.",
      "exclaim": "To say something loudly and suddenly.",
      "hike": "A long walk, often in nature."
    },
    "characters": {
      "Dean": "A friend who plans the trail.",
      "Brandy": "A friend who plans the meal.",
      "Beth": "Brandy's friend with a truck."
    }
  }
];
