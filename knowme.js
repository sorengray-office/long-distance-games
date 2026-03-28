// How Well Do You Know Me? - Game Logic

// Comprehensive question bank (30 questions)
const QUESTIONS = [
  "What's my favorite color?",
  "What's my biggest pet peeve?",
  "What's my go-to comfort food?",
  "What time do I usually wake up on weekends?",
  "What's my favorite type of music?",
  "What's something I'm secretly really good at?",
  "What's my ideal vacation destination?",
  "What's my coffee/tea order?",
  "What's my biggest fear?",
  "What's my love language?",
  "What's a movie I can watch over and over?",
  "What's my favorite season?",
  "What's something that always makes me laugh?",
  "What's my dream job?",
  "What's my favorite way to relax?",
  "What's something I'm surprisingly passionate about?",
  "What's my favorite childhood memory?",
  "What's a habit I wish I could break?",
  "What's my favorite thing about you?",
  "What's something I'm working on improving?",
  "What's my go-to excuse when I don't want to do something?",
  "What's my favorite time of day?",
  "What's something that instantly puts me in a good mood?",
  "What's a compliment I love receiving?",
  "What's my biggest insecurity?",
  "What's something I'm proud of but don't talk about much?",
  "What's my favorite thing to do when I'm alone?",
  "What's a goal I have for the next year?",
  "What's something that makes me feel loved?",
  "What's one thing I couldn't live without?"
];

// Game state
let currentMode = 'local';
let currentQuestionIndex = 0;
let score = 0;
let answers = { E: '', G: '' };
let isRevealed = false;

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadGameState();
  displayQuestion();
});

function selectMode(mode) {
  if (mode === 'remote') {
    alert('Remote multiplayer coming soon! 🚀\n\nFor now, play together on the same device during a FaceTime call.');
    return;
  }
  
  currentMode = mode;
  
  // Update button states
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

function displayQuestion() {
  if (currentQuestionIndex >= QUESTIONS.length) {
    showGameComplete();
    return;
  }
  
  const question = QUESTIONS[currentQuestionIndex];
  document.getElementById('questionText').textContent = question;
  document.getElementById('questionNumber').textContent = 
    `Question ${currentQuestionIndex + 1} of ${QUESTIONS.length}`;
  
  // Update score display
  document.getElementById('scoreDisplay').textContent = score;
  
  // Reset inputs
  document.getElementById('answerE').value = '';
  document.getElementById('answerG').value = '';
  
  // Show input mode, hide reveal mode
  document.getElementById('inputMode').style.display = 'block';
  document.getElementById('revealMode').style.display = 'none';
  isRevealed = false;
  
  // Clear reveal boxes styling
  document.getElementById('revealE').className = 'player-answer-box';
  document.getElementById('revealG').className = 'player-answer-box';
  document.getElementById('matchIndicator').textContent = '';
}

function revealAnswers() {
  const answerE = document.getElementById('answerE').value.trim();
  const answerG = document.getElementById('answerG').value.trim();
  
  if (!answerE || !answerG) {
    alert('Both players need to answer first!');
    return;
  }
  
  // Store answers
  answers.E = answerE;
  answers.G = answerG;
  
  // Switch to reveal mode
  document.getElementById('inputMode').style.display = 'none';
  document.getElementById('revealMode').style.display = 'block';
  isRevealed = true;
  
  // Display answers
  document.getElementById('displayE').textContent = answerE;
  document.getElementById('displayG').textContent = answerG;
  
  // Check if answers match (case-insensitive, trimmed)
  const match = answerE.toLowerCase() === answerG.toLowerCase();
  
  // Update styling
  const boxE = document.getElementById('revealE');
  const boxG = document.getElementById('revealG');
  const indicator = document.getElementById('matchIndicator');
  
  if (match) {
    boxE.className = 'player-answer-box revealed match';
    boxG.className = 'player-answer-box revealed match';
    indicator.textContent = '✓ Perfect Match!';
    indicator.style.color = '#6BBF4A';
    score++;
  } else {
    boxE.className = 'player-answer-box revealed no-match';
    boxG.className = 'player-answer-box revealed no-match';
    indicator.textContent = '✗ Different Answers';
    indicator.style.color = '#D63B3B';
  }
  
  // Update score display
  document.getElementById('scoreDisplay').textContent = score;
  
  // Save state
  saveGameState();
}

function resetAnswers() {
  // Go back to input mode
  document.getElementById('inputMode').style.display = 'block';
  document.getElementById('revealMode').style.display = 'none';
  isRevealed = false;
  
  // Restore previous answers
  document.getElementById('answerE').value = answers.E;
  document.getElementById('answerG').value = answers.G;
}

function nextQuestion() {
  if (!isRevealed) {
    alert('Reveal answers first!');
    return;
  }
  
  currentQuestionIndex++;
  saveGameState();
  displayQuestion();
}

function showGameComplete() {
  document.getElementById('gameArea').style.display = 'none';
  document.getElementById('gameComplete').classList.add('visible');
  document.getElementById('finalScore').textContent = score;
  
  // Generate message based on score
  let message = '';
  const percentage = (score / QUESTIONS.length) * 100;
  
  if (percentage === 100) {
    message = '🌟 PERFECT SCORE! You two are completely in sync! Mind readers? Soulmates? Both? 💫';
  } else if (percentage >= 80) {
    message = '🎊 Incredible! You know each other SO well. That\'s some serious connection right there. 💖';
  } else if (percentage >= 60) {
    message = '✨ Great job! You\'ve got a solid understanding of each other. Keep learning! 🌱';
  } else if (percentage >= 40) {
    message = '💛 Not bad! There\'s still some mystery left to discover about each other. Adventure awaits! 🗺️';
  } else if (percentage >= 20) {
    message = '🌻 Plenty of room to grow! Every question is a chance to learn something new. Keep exploring! 🔍';
  } else {
    message = '🎈 Well, you certainly have a lot to talk about! Think of it as an adventure in getting to know each other better. 💬';
  }
  
  document.getElementById('completeMessage').innerHTML = message;
  
  // Clear saved state
  localStorage.removeItem('ge_knowme_state');
}

function restartGame() {
  currentQuestionIndex = 0;
  score = 0;
  answers = { E: '', G: '' };
  isRevealed = false;
  
  document.getElementById('gameArea').style.display = 'block';
  document.getElementById('gameComplete').classList.remove('visible');
  
  saveGameState();
  displayQuestion();
}

function saveGameState() {
  const state = {
    currentQuestionIndex,
    score,
    answers,
    isRevealed
  };
  localStorage.setItem('ge_knowme_state', JSON.stringify(state));
}

function loadGameState() {
  const saved = localStorage.getItem('ge_knowme_state');
  if (saved) {
    const state = JSON.parse(saved);
    currentQuestionIndex = state.currentQuestionIndex || 0;
    score = state.score || 0;
    answers = state.answers || { E: '', G: '' };
    isRevealed = state.isRevealed || false;
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Enter key to reveal/next
  if (e.key === 'Enter') {
    if (!isRevealed && currentQuestionIndex < QUESTIONS.length) {
      revealAnswers();
    } else if (isRevealed) {
      nextQuestion();
    }
  }
});
