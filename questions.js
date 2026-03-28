// The Question Deck - Game Logic

// Comprehensive question bank
const QUESTIONS = {
  1: [ // Surface Level - Easy & Fun
    "What's your favorite way to spend a lazy Sunday?",
    "If you could have any superpower for a day, what would it be?",
    "What's the best meal you've ever had?",
    "Beach vacation or mountain retreat?",
    "What's your go-to karaoke song?",
    "Coffee or tea? (And how do you take it?)",
    "What movie can you watch over and over?",
    "What's your favorite season and why?",
    "If you could live in any decade, which one?",
    "What's the best gift you've ever received?",
    "Cats or dogs? (Or both? Or neither?)",
    "What's your comfort food?",
    "Morning person or night owl?",
    "What hobby would you love to pick up?",
    "What's the last thing that made you laugh really hard?",
    "If you could master any skill instantly, what would it be?",
    "What's your favorite way to celebrate a win?",
    "Indoor plants: yes or no?",
    "What's the best concert or live show you've been to?",
    "Sweet or savory?",
    "What's your favorite childhood memory?",
    "If you could teleport anywhere right now, where?",
    "What's the best piece of advice you've ever gotten?",
    "Favorite type of weather?",
    "What's something that always makes you smile?",
    "If you could have dinner with anyone, dead or alive, who?",
    "What's your ideal Friday night?",
    "Ocean, lake, or pool?",
    "What's a small luxury you love?",
    "Favorite holiday and why?"
  ],
  
  2: [ // Deeper - Getting Real
    "What's something you're working on improving about yourself?",
    "What does home mean to you?",
    "What's a belief you held strongly but changed your mind about?",
    "What's your relationship with failure?",
    "When do you feel most like yourself?",
    "What's something you're afraid of that most people don't know?",
    "What does success look like to you?",
    "What's a life lesson you learned the hard way?",
    "How do you handle stress or overwhelm?",
    "What makes you feel most alive?",
    "What's something you wish people understood about you?",
    "How do you define love?",
    "What's a dream you've given up on, and why?",
    "What's your relationship with your past?",
    "When do you feel most creative?",
    "What's something you need that you're not getting enough of?",
    "What does authenticity mean to you?",
    "What's a value that's non-negotiable for you?",
    "How do you want to be remembered?",
    "What's something that brings you peace?",
    "What's your biggest internal conflict right now?",
    "When was the last time you felt truly proud of yourself?",
    "What's a sacrifice you've made that you don't regret?",
    "How do you show love to others?",
    "What's something you're grateful for today?",
    "What does vulnerability mean to you?",
    "What's a question you wish someone would ask you?",
    "How have you changed in the last year?",
    "What's something you're still figuring out?",
    "What do you need to hear right now?"
  ],
  
  3: [ // Deep End - Vulnerable
    "What's your greatest fear about the future?",
    "When have you felt most alone, and what did you learn from it?",
    "What's a wound you're still healing from?",
    "What do you wish you could tell your younger self?",
    "What's something you've never said out loud?",
    "What's the hardest truth you've had to accept?",
    "When have you felt most seen by another person?",
    "What's your relationship with forgiveness?",
    "What's something you're ashamed of but shouldn't be?",
    "What do you need to let go of?",
    "When have you disappointed yourself?",
    "What's a part of yourself you've tried to hide?",
    "What does intimacy mean to you?",
    "What's your deepest insecurity?",
    "When did you first realize you were enough?",
    "What's something you've lost that you still grieve?",
    "What would you do if you knew you couldn't fail?",
    "What's a promise you made to yourself that you broke?",
    "When have you felt most courageous?",
    "What's a burden you're carrying that you don't have to?",
    "What do you wish you could change about your past?",
    "What's the most important thing you've learned about love?",
    "When have you felt most broken?",
    "What's something you're terrified to hope for?",
    "What does healing look like for you?",
    "What's a truth about yourself you're afraid to admit?",
    "What do you need to forgive yourself for?",
    "When have you felt most connected to another person?",
    "What's something you wish someone had told you sooner?",
    "What's your deepest wish for your life?"
  ]
};

// Game state
let currentLevel = 1;
let currentQuestion = null;
let usedQuestions = { 1: [], 2: [], 3: [] };
let savedQuestions = [];
let isFlipped = false;

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  updateSavedList();
});

function selectLevel(level) {
  currentLevel = level;
  
  // Update button states
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.level-btn.level-${level}`).classList.add('active');
  
  // Update card styling
  const cardFront = document.getElementById('cardFront');
  cardFront.className = `card-face card-front level-${level}`;
  
  // Update label
  const labels = {
    1: 'Surface Level',
    2: 'Deeper Level',
    3: 'Deep End'
  };
  document.getElementById('cardLabel').textContent = labels[level];
  
  // Reset card if currently showing a question
  if (currentQuestion) {
    document.getElementById('questionText').textContent = 'Click "Draw Card" for a new question';
    currentQuestion = null;
    updateBookmarkButton();
  }
  
  // Un-flip card if flipped
  if (isFlipped) {
    flipCard();
  }
}

function drawNewCard() {
  // Get available questions for current level
  let available = QUESTIONS[currentLevel].filter(q => !usedQuestions[currentLevel].includes(q));
  
  // Reset if all questions used
  if (available.length === 0) {
    usedQuestions[currentLevel] = [];
    available = [...QUESTIONS[currentLevel]];
  }
  
  // Pick random question
  currentQuestion = available[Math.floor(Math.random() * available.length)];
  usedQuestions[currentLevel].push(currentQuestion);
  
  // Update display
  document.getElementById('questionText').textContent = currentQuestion;
  
  // Un-flip if currently flipped
  if (isFlipped) {
    flipCard();
  }
  
  // Update bookmark button
  updateBookmarkButton();
  
  // Save state
  saveState();
  
  // Animate card
  const card = document.getElementById('questionCard');
  card.style.animation = 'none';
  setTimeout(() => {
    card.style.animation = 'fadeIn 0.6s ease-out';
  }, 10);
}

function flipCard() {
  if (!currentQuestion) return;
  
  const card = document.getElementById('questionCard');
  isFlipped = !isFlipped;
  
  if (isFlipped) {
    card.classList.add('flipped');
  } else {
    card.classList.remove('flipped');
  }
}

function toggleBookmark() {
  if (!currentQuestion) {
    alert('Draw a card first!');
    return;
  }
  
  const questionData = {
    level: currentLevel,
    text: currentQuestion
  };
  
  // Check if already saved
  const existingIndex = savedQuestions.findIndex(q => 
    q.text === currentQuestion && q.level === currentLevel
  );
  
  if (existingIndex !== -1) {
    // Remove from saved
    savedQuestions.splice(existingIndex, 1);
  } else {
    // Add to saved
    savedQuestions.push(questionData);
  }
  
  updateBookmarkButton();
  updateSavedList();
  saveState();
}

function updateBookmarkButton() {
  const btn = document.getElementById('bookmarkBtn');
  const icon = document.getElementById('bookmarkIcon');
  const text = document.getElementById('bookmarkText');
  
  if (!currentQuestion) {
    btn.classList.remove('saved');
    icon.textContent = '🔖';
    text.textContent = 'Save This One';
    return;
  }
  
  const isSaved = savedQuestions.some(q => 
    q.text === currentQuestion && q.level === currentLevel
  );
  
  if (isSaved) {
    btn.classList.add('saved');
    icon.textContent = '✓';
    text.textContent = 'Saved!';
  } else {
    btn.classList.remove('saved');
    icon.textContent = '🔖';
    text.textContent = 'Save This One';
  }
}

function updateSavedList() {
  const list = document.getElementById('savedList');
  
  if (savedQuestions.length === 0) {
    list.innerHTML = '<li style="text-align: center; color: var(--cream); opacity: 0.6;">No saved questions yet</li>';
    return;
  }
  
  const levelLabels = {
    1: 'Surface',
    2: 'Deeper',
    3: 'Deep End'
  };
  
  const levelColors = {
    1: '#C4883A', // amber
    2: '#2D4A2E', // forest
    3: '#A0522D'  // rust
  };
  
  list.innerHTML = savedQuestions.map((q, index) => `
    <li class="saved-item" style="border-left-color: ${levelColors[q.level]}">
      <div>
        <small style="opacity: 0.7; text-transform: uppercase; font-size: 0.75rem;">${levelLabels[q.level]}</small>
        <div>${q.text}</div>
      </div>
      <button class="remove-btn" onclick="removeSaved(${index})" title="Remove">×</button>
    </li>
  `).join('');
}

function removeSaved(index) {
  savedQuestions.splice(index, 1);
  updateSavedList();
  updateBookmarkButton();
  saveState();
}

function shuffleDeck() {
  // Reset all used questions
  usedQuestions = { 1: [], 2: [], 3: [] };
  alert('Deck shuffled! All questions are back in play. 🔄');
  saveState();
}

function saveState() {
  const state = {
    usedQuestions: usedQuestions,
    savedQuestions: savedQuestions
  };
  localStorage.setItem('ge_questions_state', JSON.stringify(state));
}

function loadSavedState() {
  const saved = localStorage.getItem('ge_questions_state');
  if (saved) {
    const state = JSON.parse(saved);
    usedQuestions = state.usedQuestions || { 1: [], 2: [], 3: [] };
    savedQuestions = state.savedQuestions || [];
  }
}
