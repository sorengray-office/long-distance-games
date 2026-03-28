// Sketch & Guess Game Logic

// Word bank - comprehensive list with variety
const WORD_BANK = [
  // Animals & Nature
  "cat", "dog", "dinosaur", "butterfly", "elephant", "giraffe", "octopus", "penguin",
  "turtle", "rabbit", "snake", "frog", "bee", "ladybug", "dragonfly", "snail",
  "mountain", "tree", "flower", "cactus", "mushroom", "leaf", "rainbow", "cloud",
  "sun", "moon", "star", "ocean", "river", "waterfall",
  
  // Food & Drinks
  "pizza", "taco", "burger", "sushi", "ice cream", "donut", "cake", "cookie",
  "banana", "apple", "strawberry", "watermelon", "pineapple", "avocado",
  "coffee", "tea", "smoothie", "popcorn", "candy", "chocolate",
  
  // Objects & Things
  "guitar", "camera", "bicycle", "car", "airplane", "boat", "rocket", "umbrella",
  "sunglasses", "hat", "backpack", "book", "pencil", "laptop", "phone",
  "clock", "lamp", "chair", "house", "castle", "tent", "bridge",
  
  // Activities & Concepts
  "running", "dancing", "reading", "sleeping", "cooking", "swimming", "hiking",
  "meditation", "yoga", "painting", "writing", "singing",
  
  // Nostalgic & Fun
  "arcade game", "skateboard", "roller skates", "balloon", "kite", "fireworks",
  "treasure chest", "pirate ship", "robot", "alien", "ghost", "wizard",
  
  // garrick's Interests (easter eggs)
  "trail running shoes", "thrift store find", "vintage camera", "field journal",
  "fossilized bone", "specimen jar", "hiking trail", "observation notes",
  
  // Abstract & Challenging
  "friendship", "distance", "memory", "dream", "adventure", "journey",
  "surprise", "discovery", "collection", "connection"
];

// Brand colors for palette
const COLORS = [
  { name: 'Espresso', value: '#2C1E12' },
  { name: 'Forest', value: '#2D4A2E' },
  { name: 'Amber', value: '#C4883A' },
  { name: 'Rust', value: '#A0522D' },
  { name: 'Denim', value: '#4A6A8A' },
  { name: 'Popsicle Red', value: '#D63B3B' },
  { name: 'Bomb Pop Blue', value: '#3B7DD6' },
  { name: 'Warhead Green', value: '#6BBF4A' },
  { name: 'Bubblegum', value: '#E87DA0' },
  { name: 'Black', value: '#000000' }
];

// Game state
let canvas, ctx;
let isDrawing = false;
let currentColor = '#2C1E12';
let currentSize = 5;
let isEraser = false;
let timerInterval = null;
let timeRemaining = 60;
let currentRound = 1;
let score = 0;
let currentWord = null;
let usedWords = [];

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('drawingCanvas');
  ctx = canvas.getContext('2d');
  
  // Set canvas size based on container
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Initialize color palette
  initColorPalette();
  
  // Initialize brush sizes
  initBrushSizes();
  
  // Setup canvas drawing
  setupCanvas();
  
  // Load saved game state if exists
  loadGameState();
});

function resizeCanvas() {
  const container = canvas.parentElement;
  const width = container.clientWidth - 32; // Account for padding
  const height = Math.min(600, width * 0.75); // Maintain aspect ratio
  
  // Save current drawing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  canvas.width = width;
  canvas.height = height;
  
  // Restore drawing
  ctx.putImageData(imageData, 0, 0);
  
  // Reset context settings
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

function initColorPalette() {
  const palette = document.getElementById('colorPalette');
  
  COLORS.forEach((color, index) => {
    const btn = document.createElement('button');
    btn.className = 'color-btn' + (index === 0 ? ' active' : '');
    btn.style.backgroundColor = color.value;
    btn.title = color.name;
    btn.dataset.color = color.value;
    btn.onclick = () => selectColor(color.value, btn);
    palette.appendChild(btn);
  });
}

function initBrushSizes() {
  const sizeButtons = document.querySelectorAll('.size-btn');
  sizeButtons.forEach(btn => {
    btn.onclick = () => selectSize(parseInt(btn.dataset.size), btn);
  });
}

function selectColor(color, btn) {
  currentColor = color;
  isEraser = false;
  
  // Update active state
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  // Update eraser button
  document.getElementById('eraserText').textContent = '✏️ Eraser';
}

function selectSize(size, btn) {
  currentSize = size;
  
  // Update active state
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleEraser() {
  isEraser = !isEraser;
  document.getElementById('eraserText').textContent = isEraser ? '🖌️ Draw' : '✏️ Eraser';
}

function setupCanvas() {
  // Mouse events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  
  // Touch events
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouch);
  canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
  isDrawing = true;
  const pos = getCanvasPosition(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!isDrawing) return;
  
  e.preventDefault();
  const pos = getCanvasPosition(e);
  
  ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
  ctx.lineWidth = currentSize;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}

function getCanvasPosition(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function clearCanvas() {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function newWord() {
  // Get a word that hasn't been used recently
  let availableWords = WORD_BANK.filter(w => !usedWords.includes(w));
  
  // Reset if all words have been used
  if (availableWords.length === 0) {
    usedWords = [];
    availableWords = [...WORD_BANK];
  }
  
  // Pick random word
  currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  usedWords.push(currentWord);
  
  // Keep only last 20 used words to allow eventual repeats
  if (usedWords.length > 20) {
    usedWords.shift();
  }
  
  // Update display
  document.getElementById('currentWord').textContent = currentWord;
  
  // Clear canvas
  clearCanvas();
  
  // Start timer
  startTimer();
  
  saveGameState();
}

function skipWord() {
  if (confirm('Skip this word? No points will be awarded.')) {
    newWord();
  }
}

function startTimer() {
  // Clear existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timeRemaining = 60;
  document.getElementById('timer').textContent = timeRemaining;
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    document.getElementById('timer').textContent = timeRemaining;
    
    // Change color when time is running out
    const timerEl = document.getElementById('timer');
    if (timeRemaining <= 10) {
      timerEl.style.color = '#D63B3B';
    } else if (timeRemaining <= 30) {
      timerEl.style.color = '#C4883A';
    } else {
      timerEl.style.color = '#C4883A';
    }
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert('Time\'s up! ⏰');
    }
  }, 1000);
}

function finishRound() {
  if (!currentWord) {
    alert('Start a new word first!');
    return;
  }
  
  // Stop timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // Award points based on time remaining
  const points = Math.max(10, timeRemaining);
  score += points;
  
  // Update display
  document.getElementById('score').textContent = score;
  
  // Increment round
  currentRound++;
  document.getElementById('roundNumber').textContent = currentRound;
  
  // Show completion message
  alert(`Great job! You earned ${points} points! 🎉\n\nWord: "${currentWord}"\nTotal Score: ${score}`);
  
  // Clear for next round
  currentWord = null;
  document.getElementById('currentWord').textContent = 'Click "New Word" to continue';
  document.getElementById('timer').textContent = '60';
  
  saveGameState();
}

function saveGameState() {
  const state = {
    round: currentRound,
    score: score,
    usedWords: usedWords
  };
  localStorage.setItem('ge_sketch_game', JSON.stringify(state));
}

function loadGameState() {
  const saved = localStorage.getItem('ge_sketch_game');
  if (saved) {
    const state = JSON.parse(saved);
    currentRound = state.round || 1;
    score = state.score || 0;
    usedWords = state.usedWords || [];
    
    document.getElementById('roundNumber').textContent = currentRound;
    document.getElementById('score').textContent = score;
  }
}

// Reset game button (can be added to UI if desired)
function resetGame() {
  if (confirm('Reset game progress?')) {
    currentRound = 1;
    score = 0;
    usedWords = [];
    currentWord = null;
    
    document.getElementById('roundNumber').textContent = currentRound;
    document.getElementById('score').textContent = score;
    document.getElementById('currentWord').textContent = 'Click "New Word" to start';
    document.getElementById('timer').textContent = '60';
    
    clearCanvas();
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    localStorage.removeItem('ge_sketch_game');
  }
}
