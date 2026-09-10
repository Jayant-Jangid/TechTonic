// Main Application Coordinator & Role-Isolated Authentication Manager

class KisanSetuApp {
  constructor() {
    this.init();
  }

  init() {
    this.currentProfileRole = 'farmer';
    this.bindAuthGateway();
    this.bindProfileModal();
    this.bindLanguageSwitcher();

    // Check active session on startup
    const currentUser = window.appStore.getCurrentUser();
    if (currentUser && currentUser.role && ['farmer', 'consumer', 'driver'].includes(currentUser.role)) {
      this.setActiveRole(currentUser.role);
    } else {
      this.setActiveRole('login');
    }

    // Subscribe to store auth and profile events
    window.appStore.subscribe((event, payload) => {
      if (event === 'user_logged_in' || event === 'user_registered') {
        this.setActiveRole(payload.role);
      } else if (event === 'user_logged_out') {
        this.setActiveRole('login');
      } else if (event === 'profile_updated') {
        const modal = document.getElementById('operational-profile-modal');
        if (modal && !modal.classList.contains('hidden')) {
          this.renderProfileModal(this.currentProfileRole);
        }
      } else if (event === 'notification_added') {
        this.showToast(payload.message, payload.type);
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  bindProfileModal() {
    // Click on topbar profile chip button
    const openProfileBtn = document.getElementById('open-profile-btn');
    if (openProfileBtn) {
      openProfileBtn.addEventListener('click', () => {
        const currentUser = window.appStore.getCurrentUser();
        const role = currentUser ? currentUser.role : 'farmer';
        this.openProfileModal(role);
      });
    }

    // Direct profile buttons in dashboards
    document.querySelectorAll('.view-operational-profile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentUser = window.appStore.getCurrentUser();
        const role = currentUser ? currentUser.role : (btn.dataset.role || 'farmer');
        this.openProfileModal(role);
      });
    });

    // Close modal buttons
    const closeBtn1 = document.getElementById('close-profile-modal-btn');
    const closeBtn2 = document.getElementById('close-profile-modal-btn2');
    const modal = document.getElementById('operational-profile-modal');

    if (closeBtn1) closeBtn1.addEventListener('click', () => modal.classList.add('hidden'));
    if (closeBtn2) closeBtn2.addEventListener('click', () => modal.classList.add('hidden'));

    // Digital pass modal trigger
    const passBtn = document.getElementById('download-digital-pass-btn');
    const passModal = document.getElementById('digital-pass-modal');
    if (passBtn && passModal) {
      passBtn.addEventListener('click', () => {
        this.renderDigitalPass(this.currentProfileRole);
        passModal.classList.remove('hidden');
      });
    }

    // Contact info edit toggle
    const toggleEditBtn = document.getElementById('toggle-edit-contact-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-contact-btn');
    const contactView = document.getElementById('profile-contact-view');
    const contactEditForm = document.getElementById('profile-contact-edit-form');

    if (toggleEditBtn && contactView && contactEditForm) {
      toggleEditBtn.addEventListener('click', () => {
        const p = window.appStore.getProfile(this.currentProfileRole);
        document.getElementById('edit-profile-phone').value = p.phone || '';
        document.getElementById('edit-profile-email').value = p.email || '';
        document.getElementById('edit-profile-address').value = p.location || '';
        contactView.classList.add('hidden');
        contactEditForm.classList.remove('hidden');
      });
    }

    if (cancelEditBtn && contactView && contactEditForm) {
      cancelEditBtn.addEventListener('click', () => {
        contactEditForm.classList.add('hidden');
        contactView.classList.remove('hidden');
      });
    }

    if (contactEditForm) {
      contactEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('edit-profile-phone').value;
        const email = document.getElementById('edit-profile-email').value;
        const location = document.getElementById('edit-profile-address').value;
        window.appStore.updateProfile(this.currentProfileRole, { phone, email, location });
        contactEditForm.classList.add('hidden');
        contactView.classList.remove('hidden');
        if (window.showSystemAlert) {
          window.showSystemAlert('Profile Updated', 'Operational contact details successfully updated!', 'success');
        } else {
          alert('Operational contact details successfully updated!');
        }
      });
    }
  }

  openProfileModal(role = 'farmer') {
    this.renderProfileModal(role);
    const modal = document.getElementById('operational-profile-modal');
    if (modal) modal.classList.remove('hidden');
  }

  renderProfileModal(role = 'farmer') {
    this.currentProfileRole = role;
    const profile = window.appStore.getProfile(role);
    if (!profile) return;

    // Synchronize with currently logged-in user details if available
    const currentUser = window.appStore.getCurrentUser();
    if (currentUser && currentUser.role === role) {
      profile.name = currentUser.name;
      profile.email = currentUser.email;
      profile.phone = currentUser.phone;
      if (currentUser.location) profile.location = currentUser.location;
      if (currentUser.govtId) profile.govtId = currentUser.govtId;
    }

    const roleBadge = document.getElementById('profile-modal-current-role-label');
    const rolePill = document.getElementById('profile-modal-role-pill');
    const roleLabelText = role === 'farmer' ? '🌾 Farmer Portal' : role === 'consumer' ? '🛒 Consumer Hub' : '🚚 Truck Logistics';
    const pillColorClass = role === 'farmer' ? 'bg-emerald-600' : role === 'consumer' ? 'bg-blue-600' : 'bg-amber-600';

    if (roleBadge) {
      roleBadge.textContent = roleLabelText;
      roleBadge.className = `px-2 py-0.5 rounded-md text-[10px] font-bold ${pillColorClass} text-white`;
    }
    if (rolePill) {
      rolePill.textContent = 'Verified Active Account';
      rolePill.className = `text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700`;
    }

    // Header identity
    const avatarEl = document.getElementById('profile-modal-avatar');
    const nameEl = document.getElementById('profile-modal-name');
    const hindiEl = document.getElementById('profile-modal-hindi');
    const taglineEl = document.getElementById('profile-modal-tagline');
    const kycBadge = document.getElementById('profile-modal-kyc-badge');
    const govtIdEl = document.getElementById('profile-govt-id');
    const enamIdEl = document.getElementById('profile-enam-id');

    if (avatarEl) {
      avatarEl.textContent = profile.avatar || '👤';
      avatarEl.className = `w-16 h-16 rounded-2xl ${role === 'farmer' ? 'bg-emerald-700' : role === 'consumer' ? 'bg-blue-700' : 'bg-amber-600'} text-white flex items-center justify-center text-3xl font-extrabold shadow-md flex-shrink-0`;
    }
    if (nameEl) nameEl.textContent = profile.name;
    if (hindiEl) hindiEl.textContent = '';
    if (taglineEl) taglineEl.textContent = profile.tagline;
    if (kycBadge) kycBadge.innerHTML = `<i data-lucide="shield-check" class="w-3 h-3 text-emerald-600"></i> ${profile.kycStatus || 'e-NAM & DigiLocker Verified'}`;
    if (govtIdEl) govtIdEl.textContent = profile.govtId;
    if (enamIdEl) enamIdEl.textContent = profile.eNamId;

    // Duty status
    const dutyText = document.getElementById('profile-duty-status-text');
    const dutyToggleInput = document.getElementById('profile-duty-toggle-input');
    const dutyIndicator = document.getElementById('profile-duty-indicator');

    if (profile.operationalStatus) {
      const isOnDuty = profile.operationalStatus.isOnDuty;
      if (dutyText) dutyText.textContent = profile.operationalStatus.statusLabel;
      if (dutyToggleInput) dutyToggleInput.checked = isOnDuty;
      if (dutyIndicator) {
        dutyIndicator.className = isOnDuty ? 'w-3 h-3 rounded-full bg-emerald-500 animate-ping flex-shrink-0' : 'w-3 h-3 rounded-full bg-slate-400 flex-shrink-0';
      }
    }

    // Performance Stats Strip
    const ratingBadge = document.getElementById('profile-rating-badge');
    const reviewsCount = document.getElementById('profile-reviews-count');
    const ontimeRate = document.getElementById('profile-ontime-rate');
    const deliveredCount = document.getElementById('profile-delivered-count');

    if (profile.operationalStatus) {
      if (ratingBadge) ratingBadge.textContent = `★ ${profile.operationalStatus.rating.toFixed(2)}`;
      if (reviewsCount) reviewsCount.textContent = `(${profile.operationalStatus.reviewsCount} Verified Reviews)`;
      if (ontimeRate) ontimeRate.textContent = profile.operationalStatus.onTimeFulfillment;
      if (deliveredCount) deliveredCount.textContent = `${profile.operationalStatus.lotsDelivered} Lots/Trips`;
    }

    // Section 1: Certifications & Standards
    const soilCardEl = document.getElementById('profile-soil-card');
    const certsGrid = document.getElementById('profile-certs-grid');
    if (soilCardEl) soilCardEl.textContent = profile.soilHealthCard;

    if (certsGrid && profile.certifications) {
      certsGrid.innerHTML = profile.certifications.map(c => `
        <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
          <div>
            <span class="font-bold text-slate-800">${c.name}</span>
            <span class="text-slate-400 block font-mono text-[10px]">${c.certNo}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">${c.status}</span>
        </div>
      `).join('');
    }

    // Section 2: Assets & Capacities
    const landEl = document.getElementById('profile-land-holding');
    const storageEl = document.getElementById('profile-storage-capacity');
    const irrigationEl = document.getElementById('profile-irrigation-type');
    const cropsEl = document.getElementById('profile-primary-crops');

    if (landEl) landEl.textContent = profile.landHolding;
    if (storageEl) storageEl.textContent = profile.storageCapacity;
    if (irrigationEl) irrigationEl.textContent = profile.irrigationType;
    if (cropsEl && profile.primaryCrops) cropsEl.textContent = profile.primaryCrops.join(', ');

    // Section 3: Financials
    const bankNameEl = document.getElementById('profile-bank-name');
    const bankAcEl = document.getElementById('profile-bank-ac');
    const bankIfscEl = document.getElementById('profile-bank-ifsc');
    const kccLimitEl = document.getElementById('profile-kcc-limit');
    const settlementSpeedEl = document.getElementById('profile-settlement-speed');
    const mandiUpiEl = document.getElementById('profile-mandi-upi');

    if (profile.financials) {
      if (bankNameEl) bankNameEl.textContent = profile.financials.bank;
      if (bankAcEl) bankAcEl.textContent = profile.financials.accountNo;
      if (bankIfscEl) bankIfscEl.textContent = profile.financials.ifsc;
      if (kccLimitEl) kccLimitEl.textContent = profile.financials.kccLimit;
      if (settlementSpeedEl) settlementSpeedEl.textContent = profile.financials.settlementSpeed;
      if (mandiUpiEl) mandiUpiEl.textContent = profile.financials.mandiEscrowUpi;
    }

    // Section 4: Contact & Coordinates
    const addrEl = document.getElementById('profile-address-display');
    const coordEl = document.getElementById('profile-coordinates');
    const phoneLink = document.getElementById('profile-phone-link');
    const phoneDisplay = document.getElementById('profile-phone-display');
    const emailDisplay = document.getElementById('profile-email-display');

    if (addrEl) addrEl.textContent = profile.location;
    if (coordEl) coordEl.textContent = profile.coordinates;
    if (phoneLink) phoneLink.href = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`;
    if (phoneDisplay) phoneDisplay.textContent = profile.phone;
    if (emailDisplay) emailDisplay.textContent = profile.email;

    // Reset contact edit form view if visible
    const contactView = document.getElementById('profile-contact-view');
    const contactEditForm = document.getElementById('profile-contact-edit-form');
    if (contactView) contactView.classList.remove('hidden');
    if (contactEditForm) contactEditForm.classList.add('hidden');

    if (window.lucide) {
      setTimeout(() => window.lucide.createIcons(), 20);
    }
  }

  renderDigitalPass(role) {
    const profile = window.appStore.getProfile(role);
    if (!profile) return;

    const passAvatar = document.getElementById('pass-avatar');
    const passName = document.getElementById('pass-name');
    const passRole = document.getElementById('pass-role');
    const passId = document.getElementById('pass-id');

    if (passAvatar) {
      passAvatar.textContent = profile.avatar || '👤';
      passAvatar.className = `w-16 h-16 rounded-2xl ${role === 'farmer' ? 'bg-emerald-700' : role === 'consumer' ? 'bg-blue-700' : 'bg-amber-600'} text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-md`;
    }
    if (passName) passName.textContent = profile.name;
    if (passRole) passRole.textContent = profile.tagline;
    if (passId) passId.textContent = profile.govtId;
  }


  // ================= 1. AUTHENTICATION & ACCOUNT CREATION GATEWAY =================
  bindAuthGateway() {
    // 1. Tab switching between Sign In and Sign Up
    const tabSignIn = document.getElementById('tab-btn-signin');
    const tabSignUp = document.getElementById('tab-btn-signup');
    const paneSignIn = document.getElementById('auth-signin-pane');
    const paneSignUp = document.getElementById('auth-signup-pane');
    const showSignInTab = () => {
      if (!paneSignIn || !paneSignUp) return;
      paneSignIn.classList.remove('hidden');
      paneSignUp.classList.add('hidden');
      if (tabSignIn && tabSignUp) {
        tabSignIn.className = 'flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 bg-white text-emerald-800 shadow-sm border border-slate-200/60';
        tabSignUp.className = 'flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 hover:bg-white/60';
      }
      if (window.lucide) window.lucide.createIcons();
    };

    const showSignUpTab = () => {
      if (!paneSignIn || !paneSignUp) return;
      paneSignUp.classList.remove('hidden');
      paneSignIn.classList.add('hidden');
      if (tabSignIn && tabSignUp) {
        tabSignUp.className = 'flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 bg-white text-emerald-800 shadow-sm border border-slate-200/60';
        tabSignIn.className = 'flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 hover:bg-white/60';
      }
      if (window.lucide) window.lucide.createIcons();
    };

    if (tabSignIn) tabSignIn.addEventListener('click', showSignInTab);
    if (tabSignUp) tabSignUp.addEventListener('click', showSignUpTab);
    const switchToSignupLink = document.getElementById('switch-to-signup-link');
    if (switchToSignupLink) switchToSignupLink.addEventListener('click', showSignUpTab);
    const switchToSigninLink = document.getElementById('switch-to-signin-link');
    if (switchToSigninLink) switchToSigninLink.addEventListener('click', showSignInTab);

    // 2. Sign In Target Role Buttons
    const roleButtons = document.querySelectorAll('.auth-role-select-btn');
    const hiddenRoleInput = document.getElementById('login-selected-role');
    const identifierInput = document.getElementById('login-identifier');
    const passwordInput = document.getElementById('login-password');

    roleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.authRole;
        if (hiddenRoleInput) hiddenRoleInput.value = role;

        roleButtons.forEach(b => {
          if (b.dataset.authRole === role) {
            b.className = 'auth-role-select-btn px-3 py-2.5 rounded-xl border text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs';
          } else {
            b.className = 'auth-role-select-btn px-3 py-2.5 rounded-xl border text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100';
          }
        });

        // Set active role for portal destination
      });
    });

    // 3. Sign Up Role Radio Switcher (Dynamic Field Toggle)
    const signupRoleRadios = document.querySelectorAll('input[name="signup-role"]');
    const farmerFields = document.getElementById('signup-role-farmer-fields');
    const consumerFields = document.getElementById('signup-role-consumer-fields');
    const driverFields = document.getElementById('signup-role-driver-fields');
    const signupRoleCards = document.querySelectorAll('.signup-role-card');

    signupRoleRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const selectedRole = radio.value;

        // Toggle card borders
        signupRoleCards.forEach(card => {
          const cardRadio = card.querySelector('input[type="radio"]');
          if (cardRadio && cardRadio.checked) {
            card.className = 'signup-role-card p-3.5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/50 cursor-pointer transition flex flex-col justify-between';
          } else {
            card.className = 'signup-role-card p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition flex flex-col justify-between';
          }
        });

        // Toggle role inputs
        if (farmerFields) farmerFields.classList.toggle('hidden', selectedRole !== 'farmer');
        if (consumerFields) consumerFields.classList.toggle('hidden', selectedRole !== 'consumer');
        if (driverFields) driverFields.classList.toggle('hidden', selectedRole !== 'driver');
      });
    });

    // 4. Toggle Password Visibility
    const togglePasswordBtn = document.getElementById('toggle-login-password-btn');
    if (togglePasswordBtn && passwordInput) {
      togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        togglePasswordBtn.innerHTML = isPassword ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' : '<i data-lucide="eye" class="w-4 h-4"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // 5. Sign In Form Submission
    const loginForm = document.getElementById('auth-login-form');
    const loginAlert = document.getElementById('login-alert-banner');

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = document.getElementById('login-identifier')?.value || '';
        const password = document.getElementById('login-password')?.value || '';
        const selectedRole = document.getElementById('login-selected-role')?.value || '';

        const loginAlert = document.getElementById('login-alert-banner');
        if (loginAlert) {
          loginAlert.classList.add('hidden');
          loginAlert.textContent = '';
        }

        const submitBtn = document.getElementById('login-submit-btn');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Authenticating...';
          if (window.lucide) window.lucide.createIcons();
        }

        try {
          const res = await window.appStore.loginUser(identifier, password, selectedRole);
          if (res.success) {
            if (loginAlert) {
              loginAlert.classList.add('hidden');
              loginAlert.textContent = '';
            }
            this.showToast(`Authenticated as ${res.user.name} (${res.user.role.toUpperCase()})`);
            this.setActiveRole(res.user.role);
          } else {
            if (loginAlert) {
              loginAlert.className = 'p-3.5 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800';
              loginAlert.textContent = res.error || 'Authentication failed.';
              loginAlert.classList.remove('hidden');
            }
          }
        } catch (err) {
          console.error('Authentication error:', err);
          if (loginAlert) {
            loginAlert.className = 'p-3.5 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800';
            loginAlert.textContent = (err && err.message) ? err.message : 'Unable to sign in. Please check your credentials.';
            loginAlert.classList.remove('hidden');
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      });
    }

    // Strict Numeric Mobile Validation
    const signupPhoneInput = document.getElementById('signup-phone');
    if (signupPhoneInput) {
      signupPhoneInput.addEventListener('keydown', (e) => {
        const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (allowed.includes(e.key) || (e.ctrlKey || e.metaKey)) return;
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      });
      signupPhoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      });
      signupPhoneInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const digits = text.replace(/\D/g, '').slice(0, 10);
        document.execCommand('insertText', false, digits);
      });
    }

    // 6. Sign Up Form Submission (Triggers Live Mobile OTP Verification)
    const signupForm = document.getElementById('auth-signup-form');
    const signupAlert = document.getElementById('signup-alert-banner');
    this.pendingRegistration = null;

    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedRoleRadio = document.querySelector('input[name="signup-role"]:checked');
        const role = selectedRoleRadio ? selectedRoleRadio.value : 'farmer';

        const name = document.getElementById('signup-name')?.value.trim() || '';
        const email = document.getElementById('signup-email')?.value.trim() || '';
        const phone = document.getElementById('signup-phone')?.value.trim() || '';
        const password = document.getElementById('signup-password')?.value || '';
        const upiId = document.getElementById('signup-upi')?.value.trim() || '';
        const location = document.getElementById('signup-location')?.value.trim() || '';

        // Form Validation
        if (!name || !email || !phone || !password) {
          if (signupAlert) {
            signupAlert.className = 'p-3.5 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800';
            signupAlert.textContent = 'Please fill out all required fields to proceed.';
            signupAlert.classList.remove('hidden');
          }
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          if (signupAlert) {
            signupAlert.className = 'p-3.5 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800';
            signupAlert.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
            signupAlert.classList.remove('hidden');
          }
          return;
        }

        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
          if (signupAlert) {
            signupAlert.className = 'p-3.5 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800';
            signupAlert.textContent = 'Mobile number must be strictly 10 numeric digits.';
            signupAlert.classList.remove('hidden');
          }
          return;
        }

        if (password.length < 6) {
          if (signupAlert) {
            signupAlert.className = 'p-3.5 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800';
            signupAlert.textContent = 'Password must be at least 6 characters long.';
            signupAlert.classList.remove('hidden');
          }
          return;
        }

        // Collect role-tailored extra fields
        const extraFields = { location, upi_id: upiId, upiId };
        if (role === 'farmer') {
          extraFields.landHolding = document.getElementById('signup-farmer-land')?.value.trim() || 'Standard Operational Landholding';
          extraFields.primaryCrop = document.getElementById('signup-farmer-crop')?.value.trim() || 'Seasonal Produce';
          extraFields.farmingMethod = document.getElementById('signup-farmer-method')?.value || 'Conventional High-Yield Standard';
          extraFields.irrigationType = document.getElementById('signup-farmer-irrigation')?.value || 'Drip / Micro-Irrigation (Automated)';
          extraFields.soilType = document.getElementById('signup-farmer-soil')?.value || 'Black Cotton Soil (Optimal Moisture Retention)';
          extraFields.govtId = document.getElementById('signup-farmer-govtid')?.value.trim() || `KCC-MH-${Math.floor(1000 + Math.random() * 9000)}`;
          extraFields.storageCapacity = document.getElementById('signup-farmer-storage')?.value.trim() || '50 MT Covered Farm Storage';
        } else if (role === 'consumer') {
          extraFields.buyerType = document.getElementById('signup-consumer-type')?.value || 'Direct Bulk Buyer';
          extraFields.dockAddress = document.getElementById('signup-consumer-dock')?.value.trim() || location;
          extraFields.govtId = document.getElementById('signup-consumer-fssai')?.value.trim() || `FSSAI-${Date.now() % 100000}`;
        } else if (role === 'driver') {
          extraFields.drivingLicense = document.getElementById('signup-driver-dl')?.value.trim() || `DL-MH-${Math.floor(1000 + Math.random() * 9000)}`;
          extraFields.govtId = extraFields.drivingLicense;
          extraFields.vehicleNo = document.getElementById('signup-driver-rc')?.value.trim() || `MH-15-${Math.floor(1000 + Math.random() * 9000)}`;
          extraFields.vehicleType = document.getElementById('signup-driver-vtype')?.value || '10-Wheeler Multi-Axle Truck';
          extraFields.storageCapacity = document.getElementById('signup-driver-capacity')?.value.trim() || '10.0 Tons Net Capacity';
          extraFields.baseCorridor = document.getElementById('signup-driver-corridor')?.value.trim() || 'Regional Agro Corridor';
        }

        this.pendingRegistration = { role, name, email, phone, password, extraFields };

        const signupSubmitBtn = document.getElementById('signup-submit-btn');
        const originalText = signupSubmitBtn ? signupSubmitBtn.innerHTML : '';
        if (signupSubmitBtn) {
          signupSubmitBtn.disabled = true;
          signupSubmitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Dispatching OTP...';
          if (window.lucide) window.lucide.createIcons();
        }

        try {
          // Send Live OTP to Mobile Number
          const otpRes = await window.appStore.sendOtp(phone);
          if (signupAlert) signupAlert.classList.add('hidden');
          this.openOtpVerificationModal(phone, otpRes.otp);
        } catch (err) {
          if (signupAlert) {
            signupAlert.className = 'p-3.5 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800';
            signupAlert.textContent = 'Failed to dispatch verification code. Please try again.';
            signupAlert.classList.remove('hidden');
          }
        } finally {
          if (signupSubmitBtn) {
            signupSubmitBtn.disabled = false;
            signupSubmitBtn.innerHTML = originalText;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      });
    }

    // OTP Modal Listeners
    this.setupOtpModalListeners();

    // 7. Forgot Password Modal & Flow
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const closeForgotPasswordBtn = document.getElementById('close-forgot-password-btn');
    const cancelForgotPasswordBtn = document.getElementById('cancel-forgot-password-btn');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotPasswordAlert = document.getElementById('forgot-password-alert');
    const sendForgotOtpBtn = document.getElementById('send-forgot-otp-btn');
    const forgotOtpInput = document.getElementById('forgot-otp');
    const forgotOtpHint = document.getElementById('forgot-otp-hint');
    const toggleForgotPasswordBtn = document.getElementById('toggle-forgot-password-btn');
    const forgotNewPasswordInput = document.getElementById('forgot-new-password');
    const forgotConfirmPasswordInput = document.getElementById('forgot-confirm-password');
    const forgotIdentifierInput = document.getElementById('forgot-identifier');
    const submitForgotPasswordBtn = document.getElementById('submit-forgot-password-btn');

    const closeForgotModal = () => {
      if (forgotPasswordModal) forgotPasswordModal.classList.add('hidden');
      if (forgotPasswordAlert) forgotPasswordAlert.classList.add('hidden');
      if (forgotOtpHint) forgotOtpHint.classList.add('hidden');
      if (forgotPasswordForm) forgotPasswordForm.reset();
    };

    if (forgotPasswordLink && forgotPasswordModal) {
      forgotPasswordLink.addEventListener('click', () => {
        const loginIdentifier = document.getElementById('login-identifier')?.value.trim() || '';
        if (forgotIdentifierInput && loginIdentifier) {
          forgotIdentifierInput.value = loginIdentifier;
        }
        if (forgotPasswordAlert) forgotPasswordAlert.classList.add('hidden');
        if (forgotOtpHint) forgotOtpHint.classList.add('hidden');
        forgotPasswordModal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (closeForgotPasswordBtn) closeForgotPasswordBtn.addEventListener('click', closeForgotModal);
    if (cancelForgotPasswordBtn) cancelForgotPasswordBtn.addEventListener('click', closeForgotModal);

    if (forgotPasswordModal) {
      forgotPasswordModal.addEventListener('click', (e) => {
        if (e.target === forgotPasswordModal) closeForgotModal();
      });
    }

    if (toggleForgotPasswordBtn && forgotNewPasswordInput) {
      toggleForgotPasswordBtn.addEventListener('click', () => {
        const isPassword = forgotNewPasswordInput.getAttribute('type') === 'password';
        forgotNewPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
        toggleForgotPasswordBtn.innerHTML = isPassword ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' : '<i data-lucide="eye" class="w-4 h-4"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (sendForgotOtpBtn && forgotOtpInput && forgotOtpHint) {
      sendForgotOtpBtn.addEventListener('click', () => {
        const idVal = forgotIdentifierInput?.value.trim();
        if (!idVal) {
          if (forgotPasswordAlert) {
            forgotPasswordAlert.className = 'p-3 rounded-xl text-xs font-medium border bg-amber-50 border-amber-200 text-amber-800 mb-4';
            forgotPasswordAlert.textContent = 'Please enter your registered email or phone number first.';
            forgotPasswordAlert.classList.remove('hidden');
          }
          return;
        }
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        forgotOtpInput.value = generatedOtp;
        forgotOtpHint.innerHTML = `<i data-lucide="shield-check" class="w-4 h-4 flex-shrink-0 text-emerald-600"></i><span>Verification OTP: <strong class="font-mono font-bold">${generatedOtp}</strong> (Auto-verified for this session)</span>`;
        forgotOtpHint.classList.remove('hidden');
        if (forgotPasswordAlert) forgotPasswordAlert.classList.add('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = forgotIdentifierInput?.value.trim() || '';
        const newPassword = forgotNewPasswordInput?.value || '';
        const confirmPassword = forgotConfirmPasswordInput?.value || '';

        if (!identifier) {
          if (forgotPasswordAlert) {
            forgotPasswordAlert.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
            forgotPasswordAlert.textContent = 'Please enter your registered email or mobile number.';
            forgotPasswordAlert.classList.remove('hidden');
          }
          return;
        }

        if (newPassword.length < 6) {
          if (forgotPasswordAlert) {
            forgotPasswordAlert.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
            forgotPasswordAlert.textContent = 'Password must be at least 6 characters in length.';
            forgotPasswordAlert.classList.remove('hidden');
          }
          return;
        }

        if (newPassword !== confirmPassword) {
          if (forgotPasswordAlert) {
            forgotPasswordAlert.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
            forgotPasswordAlert.textContent = 'New password and confirmation password do not match.';
            forgotPasswordAlert.classList.remove('hidden');
          }
          return;
        }

        const originalBtnText = submitForgotPasswordBtn ? submitForgotPasswordBtn.innerHTML : '';
        if (submitForgotPasswordBtn) {
          submitForgotPasswordBtn.disabled = true;
          submitForgotPasswordBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Updating...';
          if (window.lucide) window.lucide.createIcons();
        }

        try {
          const res = await window.appStore.resetPassword(identifier, newPassword);
          if (res.success) {
            if (forgotPasswordAlert) {
              forgotPasswordAlert.className = 'p-3 rounded-xl text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-800 mb-4';
              forgotPasswordAlert.textContent = res.message || 'Password successfully updated!';
              forgotPasswordAlert.classList.remove('hidden');
            }
            this.showToast('Password updated! You can now log in.');
            const loginId = document.getElementById('login-identifier');
            if (loginId) loginId.value = identifier;
            const loginPwd = document.getElementById('login-password');
            if (loginPwd) loginPwd.value = '';

            setTimeout(() => {
              closeForgotModal();
            }, 1200);
          } else {
            if (forgotPasswordAlert) {
              forgotPasswordAlert.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
              forgotPasswordAlert.textContent = res.error || 'Password reset failed.';
              forgotPasswordAlert.classList.remove('hidden');
            }
          }
        } catch (err) {
          if (forgotPasswordAlert) {
            forgotPasswordAlert.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
            forgotPasswordAlert.textContent = 'Service unavailable. Please try again.';
            forgotPasswordAlert.classList.remove('hidden');
          }
        } finally {
          if (submitForgotPasswordBtn) {
            submitForgotPasswordBtn.disabled = false;
            submitForgotPasswordBtn.innerHTML = originalBtnText;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      });
    }

    // 8. Sign Out action
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.appStore.logout();
        const loginAlert = document.getElementById('login-alert-banner');
        if (loginAlert) {
          loginAlert.classList.add('hidden');
          loginAlert.textContent = '';
        }
        this.showToast('Signed out successfully.');
        this.setActiveRole('login');
      });
    }
  }

  // Click on top navbar brand logo
  handleHomeClick() {
    const currentUser = window.appStore.getCurrentUser();
    if (currentUser && currentUser.role) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.setActiveRole('login');
    }
  }

  bindLanguageSwitcher() {
    // Localization restricted to English only
  }

  // ================= FLOATING TOAST NOTIFICATIONS =================
  showToast(message, type = 'info') {
    let container = document.getElementById('kisansetu-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'kisansetu-toast-container';
      container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border text-xs font-semibold transform transition-all duration-300 translate-y-2 opacity-0';

    let bgBorder = 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/20';
    let iconSvg = '<i data-lucide="info" class="w-4 h-4 text-sky-400 shrink-0 mt-0.5"></i>';

    if (type === 'success' || type === 'accepted') {
      bgBorder = 'bg-emerald-950/95 text-emerald-100 border-emerald-500/60 shadow-emerald-950/20';
      iconSvg = '<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>';
    } else if (type === 'error' || type === 'declined') {
      bgBorder = 'bg-rose-950/95 text-rose-100 border-rose-500/60 shadow-rose-950/20';
      iconSvg = '<i data-lucide="x-circle" class="w-4 h-4 text-rose-400 shrink-0 mt-0.5"></i>';
    } else if (type === 'warning' || type === 'negotiated') {
      bgBorder = 'bg-amber-950/95 text-amber-100 border-amber-500/60 shadow-amber-950/20';
      iconSvg = '<i data-lucide="handshake" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>';
    } else if (type === 'transit') {
      bgBorder = 'bg-indigo-950/95 text-indigo-100 border-indigo-500/60 shadow-indigo-950/20';
      iconSvg = '<i data-lucide="truck" class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5"></i>';
    }

    toast.className += ` ${bgBorder}`;
    toast.innerHTML = `
      ${iconSvg}
      <div class="flex-1 leading-snug">${message}</div>
      <button type="button" class="text-slate-400 hover:text-white ml-2 text-sm leading-none shrink-0 cursor-pointer" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // ================= OTP VERIFICATION CONTROLLER =================
  openOtpVerificationModal(phone, otpCode) {
    const modal = document.getElementById('otp-verification-modal');
    const phoneDisplay = document.getElementById('otp-target-phone-display');
    const smsCodeEl = document.getElementById('otp-sms-code');
    const input = document.getElementById('otp-code-input');
    const alertBanner = document.getElementById('otp-alert-banner');
    const smsBanner = document.getElementById('otp-sms-banner');
    const quickFillBtn = document.getElementById('otp-quick-fill-btn');

    if (smsBanner) smsBanner.classList.add('hidden');
    if (phoneDisplay) phoneDisplay.textContent = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    if (smsCodeEl) smsCodeEl.textContent = otpCode || '------';
    
    // Clear input initially and auto-fill with 1-second gap per user request
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);

      if (this.otpAutoFillTimer) clearTimeout(this.otpAutoFillTimer);
      this.otpAutoFillTimer = setTimeout(() => {
        if (input && otpCode) {
          input.value = otpCode;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 1000);
    }
    
    if (quickFillBtn) {
      quickFillBtn.onclick = () => {
        if (input && otpCode) {
          input.value = otpCode;
          input.focus();
        }
      };
    }
    if (smsCodeEl) {
      smsCodeEl.onclick = () => {
        if (input && otpCode) {
          input.value = otpCode;
          input.focus();
        }
      };
    }

    if (alertBanner) alertBanner.classList.add('hidden');

    this.startOtpCountdown();
    if (modal) modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  startOtpCountdown() {
    let timeLeft = 45;
    const countdownEl = document.getElementById('otp-countdown');
    const resendBtn = document.getElementById('otp-resend-btn');
    if (countdownEl) countdownEl.textContent = timeLeft;
    if (resendBtn) {
      resendBtn.disabled = true;
      resendBtn.className = 'font-bold text-slate-400 cursor-not-allowed transition';
    }

    if (this._otpTimer) clearInterval(this._otpTimer);
    this._otpTimer = setInterval(() => {
      timeLeft--;
      if (countdownEl) countdownEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(this._otpTimer);
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.className = 'font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer transition';
        }
      }
    }, 1000);
  }

  setupOtpModalListeners() {
    const modal = document.getElementById('otp-verification-modal');
    const closeBtn = document.getElementById('close-otp-modal-btn');
    const changeBtn = document.getElementById('otp-change-number-btn');
    const resendBtn = document.getElementById('otp-resend-btn');
    const form = document.getElementById('otp-verification-form');
    const input = document.getElementById('otp-code-input');
    const alertBanner = document.getElementById('otp-alert-banner');

    const closeModal = () => {
      if (this._otpTimer) clearInterval(this._otpTimer);
      if (this.otpAutoFillTimer) clearTimeout(this.otpAutoFillTimer);
      if (modal) modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (changeBtn) changeBtn.addEventListener('click', () => {
      closeModal();
      const phoneInp = document.getElementById('signup-phone');
      if (phoneInp) phoneInp.focus();
    });

    if (input) {
      input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
      });
    }

    if (resendBtn) {
      resendBtn.addEventListener('click', async () => {
        if (!this.pendingRegistration || !this.pendingRegistration.phone) return;
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';
        try {
          const res = await window.appStore.sendOtp(this.pendingRegistration.phone);
          const smsCodeEl = document.getElementById('otp-sms-code');
          if (smsCodeEl) smsCodeEl.textContent = res.otp;
          if (input) {
            input.value = '';
            if (this.otpAutoFillTimer) clearTimeout(this.otpAutoFillTimer);
            this.otpAutoFillTimer = setTimeout(() => {
              if (input && res.otp) {
                input.value = res.otp;
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }, 1000);
          }
          this.showToast(`New verification OTP sent to +91 ${this.pendingRegistration.phone}`);
          this.startOtpCountdown();
        } catch (err) {
          this.showToast('Failed to resend OTP.', 'error');
        } finally {
          resendBtn.textContent = 'Resend OTP';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!this.pendingRegistration) return;
        const code = (input ? input.value : '').trim();
        if (code.length !== 6) {
          if (alertBanner) {
            alertBanner.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
            alertBanner.textContent = 'Please enter all 6 digits of the OTP verification code.';
            alertBanner.classList.remove('hidden');
          }
          return;
        }

        const submitBtn = document.getElementById('otp-verify-submit-btn');
        const origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Verifying Code...';
          if (window.lucide) window.lucide.createIcons();
        }

        try {
          const verifyRes = await window.appStore.verifyOtp(this.pendingRegistration.phone, code);
          if (verifyRes.success) {
            const regRes = await window.appStore.registerUser(
              this.pendingRegistration.role,
              this.pendingRegistration.name,
              this.pendingRegistration.email,
              this.pendingRegistration.phone,
              this.pendingRegistration.password,
              this.pendingRegistration.extraFields
            );

            if (regRes.success) {
              closeModal();
              const signupForm = document.getElementById('auth-signup-form');
              if (signupForm) signupForm.reset();
              this.showToast(`✓ Mobile Verified! Welcome to KisanSetu, ${regRes.user.name}!`, 'success');
              this.setActiveRole(regRes.user.role);
            } else {
              if (alertBanner) {
                alertBanner.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
                alertBanner.textContent = regRes.error || 'Registration failed.';
                alertBanner.classList.remove('hidden');
              }
            }
          } else {
            if (alertBanner) {
              alertBanner.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
              alertBanner.textContent = verifyRes.error || 'Invalid OTP code. Please check and try again.';
              alertBanner.classList.remove('hidden');
            }
          }
        } catch (err) {
          if (alertBanner) {
            alertBanner.className = 'p-3 rounded-xl text-xs font-medium border bg-rose-50 border-rose-200 text-rose-800 mb-4';
            alertBanner.textContent = 'Verification service error. Please try again.';
            alertBanner.classList.remove('hidden');
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      });
    }

    this.setupSystemFeedbackModal();
  }

  // ================= SYSTEM FEEDBACK MODAL (REPLACING NATIVE ALERTS) =================
  setupSystemFeedbackModal() {
    window.showSystemAlert = (title, message, type = 'success', onOk = null) => {
      if (typeof title === 'object' && title !== null) {
        message = title.message;
        type = title.type || 'success';
        onOk = title.onOk || onOk;
        title = title.title;
      }
      return new Promise((resolve) => {
        const modal = document.getElementById('system-feedback-modal');
        if (!modal) {
          alert(message || title);
          if (onOk) onOk();
          resolve();
          return;
        }
        const titleEl = document.getElementById('system-feedback-title');
        const msgEl = document.getElementById('system-feedback-message');
        const iconWrap = document.getElementById('system-feedback-icon-wrap');
        const icon = document.getElementById('system-feedback-icon');
        const cancelBtn = document.getElementById('system-feedback-cancel-btn');
        const okBtn = document.getElementById('system-feedback-ok-btn');

        if (titleEl) titleEl.textContent = title || 'Notification';
        if (msgEl) msgEl.textContent = message || '';
        if (cancelBtn) cancelBtn.classList.add('hidden');

        if (iconWrap && icon) {
          if (type === 'error') {
            iconWrap.className = 'w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs';
            icon.setAttribute('data-lucide', 'alert-triangle');
          } else if (type === 'warning') {
            iconWrap.className = 'w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs';
            icon.setAttribute('data-lucide', 'alert-circle');
          } else if (type === 'info') {
            iconWrap.className = 'w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs';
            icon.setAttribute('data-lucide', 'info');
          } else {
            iconWrap.className = 'w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs';
            icon.setAttribute('data-lucide', 'check-circle-2');
          }
        }

        const closeHandler = () => {
          modal.classList.add('hidden');
          okBtn.removeEventListener('click', closeHandler);
          if (onOk) onOk();
          resolve();
        };
        const inputEl = document.getElementById('system-feedback-input');
        if (inputEl) inputEl.classList.add('hidden');
        okBtn.addEventListener('click', closeHandler, { once: true });
        modal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    };

    window.showSystemConfirm = (title, message, onConfirm = null, onCancel = null) => {
      if (typeof title === 'object' && title !== null) {
        message = title.message;
        onConfirm = title.onConfirm || onConfirm;
        onCancel = title.onCancel || onCancel;
        title = title.title;
      }
      return new Promise((resolve) => {
        const modal = document.getElementById('system-feedback-modal');
        if (!modal) {
          const res = confirm(message || title);
          if (res) { if (onConfirm) onConfirm(); resolve(true); }
          else { if (onCancel) onCancel(); resolve(false); }
          return;
        }
        const titleEl = document.getElementById('system-feedback-title');
        const msgEl = document.getElementById('system-feedback-message');
        const inputEl = document.getElementById('system-feedback-input');
        const iconWrap = document.getElementById('system-feedback-icon-wrap');
        const icon = document.getElementById('system-feedback-icon');
        const cancelBtn = document.getElementById('system-feedback-cancel-btn');
        const okBtn = document.getElementById('system-feedback-ok-btn');

        if (titleEl) titleEl.textContent = title || 'Confirmation Required';
        if (msgEl) msgEl.textContent = message || '';
        if (inputEl) inputEl.classList.add('hidden');
        if (cancelBtn) cancelBtn.classList.remove('hidden');

        if (iconWrap && icon) {
          iconWrap.className = 'w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs';
          icon.setAttribute('data-lucide', 'help-circle');
        }

        const onOkClick = () => {
          modal.classList.add('hidden');
          if (onConfirm) onConfirm();
          resolve(true);
        };
        const onCancelClick = () => {
          modal.classList.add('hidden');
          if (onCancel) onCancel();
          resolve(false);
        };

        okBtn.onclick = onOkClick;
        cancelBtn.onclick = onCancelClick;
        modal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    };

    window.showSystemPrompt = (title, message, defaultValue = '', onOk = null, onCancel = null) => {
      if (typeof title === 'object' && title !== null) {
        message = title.message;
        defaultValue = title.defaultValue || defaultValue;
        onOk = title.onOk || onOk;
        onCancel = title.onCancel || onCancel;
        title = title.title;
      }
      return new Promise((resolve) => {
        const modal = document.getElementById('system-feedback-modal');
        if (!modal) {
          const res = prompt(message || title, defaultValue);
          if (res !== null) { if (onOk) onOk(res); resolve(res); }
          else { if (onCancel) onCancel(); resolve(null); }
          return;
        }
        const titleEl = document.getElementById('system-feedback-title');
        const msgEl = document.getElementById('system-feedback-message');
        const inputEl = document.getElementById('system-feedback-input');
        const iconWrap = document.getElementById('system-feedback-icon-wrap');
        const icon = document.getElementById('system-feedback-icon');
        const cancelBtn = document.getElementById('system-feedback-cancel-btn');
        const okBtn = document.getElementById('system-feedback-ok-btn');

        if (titleEl) titleEl.textContent = title || 'Input Required';
        if (msgEl) msgEl.textContent = message || '';
        if (inputEl) {
          inputEl.value = defaultValue;
          inputEl.classList.remove('hidden');
        }
        if (cancelBtn) cancelBtn.classList.remove('hidden');

        if (iconWrap && icon) {
          iconWrap.className = 'w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3.5 shadow-xs';
          icon.setAttribute('data-lucide', 'edit-3');
        }

        const cleanup = () => {
          modal.classList.add('hidden');
          if (inputEl) inputEl.classList.add('hidden');
        };

        const onOkClick = () => {
          const val = inputEl ? inputEl.value : '';
          cleanup();
          if (onOk) onOk(val);
          resolve(val);
        };
        const onCancelClick = () => {
          cleanup();
          if (onCancel) onCancel();
          resolve(null);
        };

        okBtn.onclick = onOkClick;
        cancelBtn.onclick = onCancelClick;
        modal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
        if (inputEl) {
          setTimeout(() => inputEl.focus(), 100);
        }
      });
    };
  }

  // ================= 3. ROLE-ISOLATED PORTAL ACTIVATOR =================
  setActiveRole(role) {
    window.appStore.setActiveRole(role);

    // Toggle Portal views with strict role isolation
    const portalViews = {
      login: document.getElementById('portal-unified-login'),
      farmer: document.getElementById('portal-farmer-dashboard'),
      consumer: document.getElementById('portal-consumer-dashboard'),
      driver: document.getElementById('portal-driver-dashboard')
    };

    Object.keys(portalViews).forEach(key => {
      if (portalViews[key]) {
        if (key === role) {
          portalViews[key].classList.remove('hidden');
        } else {
          portalViews[key].classList.add('hidden');
        }
      }
    });

    const headerLoggedOutBadge = document.getElementById('header-logged-out-badge');
    const headerLoggedInBadge = document.getElementById('header-logged-in-badge');
    const headerRolePill = document.getElementById('header-role-pill');
    const headerRoleTitle = document.getElementById('header-role-title');
    const headerSessionUser = document.getElementById('header-session-user');
    const profileChip = document.getElementById('active-user-profile-chip');
    const profileName = document.getElementById('profile-user-name');
    const profileRole = document.getElementById('profile-user-role');
    const cartBtn = document.getElementById('header-cart-btn');

    if (role === 'login') {
      // Clear and hide any lingering login alert banner
      const loginAlert = document.getElementById('login-alert-banner');
      if (loginAlert) {
        loginAlert.classList.add('hidden');
        loginAlert.textContent = '';
      }

      // Unauthenticated state
      if (headerLoggedOutBadge) headerLoggedOutBadge.classList.remove('hidden');
      if (headerLoggedInBadge) headerLoggedInBadge.classList.add('hidden');
      if (profileChip) profileChip.classList.add('hidden');
      if (cartBtn) cartBtn.classList.add('hidden');
    } else {
      // Authenticated state (farmer, consumer, driver)
      const currentUser = window.appStore.getCurrentUser();
      const userName = currentUser ? currentUser.name : (role === 'farmer' ? 'Ramesh Patel' : role === 'consumer' ? 'Priya Sharma' : 'Gurpreet Singh');

      if (headerLoggedOutBadge) headerLoggedOutBadge.classList.add('hidden');
      if (headerLoggedInBadge) {
        headerLoggedInBadge.classList.remove('hidden');
        headerLoggedInBadge.classList.add('flex');
      }

      if (headerRolePill && headerRoleTitle) {
        if (role === 'farmer') {
          headerRolePill.className = 'px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 bg-emerald-700 text-white';
          headerRoleTitle.innerHTML = '<i data-lucide="tractor" class="w-3.5 h-3.5 inline mr-1"></i> Farmer Workspace';
        } else if (role === 'consumer') {
          headerRolePill.className = 'px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 bg-blue-700 text-white';
          headerRoleTitle.innerHTML = '<i data-lucide="shopping-cart" class="w-3.5 h-3.5 inline mr-1"></i> Consumer Hub';
        } else if (role === 'driver') {
          headerRolePill.className = 'px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 bg-amber-600 text-white';
          headerRoleTitle.innerHTML = '<i data-lucide="truck" class="w-3.5 h-3.5 inline mr-1"></i> Truck Logistics';
        }
      }

      if (headerSessionUser) headerSessionUser.textContent = userName;

      // Profile chip
      if (profileChip) profileChip.classList.remove('hidden');
      if (profileName) profileName.textContent = userName;
      if (profileRole) {
        profileRole.textContent = role === 'farmer' ? 'Verified Kisan • Nashik' :
                                  role === 'consumer' ? 'Commercial Direct Buyer' :
                                  'Fleet Driver • MH-15';
      }

      // Consumer cart only visible to Consumer
      if (cartBtn) {
        if (role === 'consumer') cartBtn.classList.remove('hidden');
        else cartBtn.classList.add('hidden');
      }

      // Trigger controller renders safely
      try {
        if (role === 'farmer' && window.farmerController) window.farmerController.render();
        if (role === 'consumer' && window.consumerController) window.consumerController.render();
        if (role === 'driver' && window.driverController) window.driverController.render();
      } catch (err) {
        console.error(`Error rendering view for ${role}:`, err);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new KisanSetuApp();
  window.appCoordinator = window.app;
});

