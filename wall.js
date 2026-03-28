// Polaroid Wall - Game Logic

let pendingImage = null;

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadPolaroids();
});

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file!');
    return;
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large! Please choose a file under 5MB.');
    return;
  }
  
  // Read the file
  const reader = new FileReader();
  reader.onload = (e) => {
    pendingImage = e.target.result;
    showCaptionInput(pendingImage);
  };
  reader.readAsDataURL(file);
  
  // Reset file input
  event.target.value = '';
}

function showCaptionInput(imageData) {
  document.getElementById('previewImage').src = imageData;
  document.getElementById('captionSection').classList.add('visible');
  document.getElementById('captionInput').value = '';
  document.getElementById('captionInput').focus();
}

function cancelUpload() {
  document.getElementById('captionSection').classList.remove('visible');
  pendingImage = null;
}

function compressImage(dataUrl, maxWidth, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = (maxWidth / w) * h;
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

async function savePolaroid() {
  const caption = document.getElementById('captionInput').value.trim();
  
  if (!caption) {
    alert('Please add a caption!');
    return;
  }
  
  if (!pendingImage) {
    alert('No image selected!');
    return;
  }
  
  // Get existing polaroids
  const polaroids = JSON.parse(localStorage.getItem('ge_polaroids') || '[]');
  
  // Compress image before saving to conserve localStorage space
  const compressedImage = await compressImage(pendingImage, 800, 0.7);
  
  // Get current player
  const player = localStorage.getItem('ge_player') || '?';
  
  // Add new polaroid
  const newPolaroid = {
    id: Date.now(),
    image: compressedImage,
    caption: caption,
    uploadedBy: player,
    date: new Date().toISOString(),
    rotation: (Math.random() - 0.5) * 10 // Random rotation between -5 and 5 degrees
  };
  
  polaroids.push(newPolaroid);
  
  // Save to localStorage
  localStorage.setItem('ge_polaroids', JSON.stringify(polaroids));
  
  // Hide caption input
  cancelUpload();
  
  // Reload display
  loadPolaroids();
  
  // Scroll to bottom
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100);
}

function loadPolaroids() {
  const polaroids = JSON.parse(localStorage.getItem('ge_polaroids') || '[]');
  const wall = document.getElementById('polaroidWall');
  
  if (polaroids.length === 0) {
    wall.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📷</div>
        <p>Your wall is empty. Start adding memories!</p>
      </div>
    `;
    return;
  }
  
  // Shuffle polaroids for varied display
  const shuffled = [...polaroids].sort(() => Math.random() - 0.5);
  
  wall.innerHTML = shuffled.map(p => {
    const date = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const by = p.uploadedBy === 'E' ? 'Ethan' : p.uploadedBy === 'G' ? 'Garrick' : '';
    return `
    <div class="polaroid-item" style="transform: rotate(${p.rotation}deg);" onclick="openLightbox(${p.id})">
      <button class="delete-btn" onclick="event.stopPropagation(); deletePolaroid(${p.id})" title="Delete">×</button>
      <img src="${p.image}" alt="${p.caption}">
      <div class="polaroid-caption">${p.caption}</div>
      <div class="polaroid-meta">${date}${by ? ' · ' + by : ''}</div>
    </div>
  `;
  }).join('');
}

function deletePolaroid(id) {
  if (!confirm('Delete this photo?')) return;
  
  let polaroids = JSON.parse(localStorage.getItem('ge_polaroids') || '[]');
  polaroids = polaroids.filter(p => p.id !== id);
  localStorage.setItem('ge_polaroids', JSON.stringify(polaroids));
  
  loadPolaroids();
}

function openLightbox(id) {
  const polaroids = JSON.parse(localStorage.getItem('ge_polaroids') || '[]');
  const polaroid = polaroids.find(p => p.id === id);
  
  if (!polaroid) return;
  
  document.getElementById('lightboxImage').src = polaroid.image;
  document.getElementById('lightboxCaption').textContent = polaroid.caption;
  document.getElementById('lightbox').classList.add('visible');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('visible');
  
  // Restore body scroll
  document.body.style.overflow = '';
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape to close lightbox
  if (e.key === 'Escape') {
    closeLightbox();
    
    // Also cancel upload if caption section is open
    if (document.getElementById('captionSection').classList.contains('visible')) {
      cancelUpload();
    }
  }
  
  // Enter to save caption if focused on input
  if (e.key === 'Enter' && document.activeElement.id === 'captionInput') {
    savePolaroid();
  }
});

// Drag and drop support
const wallPage = document.querySelector('.wall-page');

wallPage.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

wallPage.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        pendingImage = event.target.result;
        showCaptionInput(pendingImage);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please drop an image file!');
    }
  }
});
