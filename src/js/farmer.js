// Farmer Dashboard Logic: Listing Form, Voice Parser, MSP Slider, Grading UI, Active Listings, Inbox, and Sidebar Tools

class FarmerController {
  constructor() {
    this.currentView = 'listings'; // 'listings' | 'add_crop' | 'inbox' | 'analytics' | 'bulletins' | 'notifications'
    this.initEventListeners();
    this.setupHarvestCalculator();
    this.setupPriceMspSlider();
    this.setupVoiceIntegration();
    this.setupCropPresets();
    this.setupFarmerCounterModal();
    this.updateNotificationBadge();
    this.updateInboxBadge();
    if (window.appStore && window.appStore.syncOrdersWithDatabase) {
      window.appStore.syncOrdersWithDatabase();
      window.appStore.syncCropsWithDatabase();
    }
  }

  initEventListeners() {
    // Listen for store updates
    window.appStore.subscribe((event, payload) => {
      if (['crop_added', 'order_added', 'order_updated', 'data_reset'].includes(event)) {
        this.render();
      }
      if (['notifications_updated', 'notification_added', 'data_reset'].includes(event)) {
        this.updateNotificationBadge();
        if (this.currentView === 'notifications') {
          this.renderFarmerNotifications();
        }
      }
    });

    // Sidebar navigation clicks
    document.querySelectorAll('.farmer-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Form submit
    const form = document.getElementById('farmer-crop-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCropSubmit();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        const confirmed = window.showSystemConfirm
          ? await window.showSystemConfirm('Reset Demo Data?', 'Reset all demo data to initial state?')
          : confirm('Reset all demo data to initial state?');
        if (confirmed) {
          window.appStore.resetDemoData();
          if (window.showSystemAlert) {
            window.showSystemAlert('Data Refreshed', 'Demo data successfully refreshed!', 'success');
          } else {
            alert('Demo data successfully refreshed!');
          }
        }
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.farmer-nav-btn').forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('bg-emerald-800', 'text-white', 'shadow-md');
        btn.classList.remove('text-emerald-100', 'hover:bg-emerald-800/60');
      } else {
        btn.classList.remove('bg-emerald-800', 'text-white', 'shadow-md');
        btn.classList.add('text-emerald-100', 'hover:bg-emerald-800/60');
      }
    });

    // Hide all view panels
    const views = ['listings', 'add_crop', 'inbox', 'analytics', 'bulletins', 'notifications'];
    views.forEach(v => {
      const el = document.getElementById(`farmer-view-${v}`);
      if (el) el.classList.add('hidden');
    });

    // Show target
    const target = document.getElementById(`farmer-view-${viewName}`);
    if (target) target.classList.remove('hidden');

    if (viewName === 'analytics') {
      this.renderAnalyticsCharts();
      if (window.lucide) window.lucide.createIcons();
    } else if (viewName === 'inbox') {
      if (window.appStore && window.appStore.syncOrdersWithDatabase) window.appStore.syncOrdersWithDatabase();
      this.renderInbox();
    } else if (viewName === 'listings') {
      if (window.appStore && window.appStore.syncCropsWithDatabase) window.appStore.syncCropsWithDatabase();
      this.renderListings();
    } else if (viewName === 'bulletins') {
      this.renderBulletins();
    } else if (viewName === 'notifications') {
      this.renderFarmerNotifications();
    }
  }

  // Preset crops quick-fill helper
  setupCropPresets() {
    const presets = [
      { name: 'Sharbati Golden Wheat', cat: 'Cereals', unit: 'Quintal', msp: 2275, mandi: 2420, price: 2650, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80' },
      { name: 'Alphonso Ratnagiri Mangoes', cat: 'Fruits', unit: 'Crates', msp: 1600, mandi: 1720, price: 1850, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80' },
      { name: 'Pusa 1121 Basmati Rice', cat: 'Cereals', unit: 'Quintal', msp: 3450, mandi: 3600, price: 3800, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
      { name: 'Red Hybrid Vine Tomatoes', cat: 'Vegetables', unit: 'Crates', msp: 380, mandi: 420, price: 480, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
      { name: 'Lakadong High-Curcumin Turmeric', cat: 'Spices', unit: 'Quintal', msp: 7200, mandi: 7900, price: 8400, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
      { name: 'BT Long-Staple Cotton', cat: 'Cash Crops', unit: 'Quintal', msp: 6620, mandi: 6900, price: 7200, img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80' }
    ];

    const presetContainer = document.getElementById('crop-preset-pills');
    if (presetContainer) {
      presetContainer.innerHTML = presets.map(p => `
        <button type="button" class="preset-pill px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5"
          data-preset='${JSON.stringify(p)}'>
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-600"></i> ${p.name}
        </button>
      `).join('');

      presetContainer.querySelectorAll('.preset-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = JSON.parse(btn.dataset.preset);
          document.getElementById('crop-name-input').value = p.name;
          document.getElementById('crop-category-select').value = p.cat;
          document.getElementById('crop-unit-select').value = p.unit;
          document.getElementById('crop-image-url').value = p.img;
          this.updateImagePreview(p.img);
          this.updateMspBenchmarks(p.msp, p.mandi, p.price);
        });
      });
    }

    // Image URL change & click triggers
    const imgInput = document.getElementById('crop-image-url');
    if (imgInput) {
      imgInput.addEventListener('input', (e) => this.updateImagePreview(e.target.value));
    }

    // Photo thumbnails picker
    document.querySelectorAll('.preset-photo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        if (imgInput) imgInput.value = url;
        this.updateImagePreview(url);
      });
    });

    // Organic Toggle listener
    const organicToggle = document.getElementById('crop-organic-toggle');
    const certField = document.getElementById('organic-cert-container');
    if (organicToggle && certField) {
      organicToggle.addEventListener('change', () => {
        if (organicToggle.checked) {
          certField.classList.remove('hidden');
        } else {
          certField.classList.add('hidden');
        }
      });
    }
  }

  updateImagePreview(url) {
    const preview = document.getElementById('crop-preview-img');
    const placeholder = document.getElementById('crop-preview-placeholder');
    if (preview && placeholder) {
      if (url) {
        preview.src = url;
        preview.classList.remove('hidden');
        placeholder.classList.add('hidden');
      } else {
        preview.classList.add('hidden');
        placeholder.classList.remove('hidden');
      }
    }
  }

  // Harvest Timeline: Calculates harvest date from days ago
  setupHarvestCalculator() {
    const daysInput = document.getElementById('harvest-days-ago');
    const daysDisplay = document.getElementById('harvest-days-display');
    const dateDisplay = document.getElementById('harvest-calculated-date');
    const freshnessMeter = document.getElementById('harvest-freshness-meter');
    const freshnessText = document.getElementById('harvest-freshness-text');

    const updateHarvest = (days) => {
      days = parseInt(days, 10) || 0;
      if (daysDisplay) daysDisplay.textContent = days === 0 ? 'Harvested Today' : days === 1 ? '1 day ago (Yesterday)' : `${days} days ago`;
      
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - days);
      const formatted = targetDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      if (dateDisplay) dateDisplay.textContent = `Calculated Harvest Date: ${formatted}`;

      // Calculate freshness index (100% - days * 2.5%, min 70%)
      const freshness = Math.max(70, 100 - (days * 2.5));
      if (freshnessMeter) {
        freshnessMeter.style.width = `${freshness}%`;
        if (freshness >= 95) {
          freshnessMeter.className = 'h-2.5 rounded-full bg-emerald-500 transition-all duration-300';
        } else if (freshness >= 85) {
          freshnessMeter.className = 'h-2.5 rounded-full bg-lime-500 transition-all duration-300';
        } else {
          freshnessMeter.className = 'h-2.5 rounded-full bg-amber-500 transition-all duration-300';
        }
      }
      if (freshnessText) {
        freshnessText.textContent = `${Math.round(freshness)}% Peak Quality Index`;
      }
    };

    if (daysInput) {
      daysInput.addEventListener('input', (e) => updateHarvest(e.target.value));
      updateHarvest(daysInput.value || 2);
    }
  }

  // Pricing & Location Tool: Radius slider and Mandi vs MSP adjustment slider
  setupPriceMspSlider() {
    const radiusSlider = document.getElementById('location-radius-slider');
    const radiusDisplay = document.getElementById('location-radius-display');
    if (radiusSlider && radiusDisplay) {
      radiusSlider.addEventListener('input', (e) => {
        radiusDisplay.textContent = `${e.target.value} km`;
      });
    }

    const priceSlider = document.getElementById('pricing-slider');
    const priceInput = document.getElementById('crop-price-input');
    const mspBadge = document.getElementById('msp-badge-val');
    const mandiBadge = document.getElementById('mandi-badge-val');
    const marginBadge = document.getElementById('profit-margin-badge');

    const updatePriceCalculations = (price) => {
      price = parseFloat(price) || 2500;
      if (priceInput) priceInput.value = price;
      if (priceSlider) priceSlider.value = price;

      const msp = parseFloat(priceSlider.dataset.msp || 2275);
      const mandi = parseFloat(priceSlider.dataset.mandi || 2420);

      const marginOverMsp = Math.round(((price - msp) / msp) * 100);
      const marginOverMandi = Math.round(((price - mandi) / mandi) * 100);

      if (marginBadge) {
        if (price >= mandi) {
          marginBadge.textContent = `+${marginOverMandi}% above Mandi Rate (+${marginOverMsp}% over MSP)`;
          marginBadge.className = 'text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
        } else if (price >= msp) {
          marginBadge.textContent = `+${marginOverMsp}% over Govt MSP (Competitive Wholesale)`;
          marginBadge.className = 'text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800';
        } else {
          marginBadge.textContent = `Below MSP Warning (Govt minimum is ₹${msp})`;
          marginBadge.className = 'text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800';
        }
      }
    };

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => updatePriceCalculations(e.target.value));
    }
    if (priceInput) {
      priceInput.addEventListener('input', (e) => updatePriceCalculations(e.target.value));
    }

    // Quality Grading UI click handlers
    document.querySelectorAll('.grade-select-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.grade-select-card').forEach(c => {
          c.classList.remove('border-emerald-600', 'bg-emerald-50/70', 'ring-2', 'ring-emerald-500');
          c.classList.add('border-slate-200');
        });
        card.classList.add('border-emerald-600', 'bg-emerald-50/70', 'ring-2', 'ring-emerald-500');
        card.classList.remove('border-slate-200');
        const gradeInput = document.getElementById('selected-grade-input');
        if (gradeInput) gradeInput.value = card.dataset.grade;
      });
    });
  }

  updateMspBenchmarks(msp, mandi, price) {
    const priceSlider = document.getElementById('pricing-slider');
    const mspBadge = document.getElementById('msp-badge-val');
    const mandiBadge = document.getElementById('mandi-badge-val');
    const minSlider = document.getElementById('slider-min-msp');
    const maxSlider = document.getElementById('slider-max-mandi');

    if (priceSlider) {
      priceSlider.dataset.msp = msp;
      priceSlider.dataset.mandi = mandi;
      priceSlider.min = Math.round(msp * 0.9);
      priceSlider.max = Math.round(mandi * 1.5);
      priceSlider.value = price;
    }
    if (mspBadge) mspBadge.textContent = `₹${msp}`;
    if (mandiBadge) mandiBadge.textContent = `₹${mandi}`;
    if (minSlider) minSlider.textContent = `MSP: ₹${msp}`;
    if (maxSlider) maxSlider.textContent = `Mandi Max: ₹${Math.round(mandi * 1.35)}`;

    const priceInput = document.getElementById('crop-price-input');
    if (priceInput) priceInput.value = price;

    const marginBadge = document.getElementById('profit-margin-badge');
    if (marginBadge) {
      const margin = Math.round(((price - mandi) / mandi) * 100);
      marginBadge.textContent = `+${margin}% vs Mandi`;
    }
  }

  // Voice integration setup
  setupVoiceIntegration() {
    const micBtn = document.getElementById('voice-mic-btn');
    const micStatus = document.getElementById('voice-status-text');
    const waveVisualizer = document.getElementById('voice-wave-visualizer');
    const voiceCard = document.getElementById('voice-assistant-card');

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (window.voiceAssistant.isListening) {
          window.voiceAssistant.stopListening();
        } else {
          window.voiceAssistant.startListening(
            (parsed) => this.applyVoiceParsedData(parsed),
            (isListening, reason) => {
              if (isListening) {
                micBtn.classList.add('bg-red-600', 'animate-pulse');
                micBtn.classList.remove('bg-emerald-600');
                if (waveVisualizer) waveVisualizer.classList.remove('hidden');
                if (micStatus) micStatus.textContent = reason === 'simulated' ? 'Listening... Speak crop details or click sample prompt below' : 'Listening... Speak crop details';
              } else {
                micBtn.classList.remove('bg-red-600', 'animate-pulse');
                micBtn.classList.add('bg-emerald-600');
                if (waveVisualizer) waveVisualizer.classList.add('hidden');
                if (micStatus) micStatus.textContent = 'Tap to speak & list crop hands-free';
              }
            }
          );
        }
      });
    }

    // Voice quick sample buttons
    document.querySelectorAll('.voice-sample-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleKey = btn.dataset.sample;
        const parsed = window.voiceAssistant.simulateVoiceSample(sampleKey);
        this.applyVoiceParsedData(parsed);
      });
    });
  }

  applyVoiceParsedData(parsed) {
    if (!parsed) return;

    // Auto-fill form fields
    const nameInput = document.getElementById('crop-name-input');
    const catSelect = document.getElementById('crop-category-select');
    const qtyInput = document.getElementById('crop-quantity-input');
    const unitSelect = document.getElementById('crop-unit-select');
    const organicToggle = document.getElementById('crop-organic-toggle');
    const certField = document.getElementById('organic-cert-container');
    const harvestDays = document.getElementById('harvest-days-ago');
    const priceInput = document.getElementById('crop-price-input');
    const priceSlider = document.getElementById('pricing-slider');

    if (nameInput) nameInput.value = parsed.cropName;
    if (catSelect) catSelect.value = parsed.category;
    if (qtyInput) qtyInput.value = parsed.quantity;
    if (unitSelect) unitSelect.value = parsed.unit;
    
    if (organicToggle) {
      organicToggle.checked = parsed.isOrganic;
      if (certField) {
        if (parsed.isOrganic) {
          certField.classList.remove('hidden');
          const certInput = document.getElementById('crop-cert-no');
          if (certInput && !certInput.value) certInput.value = 'JAIVIK-IND-' + Math.floor(1000 + Math.random() * 9000);
        } else {
          certField.classList.add('hidden');
        }
      }
    }

    if (harvestDays) {
      harvestDays.value = parsed.harvestDaysAgo;
      harvestDays.dispatchEvent(new Event('input'));
    }

    if (priceInput) priceInput.value = parsed.price;
    if (priceSlider) {
      priceSlider.value = parsed.price;
      priceSlider.dispatchEvent(new Event('input'));
    }

    // Select grade card
    if (parsed.grade) {
      document.querySelectorAll('.grade-select-card').forEach(card => {
        if (card.dataset.grade === parsed.grade) {
          card.click();
        }
      });
    }

    // Auto-fill preset image if matched
    const matchedCrop = INITIAL_CROPS.find(c => c.name.toLowerCase().includes(parsed.cropName.toLowerCase().split(' ')[0]));
    if (matchedCrop) {
      const imgInput = document.getElementById('crop-image-url');
      if (imgInput) {
        imgInput.value = matchedCrop.imageUrl;
        this.updateImagePreview(matchedCrop.imageUrl);
      }
      this.updateMspBenchmarks(matchedCrop.mspPrice, matchedCrop.mandiPrice, parsed.price);
    }

    // Show visual confirmation notification
    const banner = document.getElementById('voice-success-banner');
    if (banner) {
      banner.classList.remove('hidden');
      document.getElementById('voice-success-msg').textContent = `Parsed: "${parsed.rawText}" ➔ Auto-filled form fields!`;
      setTimeout(() => banner.classList.add('hidden'), 6000);
    }

    // Scroll smoothly to form
    const form = document.getElementById('farmer-crop-form');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
  }

  handleCropSubmit() {
    const name = document.getElementById('crop-name-input').value;
    const category = document.getElementById('crop-category-select').value;
    const quantity = parseFloat(document.getElementById('crop-quantity-input').value) || 10;
    const unit = document.getElementById('crop-unit-select').value;
    const pricePerUnit = parseFloat(document.getElementById('crop-price-input').value) || 2000;
    const isOrganic = document.getElementById('crop-organic-toggle').checked;
    const organicCertNo = isOrganic ? (document.getElementById('crop-cert-no').value || 'NPOP-VERIFIED-2026') : '';
    const harvestDaysAgo = parseInt(document.getElementById('harvest-days-ago').value, 10) || 0;
    const grade = document.getElementById('selected-grade-input').value || 'A';
    const deliveryRadiusKm = parseInt(document.getElementById('location-radius-slider').value, 10) || 75;
    const imageUrl = document.getElementById('crop-image-url').value || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
    const description = document.getElementById('crop-description-input').value || 'Fresh direct harvest from fertile soils.';

    const harvestDateObj = new Date();
    harvestDateObj.setDate(harvestDateObj.getDate() - harvestDaysAgo);
    const harvestDate = harvestDateObj.toISOString().split('T')[0];
    const freshnessIndex = Math.max(70, Math.round(100 - harvestDaysAgo * 2.5));

    const newCrop = {
      name,
      category,
      quantity,
      unit,
      pricePerUnit,
      mandiPrice: Math.round(pricePerUnit * 0.92),
      mspPrice: Math.round(pricePerUnit * 0.85),
      isOrganic,
      organicCertNo,
      harvestDaysAgo,
      harvestDate,
      freshnessIndex,
      grade,
      gradeLabel: grade === 'A+' ? 'Export Grade A+' : grade === 'A' ? 'Premium Grade A' : 'Standard Market Grade',
      qualitySpecs: {
        uniformity: 96,
        grainSize: 'Prime Standard'
      },
      farmerId: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().id) || 'farmer-1',
      farmerName: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().name) || 'Ramesh Patel',
      farmLocation: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().location) || 'Nashik Agro-Cluster, Maharashtra',
      coordinates: { lat: 19.9975, lng: 73.7898 },
      deliveryRadiusKm,
      imageUrl,
      description
    };

    window.appStore.addCrop(newCrop);

    if (window.showSystemAlert) {
      window.showSystemAlert('Listing Published Successfully', `"${name}" (${quantity} ${unit}) is now live on the KisanSetu marketplace!`, 'success');
    } else {
      alert(`Success! "${name}" (${quantity} ${unit}) has been listed on the marketplace.`);
    }
    document.getElementById('farmer-crop-form').reset();
    this.updateImagePreview('');
    this.switchView('listings');
  }

  // Update farmer sidebar dynamically from active user & profile
  updateSidebarProfile() {
    const currentUser = window.appStore.getCurrentUser();
    if (!currentUser) return;
    const profile = window.appStore.getProfile(currentUser.id) || {};
    const farmerName = currentUser.name || profile.name || 'Registered Kisan';
    const farmerLocation = currentUser.location || profile.location || 'Regional Agro Cluster';
    const farmerId = currentUser.govtId || profile.govtId || profile.id || `MH-NSK-4402`;

    const nameEl = document.getElementById('farmer-sidebar-name');
    const locEl = document.getElementById('farmer-sidebar-location');
    const idEl = document.getElementById('farmer-sidebar-id');
    const userEl = document.getElementById('farmer-sidebar-username');

    if (nameEl) nameEl.textContent = farmerName;
    if (locEl) locEl.textContent = farmerLocation;
    if (idEl) idEl.textContent = `ID: ${farmerId}`;
    if (userEl) userEl.textContent = farmerName;

    // Calculate this farmer's specific metrics
    const allCrops = window.appStore.getCrops();
    const myCrops = allCrops.filter(c => String(c.farmerId) === String(currentUser.id));
    const allOrders = window.appStore.getOrders();
    const myDeliveredOrders = allOrders.filter(o => String(o.farmerId) === String(currentUser.id) && o.status === 'delivered');
    const myRevenue = myDeliveredOrders.reduce((sum, o) => sum + (o.subtotal || o.totalAmount || 0), 0);

    const countEl = document.getElementById('farmer-sidebar-crops-count');
    if (countEl) countEl.textContent = `${myCrops.length} Active Crops`;

    const revEl = document.getElementById('farmer-sidebar-revenue');
    if (revEl) {
      if (myRevenue > 0) {
        revEl.textContent = myRevenue >= 100000 ? `₹${(myRevenue / 100000).toFixed(1)} Lakhs` : `₹${myRevenue.toLocaleString('en-IN')}`;
      } else {
        revEl.textContent = '₹0 (New Season)';
      }
    }

    const marginEl = document.getElementById('farmer-sidebar-margin');
    if (marginEl) {
      marginEl.textContent = myCrops.length > 0 ? '+16.4%' : 'Direct Gate (0%)';
    }
  }

  // Render Active Listings View & Interested Buyers Modal
  renderListings() {
    this.updateSidebarProfile();
    const currentUser = window.appStore.getCurrentUser();
    const allCrops = window.appStore.getCrops();
    const userId = currentUser && currentUser.id ? currentUser.id : 'farmer-1';
    const farmerName = currentUser && currentUser.name ? currentUser.name : 'Kisan';

    // Strictly filter crops belonging to this authenticated farmer
    let crops = allCrops.filter(c => String(c.farmerId) === String(userId));

    const container = document.getElementById('farmer-listings-container');
    const totalCountEl = document.getElementById('farmer-active-count-badge');
    if (totalCountEl) totalCountEl.textContent = `${crops.length} Active Crops`;

    if (!container) return;

    if (crops.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = crops.map(crop => {
      const buyerCount = crop.interestedBuyers ? crop.interestedBuyers.length : 0;
      return `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="relative h-44 overflow-hidden bg-slate-100">
              <img src="${crop.imageUrl}" alt="${crop.name}" class="w-full h-full object-cover">
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-900/80 text-white backdrop-blur-md">
                  ${crop.category}
                </span>
                ${crop.isOrganic ? `
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                    <i data-lucide="leaf" class="w-3 h-3"></i> 100% Organic
                  </span>
                ` : ''}
              </div>
              <div class="absolute top-3 right-3">
                <span class="px-2.5 py-1 text-xs font-bold rounded-full ${crop.grade === 'A+' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'} shadow-sm">
                  Grade ${crop.grade}
                </span>
              </div>
              <div class="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-400"></i>
                Harvested ${crop.harvestDaysAgo === 0 ? 'Today' : `${crop.harvestDaysAgo} days ago`} (${crop.freshnessIndex}% Fresh)
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <h3 class="font-bold text-slate-900 text-base leading-tight">${crop.name}</h3>
                <span class="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Radius: ${crop.deliveryRadiusKm}km
                </span>
              </div>
              <p class="text-xs text-slate-500 mb-3 line-clamp-2">${crop.description || 'Quality verified crop ready for dispatch.'}</p>

              <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs mb-3 border border-slate-100">
                <div>
                  <span class="text-slate-400 block text-[11px]">Available Stock</span>
                  <span class="font-bold text-slate-800 text-sm">${crop.quantity} ${crop.unit}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px]">Listed Price</span>
                  <span class="font-bold text-emerald-700 text-sm">₹${crop.pricePerUnit.toLocaleString('en-IN')}<span class="text-slate-400 text-[10px] font-normal">/${crop.unit}</span></span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px]">APMC Mandi Rate</span>
                  <span class="font-semibold text-slate-600">₹${crop.mandiPrice.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px]">Govt MSP Floor</span>
                  <span class="font-semibold text-slate-600">₹${crop.mspPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs pt-1">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Connected to Mandi e-Market
                </span>
                <span class="text-slate-400 text-[11px] font-mono">ID: ${crop.id}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action: Delete Crop Listing -->
          <div class="p-4 pt-0">
            <button type="button" class="delete-crop-btn w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition border border-rose-200 flex items-center justify-center gap-1.5"
              data-crop-id="${crop.id}" data-crop-name="${crop.name}">
              <i data-lucide="trash-2" class="w-3.5 h-3.5 text-rose-600"></i>
              Delete Crop Listing
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    // Attach delete crop handlers
    container.querySelectorAll('.delete-crop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cropId = btn.dataset.cropId;
        const cropName = btn.dataset.cropName;
        if (confirm(`Are you sure you want to delete "${cropName}" from marketplace listings?`)) {
          window.appStore.deleteCrop(cropId);
          this.renderListings();
        }
      });
    });
  }

  renderIncomingOrders() {
    this.renderInbox();
  }

  // Order Management: Request Inbox
  renderInbox() {
    this.updateSidebarProfile();
    const currentUser = window.appStore.getCurrentUser();
    const userId = currentUser && currentUser.id ? currentUser.id : 'farmer-1';
    const allOrders = window.appStore.getOrders();
    const orders = allOrders.filter(o => String(o.farmerId) === String(userId));
    const container = document.getElementById('farmer-orders-table-body');
    const badge = document.getElementById('farmer-inbox-counter');
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    if (badge) {
      badge.textContent = pendingCount;
      badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
    }

    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-slate-400">No customer orders currently in your inbox.</td></tr>`;
      return;
    }

    container.innerHTML = orders.map(ord => {
      let statusBadge = '';
      if (ord.status === 'pending') {
        statusBadge = '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 animate-pulse">Action Required</span>';
      } else if (ord.status === 'accepted') {
        statusBadge = '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Accepted • Dispatched</span>';
      } else if (ord.status === 'dispatched') {
        statusBadge = '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">In Transit with Truck</span>';
      } else if (ord.status === 'delivered') {
        statusBadge = '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">Delivered & Paid</span>';
      } else {
        statusBadge = `<span class="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">${ord.status}</span>`;
      }

      const isPending = ord.status === 'pending';
      const priceDiff = ord.offeredPrice - ord.listedPrice;
      const diffClass = priceDiff >= 0 ? 'text-emerald-600' : 'text-amber-600';
      const diffText = priceDiff === 0 ? 'Full Listed Price' : priceDiff > 0 ? `+₹${priceDiff} premium` : `-₹${Math.abs(priceDiff)} negotiated`;

      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition">
          <td class="p-3.5 font-medium text-slate-900 text-xs">
            <span class="font-mono text-slate-400">#${ord.id}</span>
            <div class="font-bold text-slate-800 text-sm mt-0.5">${ord.cropName}</div>
            <span class="text-slate-400 text-[11px]">${new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </td>
          <td class="p-3.5 text-xs text-slate-700">
            <div class="font-semibold text-slate-900">${ord.buyerName}</div>
            <span class="text-slate-500 text-[11px]">${ord.buyerType || 'Verified Buyer'} • ${ord.distanceKm || 45} km</span>
            <div class="text-[10px] text-slate-400 truncate max-w-xs">${ord.deliveryAddress || ''}</div>
          </td>
          <td class="p-3.5 text-xs font-bold text-slate-800">
            ${ord.quantity} ${ord.unit}
          </td>
          <td class="p-3.5 text-xs">
            <div class="font-bold text-slate-900">₹${ord.offeredPrice.toLocaleString('en-IN')} <span class="text-[10px] text-slate-400 font-normal">/${ord.unit}</span></div>
            <span class="text-[10px] ${diffClass} font-semibold">${diffText}</span>
          </td>
          <td class="p-3.5 text-xs font-bold text-emerald-700">
            ₹${(ord.totalAmount || ord.quantity * ord.offeredPrice).toLocaleString('en-IN')}
          </td>
          <td class="p-3.5">
            ${statusBadge}
          </td>
          <td class="p-3.5 text-right">
            ${isPending ? `
              <div class="flex items-center justify-end gap-1.5">
                <button type="button" class="accept-order-btn px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                  data-order-id="${ord.id}">
                  Accept
                </button>
                <button type="button" class="counter-order-btn px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  data-order-id="${ord.id}">
                  Counter
                </button>
                <button type="button" class="decline-order-btn px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition"
                  data-order-id="${ord.id}">
                  ✕
                </button>
              </div>
            ` : `
              <span class="text-xs text-slate-400 font-mono">Processed</span>
            `}
          </td>
        </tr>
      `;
    }).join('');

    // Attach order action buttons
    container.querySelectorAll('.accept-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const orders = window.appStore.getOrders();
        const ord = orders.find(o => String(o.id) === String(orderId)) || {};
        const cropName = ord.cropName || 'Produce';

        window.appStore.updateOrderStatus(orderId, 'accepted');
        window.appStore.addNotification(
          'accepted',
          'Order Accepted by Farmer',
          `Order #${orderId} (${cropName}) was ACCEPTED by ${ord.farmerName || 'Farmer'}. Truck freight load auto-generated for driver Gurpreet Singh.`,
          { orderId, role: 'all' }
        );
        if (window.app && window.app.showToast) {
          window.app.showToast(`✓ Order #${orderId} accepted! Logistics dispatched.`, 'accepted');
        }
        this.renderInbox();
      });
    });

    container.querySelectorAll('.counter-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        this.openFarmerCounterModal(orderId);
      });
    });

    container.querySelectorAll('.decline-order-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderId = btn.dataset.orderId;
        const orders = window.appStore.getOrders();
        const ord = orders.find(o => String(o.id) === String(orderId)) || {};
        const cropName = ord.cropName || 'Produce';

        const confirmed = window.showSystemConfirm
          ? await window.showSystemConfirm('Decline Purchase Order?', `Are you sure you want to decline purchase order #${orderId} for "${cropName}"?`)
          : confirm(`Decline purchase order #${orderId} for "${cropName}"?`);

        if (confirmed) {
          window.appStore.updateOrderStatus(orderId, 'declined');
          window.appStore.addNotification(
            'declined',
            'Order Declined by Farmer',
            `Order #${orderId} for ${cropName} was DECLINED by ${ord.farmerName || 'Farmer'}.`,
            { orderId, role: 'all' }
          );
          if (window.app && window.app.showToast) {
            window.app.showToast(`Order #${orderId} declined. Notification dispatched.`, 'declined');
          }
          this.renderInbox();
        }
      });
    });
  }

  // Setup Modern Farmer Counter-Offer Modal
  setupFarmerCounterModal() {
    const modal = document.getElementById('farmer-counter-modal');
    const closeBtn = document.getElementById('close-farmer-counter-modal-btn');
    const cancelBtn = document.getElementById('cancel-farmer-counter-btn');
    const form = document.getElementById('farmer-counter-form');
    const priceInput = document.getElementById('fcounter-price-input');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    if (cancelBtn && modal) {
      cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    const updateLiveMath = () => {
      const orderId = document.getElementById('fcounter-order-id-val')?.value;
      if (!orderId) return;
      const orders = window.appStore.getOrders();
      const ord = orders.find(o => String(o.id) === String(orderId));
      if (!ord) return;

      const price = parseFloat(priceInput?.value) || 0;
      const qty = ord.quantity || 1;
      const subtotal = Math.round(price * qty);
      const pricing = window.appStore.calculatePricing(subtotal);

      const subtotalEl = document.getElementById('fcounter-calc-subtotal');
      const feesEl = document.getElementById('fcounter-calc-fees');
      const totalEl = document.getElementById('fcounter-calc-total');

      if (subtotalEl) subtotalEl.textContent = `₹${pricing.subtotal.toLocaleString('en-IN')}`;
      if (feesEl) feesEl.textContent = `₹${(pricing.mandiCess + pricing.platformFee).toLocaleString('en-IN')} (₹${pricing.mandiCess} cess + ₹${pricing.platformFee} fee)`;
      if (totalEl) totalEl.textContent = `₹${pricing.grandTotal.toLocaleString('en-IN')}`;
    };

    if (priceInput) {
      priceInput.addEventListener('input', updateLiveMath);
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const orderId = document.getElementById('fcounter-order-id-val')?.value;
        const price = parseFloat(document.getElementById('fcounter-price-input')?.value);
        const notes = document.getElementById('fcounter-notes-input')?.value;

        if (!orderId || isNaN(price) || price <= 0) {
          if (window.showSystemAlert) {
            window.showSystemAlert('Invalid Price', 'Please enter a valid positive counter-offer price.', 'warning');
          } else {
            alert('Please enter a valid counter-offer price.');
          }
          return;
        }

        await window.appStore.counterOrder(orderId, price, notes, 'farmer');
        if (modal) modal.classList.add('hidden');

        if (window.app && window.app.showToast) {
          window.app.showToast(`Counter-offer of ₹${price.toLocaleString('en-IN')} dispatched to buyer!`, 'negotiated');
        } else if (window.showSystemAlert) {
          window.showSystemAlert('Counter-Offer Dispatched', `Counter-offer of ₹${price.toLocaleString('en-IN')} successfully submitted to buyer.`, 'success');
        }

        this.renderInbox();
      });
    }
  }

  // Open Farmer Counter Modal for specific Order
  openFarmerCounterModal(orderId) {
    const orders = window.appStore.getOrders();
    const ord = orders.find(o => String(o.id) === String(orderId));
    if (!ord) return;

    const modal = document.getElementById('farmer-counter-modal');
    if (!modal) return;

    const orderIdVal = document.getElementById('fcounter-order-id-val');
    const cropNameEl = document.getElementById('fcounter-crop-name');
    const orderIdEl = document.getElementById('fcounter-order-id');
    const buyerNameEl = document.getElementById('fcounter-buyer-name');
    const qtyUnitEl = document.getElementById('fcounter-quantity-unit');
    const listedEl = document.getElementById('fcounter-listed-price');
    const offeredEl = document.getElementById('fcounter-offered-price');
    const priceInput = document.getElementById('fcounter-price-input');
    const notesInput = document.getElementById('fcounter-notes-input');

    if (orderIdVal) orderIdVal.value = ord.id;
    if (cropNameEl) cropNameEl.textContent = ord.cropName || 'Farm Produce';
    if (orderIdEl) orderIdEl.textContent = `#${ord.id}`;
    if (buyerNameEl) buyerNameEl.textContent = ord.buyerName || 'Direct Buyer';
    if (qtyUnitEl) qtyUnitEl.textContent = `${ord.quantity} ${ord.unit || 'Quintals'}`;

    const listed = ord.listedPrice || ord.cropPrice || ord.offeredPrice || 0;
    if (listedEl) listedEl.textContent = `₹${listed.toLocaleString('en-IN')} / ${ord.unit || 'Qtl'}`;
    if (offeredEl) offeredEl.textContent = `₹${(ord.offeredPrice || 0).toLocaleString('en-IN')} / ${ord.unit || 'Qtl'}`;

    const suggested = ord.counterPrice || Math.round((listed + (ord.offeredPrice || listed)) / 2);
    if (priceInput) priceInput.value = suggested;
    if (notesInput) notesInput.value = ord.counterNotes || '';

    if (priceInput) {
      priceInput.dispatchEvent(new Event('input'));
    }

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
    if (priceInput) priceInput.focus();
  }

  // Retrieve strictly the crops listed by the currently authenticated / active farmer
  getFarmerListedCrops() {
    const currentUser = window.appStore.getCurrentUser();
    const allCrops = window.appStore.getCrops();

    if (currentUser && currentUser.id) {
      return allCrops.filter(c =>
        c.farmerId === currentUser.id ||
        (currentUser.name && c.farmerName && c.farmerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
      );
    }

    const defaultFarmerCrops = allCrops.filter(c => c.farmerId === 'farmer-1' || (c.farmerName && c.farmerName.includes('Ramesh')));
    if (defaultFarmerCrops.length > 0) return defaultFarmerCrops;

    return [];
  }

  // Update notification badge count in the farmer sidebar
  updateNotificationBadge() {
    const notifs = window.appStore.getNotifications('farmer');
    const unreadCount = notifs.filter(n => !n.read).length;
    const badge = document.getElementById('farmer-notif-counter');
    if (badge) {
      badge.textContent = unreadCount;
      if (unreadCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  // Update pending orders inbox badge in the farmer sidebar
  updateInboxBadge() {
    const currentUser = window.appStore.getCurrentUser();
    const userId = currentUser && currentUser.id ? currentUser.id : 'farmer-1';
    const allOrders = window.appStore.getOrders();
    const orders = allOrders.filter(o => String(o.farmerId) === String(userId));
    const badge = document.getElementById('farmer-inbox-counter');
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    if (badge) {
      badge.textContent = pendingCount;
      badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
    }
  }

  // Farmer Role-Specific Notifications & Alerts Feed
  renderFarmerNotifications() {
    this.updateNotificationBadge();
    const container = document.getElementById('farmer-notifications-list');
    if (!container) return;

    const notifs = window.appStore.getNotifications('farmer');

    // Attach mark read & clear buttons
    const markReadBtn = document.getElementById('farmer-notif-mark-read-btn');
    if (markReadBtn && !markReadBtn._hasHandler) {
      markReadBtn._hasHandler = true;
      markReadBtn.addEventListener('click', () => {
        window.appStore.markAllNotificationsRead('farmer');
        this.renderFarmerNotifications();
      });
    }

    const clearBtn = document.getElementById('farmer-notif-clear-btn');
    if (clearBtn && !clearBtn._hasHandler) {
      clearBtn._hasHandler = true;
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all farmer notifications?')) {
          window.appStore.clearNotifications('farmer');
          this.renderFarmerNotifications();
        }
      });
    }

    if (notifs.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <i data-lucide="bell-off" class="w-6 h-6"></i>
          </div>
          <h4 class="font-bold text-slate-800 text-sm">No Farmer Alerts</h4>
          <p class="text-xs text-slate-400">You are all caught up! New buyer orders, price alerts, and truck schedules will appear here.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const typeIcons = {
      order: { icon: 'shopping-bag', bg: 'bg-emerald-100 text-emerald-800' },
      price_alert: { icon: 'trending-up', bg: 'bg-amber-100 text-amber-800' },
      transit: { icon: 'truck', bg: 'bg-blue-100 text-blue-800' },
      escrow: { icon: 'shield-check', bg: 'bg-purple-100 text-purple-800' },
      accepted: { icon: 'check-circle-2', bg: 'bg-emerald-100 text-emerald-800' },
      negotiated: { icon: 'arrow-left-right', bg: 'bg-indigo-100 text-indigo-800' },
      declined: { icon: 'x-circle', bg: 'bg-rose-100 text-rose-800' },
      info: { icon: 'info', bg: 'bg-slate-100 text-slate-800' }
    };

    container.innerHTML = notifs.map(n => {
      const iconMeta = typeIcons[n.type] || typeIcons.info;
      return `
        <div class="p-4 rounded-2xl border transition-all ${n.read ? 'bg-white border-slate-200 opacity-90' : 'bg-emerald-50/50 border-emerald-300 shadow-xs'} flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl ${iconMeta.bg} flex items-center justify-center flex-shrink-0 mt-0.5">
              <i data-lucide="${iconMeta.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="font-bold text-slate-900 text-sm">${n.title}</span>
                ${!n.read ? '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>' : ''}
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">${n.message}</p>
              <div class="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                <span>${n.timeAgo || 'Recently'}</span>
                ${n.amount ? `<span>• Amount: <b class="text-emerald-700 font-bold">${n.amount}</b></span>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // Module 1: Clean Price Comparison for Farmer's Listed Crops
  renderPriceVariationChart() {
    const ctx = document.getElementById('chart-farmer-my-crops-price');
    if (!ctx) return;

    if (this.priceVariationChart) {
      this.priceVariationChart.destroy();
    }

    const crops = this.getFarmerListedCrops();

    // Update active count in header badge
    const countEl = document.getElementById('analytics-crop-count-display');
    if (countEl) countEl.textContent = `${crops.length} Crops`;

    const cardsContainer = document.getElementById('farmer-my-crops-summary-cards');
    if (crops.length === 0) {
      if (this.priceVariationChart) {
        this.priceVariationChart.destroy();
        this.priceVariationChart = null;
      }
      if (cardsContainer) {
        cardsContainer.innerHTML = `
          <div class="col-span-full py-8 px-4 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p class="font-semibold text-sm text-slate-700">No active crop listings to analyze yet.</p>
            <p class="text-xs text-slate-400 mt-1">List your harvest in the Harvest Listings tab to benchmark your selling price directly against Govt MSP and local Mandi rates.</p>
          </div>
        `;
      }
      return;
    }

    const labels = crops.map(c => c.name.split('(')[0].trim());

    this.priceVariationChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Govt Minimum Price (MSP)',
            data: crops.map(c => c.mspPrice || Math.round(c.pricePerUnit * 0.85)),
            backgroundColor: '#3b82f6',
            hoverBackgroundColor: '#2563eb',
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Local Mandi Rate',
            data: crops.map(c => c.mandiPrice || Math.round(c.pricePerUnit * 0.92)),
            backgroundColor: '#f59e0b',
            hoverBackgroundColor: '#d97706',
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Your Price on KisanSetu',
            data: crops.map(c => c.pricePerUnit),
            backgroundColor: '#10b981',
            hoverBackgroundColor: '#059669',
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 14,
            cornerRadius: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              title: (items) => crops[items[0].dataIndex].name,
              label: (context) => `  ${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`,
              afterBody: (items) => {
                const c = crops[items[0].dataIndex];
                const mandi = c.mandiPrice || Math.round(c.pricePerUnit * 0.92);
                const msp = c.mspPrice || Math.round(c.pricePerUnit * 0.85);
                const diffMandi = c.pricePerUnit - mandi;
                return [
                  diffMandi >= 0
                    ? `  🟢 Extra Profit: +₹${diffMandi.toLocaleString('en-IN')} more per ${c.unit} than local Mandi!`
                    : `  ⚠️ Mandi Price: ₹${mandi.toLocaleString('en-IN')}`,
                  `  ✓ Govt Support Floor (MSP): ₹${msp.toLocaleString('en-IN')}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { weight: 'bold', size: 12 },
              color: '#1e293b'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price in Rupees (₹)',
              font: { weight: '700', size: 12 },
              color: '#475569'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            },
            ticks: {
              callback: (val) => '₹' + Number(val).toLocaleString('en-IN'),
              font: { weight: '600', size: 11 },
              color: '#64748b'
            }
          }
        }
      }
    });

    // Render simple summary cards below chart
    if (cardsContainer) {
      cardsContainer.innerHTML = crops.map(c => {
        const msp = c.mspPrice || Math.round(c.pricePerUnit * 0.85);
        const mandi = c.mandiPrice || Math.round(c.pricePerUnit * 0.92);
        const diffMandi = c.pricePerUnit - mandi;
        const isHigher = diffMandi >= 0;

        return `
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="font-extrabold text-slate-900 text-sm truncate">${c.name}</span>
                <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">${c.quantity} ${c.unit}</span>
              </div>
              <div class="mt-2 flex items-baseline justify-between">
                <span class="text-[11px] text-slate-500">Your Selling Price:</span>
                <span class="text-base font-black text-emerald-700">₹${c.pricePerUnit.toLocaleString('en-IN')}</span>
              </div>
              <div class="mt-1 flex items-baseline justify-between text-[11px]">
                <span class="text-slate-400">Local Mandi Rate:</span>
                <span class="font-semibold text-amber-700">₹${mandi.toLocaleString('en-IN')}</span>
              </div>
              <div class="mt-0.5 flex items-baseline justify-between text-[11px]">
                <span class="text-slate-400">Govt Floor (MSP):</span>
                <span class="font-semibold text-blue-700">₹${msp.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100">
              <div class="text-[11px] font-bold ${isHigher ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-amber-800 bg-amber-50 border border-amber-200'} p-2 rounded-xl text-center">
                ${isHigher ? `🟢 +₹${diffMandi.toLocaleString('en-IN')} Extra Profit / ${c.unit}` : `⚠️ Local Mandi depressed by ₹${Math.abs(mandi - msp)}`}
              </div>
            </div>
          </div>
        `;
      }).join('');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // Module 2: Simple Seasonal Selling Calendar
  renderSeasonalVolatilityChart() {
    const ctx = document.getElementById('chart-farmer-simple-season');
    if (!ctx) return;

    if (this.seasonalVolatilityChart) {
      this.seasonalVolatilityChart.destroy();
    }

    const months = ['Oct', 'Nov (⚠️ Low)', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May (⚠️ Low)', 'Jun', 'Jul', 'Aug (💰 High)', 'Sep (💰 High)'];
    const priceLevels = [60, 50, 75, 90, 95, 80, 50, 45, 75, 85, 110, 140];

    const barColors = priceLevels.map((val, idx) => {
      if (idx === 1 || idx === 7) return '#ef4444'; // Red for Nov & May (Glut)
      if (idx >= 10) return '#10b981'; // Green for Aug & Sep (Peak Profit)
      return '#3b82f6'; // Blue for normal months
    });

    this.seasonalVolatilityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Market Price Level',
            data: priceLevels,
            backgroundColor: barColors,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 42
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              title: (items) => `Month: ${months[items[0].dataIndex]}`,
              label: (context) => `  Price Index: ${context.raw} (Base 100)`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                if (idx === 1 || idx === 7) {
                  return ['  ⚠️ HARVEST RUSH: Mandis flooded, prices crash. Avoid selling all now.'];
                } else if (idx >= 10) {
                  return ['  💰 BEST TIME TO SELL: High shortage in market. Stored crops earn +50% extra!'];
                }
                return ['  ✓ Normal market price. Steady buyer demand.'];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { weight: '600', size: 11 },
              color: '#334155'
            }
          },
          y: {
            min: 20,
            max: 160,
            title: {
              display: true,
              text: 'Market Price Level (Normal = 100)',
              font: { weight: '700', size: 11 },
              color: '#475569'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            },
            ticks: {
              font: { weight: '500', size: 11 },
              color: '#64748b'
            }
          }
        }
      }
    });
  }

  // Module 3: Simple Destination Markets
  renderStateMarketChart() {
    const ctx = document.getElementById('chart-farmer-best-markets');
    if (!ctx) return;

    if (this.stateMarketChart) {
      this.stateMarketChart.destroy();
    }

    const destinationMarkets = [
      { name: 'Andhra Pradesh & South (Processing Mills)', gain: 350, desc: 'Highest paying market for pulses and oilseeds' },
      { name: 'Delhi NCR / North (Mega Supermarkets)', gain: 280, desc: 'High consumer demand for wheat, basmati & fruit' },
      { name: 'Gujarat (Spice & Agro Industry)', gain: 220, desc: 'Steady demand from flour & packaging plants' },
      { name: 'Rajasthan (Wholesale Grain Mandis)', gain: 150, desc: 'Large scale commodity trading hub' },
      { name: 'Local Maharashtra APMC (Home Mandi)', gain: 0, desc: 'Standard local rate with middleman deductions' }
    ];

    this.stateMarketChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: destinationMarkets.map(d => d.name),
        datasets: [
          {
            label: 'Extra Profit per Quintal (₹)',
            data: destinationMarkets.map(d => d.gain),
            backgroundColor: ['#059669', '#10b981', '#06b6d4', '#3b82f6', '#94a3b8'],
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              label: (context) => {
                const item = destinationMarkets[context.dataIndex];
                return item.gain > 0
                  ? `  Extra Profit: +₹${item.gain}/Qtl over local Mandi`
                  : '  Local Mandi Base Rate';
              },
              afterBody: (items) => {
                const item = destinationMarkets[items[0].dataIndex];
                return ['  ' + item.desc];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Extra Profit in Rupees over Local Mandi (₹ / Quintal)',
              font: { weight: '700', size: 11 },
              color: '#475569'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            },
            ticks: {
              callback: (val) => val > 0 ? '+₹' + val : '₹0 (Local)',
              font: { weight: '600', size: 11 },
              color: '#64748b'
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { weight: '600', size: 11 },
              color: '#1e293b'
            }
          }
        }
      }
    });
  }

  // Master Analytics Render Trigger
  renderAnalyticsCharts() {
    if (typeof Chart === 'undefined') return;

    this.renderPriceVariationChart();
    this.renderSeasonalVolatilityChart();
    this.renderStateMarketChart();
  }

  // Sidebar Tool: Text Bulletins & SMS Feeds
  renderBulletins() {
    const container = document.getElementById('farmer-bulletins-list');
    if (!container) return;

    container.innerHTML = window.SMS_BULLETINS.map(b => `
      <div class="p-4 rounded-xl border ${b.urgent ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-white'} shadow-sm">
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white">${b.sender}</span>
            <span class="text-xs font-semibold ${b.urgent ? 'text-amber-800 bg-amber-100' : 'text-slate-600 bg-slate-100'} px-2 py-0.5 rounded-full">${b.category}</span>
          </div>
          <span class="text-xs text-slate-400 font-medium">${b.time}</span>
        </div>
        <h4 class="font-bold text-slate-900 text-sm mb-1">${b.title}</h4>
        <p class="text-xs text-slate-700 leading-relaxed">${b.content}</p>
        <div class="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <span class="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Authorized Advisory
          </span>
          <span class="text-[11px] text-slate-400">Verified Broadcast</span>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  render() {
    this.updateSidebarProfile();
    this.updateInboxBadge();
    this.updateNotificationBadge();
    if (this.currentView === 'listings') {
      this.renderListings();
    } else if (this.currentView === 'inbox') {
      this.renderInbox();
    } else if (this.currentView === 'analytics') {
      this.renderAnalyticsCharts();
    } else if (this.currentView === 'bulletins') {
      this.renderBulletins();
    } else if (this.currentView === 'notifications') {
      this.renderFarmerNotifications();
    }
  }
}

window.farmerController = new FarmerController();

