# G & E — Long Distance Games Website

## Complete Build Specification & Prompt

-----

## Overview

Build a private, two-player website for a long-distance couple (Ethan in Austin, TX and Garik in Hawaii). This is a surprise gift from Ethan to Garik. The site serves as both a love letter and a functional game hub - a place they visit together while on FaceTime to play games, answer deep questions, and build a shared memory wall over time.

This is NOT a product or SaaS app. It is an intimate, personal website built exclusively for two people. Every design decision should reflect that - it should feel like opening a handmade gift, not signing up for a service.

-----

## Brand & Visual Direction

A full brand guide HTML file is provided alongside this document. Reference it for all visual decisions. Here is a summary of the key brand principles:

### Aesthetic

- **Primary mood**: Vintage natural history museum meets nostalgic childhood candy aisle
- **Surfaces should feel tactile** - aged paper grain, specimen grid patterns, denim texture, forest camo. Nothing flat or sterile.
- **Dark backgrounds must be warm** - use espresso (#2C1E12), never pure black
- **The overall feeling is “collected, not designed”** - like a field journal full of things someone loves

### Color Palette

**Primary (The Earth):**

- Espresso: #2C1E12 (dark backgrounds, text)
- Forest: #2D4A2E (accents, nature elements)
- Amber: #C4883A (primary CTA color, warm highlights)
- Rust: #A0522D (secondary warm tone)
- Cream: #F5EDE0 (light backgrounds, cards)
- Denim: #4A6A8A (cool neutral, secondary elements)

**Accent (The Candy Aisle) - use sparingly for interactive moments:**

- Popsicle Red: #D63B3B
- Bomb Pop Blue: #3B7DD6
- Warhead Green: #6BBF4A
- Bubblegum: #E87DA0

### Typography

- **Headlines**: Playfair Display (900/Black for titles, 400/Italic for emphasis and personality)
- **Body text**: DM Sans (400 Regular for UI, 500/700 for emphasis)
- **Handwritten accents**: Caveat (for labels, callouts, polaroid captions, playful moments)
- Import all from Google Fonts

### Design Rules

- Use warm earthy tones as the foundation, candy-bright accents only as spice
- Surfaces need texture and depth - paper grain, subtle noise, fabric patterns
- Vintage illustration style for any decorative elements
- Handwritten type (Caveat) in small doses for personality
- Easter eggs referencing Garik’s interests throughout (cat memes, dinosaurs, insects, thrift finds)
- Fun bright pops of color are welcome - Garik’s style loves bold color
- AVOID: cold grays, sterile whites, neon gradients, generic SaaS aesthetic, Inter/Roboto fonts, flat textureless surfaces, pure black backgrounds, stock imagery

### Garik’s Interests (use for theming, word banks, Easter eggs)

- Dinosaurs (vintage illustration style)
- Entomology (specimen displays, field guides)
- Trail running (mountains, cross country)
- Cats & cat memes (TOP TIER - the weirder the better)
- Books (stacks on stacks)
- Sneakers (New Balance, fun bright colorways)
- Nostalgic snacks (Bomb Pops, Warheads, Hubba Bubba)
- Food (smoothies, Thai/Asian cuisine)
- Classical art (Renaissance, old masters)
- Vintage thrifting (baggy jorts, vintage zoo tees, Rainforest Cafe shirts, bright fun finds)

-----

## Site Architecture

The site has 5 main views:

### 1. The Reveal (Landing Page)

**Route**: `/`
**Purpose**: This is the gift-opening moment. Garik will open this link not knowing what it is.

**Requirements:**

- Minimal, emotional, and beautiful
- Display “G & E” prominently in the brand’s display typography (Playfair Display)
- A short, heartfelt tagline beneath it. Something like: “For the distance between us and everything we’re building across it.” (Ethan may want to customize this - make it easy to change.)
- Subtle background texture (aged paper or specimen grid pattern)
- A single CTA button to enter the site: “Come Inside” or “Open” styled in amber (#C4883A) with the brand button style
- Gentle entrance animation - fade in, maybe a slight reveal effect. Should feel like unwrapping something.
- Once entered, redirect to the Hub. Consider storing a simple flag so the reveal only shows in full the first time, and subsequent visits go straight to the hub (or show a simpler welcome).

**Do NOT include**: login forms, explanations of what the site is, feature lists, or anything that breaks the intimacy of the moment.

### 2. Authentication

**Purpose**: Keep this private to just Ethan and Garik.

**Requirements:**

- Simple authentication - this can be a shared passphrase/PIN entry rather than full user accounts, since only two people will ever use it
- After the reveal page, prompt for a simple code or passphrase to enter
- Store auth state in the browser so they don’t need to re-enter every visit
- Two user identities within the system: “E” (Ethan) and “G” (Garik). After auth, each person selects who they are. This identity is used for game scoring, the Polaroid wall attributions, and the “How Well Do You Know Me” answer tracking.
- Keep it lightweight - no email/password, no OAuth. A shared secret phrase that Ethan gives Garik when he reveals the gift.

### 3. The Hub (Home)

**Route**: `/hub` or `/home`
**Purpose**: The shared living room. This is where they land every time they visit.

**Layout and content:**

- A warm greeting at the top. Could use their names or initials. Consider time-awareness (good morning/evening based on time).
- **Austin ↔ Hawaii element**: A subtle visual showing the connection between their two locations. Could be text-based (“Austin, TX — 3,700 mi — Honolulu, HI”), a minimal illustrated line, or coordinates. Keep it understated but always present.
- **Three game cards**: Displayed in the brand’s specimen-cabinet style. Each card shows the game name, a short description, and a themed icon/emoji. Cards should feel like physical objects you want to pick up - slight shadow, texture, maybe a subtle hover lift animation.
  - Sketch & Guess
  - The Question Deck
  - How Well Do You Know Me?
- **Polaroid Wall section**: Below or alongside the games. A growing collection of uploaded photos rendered as polaroid-style cards. (Full spec in Feature section below.)
- The overall feel should be cozy and personal, not dashboard-like. Think of it as a page you’d want to just sit on for a moment.

### 4. Game Views (3 separate game pages)

Each game gets its own route and full-screen experience. Detailed specs below.

### 5. Polaroid Memory Wall

Can be a section within the Hub or its own dedicated page (recommend: section in Hub with a “See All” expansion to full page).

-----

## Game Specifications

All three games are designed to be played in real-time while on FaceTime. Both players are on the site simultaneously on their own devices.

### Real-Time Sync Approach

Since both players are on the site at the same time, you need a real-time sync mechanism. Options (choose based on your stack):

- **WebSocket-based**: Use a service like Supabase Realtime, Firebase Realtime Database, or Pusher for syncing game state between two clients
- **Simple polling with shared state**: If keeping infrastructure minimal, a shared room code with state stored in a lightweight backend (Supabase, Firebase, or even a simple serverless function + database)
- **Room system**: When starting a game, one player creates a room (generates a short code), the other joins with that code. Game state syncs between the two connected clients.

Recommend Firebase Realtime Database or Supabase for simplicity - free tier handles two users easily.

-----

### Game 1: Sketch & Guess

**Concept**: One person draws a prompt on a canvas, the other guesses what it is. Played on FaceTime so the guessing happens out loud, but the drawing canvas should be visible to both players in real-time.

**Flow:**

1. Both players join the game room
1. The game assigns a drawer and a guesser (alternates each round)
1. The drawer sees a word prompt on their screen (hidden from the guesser’s screen)
1. A countdown timer starts (60 seconds recommended, configurable)
1. The drawer sketches on a canvas using touch/mouse input
1. The drawing appears in real-time on the guesser’s screen
1. The guesser says their guess out loud on FaceTime. The drawer taps “Got It” when correct, or the timer runs out.
1. Score is tracked. Roles swap for the next round.
1. Play continues for a set number of rounds (suggest 10 rounds per game).

**Word Bank**: Themed to Garik’s interests. Include categories:

- Dinosaurs: T-Rex, Velociraptor, Triceratops, Pterodactyl, Stegosaurus, fossil, extinction, amber, skeleton, excavation
- Cats & Memes: cat loaf, zoomies, laser pointer, cardboard box, keyboard cat, ceiling cat, grumpy cat, hairball, catnip, toe beans
- Bugs & Nature: butterfly, beetle, dragonfly, ant colony, spider web, cocoon, firefly, mantis, centipede, caterpillar
- Trail Running: mountain, switchback, trail marker, water bottle, summit, sunrise run, mud, elevation, finish line, hydration pack
- Thrift & Style: baggy jorts, Hawaiian shirt, vintage tee, New Balance, fanny pack, bucket hat, tie-dye, corduroy, denim jacket, overalls
- Nostalgic Snacks: Bomb Pop, Warheads, Hubba Bubba, smoothie, gummy worm, popsicle, jawbreaker, Ring Pop, Fruit Roll-Up, Dunkaroos
- Wildcard: Rainforest Cafe, lava lamp, FaceTime, postcard, airplane, surfing, cactus, ukulele, sunset, boba tea

**Drawing Canvas:**

- Simple canvas with touch and mouse support
- Color palette: offer 6-8 colors that match the brand palette (espresso, forest, amber, rust, popsicle red, bomb pop blue, warhead green, bubblegum)
- Brush size toggle (small, medium, large)
- Clear canvas button
- Eraser tool
- Keep it simple - this is about fun bad drawings, not art tools

**UI:**

- Timer displayed prominently
- Current score for both players
- Round counter (e.g., “Round 3 of 10”)
- The drawer’s screen shows: the word prompt at top, canvas, drawing tools
- The guesser’s screen shows: the canvas (view-only), a “waiting for drawing…” state, the timer
- “Got It!” button for the drawer to confirm correct guess
- End-of-round animation showing the word and who got points
- End-of-game summary with final scores

-----

### Game 2: The Question Deck

**Concept**: A shared digital card deck with questions at three depth levels. Pull a card together, both answer out loud on FaceTime. This is the heart and soul game - designed for connection and curiosity.

**Flow:**

1. Both players join the game room
1. They see a card deck visual (styled like a vintage specimen card or field note card)
1. Three depth levels to choose from before each pull:
- **Level 1 - Light**: Fun, easy, icebreaker-style
- **Level 2 - Curious**: More thoughtful, reflective, interesting
- **Level 3 - Vulnerable**: Deep, emotional, relationship-building
1. Either player taps to select a level and draw a card
1. The card flips/reveals with an animation, showing the question to both players simultaneously
1. They discuss and answer on FaceTime (no typing needed)
1. When ready, either player draws the next card
1. No scoring - this is about conversation, not competition
1. Optional: a “Save This One” button that bookmarks a question they loved (stored and viewable later)

**Question Bank** (provide at least 30 per level, aim for 50+):

**Level 1 - Light:**

- What’s the worst thing you’ve ever found at a thrift store?
- If you could only eat one cuisine for a year, what would it be?
- What’s a song that always makes you want to dance?
- What was your favorite candy as a kid?
- Describe your perfect lazy Sunday.
- What’s the most useless talent you have?
- If you were a cat, what kind of cat would you be?
- What’s the best meal you’ve ever had?
- What’s your go-to order at a coffee shop?
- What movie could you watch on repeat forever?
- If you could live in any decade, which one?
- What’s the weirdest Wikipedia rabbit hole you’ve been down?
- Mountains or ocean?
- What’s the best thrift store find you’ve ever scored?
- What would your Rainforest Cafe order be?
- Early bird or night owl?
- What’s a hill you’ll die on that doesn’t matter at all?
- What’s the first concert you ever went to?
- What animal would you want as an unlikely pet?
- Describe yourself using only three emojis.
- What’s a food you hated as a kid but love now?
- What’s your comfort show?
- If you had to wear one outfit for the rest of your life, what would it be?
- What’s the most embarrassing thing in your search history?
- What would your walk-up song be?

**Level 2 - Curious:**

- What’s a memory you think about more often than you probably should?
- What’s something you’ve changed your mind about in the last year?
- If you could master any skill overnight, what would it be and why?
- What’s a compliment someone gave you that you still think about?
- When do you feel most like yourself?
- What’s something you wish more people asked you about?
- What’s a belief you hold that most people around you don’t share?
- If you could have dinner with anyone, living or dead, who and why?
- What’s a place that shaped who you are?
- What’s something about yourself that surprised you?
- What does “home” mean to you right now?
- When was the last time you were truly proud of yourself?
- What’s a small thing that brings you disproportionate joy?
- What’s a question you’ve been sitting with lately?
- What’s something you want to be better at?
- Is there a book, movie, or song that changed how you see the world?
- What’s the bravest thing you’ve done?
- How do you know when you trust someone?
- What’s something you’re curious about but have never explored?
- What’s a tradition you want to keep or start?
- Describe a moment where you felt completely at peace.
- What would you do with your life if money was irrelevant?
- What’s something that always makes you nostalgic?
- What do you value most in a friendship?
- What’s a part of your routine that’s secretly sacred to you?

**Level 3 - Vulnerable:**

- What are you most afraid of losing?
- What’s something you’ve never told me?
- When was the last time you cried and why?
- What’s an insecurity you’ve been carrying lately?
- What does love look like to you in practice, not theory?
- What do you need from me that you haven’t asked for?
- What’s a moment in our relationship that meant more to you than I probably realize?
- What’s the hardest thing about the distance?
- When do you feel most loved by me?
- What are you most proud of about us?
- Is there something you’ve been holding back from saying?
- What does commitment mean to you?
- What’s a fear you have about the future?
- What’s a wound from your past that still shows up sometimes?
- How do you handle loneliness?
- What part of yourself do you hide from most people?
- When do you feel safest?
- What do you need when you’re shutting down emotionally?
- What’s something about the distance that’s actually taught you something good?
- What do you want our life to look like in five years?
- What’s the hardest thing you’ve ever had to forgive?
- What makes you feel seen?
- Is there something you wish I understood better about you?
- What’s a promise you want to make to each other?
- What’s one thing you want us to never stop doing?

**Card UI:**

- Cards should look like vintage field note cards or museum specimen labels
- Cream/paper background with subtle texture
- The depth level indicated by a colored stripe on the card edge:
  - Level 1: Amber
  - Level 2: Forest green
  - Level 3: Deep rust
- Question text in Playfair Display (italic) for a warm, personal feel
- Card flip animation on reveal
- “Draw Another” button
- “Save This One” heart/bookmark icon
- Saved questions viewable from a separate “Saved” section

-----

### Game 3: How Well Do You Know Me?

**Concept**: A question appears about one player. Both players type their answer - the subject answers truthfully, the other guesses. Answers reveal simultaneously. Running score tracked across sessions.

**Flow:**

1. Both players join the game room
1. The game picks a “subject” (alternates each question)
1. A question appears: “What is [G/E]’s ___?”
1. The subject types their true answer
1. The guesser types what they think the subject’s answer is
1. Both submit. Answers are hidden until both are in.
1. Reveal animation shows both answers side by side
1. The subject judges: “Correct” or “Not quite” (since answers are typed, exact matching is too rigid - let the subject decide)
1. Points awarded for correct guesses
1. Running all-time score is stored and displayed (e.g., “E knows G: 47 | G knows E: 52”)
1. Play for a set number of rounds or until they want to stop

**Question Bank** (at least 50 questions, rotating):

- What is [name]’s comfort food?
- What is [name]’s biggest pet peeve?
- What would [name] grab first in a fire?
- What is [name]’s guilty pleasure show?
- What is [name]’s dream vacation destination?
- What was [name]’s favorite subject in school?
- What is [name]’s most-used emoji?
- What is [name]’s go-to karaoke song?
- What is [name]’s ideal weekend morning?
- What scares [name] the most?
- What is [name]’s favorite thing about themselves?
- What is [name]’s order at a Thai restaurant?
- Who is [name]’s celebrity crush?
- What makes [name] cry every time?
- What is [name]’s unpopular opinion?
- What would [name]’s last meal be?
- What annoys [name] more than it should?
- What is [name]’s happiest memory?
- What does [name] want to be remembered for?
- What’s [name]’s most-played song right now?
- What is [name]’s love language?
- What would [name] do with a free afternoon alone?
- What is [name]’s secret talent?
- What is [name]’s worst habit?
- What was [name]’s first impression of the other person?
- What keeps [name] up at night?
- What makes [name] laugh the hardest?
- What is [name]’s toxic trait?
- What would [name] never say no to?
- What’s the first thing [name] does in the morning?

**UI:**

- Question displayed prominently in Playfair Display
- Two answer input fields (both visible, but the other person’s answer is hidden/masked until reveal)
- A “Lock In” button to submit your answer
- Status indicators: “E is typing…” / “G has locked in”
- Reveal animation: answers slide in from each side, side by side
- “Correct” / “Not Quite” judgment buttons for the subject
- Running score displayed at top of game
- All-time score persisted across sessions
- End-of-game summary

-----

## Feature: Polaroid Memory Wall

**Concept**: A growing wall of photos uploaded by both Ethan and Garik, displayed as polaroid-style cards.

**Requirements:**

- Upload button accessible from the Hub
- When uploading, user can add a short caption (rendered in Caveat/handwritten font) and the date auto-fills
- Photos render as polaroid frames: white border (thicker at bottom for caption), slight random rotation (-3 to +3 degrees), drop shadow
- Each polaroid shows: the photo, the caption in handwritten font, the date, and who uploaded it (G or E)
- Photos arranged in a masonry or scattered layout on the wall
- Newest photos appear first, but the wall should feel organic, not grid-like
- Clicking a polaroid could enlarge it (lightbox)
- Storage: Use a cloud storage solution (Firebase Storage, Supabase Storage, or Cloudinary) for image uploads. Store metadata (caption, date, uploader) in the database.
- Keep upload size reasonable (compress on client-side before upload, max 5MB)

-----

## Technical Recommendations

### Stack Suggestions

- **Frontend**: React (Next.js or Vite) - component-based, good for the interactive games
- **Styling**: Tailwind CSS with custom theme tokens matching the brand guide, or CSS modules with CSS variables
- **Real-time sync**: Firebase Realtime Database or Supabase Realtime (both have generous free tiers, perfect for 2 users)
- **Auth**: Firebase Auth (anonymous auth with a PIN gate) or a simple passphrase check stored in the database
- **Image storage**: Firebase Storage or Supabase Storage
- **Database**: Firestore or Supabase Postgres for persistent data (scores, saved questions, polaroid metadata)
- **Hosting**: Vercel or Firebase Hosting
- **Drawing canvas**: HTML5 Canvas API or a library like react-canvas-draw for the Sketch & Guess game

### Data Model (simplified)

```
users/
  E: { name: "Ethan", lastActive: timestamp }
  G: { name: "Garik", lastActive: timestamp }

games/
  sketch-and-guess/
    rooms/{roomId}: { drawer, guesser, currentWord, roundNumber, scores, status }
  question-deck/
    saved/: [{ question, level, savedAt, savedBy }]
  know-me/
    rooms/{roomId}: { subject, question, answers, roundNumber, scores, status }
    allTimeScores: { E_knows_G: number, G_knows_E: number }

polaroids/
  {id}: { imageUrl, caption, date, uploadedBy, createdAt }
```

### Key Technical Notes

- All real-time game state lives in the room document and syncs via listeners
- Persistent data (all-time scores, saved questions, polaroids) lives in permanent collections
- The passphrase should be hashed and stored, not plaintext
- Image uploads should be compressed client-side before storage
- The site should be fully responsive (both will likely use phones on FaceTime)
- Canvas drawing data can sync via a simple point-stream (array of {x, y, color, size} objects pushed to the room document)

-----

## Deployment Notes

- This is a private site for 2 people. No SEO, no analytics, no cookies banner needed.
- A custom domain would be a nice touch for the gift (something personal like gandegames.com or similar)
- SSL/HTTPS is required (handled automatically by Vercel/Firebase Hosting)
- The site should work well on mobile Safari and Chrome (primary devices for FaceTime usage)

-----

## Summary of Pages/Routes

|Route       |Page                    |Description                                          |
|------------|------------------------|-----------------------------------------------------|
|`/`         |The Reveal              |Gift-opening landing page                            |
|`/enter`    |Auth                    |Passphrase entry + player selection (E or G)         |
|`/hub`      |The Hub                 |Home base with games, polaroid wall, personal touches|
|`/sketch`   |Sketch & Guess          |Drawing/guessing game with themed word banks         |
|`/questions`|The Question Deck       |Tiered depth question cards                          |
|`/knowme`   |How Well Do You Know Me?|Simultaneous answer/guess game with scoring          |
|`/wall`     |Memory Wall (optional)  |Full-page view of all polaroids                      |

-----

## Final Note for the AI Agent

This website is a love letter disguised as a game hub. Every pixel, every animation, every word choice should reflect that it was made by someone who cares deeply about the person who will open it. Lean into the warmth. Lean into the personality. Reference the brand guide for every visual decision. When in doubt, ask: “Would this make Garik smile?”

The brand guide HTML file contains the full color palette, typography system, texture references, interest map, and design do’s/don’ts. Use it as the single source of truth for all aesthetic choices.