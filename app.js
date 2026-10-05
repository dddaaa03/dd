/**
 * Eternal Vows - Marriage Certificate Application
 * Bride: Desiree Alombro
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const registryView = document.getElementById('registry-view');
  const certView = document.getElementById('certificate-view');
  const congratsModal = document.getElementById('congrats-modal');
  
  const groomInput = document.getElementById('groom-name');
  const brideInput = document.getElementById('bride-name');
  const dateInput = document.getElementById('marriage-date');
  const placeInput = document.getElementById('marriage-place');
  const vowInput = document.getElementById('vow-text');
  const groomError = document.getElementById('groom-error');
  
  const btnGenerate = document.getElementById('btn-generate');
  const btnViewCert = document.getElementById('btn-view-cert');
  const btnEdit = document.getElementById('btn-edit');
  const btnPrint = document.getElementById('btn-print');
  const btnDownload = document.getElementById('btn-download');
  const btnSound = document.getElementById('btn-sound');
  const soundLabel = document.getElementById('sound-label');

  // Certificate Display Elements
  const displayGroom = document.getElementById('display-groom-name');
  const displayBride = document.getElementById('display-bride-name');
  const displayDateWords = document.getElementById('display-date-words');
  const displayPlace = document.getElementById('display-place');
  const displayVow = document.getElementById('display-vow');
  const sigGroom = document.getElementById('sig-groom-text');
  const certNum = document.getElementById('cert-num');
  const sealInitials = document.querySelector('.seal-initials');
  
  const congratsGroom = document.getElementById('congrats-groom');

  let soundEnabled = true;
  let audioCtx = null;

  // 1. Auto-set today's date in input
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;

  // Helper: Format Date into Ceremonial English Words
  function formatFormalDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[dateObj.getDay()];
    const dayNum = dateObj.getDate();
    const monthName = months[dateObj.getMonth()];
    const yearNum = dateObj.getFullYear();

    // Day suffix: 1st, 2nd, 3rd, 4th...
    function getOrdinal(n) {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    // Number to words for year
    function numberToWordsYear(year) {
      if (year === 2026) return "Two Thousand Twenty-Six";
      if (year === 2025) return "Two Thousand Twenty-Five";
      if (year === 2024) return "Two Thousand Twenty-Four";
      if (year === 2027) return "Two Thousand Twenty-Seven";
      return year.toString();
    }

    return `${dayName}, the ${getOrdinal(dayNum)} day of ${monthName} in the year ${numberToWordsYear(yearNum)}`;
  }

  // Generate a random certificate registration number
  function generateCertId() {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `DA-${yyyy}-${randomDigits}`;
  }

  // Web Audio API Synthesized Romantic Chime / Wedding Bell
  function playRomanticChime() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Play an uplifting romantic chord progression (C-E-G-B-C)
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.14);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + index * 0.14);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + index * 0.14 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + index * 0.14 + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + index * 0.14);
        osc.stop(audioCtx.currentTime + index * 0.14 + 2.6);
      });
    } catch (e) {
      console.warn("Audio playback not supported or blocked", e);
    }
  }

  // Toggle Sound
  btnSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundLabel.textContent = soundEnabled ? 'Music: On' : 'Music: Off';
    btnSound.style.opacity = soundEnabled ? '1' : '0.6';
  });

  // Handle Generate / Say I Do
  btnGenerate.addEventListener('click', () => {
    const groomName = groomInput.value.trim();
    if (!groomName) {
      groomError.classList.add('visible');
      groomInput.focus();
      return;
    }
    groomError.classList.remove('visible');

    const brideName = brideInput.value.trim() || 'Desiree Alombro';
    const marriageDate = dateInput.value;
    const marriagePlace = placeInput.value.trim() || 'In Our Hearts & Before God';
    const vowText = vowInput.value.trim() || 'To have and to hold, from this day forth and forever.';

    // Populate Certificate Elements
    displayGroom.textContent = groomName;
    displayBride.textContent = brideName;
    displayDateWords.textContent = formatFormalDate(marriageDate);
    displayPlace.textContent = marriagePlace;
    displayVow.textContent = `"${vowText}"`;
    sigGroom.textContent = groomName;
    certNum.textContent = generateCertId();

    // Seal initials (e.g. D & G)
    const groomInitial = groomName.charAt(0).toUpperCase();
    const brideInitial = brideName.charAt(0).toUpperCase();
    if (sealInitials) {
      sealInitials.textContent = `${brideInitial} & ${groomInitial}`;
    }

    // Populate Congratulations Modal
    congratsGroom.textContent = groomName;

    // Trigger celebration effects
    triggerConfetti();
    playRomanticChime();

    // Show congratulations modal
    congratsModal.classList.remove('hidden');
  });

  // From Modal to Certificate View
  btnViewCert.addEventListener('click', () => {
    congratsModal.classList.add('hidden');
    registryView.classList.add('hidden');
    certView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerConfetti(2); // secondary blast
  });

  // Edit Details (Back to form)
  btnEdit.addEventListener('click', () => {
    certView.classList.add('hidden');
    registryView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Print Certificate (Native Print dialog)
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // Download Certificate as Image via Canvas
  btnDownload.addEventListener('click', () => {
    downloadCertificateAsImage();
  });

  // Live validation on groom input
  groomInput.addEventListener('input', () => {
    if (groomInput.value.trim()) {
      groomError.classList.remove('visible');
    }
  });

  groomInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnGenerate.click();
    }
  });

  // =========================================================================
  // Canvas Ambient Romantic Particles (Hearts & Glows)
  // =========================================================================
  const ambientCanvas = document.getElementById('ambient-canvas');
  const ambCtx = ambientCanvas.getContext('2d');
  let particles = [];

  function resizeAmbientCanvas() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeAmbientCanvas);
  resizeAmbientCanvas();

  class HeartParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * ambientCanvas.width;
      this.y = ambientCanvas.height + 20 + Math.random() * 50;
      this.size = 10 + Math.random() * 16;
      this.speedY = 0.5 + Math.random() * 1.2;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = 0.2 + Math.random() * 0.45;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.color = Math.random() > 0.4 ? '#e84a7f' : '#d4af37';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.02) * 0.5;
      this.rotation += this.rotSpeed;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Draw Heart Shape
      const s = this.size * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.4, s * 0.4, 0, s * 1.3);
      ctx.bezierCurveTo(s * 1.4, s * 0.4, s, -s * 0.6, 0, s * 0.3);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 28; i++) {
    particles.push(new HeartParticle());
  }

  function animateAmbient() {
    ambCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    particles.forEach(p => {
      p.update();
      p.draw(ambCtx);
    });
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // =========================================================================
  // Confetti Engine
  // =========================================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  const confettiColors = ['#d4af37', '#f7e7a9', '#e84a7f', '#ffffff', '#ff9bbb', '#c5a059'];

  class ConfettiPiece {
    constructor(x, y) {
      this.x = x || Math.random() * confettiCanvas.width;
      this.y = y || -10;
      this.size = 8 + Math.random() * 8;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.speedY = 3 + Math.random() * 5;
      this.speedX = (Math.random() - 0.5) * 6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.opacity = 1;
      this.shape = Math.random() > 0.3 ? 'rect' : 'circle';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;
      if (this.y > confettiCanvas.height - 20) {
        this.opacity -= 0.025;
      }
    }
    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function triggerConfetti(multiplier = 1) {
    const count = 120 * multiplier;
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiPiece());
    }
  }

  function animateConfetti() {
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const piece = confettiPieces[i];
      piece.update();
      piece.draw(confCtx);
      if (piece.y > confettiCanvas.height || piece.opacity <= 0) {
        confettiPieces.splice(i, 1);
      }
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // =========================================================================
  // High-Resolution Certificate Image Generator (Canvas Exporter)
  // =========================================================================
  function downloadCertificateAsImage() {
    const groom = displayGroom.textContent || 'Groom';
    const bride = displayBride.textContent || 'Desiree Alombro';
    const dateWords = displayDateWords.textContent;
    const place = displayPlace.textContent;
    const vow = displayVow.textContent;
    const certId = certNum.textContent;

    const w = 1920;
    const h = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // 1. Parchment Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#fdfbf7');
    bgGrad.addColorStop(0.5, '#fbf5e6');
    bgGrad.addColorStop(1, '#f6ebd5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle parchment texture dots
    ctx.fillStyle = 'rgba(180, 150, 110, 0.08)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    // 2. Borders
    // Outer Gold Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#b8860b';
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Inner Delicate Double Border
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d4af37';
    ctx.strokeRect(60, 60, w - 120, h - 120);

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#c5a059';
    ctx.strokeRect(70, 70, w - 140, h - 140);

    // Corner Ornaments
    ctx.font = '55px serif';
    ctx.fillStyle = '#b8860b';
    ctx.fillText('❧', 85, 130);
    ctx.fillText('☙', w - 130, 130);
    ctx.fillText('❧', 85, h - 95);
    ctx.fillText('☙', w - 130, h - 95);

    // 3. Header
    ctx.textAlign = 'center';
    
    // Rings
    ctx.font = '40px serif';
    ctx.fillText('💍  ♥  💍', w / 2, 160);

    // Motto
    ctx.font = '600 18px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#8c6a21';
    ctx.fillText('AMOR VINCIT OMNIA  •  OFFICIAL RECORD #' + certId, w / 2, 195);

    // Pretitle
    ctx.font = '600 24px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#7a602b';
    ctx.fillText('HOLY COVENANT OF MATRIMONY', w / 2, 250);

    // Certificate Title
    ctx.font = 'bold 74px "Cinzel Decorative", "Cinzel", Georgia, serif';
    ctx.fillStyle = '#261b11';
    ctx.fillText('Certificate of Marriage', w / 2, 335);

    // Subtitle
    ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#4f453a';
    ctx.fillText('This solemn record certifies that in the presence of Love, Honor, and Devotion', w / 2, 385);

    // 4. Couple Section
    // Groom
    ctx.font = '700 20px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#9c7b38';
    ctx.fillText('THE GROOM', w * 0.28, 465);

    ctx.font = '68px "Alex Brush", "Great Vibes", cursive, Georgia';
    ctx.fillStyle = '#1c150e';
    ctx.fillText(groom, w * 0.28, 545);

    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.15, 570);
    ctx.lineTo(w * 0.41, 570);
    ctx.stroke();

    ctx.font = 'italic 18px "Playfair Display", serif';
    ctx.fillStyle = '#776b5d';
    ctx.fillText('Pledged in honor & lifelong fidelity', w * 0.28, 600);

    // Center Emblem
    ctx.font = '50px serif';
    ctx.fillStyle = '#c98835';
    ctx.fillText('∞', w / 2, 510);
    ctx.font = 'bold 36px "Cinzel Decorative", Georgia';
    ctx.fillText('&', w / 2, 550);
    ctx.font = '700 15px "Cinzel", serif';
    ctx.fillStyle = '#7d6537';
    ctx.fillText('UNITED AS ONE', w / 2, 580);

    // Bride (Desiree Alombro)
    ctx.font = '700 20px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#9c7b38';
    ctx.fillText('THE BRIDE', w * 0.72, 465);

    ctx.font = '68px "Alex Brush", "Great Vibes", cursive, Georgia';
    ctx.fillStyle = '#8c1d40';
    ctx.fillText(bride, w * 0.72, 545);

    ctx.beginPath();
    ctx.moveTo(w * 0.59, 570);
    ctx.lineTo(w * 0.85, 570);
    ctx.stroke();

    ctx.font = 'italic 18px "Playfair Display", serif';
    ctx.fillStyle = '#776b5d';
    ctx.fillText('Pledged in love & everlasting devotion', w * 0.72, 600);

    // 5. Statement
    ctx.font = 'italic 25px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#3c342b';
    ctx.fillText('Were lawfully and sacramentally united in the sacred bond of', w / 2, 680);

    ctx.font = '700 32px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#885b1f';
    ctx.fillText('HOLY MATRIMONY', w / 2, 725);

    ctx.font = '24px "Playfair Display", serif';
    ctx.fillStyle = '#2b231a';
    ctx.fillText(`on this day, ${dateWords},`, w / 2, 775);
    ctx.fillText(`solemnized at ${place}.`, w / 2, 815);

    // Vow
    ctx.font = 'italic 21px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#554c41';
    ctx.fillText(vow, w / 2, 875);

    // 6. Wax Seal in Center
    const sealX = w / 2;
    const sealY = 1040;
    const sealRadius = 65;

    // Ribbons
    ctx.fillStyle = '#941432';
    ctx.beginPath();
    ctx.moveTo(sealX - 25, sealY + 20);
    ctx.lineTo(sealX - 45, sealY + 110);
    ctx.lineTo(sealX - 25, sealY + 95);
    ctx.lineTo(sealX - 5, sealY + 110);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sealX + 25, sealY + 20);
    ctx.lineTo(sealX + 5, sealY + 110);
    ctx.lineTo(sealX + 25, sealY + 95);
    ctx.lineTo(sealX + 45, sealY + 110);
    ctx.closePath();
    ctx.fill();

    // Seal circle
    const sealGrad = ctx.createRadialGradient(sealX - 15, sealY - 15, 10, sealX, sealY, sealRadius);
    sealGrad.addColorStop(0, '#ffe08a');
    sealGrad.addColorStop(0.6, '#b8860b');
    sealGrad.addColorStop(1, '#664700');
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fff2b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fffbe8';
    ctx.font = 'bold 22px "Cinzel", Georgia';
    const bInit = bride.charAt(0).toUpperCase();
    const gInit = groom.charAt(0).toUpperCase();
    ctx.fillText(`${bInit} & ${gInit}`, sealX, sealY + 2);
    ctx.font = 'bold 11px "Cinzel", Georgia';
    ctx.fillText('SEALED IN LOVE', sealX, sealY + 22);
    ctx.fillText('ETERNAL', sealX, sealY + 36);

    // 7. Signatures
    // Groom signature
    ctx.font = '54px "Great Vibes", cursive, Georgia';
    ctx.fillStyle = '#162238';
    ctx.fillText(groom, w * 0.28, 1030);

    ctx.strokeStyle = '#2b241d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.16, 1050);
    ctx.lineTo(w * 0.40, 1050);
    ctx.stroke();

    ctx.font = '700 15px "Cinzel", serif';
    ctx.fillStyle = '#635749';
    ctx.fillText('SIGNATURE OF THE GROOM', w * 0.28, 1075);

    // Bride signature
    ctx.font = '54px "Great Vibes", cursive, Georgia';
    ctx.fillStyle = '#7a1d3a';
    ctx.fillText(bride, w * 0.72, 1030);

    ctx.beginPath();
    ctx.moveTo(w * 0.60, 1050);
    ctx.lineTo(w * 0.84, 1050);
    ctx.stroke();

    ctx.font = '700 15px "Cinzel", serif';
    ctx.fillStyle = '#635749';
    ctx.fillText('SIGNATURE OF THE BRIDE', w * 0.72, 1075);

    // 8. Footer Witnesses & Motto
    ctx.strokeStyle = '#d1c09d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.12, 1160);
    ctx.lineTo(w * 0.88, 1160);
    ctx.stroke();

    // Witness Left
    ctx.font = '36px "Great Vibes", cursive';
    ctx.fillStyle = '#3b332a';
    ctx.fillText('Love & Destiny', w * 0.25, 1205);
    ctx.font = '600 14px "Cinzel", serif';
    ctx.fillStyle = '#7c7163';
    ctx.fillText('WITNESS OF THE HEART', w * 0.25, 1235);

    // Center Scripture
    ctx.font = 'italic 17px "Playfair Display", serif';
    ctx.fillStyle = '#574d41';
    ctx.fillText('"Therefore what God has joined together, let no one separate." • Mark 10:9', w / 2, 1215);

    // Witness Right
    ctx.font = '36px "Great Vibes", cursive';
    ctx.fillStyle = '#3b332a';
    ctx.fillText('Sacred Minister of Love', w * 0.75, 1205);
    ctx.font = '600 14px "Cinzel", serif';
    ctx.fillStyle = '#7c7163';
    ctx.fillText('OFFICIATING WITNESS', w * 0.75, 1235);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Marriage-Certificate-Desiree-and-${groom.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
});
