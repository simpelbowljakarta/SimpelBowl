  /* ── Success Popup ── */
  function closeSuccessPopup() {
    document.getElementById('successPopupOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
  // Tutup popup kalau klik di luar
  document.getElementById('successPopupOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeSuccessPopup();
  });

  /* ── Privacy Modal ── */
  function openPrivacyModal(e) {
    if (e) e.preventDefault();
    document.getElementById('privacyModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closePrivacyModal() {
    document.getElementById('privacyModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
  function agreeAndClose() {
    document.getElementById('privacyCheck').checked = true;
    closePrivacyModal();
  }
  // Tutup modal kalau klik di luar
  document.getElementById('privacyModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closePrivacyModal();
  });

  /* ── Waitlist Form → Google Sheets ── */
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBAclUkTzh0ynL8OdPZYo9b-OuMj0rtCOXDSjttmxLe-2ZONg28kEwdiyqZs76hJImyg/exec';

  async function handleSubmit(e) {
    e.preventDefault();

    const btn        = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');
    const privacyChk = document.getElementById('privacyCheck');

    // Validasi checkbox privacy
    if (!privacyChk.checked) {
      privacyChk.focus();
      return;
    }

    const nama      = document.getElementById('nama').value.trim();
    const instagram = document.getElementById('instagram').value.trim();
    if (!nama || !instagram) return;

    // Normalkan handle Instagram
    const igHandle  = instagram.startsWith('@') ? instagram : '@' + instagram;
    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    // Tampilkan status loading
    btn.disabled    = true;
    btn.textContent = 'Mendaftarkan...';

    const payload = new URLSearchParams({
      nama:      nama,
      instagram: igHandle,
      timestamp: timestamp
    });

    try {
      await fetch(SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    payload.toString()
      });

      // Sukses — sembunyikan form & tampilkan popup
      document.getElementById('waitlistForm').style.display = 'none';
      successMsg.style.display = 'block';
      successMsg.classList.add('show');

      btn.textContent      = '✓ Kamu Sudah Terdaftar!';
      btn.style.background = 'var(--olive)';

      // Tampilkan success popup
      document.getElementById('successPopupOverlay').classList.add('active');
      document.body.style.overflow = 'hidden';

      // Update catatan slot
      const note = document.querySelector('.form-note');
      if (note) {
        note.innerHTML        = 'Yeay! Kamu sudah masuk waitlist 🎉 Nantikan kabar dari kami via Instagram.';
        note.style.color      = 'var(--olive)';
        note.style.fontWeight = '600';
      }

    } catch (err) {
      // Gagal — kembalikan tombol
      btn.disabled    = false;
      btn.textContent = 'Daftar Waitlist Sekarang →';
      alert('Terjadi kesalahan koneksi. Silakan coba lagi atau hubungi kami via Instagram @simpelbowl.id');
    }
  }

  /* ── Instagram @ prefix helper ── */
  document.getElementById('instagram').addEventListener('blur', function() {
    const val = this.value.trim();
    if (val && !val.startsWith('@')) this.value = '@' + val;
  });

  /* ── Smooth reveal on scroll ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.vp-card, .paket-card, .slot-box, .faq-item').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
  
