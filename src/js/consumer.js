// Consumer Dashboard Logic: Marketplace Search Engine, Live Feed, Cart UI, Checkout Flow, and Order History

class ConsumerController {
  constructor() {
    this.activeTab = 'marketplace'; // 'marketplace' | 'orders' | 'notifications'
    this.filters = {
      query: '',
      category: 'all',
      maxHarvestDays: 14,
      maxDistanceKm: 200,
      organicOnly: false,
      gradeAOnly: false,
      sortBy: 'freshness' // 'freshness' | 'distance' | 'price_asc' | 'price_desc'
    };
    this.selectedCropForOffer = null;
    this.orderFilter = 'all'; // 'all' | 'active' | 'delivered' | 'pending'
    this.reviewRating = 5;
    this.selectedReviewTags = ['Farm Fresh Quality', 'Punctual Delivery'];
    this.initEventListeners();
    this.setupConsumerCounterModal();
    this.updateNotificationBadge();
    if (window.appStore && window.appStore.syncCropsWithDatabase) {
      window.appStore.syncCropsWithDatabase();
      window.appStore.syncOrdersWithDatabase();
    }
  }

  initEventListeners() {
    this.setupPaymentMethodListeners();
    this.setupOrderFilterListeners();
    this.setupOrderReviewListeners();
    this.setupLiveMapListeners();
    // App store listener
    window.appStore.subscribe((event, payload) => {
      if (event === 'cart_updated') {
        this.renderCart();
      } else if (['crop_added', 'order_added', 'order_updated', 'data_reset', 'notifications_updated', 'notification_added'].includes(event)) {
        this.updateNotificationBadge();
        this.render();
      } else if (event === 'gps_telemetry_updated') {
        this.updateLiveTracking(payload);
      }
    });

    // Top Consumer navigation tabs (Marketplace vs Order History)
    document.querySelectorAll('.consumer-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Search and Filter elements
    const searchInput = document.getElementById('consumer-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.query = e.target.value.toLowerCase().trim();
        this.renderMarketplace();
      });
    }

    const catSelect = document.getElementById('consumer-cat-filter');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.filters.category = e.target.value;
        this.renderMarketplace();
      });
    }

    const harvestFilter = document.getElementById('consumer-harvest-filter');
    if (harvestFilter) {
      harvestFilter.addEventListener('change', (e) => {
        this.filters.maxHarvestDays = parseInt(e.target.value, 10) || 14;
        this.renderMarketplace();
      });
    }

    const distanceSlider = document.getElementById('consumer-distance-slider');
    const distanceDisplay = document.getElementById('consumer-distance-display');
    if (distanceSlider && distanceDisplay) {
      distanceSlider.addEventListener('input', (e) => {
        this.filters.maxDistanceKm = parseInt(e.target.value, 10);
        distanceDisplay.textContent = `Within ${e.target.value} km`;
        this.renderMarketplace();
      });
    }

    const organicCheckbox = document.getElementById('consumer-organic-filter');
    if (organicCheckbox) {
      organicCheckbox.addEventListener('change', (e) => {
        this.filters.organicOnly = e.target.checked;
        this.renderMarketplace();
      });
    }

    const sortSelect = document.getElementById('consumer-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.filters.sortBy = e.target.value;
        this.renderMarketplace();
      });
    }

    // Category quick chips
    document.querySelectorAll('.cat-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-chip-btn').forEach(b => b.classList.remove('bg-emerald-700', 'text-white'));
        btn.classList.add('bg-emerald-700', 'text-white');
        this.filters.category = btn.dataset.cat;
        if (catSelect) catSelect.value = btn.dataset.cat;
        this.renderMarketplace();
      });
    });

    // Cart Drawer Toggle
    const cartBtn = document.getElementById('header-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (cartBtn && cartDrawer) {
      cartBtn.addEventListener('click', () => {
        this.renderCart();
        cartDrawer.classList.remove('translate-x-full');
      });
    }
    if (closeCartBtn && cartDrawer) {
      closeCartBtn.addEventListener('click', () => cartDrawer.classList.add('translate-x-full'));
    }

    // Checkout Flow Trigger
    const checkoutBtn = document.getElementById('proceed-checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    if (checkoutBtn && checkoutModal) {
      checkoutBtn.addEventListener('click', () => {
        const cart = window.appStore.getCart();
        if (cart.length === 0) {
          if (window.showSystemAlert) {
            window.showSystemAlert('Your Cart is Empty', 'Please add fresh produce from the marketplace before proceeding to checkout.', 'warning');
          } else {
            alert('Your cart is empty. Add fresh crops from the marketplace first!');
          }
          return;
        }
        cartDrawer.classList.add('translate-x-full');
        this.populateCheckoutModal();
        checkoutModal.classList.remove('hidden');
      });
    }
    if (closeCheckoutBtn && checkoutModal) {
      closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));
    }

    // Place Order Form submission
    const checkoutForm = document.getElementById('consumer-checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleOrderPlacement();
      });
    }

    // Make Offer Modal Submit
    const offerForm = document.getElementById('make-offer-form');
    if (offerForm) {
      offerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleMakeOfferSubmit();
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.consumer-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('border-emerald-600', 'text-emerald-700', 'font-bold');
        btn.classList.remove('border-transparent', 'text-slate-500');
      } else {
        btn.classList.remove('border-emerald-600', 'text-emerald-700', 'font-bold');
        btn.classList.add('border-transparent', 'text-slate-500');
      }
    });

    const marketView = document.getElementById('consumer-marketplace-view');
    const ordersView = document.getElementById('consumer-orders-view');
    const notifView = document.getElementById('consumer-notifications-view');

    if (marketView) marketView.classList.toggle('hidden', tabName !== 'marketplace');
    if (ordersView) ordersView.classList.toggle('hidden', tabName !== 'orders');
    if (notifView) notifView.classList.toggle('hidden', tabName !== 'notifications');

    if (tabName === 'marketplace') {
      if (window.appStore && window.appStore.syncCropsWithDatabase) window.appStore.syncCropsWithDatabase();
      this.renderMarketplace();
    } else if (tabName === 'orders') {
      if (window.appStore && window.appStore.syncOrdersWithDatabase) window.appStore.syncOrdersWithDatabase();
      this.renderOrderHistory();
    } else if (tabName === 'notifications') {
      this.renderConsumerNotifications();
    }
  }

  // Filter & Sort Crops
  getFilteredCrops() {
    let crops = window.appStore.getCrops();

    // Query filter
    if (this.filters.query) {
      const q = this.filters.query.toLowerCase().trim();
      crops = crops.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.farmerName && c.farmerName.toLowerCase().includes(q)) ||
        (c.farmLocation && c.farmLocation.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (this.filters.category && this.filters.category !== 'all') {
      crops = crops.filter(c => c.category && c.category.toLowerCase() === this.filters.category.toLowerCase());
    }

    // Harvest freshness filter
    if (this.filters.maxHarvestDays && this.filters.maxHarvestDays < 14) {
      crops = crops.filter(c => (c.harvestDaysAgo ?? 0) <= this.filters.maxHarvestDays);
    }

    // Distance filter: only filter if slider is below 250 (max range)
    if (this.filters.maxDistanceKm && this.filters.maxDistanceKm < 250) {
      crops = crops.filter(c => (c.deliveryRadiusKm || 50) <= this.filters.maxDistanceKm);
    }

    // Organic filter
    if (this.filters.organicOnly) {
      crops = crops.filter(c => c.isOrganic);
    }

    // Sort
    crops.sort((a, b) => {
      if (this.filters.sortBy === 'freshness') {
        return (a.harvestDaysAgo ?? 0) - (b.harvestDaysAgo ?? 0);
      } else if (this.filters.sortBy === 'distance') {
        return (a.deliveryRadiusKm || 50) - (b.deliveryRadiusKm || 50);
      } else if (this.filters.sortBy === 'price_asc') {
        return (a.pricePerUnit || 0) - (b.pricePerUnit || 0);
      } else if (this.filters.sortBy === 'price_desc') {
        return (b.pricePerUnit || 0) - (a.pricePerUnit || 0);
      }
      return 0;
    });

    return crops;
  }

  // Render Marketplace Grid & Live Feed
  renderMarketplace() {
    const crops = this.getFilteredCrops();
    const container = document.getElementById('consumer-crop-grid');
    const resultCountEl = document.getElementById('search-result-count');

    if (resultCountEl) {
      resultCountEl.textContent = `Showing ${crops.length} fresh farm listings`;
    }

    if (!container) return;

    if (crops.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 text-slate-300"></i>
          <h3 class="text-base font-bold text-slate-700">No matching crops found</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try loosening your harvest timeline or distance radius filters to see more listings from across regional farm clusters.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = crops.map(crop => {
      const price = Number(crop.pricePerUnit) || 0;
      const savings = Math.round(price * 0.15);
      const retailBenchmark = price + savings;
      const locationLabel = (crop.farmLocation || 'Regional Agro Cluster, Farm Gate').split(',')[0];
      const harvestText = crop.harvestDaysAgo === 0 ? 'Harvested Today' : crop.harvestDaysAgo === 1 ? 'Harvested Yesterday' : `Harvested ${crop.harvestDaysAgo} days ago`;
      return `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div>
            <!-- Image & Badges -->
            <div class="relative h-48 overflow-hidden bg-slate-100">
              <img src="${crop.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'}" alt="${crop.name || 'Crop'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/80 text-white backdrop-blur-md">
                  ${crop.category || 'Agricultural'}
                </span>
                ${crop.isOrganic ? `
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                    <i data-lucide="leaf" class="w-3 h-3"></i> 100% Organic
                  </span>
                ` : ''}
              </div>

              <div class="absolute top-3 right-3">
                <span class="px-2.5 py-1 text-xs font-bold rounded-full ${crop.grade === 'A+' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'} shadow-sm">
                  Grade ${crop.grade || 'A'}
                </span>
              </div>

              <!-- Freshness Timeline indicator on image -->
              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span class="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-md">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-400"></i>
                  ${harvestText}
                </span>
                <span class="bg-emerald-600/90 font-bold px-2 py-1 rounded-lg backdrop-blur-md text-[11px]">
                  ${crop.freshnessIndex || 95}% Freshness
                </span>
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-4">
              <div class="flex items-center justify-between gap-2 mb-1">
                <h3 class="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition leading-snug">${crop.name}</h3>
              </div>

              <!-- Farmer Identity & Distance -->
              <div class="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span class="font-medium text-slate-700">${crop.farmerName || 'Verified Kisan'}</span>
                <span>•</span>
                <span class="text-slate-400 truncate max-w-[130px]">${locationLabel}</span>
                <span class="ml-auto font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  ${crop.deliveryRadiusKm || 50} km
                </span>
              </div>

              <!-- Price Box & Direct Mandi Savings -->
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                <div class="flex items-baseline justify-between">
                  <div>
                    <span class="text-[11px] text-slate-400 block">Direct Farm Gate Price</span>
                    <div class="text-xl font-extrabold text-emerald-700">
                      ₹${price.toLocaleString('en-IN')}
                      <span class="text-xs font-normal text-slate-500">/${crop.unit || 'Unit'}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-slate-400 block">Retail Benchmark</span>
                    <span class="text-xs font-medium text-slate-500 line-through">₹${retailBenchmark.toLocaleString('en-IN')}</span>
                    <span class="block text-[10px] font-bold text-emerald-600">Save ₹${savings.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div class="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Stock: <b class="text-slate-700">${crop.quantity || 0} ${crop.unit || 'Units'} left</b></span>
                  <span>Quality: <b class="text-slate-700">${crop.gradeLabel || 'Standard Market Grade'}</b></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 pt-0 grid grid-cols-2 gap-2">
            <button type="button" class="make-offer-btn py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              data-crop-id="${crop.id}">
              <i data-lucide="handshake" class="w-3.5 h-3.5 text-slate-500"></i>
              Make Offer
            </button>
            <button type="button" class="add-to-cart-btn py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95"
              data-crop-id="${crop.id}">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
              Add to Cart
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    // Attach Add to Cart and Make Offer listeners using safe ID lookup
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cropId = btn.dataset.cropId;
        const crop = window.appStore.getCrops().find(c => String(c.id) === String(cropId));
        if (!crop) return;

        window.appStore.addToCart(crop, 1);

        // Immediate explicit visual state feedback
        btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
        btn.classList.add('bg-emerald-800', 'ring-2', 'ring-emerald-400', 'scale-[1.02]', 'shadow-md');
        btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-200 animate-pulse"></i> <span class="font-extrabold tracking-wide">✓ Added to Cart!</span>`;
        if (window.lucide) window.lucide.createIcons();

        // Explicit confirmation message via toast notification
        if (window.app && window.app.showToast) {
          window.app.showToast(`🛒 Added to Cart: ${crop.name} (1 ${crop.unit})`, 'success');
        }

        // Animate cart count badge
        const badge = document.getElementById('cart-count-badge');
        if (badge) {
          badge.classList.add('scale-125', 'ring-2', 'ring-emerald-300');
          setTimeout(() => badge.classList.remove('scale-125', 'ring-2', 'ring-emerald-300'), 450);
        }

        setTimeout(() => {
          btn.classList.remove('bg-emerald-800', 'ring-2', 'ring-emerald-400', 'scale-[1.02]', 'shadow-md');
          btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
          btn.innerHTML = `<i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Add to Cart`;
          if (window.lucide) window.lucide.createIcons();
        }, 1800);
      });
    });

    container.querySelectorAll('.make-offer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cropId = btn.dataset.cropId;
        const crop = window.appStore.getCrops().find(c => String(c.id) === String(cropId));
        if (crop) {
          this.openMakeOfferModal(crop);
        }
      });
    });
  }

  openMakeOfferModal(crop) {
    this.selectedCropForOffer = crop;
    const modal = document.getElementById('make-offer-modal');
    const title = document.getElementById('offer-crop-title');
    const listPrice = document.getElementById('offer-crop-list-price');
    const offerInput = document.getElementById('offer-price-input');
    const qtyInput = document.getElementById('offer-quantity-input');

    if (title) title.textContent = `${crop.name} (${crop.quantity} ${crop.unit} available)`;
    if (listPrice) listPrice.textContent = `₹${crop.pricePerUnit} / ${crop.unit}`;
    if (offerInput) offerInput.value = Math.round(crop.pricePerUnit * 0.95);
    if (qtyInput) qtyInput.value = Math.min(10, crop.quantity);

    if (modal) modal.classList.remove('hidden');
  }

  handleMakeOfferSubmit() {
    if (!this.selectedCropForOffer) return;

    const offerPrice = parseFloat(document.getElementById('offer-price-input').value);
    const quantity = parseFloat(document.getElementById('offer-quantity-input').value) || 1;
    const notes = document.getElementById('offer-notes-input').value;

    const subtotal = Math.round(quantity * offerPrice);
    const pricing = window.appStore.calculatePricing(subtotal);

    const order = {
      cropId: this.selectedCropForOffer.id,
      cropName: this.selectedCropForOffer.name,
      farmerId: this.selectedCropForOffer.farmerId,
      farmerName: this.selectedCropForOffer.farmerName,
      buyerId: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().id) || 'buyer-current',
      buyerName: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().name) || 'Priya Sharma (Consumer Collective)',
      buyerType: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().buyerType) || 'Bulk Consumer / Co-op',
      buyerPhone: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().phone) || '+91 98201 44552',
      deliveryAddress: (window.appStore.getCurrentUser() && window.appStore.getCurrentUser().location) || 'Flat 402, Sunshine Heights, Kalyani Nagar, Pune, MH 411006',
      distanceKm: this.selectedCropForOffer.deliveryRadiusKm || 50,
      quantity,
      unit: this.selectedCropForOffer.unit,
      listedPrice: this.selectedCropForOffer.pricePerUnit,
      offeredPrice: offerPrice,
      subtotal: pricing.subtotal,
      mandiCess: pricing.mandiCess,
      platformFee: pricing.platformFee,
      freightCharge: pricing.freightCharge,
      totalAmount: pricing.grandTotal,
      paymentMode: 'Mandi Escrow / UPI',
      notes: notes || 'Direct offer submitted via KisanSetu Consumer Portal.'
    };

    window.appStore.addOrder(order);

    window.appStore.addNotification(
      'negotiated',
      'Price Negotiation Offer Submitted',
      `Buyer ${order.buyerName} submitted offer of ₹${offerPrice}/${this.selectedCropForOffer.unit} for ${this.selectedCropForOffer.name}. Sent to Farmer ${this.selectedCropForOffer.farmerName}.`,
      { cropName: this.selectedCropForOffer.name, offeredPrice: offerPrice, role: 'all' }
    );

    if (window.app && window.app.showToast) {
      window.app.showToast(`🤝 Negotiation offer of ₹${offerPrice}/${this.selectedCropForOffer.unit} sent to farmer ${this.selectedCropForOffer.farmerName}!`, 'negotiated');
    }

    document.getElementById('make-offer-modal').classList.add('hidden');
    this.switchTab('orders');
  }

  // Cart Drawer UI & Calculations
  renderCart() {
    const cart = window.appStore.getCart();
    const container = document.getElementById('cart-items-list');
    const badge = document.getElementById('cart-count-badge');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 text-slate-400">
          <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-2 text-slate-300"></i>
          <p class="text-sm font-semibold text-slate-600">Your farm cart is empty</p>
          <p class="text-xs text-slate-400 mt-1">Browse farm gate listings and add fresh harvests.</p>
        </div>
      `;
      this.updateCartSummary(0, 0, 0);
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let subtotal = 0;

    container.innerHTML = cart.map(item => {
      const lineTotal = item.quantity * item.pricePerUnit;
      subtotal += lineTotal;

      return `
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <img src="${item.imageUrl}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg flex-shrink-0">
          <div class="flex-grow min-w-0">
            <h4 class="font-bold text-slate-900 text-xs truncate">${item.name}</h4>
            <div class="text-[11px] text-slate-500">₹${item.pricePerUnit} / ${item.unit}</div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Grade ${item.grade}</span>
              ${item.isOrganic ? '<span class="text-[10px] text-emerald-600 font-semibold">Organic</span>' : ''}
            </div>
          </div>
          <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div class="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
              <button type="button" class="cart-qty-btn px-2 py-1 text-slate-600 hover:bg-slate-100" data-id="${item.cropId}" data-delta="-1">-</button>
              <span class="px-2 font-bold text-slate-800">${item.quantity}</span>
              <button type="button" class="cart-qty-btn px-2 py-1 text-slate-600 hover:bg-slate-100" data-id="${item.cropId}" data-delta="1">+</button>
            </div>
            <span class="font-bold text-slate-900 text-xs">₹${lineTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      `;
    }).join('');

    const pricing = window.appStore.calculatePricing(subtotal);
    this.updateCartSummary(pricing);

    // Qty listeners
    container.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cropId = btn.dataset.id;
        const delta = parseInt(btn.dataset.delta, 10);
        const currentCart = window.appStore.getCart();
        const item = currentCart.find(i => String(i.cropId) === String(cropId));
        if (item) {
          window.appStore.updateCartQty(cropId, item.quantity + delta);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  setupPaymentMethodListeners() {
    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.payment-method-option').forEach(opt => {
          opt.className = 'payment-method-option flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition';
          const span = opt.querySelector('span');
          if (span) span.className = 'font-medium text-slate-700';
        });
        const activeLabel = radio.closest('.payment-method-option');
        if (activeLabel) {
          activeLabel.className = 'payment-method-option flex items-center gap-2.5 p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/80 shadow-xs cursor-pointer transition';
          const span = activeLabel.querySelector('span');
          if (span) span.className = 'font-bold text-slate-800';
        }
      });
    });
  }

  setupOrderFilterListeners() {
    document.querySelectorAll('.consumer-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.consumer-filter-btn').forEach(b => {
          b.className = 'consumer-filter-btn px-3 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900';
        });
        btn.className = 'consumer-filter-btn px-3 py-1 rounded-lg font-bold bg-white text-slate-900 shadow-xs';
        this.orderFilter = btn.dataset.filter || 'all';
        this.renderOrderHistory();
      });
    });
  }

  setupLiveMapListeners() {
    const recenterBtn = document.getElementById('consumer-map-recenter-btn');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => {
        const truckPin = document.getElementById('consumer-truck-pin');
        if (truckPin) {
          truckPin.classList.add('scale-125');
          setTimeout(() => truckPin.classList.remove('scale-125'), 600);
        }
        const telemetry = window.appStore.getLiveGpsTelemetry();
        const alertMsg = `Centering live GPS view on Truck MH-15-EG-4482 (Gurpreet Singh Carrier Fleet).\nCurrent corridor: ${telemetry.corridorLocation} • Speed: ${telemetry.speedMs} m/s • Distance left: ${telemetry.remainingMetersFormatted}.`;
        if (window.showSystemAlert) {
          window.showSystemAlert('Carrier GPS Telemetry', alertMsg, 'info');
        } else {
          alert(alertMsg);
        }
      });
    }
  }

  updateLiveTracking(telemetry) {
    if (!telemetry) telemetry = window.appStore.getLiveGpsTelemetry();
    const routePath = document.getElementById('consumer-route-path');
    const truckPin = document.getElementById('consumer-truck-pin');
    if (routePath && truckPin) {
      try {
        const totalLen = routePath.getTotalLength();
        const pt = routePath.getPointAtLength(telemetry.progress * totalLen);
        truckPin.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);

        const texts = truckPin.querySelectorAll('text');
        if (texts.length >= 3) {
          texts[1].textContent = `Live: ${telemetry.corridorLocation}`;
          texts[2].textContent = `${telemetry.speedMs} m/s • ${telemetry.remainingMetersFormatted} to go`;
        }
      } catch (e) {}
    }

    const speedEl = document.getElementById('consumer-telemetry-speed');
    if (speedEl) speedEl.textContent = `${telemetry.speedMs} m/s (Steady)`;

    const distEl = document.getElementById('consumer-telemetry-distance');
    if (distEl) distEl.textContent = `${telemetry.remainingMetersFormatted} to Destination`;

    const etaEl = document.getElementById('consumer-telemetry-eta');
    if (etaEl) etaEl.textContent = telemetry.etaHours;

    const overlaySpan = document.querySelector('#consumer-live-map-card .absolute.bottom-3.right-3 span:last-child') ||
                        document.querySelector('#consumer-view-tracking .absolute.bottom-3.right-3 span:last-child');
    if (overlaySpan) {
      overlaySpan.textContent = `GPS Telemetry: Live (${telemetry.speedMs} m/s • Remaining ${telemetry.remainingMetersFormatted})`;
    }
  }

  setupOrderReviewListeners() {
    const closeBtn = document.getElementById('close-review-modal-btn');
    const modal = document.getElementById('order-review-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    // Star rating buttons
    const starButtons = document.querySelectorAll('.review-star-btn');
    const captionEl = document.getElementById('review-rating-caption');
    const ratingInput = document.getElementById('review-active-rating-val');

    starButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        this.reviewRating = val;
        if (ratingInput) ratingInput.value = val;

        // Highlight stars
        starButtons.forEach(b => {
          const bVal = parseInt(b.dataset.val, 10);
          if (bVal <= val) {
            b.className = 'review-star-btn text-2xl text-amber-400 hover:scale-125 transition';
          } else {
            b.className = 'review-star-btn text-2xl text-slate-300 hover:scale-125 transition';
          }
        });

        if (captionEl) {
          const captions = {
            1: '1.0 - Needs Improvement',
            2: '2.0 - Fair Quality',
            3: '3.0 - Good Standard Mandi Grade',
            4: '4.0 - Very Good Freshness & Transit',
            5: '5.0 - Outstanding (Prime Farm Fresh Quality)'
          };
          captionEl.textContent = captions[val] || `${val}.0 Rating`;
        }
      });
    });

    // Tag chips
    document.querySelectorAll('.review-tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.tag;
        if (this.selectedReviewTags.includes(tag)) {
          this.selectedReviewTags = this.selectedReviewTags.filter(t => t !== tag);
          chip.className = 'review-tag-chip px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50';
          chip.textContent = tag;
        } else {
          this.selectedReviewTags.push(tag);
          chip.className = 'review-tag-chip px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-300 bg-emerald-50 text-emerald-800';
          chip.textContent = `✓ ${tag}`;
        }
      });
    });

    // Submit review button
    const submitBtn = document.getElementById('submit-order-review-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const orderId = document.getElementById('review-active-order-id')?.value;
        const reviewText = document.getElementById('review-comments-input')?.value || 'Fresh direct harvest produce received in excellent condition.';
        const rating = this.reviewRating || 5;
        const tags = this.selectedReviewTags;

        if (!orderId) {
          if (window.showSystemAlert) {
            window.showSystemAlert('Error', 'No active order selected for review.', 'error');
          } else {
            alert('Error: No active order selected for review.');
          }
          return;
        }

        window.appStore.addOrderReview(orderId, rating, reviewText, tags);
        if (modal) modal.classList.add('hidden');
        if (window.showSystemAlert) {
          window.showSystemAlert('Review Recorded', `Thank you! Your ★ ${rating}.0 verified rating & review has been recorded and submitted to the farmer.`, 'success');
        } else {
          alert(`Thank you! Your ★ ${rating}.0 verified rating & review has been recorded and submitted to the farmer.`);
        }
        this.renderOrderHistory();
      });
    }
  }

  openOrderReviewModal(orderId) {
    const orders = window.appStore.getOrders();
    const ord = orders.find(o => String(o.id) === String(orderId));
    if (!ord) return;

    const modal = document.getElementById('order-review-modal');
    if (!modal) return;

    document.getElementById('review-modal-crop-name').textContent = ord.cropName;
    document.getElementById('review-modal-farmer-name').textContent = `Farmer: ${ord.farmerName}`;
    document.getElementById('review-modal-order-id').textContent = `Order #${ord.id}`;
    document.getElementById('review-active-order-id').value = ord.id;
    document.getElementById('review-comments-input').value = ord.reviewText || '';

    // Reset stars to 5 or existing rating
    const ratingVal = ord.reviewRating || 5;
    this.reviewRating = ratingVal;
    document.querySelectorAll('.review-star-btn').forEach(b => {
      const bVal = parseInt(b.dataset.val, 10);
      b.className = bVal <= ratingVal ? 'review-star-btn text-2xl text-amber-400 hover:scale-125 transition' : 'review-star-btn text-2xl text-slate-300 hover:scale-125 transition';
    });

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  updateCartSummary(pricing) {
    if (typeof pricing === 'number') {
      pricing = window.appStore.calculatePricing(pricing);
    } else if (!pricing) {
      pricing = window.appStore.calculatePricing(0);
    }
    const subtotal = Number(pricing.subtotal) || 0;
    const savings = Number(pricing.retailSavings != null ? pricing.retailSavings : pricing.savings) || 0;
    const freight = Number(pricing.freightCharge) || 0;
    const grandTotal = Number(pricing.grandTotal) || 0;

    const subtotalEl = document.getElementById('cart-subtotal-val');
    const savingsEl = document.getElementById('cart-savings-val');
    const logisticsEl = document.getElementById('cart-logistics-val');
    const totalEl = document.getElementById('cart-total-val');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (savingsEl) savingsEl.textContent = `₹${savings.toLocaleString('en-IN')}`;
    if (logisticsEl) logisticsEl.textContent = `₹${freight.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  // Populate Checkout Modal
  populateCheckoutModal() {
    const cart = window.appStore.getCart();
    const summaryContainer = document.getElementById('checkout-order-summary');
    if (!summaryContainer) return;

    let subtotal = 0;
    const itemsHtml = cart.map(item => {
      const lineTotal = item.quantity * item.pricePerUnit;
      subtotal += lineTotal;
      return `
        <div class="flex items-center justify-between text-xs py-1 border-b border-slate-100">
          <span class="text-slate-700">${item.quantity} x ${item.name} (${item.unit})</span>
          <span class="font-semibold text-slate-900">₹${lineTotal.toLocaleString('en-IN')}</span>
        </div>
      `;
    }).join('');

    const pricing = window.appStore.calculatePricing(subtotal);
    const subtotalVal = Number(pricing.subtotal) || 0;
    const mandiCessVal = Number(pricing.mandiCess) || 0;
    const platformFeeVal = Number(pricing.platformFee) || 0;
    const freightChargeVal = Number(pricing.freightCharge) || 0;
    const grandTotalVal = Number(pricing.grandTotal) || 0;
    const savingsVal = Number(pricing.retailSavings != null ? pricing.retailSavings : pricing.savings) || 0;

    summaryContainer.innerHTML = `
      ${itemsHtml}
      <div class="flex items-center justify-between text-xs py-1 pt-2 font-semibold">
        <span>Produce Subtotal</span>
        <span>₹${subtotalVal.toLocaleString('en-IN')}</span>
      </div>
      <div class="flex items-center justify-between text-xs py-0.5 text-slate-500 text-[11px]">
        <span>APMC Mandi Cess (1.5%)</span>
        <span>₹${mandiCessVal.toLocaleString('en-IN')}</span>
      </div>
      <div class="flex items-center justify-between text-xs py-0.5 text-slate-500 text-[11px]">
        <span>Platform Tech & Verification Fee (1.0%)</span>
        <span>₹${platformFeeVal.toLocaleString('en-IN')}</span>
      </div>
      <div class="flex items-center justify-between text-xs py-1 text-slate-700">
        <span>Green Logistics Freight (Flat Rural Tariff)</span>
        <span>₹${freightChargeVal.toLocaleString('en-IN')}</span>
      </div>
      <div class="flex items-center justify-between text-sm py-2 font-extrabold text-slate-900 border-t border-slate-200 mt-1">
        <span>Total Payable (Escrow Protected)</span>
        <span class="text-emerald-700">₹${grandTotalVal.toLocaleString('en-IN')}</span>
      </div>
      <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-medium flex items-center justify-between mt-2 border border-emerald-200">
        <span class="flex items-center gap-1"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-600"></i> Est. Retail Savings vs Middlemen:</span>
        <span class="font-bold text-emerald-700">₹${savingsVal.toLocaleString('en-IN')}</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  handleOrderPlacement() {
    const cart = window.appStore.getCart();
    if (cart.length === 0) return;

    const deliveryAddress = document.getElementById('checkout-address-input')?.value || 'Flat 402, Sunshine Heights, Kalyani Nagar, Pune, MH 411006';
    const paymentMode = document.querySelector('input[name="payment_method"]:checked')?.value || 'UPI / Instant Kisan Pay';
    const deliverySpeed = document.getElementById('checkout-logistics-speed')?.value || 'Standard Agro-Freight';
    const currentUser = window.appStore.getCurrentUser();
    const buyerId = (currentUser && currentUser.id) ? currentUser.id : 'buyer-201';
    const buyerName = (currentUser && currentUser.name) ? currentUser.name : 'Priya Sharma (GreenBites Co-op)';
    const buyerType = (currentUser && currentUser.buyerType) ? currentUser.buyerType : 'Consumer Collective';
    const buyerPhone = (currentUser && currentUser.phone) ? currentUser.phone : '+91 98201 44552';

    // Create an order for each distinct farmer or item in cart
    const allCrops = window.appStore.getCrops();
    cart.forEach(item => {
      const itemSubtotal = (item.quantity || 1) * (item.pricePerUnit || 0);
      const itemPricing = window.appStore.calculatePricing(itemSubtotal);
      const cropLookup = allCrops.find(c => String(c.id) === String(item.cropId));
      const farmerId = item.farmerId || (cropLookup ? cropLookup.farmerId : 'farmer-1');
      const farmerName = item.farmerName || (cropLookup ? cropLookup.farmerName : 'Ramesh Patel');

      const newOrder = {
        cropId: item.cropId,
        cropName: item.name,
        farmerId: farmerId,
        farmerName: farmerName,
        buyerId: buyerId,
        buyerName: buyerName,
        buyerType: buyerType,
        buyerPhone: buyerPhone,
        deliveryAddress: deliveryAddress,
        distanceKm: (cropLookup && cropLookup.deliveryRadiusKm) || 52,
        quantity: item.quantity,
        unit: item.unit,
        listedPrice: item.pricePerUnit,
        offeredPrice: item.pricePerUnit, // Direct cart checkout is at listed price
        subtotal: itemPricing.subtotal,
        mandiCess: itemPricing.mandiCess,
        platformFee: itemPricing.platformFee,
        freightCharge: itemPricing.freightCharge,
        totalAmount: itemPricing.grandTotal,
        paymentMode: paymentMode,
        status: 'pending',
        createdAt: new Date().toISOString(),
        notes: `Direct checkout order via ${deliverySpeed}. Delivery scheduled.`
      };

      window.appStore.addOrder(newOrder);
    });

    window.appStore.clearCart();
    document.getElementById('checkout-modal')?.classList.add('hidden');
    if (window.showSystemAlert) {
      window.showSystemAlert('Order Placed Successfully', 'Congratulations! Your order has been placed in Escrow protection. A real-time notification has been sent to the farmer.', 'success');
    } else {
      alert('Congratulations! Your order has been placed successfully. A notification has been sent to the farmer.');
    }
    this.switchTab('orders');
  }

  // Review Order History Tab & List of Orders
  renderOrderHistory() {
    const currentUser = window.appStore.getCurrentUser();
    const userId = currentUser && currentUser.id ? currentUser.id : 'buyer-201';
    let allOrders = window.appStore.getOrders();
    let orders = allOrders.filter(o => String(o.buyerId) === String(userId));
    const container = document.getElementById('consumer-orders-list');
    const totalStatEl = document.getElementById('consumer-orders-total-stat');
    const activeStatEl = document.getElementById('consumer-orders-active-stat');

    const totalOrdersCount = orders.length;
    const activeOrdersCount = orders.filter(o => ['dispatched', 'accepted'].includes(o.status)).length;

    if (totalStatEl) totalStatEl.textContent = `${totalOrdersCount} Orders`;
    if (activeStatEl) activeStatEl.textContent = `${activeOrdersCount} Active`;

    // Filter orders based on active filter chip
    if (this.orderFilter === 'active') {
      orders = orders.filter(o => ['dispatched', 'accepted'].includes(o.status));
    } else if (this.orderFilter === 'delivered') {
      orders = orders.filter(o => o.status === 'delivered');
    } else if (this.orderFilter === 'pending') {
      orders = orders.filter(o => ['pending', 'countered'].includes(o.status));
    }

    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <i data-lucide="package-search" class="w-12 h-12 mx-auto mb-3 text-slate-300"></i>
          <h3 class="text-base font-bold text-slate-700">No Consignments in this View</h3>
          <p class="text-xs text-slate-400 mt-1">Select "All Orders" or visit the Farm Marketplace to place new orders directly from growers.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = orders.map(ord => {
      // Stepper calculation
      const steps = [
        { label: 'Order Placed', completed: true },
        { label: 'Farmer Accepted', completed: ['accepted', 'dispatched', 'delivered'].includes(ord.status) },
        { label: 'Truck Assigned', completed: ['dispatched', 'delivered'].includes(ord.status) },
        { label: 'In Transit', completed: ['dispatched', 'delivered'].includes(ord.status) },
        { label: 'Delivered', completed: ord.status === 'delivered' }
      ];

      const isDelivered = ord.status === 'delivered';
      const hasReview = ord.reviewRating && ord.reviewRating > 0;

      return `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-4 transition hover:border-emerald-300">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-slate-400">Order #${ord.id}</span>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  ord.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                  ord.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                  ord.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                  ord.status === 'countered' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }">
                  ${ord.status.toUpperCase()}
                </span>
                ${ord.paymentMode ? `<span class="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">${ord.paymentMode}</span>` : ''}
              </div>
              <h3 class="text-base font-bold text-slate-900 mt-1">${ord.cropName}</h3>
              <p class="text-xs text-slate-500">From ${ord.farmerName} • Placed on ${new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 block">Total Amount</span>
              <span class="text-lg font-extrabold text-emerald-700">₹${(ord.totalAmount || ord.quantity * ord.offeredPrice).toLocaleString('en-IN')}</span>
              <span class="text-[11px] text-slate-500 block">${ord.quantity} ${ord.unit} @ ₹${ord.offeredPrice}</span>
            </div>
          </div>

          <!-- Stepper Visualization -->
          <div class="py-5">
            <div class="grid grid-cols-5 gap-2 relative">
              ${steps.map((s, idx) => `
                <div class="flex flex-col items-center text-center relative z-10">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    s.completed ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }">
                    ${s.completed ? '✓' : idx + 1}
                  </div>
                  <span class="text-[11px] font-semibold mt-1.5 ${s.completed ? 'text-slate-900' : 'text-slate-400'}">
                    ${s.label}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Delivery Details & Action Bar -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <div>
              <span class="text-slate-400 block text-[11px]">Delivery Location</span>
              <span class="font-medium text-slate-800">${ord.deliveryAddress || 'Kalyani Nagar, Pune'}</span>
            </div>
            <div class="flex items-center gap-2">
              ${ord.status === 'dispatched' ? `
                <button type="button" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-1 shadow-xs"
                  onclick="window.showSystemAlert ? window.showSystemAlert('Carrier Fleet Telemetry', 'Carrier: Gurpreet Singh (+91 98765 43210)\\nVehicle: MH-15-EG-4482\\nGPS Status: En route on Sangamner Bypass, 54 km/h.', 'info') : alert('Carrier: Gurpreet Singh (+91 98765 43210)\\nVehicle: MH-15-EG-4482\\nGPS Status: En route on Sangamner Bypass, 54 km/h.')">
                  <i data-lucide="truck" class="w-3.5 h-3.5"></i> Live Route GPS
                </button>
              ` : ''}

              ${isDelivered && !hasReview ? `
                <button type="button" class="rate-order-btn px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
                  data-order-id="${ord.id}">
                  <i data-lucide="star" class="w-3.5 h-3.5 fill-white"></i> Rate & Review
                </button>
              ` : ''}

              <button type="button" class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition flex items-center gap-1"
                onclick="window.showSystemAlert ? window.showSystemAlert('Tax Invoice Generated', 'Tax Invoice & Delivery Receipt generated for Order #${ord.id}. Total ₹${(ord.totalAmount || 0).toLocaleString('en-IN')}.\\nAuthorized KisanSetu Direct Mandi Escrow.', 'success') : alert('Tax Invoice & Delivery Receipt generated for Order #${ord.id}. Total ₹${ord.totalAmount}.\\nAuthorized KisanSetu Direct Mandi Escrow.')">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Download Invoice
              </button>
            </div>
          </div>

          <!-- Farmer Counter-Offer Action Card (When status is countered) -->
          ${ord.status === 'countered' ? `
            <div class="mt-4 p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-sm animate-in fade-in duration-200">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-extrabold tracking-wide uppercase">
                      Action Required: Counter-Offer Received
                    </span>
                    <span class="text-xs text-amber-900 font-bold">
                      Farmer Counter: <span class="text-sm font-extrabold text-amber-950">₹${(ord.counterPrice || ord.offeredPrice).toLocaleString('en-IN')}</span> / ${ord.unit}
                    </span>
                  </div>
                  <p class="text-xs text-amber-900 leading-relaxed">
                    Farmer <strong>${ord.farmerName}</strong> has proposed a counter-price of <strong>₹${(ord.counterPrice || ord.offeredPrice).toLocaleString('en-IN')}/${ord.unit}</strong> (your original offer was ₹${(ord.offeredPrice || 0).toLocaleString('en-IN')}/${ord.unit}).
                    ${ord.counterNotes ? `<span class="italic block text-[11px] text-amber-800 mt-0.5">Farmer note: "${ord.counterNotes}"</span>` : ''}
                  </p>
                  <div class="text-[11px] text-slate-600 flex items-center gap-3 pt-0.5 font-medium">
                    <span>Revised Produce Subtotal: <strong>₹${((ord.counterPrice || ord.offeredPrice) * ord.quantity).toLocaleString('en-IN')}</strong></span>
                    <span>•</span>
                    <span>Logistics Freight: <strong>₹450</strong></span>
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
                  <button type="button" class="consumer-accept-counter-btn px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    data-order-id="${ord.id}">
                    <i data-lucide="check" class="w-4 h-4"></i> Accept Counter
                  </button>
                  <button type="button" class="consumer-recounter-btn px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    data-order-id="${ord.id}">
                    <i data-lucide="message-square" class="w-4 h-4"></i> Counter Again
                  </button>
                  <button type="button" class="consumer-decline-counter-btn px-3 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                    data-order-id="${ord.id}">
                    <i data-lucide="x" class="w-4 h-4"></i> Decline
                  </button>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Rating & Review display if completed and reviewed -->
          ${isDelivered && hasReview ? `
            <div class="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  ${'★'.repeat(Math.round(ord.reviewRating))}${'☆'.repeat(Math.max(0, 5 - Math.round(ord.reviewRating)))}
                  <span class="text-slate-800 font-bold ml-1">${ord.reviewRating.toFixed(1)} / 5.0</span>
                  <span class="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full ml-1 font-semibold">Verified Consumer Review</span>
                </div>
                <p class="text-xs text-slate-700 italic mt-1">"${ord.reviewText || 'Delivered on time with pristine farm freshness.'}"</p>
                ${ord.reviewTags && ord.reviewTags.length ? `
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    ${ord.reviewTags.map(t => `<span class="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[10px] text-amber-900 font-medium">✓ ${t}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
              <button type="button" class="rate-order-btn text-[11px] font-bold text-amber-800 hover:underline flex-shrink-0"
                data-order-id="${ord.id}">
                Edit Review
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    // Attach review button triggers
    container.querySelectorAll('.rate-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        this.openOrderReviewModal(orderId);
      });
    });

    // Attach consumer counter-offer action buttons
    container.querySelectorAll('.consumer-accept-counter-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderId = btn.dataset.orderId;
        await window.appStore.respondCounterOrder(orderId, 'accept');
        if (window.app && window.app.showToast) {
          window.app.showToast(`✓ Counter-offer accepted! Order #${orderId} confirmed with farmer.`, 'accepted');
        } else if (window.showSystemAlert) {
          window.showSystemAlert('Counter-Offer Accepted', `Order #${orderId} has been confirmed at the negotiated rate. Logistics dispatch initiated!`, 'success');
        }
        this.renderOrderHistory();
      });
    });

    container.querySelectorAll('.consumer-recounter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        this.openConsumerCounterModal(orderId);
      });
    });

    container.querySelectorAll('.consumer-decline-counter-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderId = btn.dataset.orderId;
        const confirmed = window.showSystemConfirm
          ? await window.showSystemConfirm('Decline Counter-Offer?', `Are you sure you want to decline the farmer's counter-offer for Order #${orderId}?`)
          : confirm(`Decline the farmer's counter-offer for Order #${orderId}?`);

        if (confirmed) {
          await window.appStore.respondCounterOrder(orderId, 'decline');
          if (window.app && window.app.showToast) {
            window.app.showToast(`Counter-offer for Order #${orderId} declined.`, 'declined');
          }
          this.renderOrderHistory();
        }
      });
    });
  }

  // Setup Consumer Counter-Offer Modal
  setupConsumerCounterModal() {
    const modal = document.getElementById('consumer-counter-modal');
    const closeBtn = document.getElementById('close-consumer-counter-modal-btn');
    const cancelBtn = document.getElementById('cancel-consumer-counter-btn');
    const form = document.getElementById('consumer-counter-form');
    const priceInput = document.getElementById('ccounter-price-input');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    if (cancelBtn && modal) {
      cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    const updateLiveMath = () => {
      const orderId = document.getElementById('ccounter-order-id-val')?.value;
      if (!orderId) return;
      const orders = window.appStore.getOrders();
      const ord = orders.find(o => String(o.id) === String(orderId));
      if (!ord) return;

      const price = parseFloat(priceInput?.value) || 0;
      const qty = ord.quantity || 1;
      const subtotal = Math.round(price * qty);
      const pricing = window.appStore.calculatePricing(subtotal);

      const subtotalEl = document.getElementById('ccounter-calc-subtotal');
      const feesEl = document.getElementById('ccounter-calc-fees');
      const totalEl = document.getElementById('ccounter-calc-total');

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
        const orderId = document.getElementById('ccounter-order-id-val')?.value;
        const price = parseFloat(document.getElementById('ccounter-price-input')?.value);
        const notes = document.getElementById('ccounter-notes-input')?.value;

        if (!orderId || isNaN(price) || price <= 0) {
          if (window.showSystemAlert) {
            window.showSystemAlert('Invalid Price', 'Please enter a valid counter-offer price.', 'warning');
          } else {
            alert('Please enter a valid counter-offer price.');
          }
          return;
        }

        await window.appStore.respondCounterOrder(orderId, 'counter', price, notes);
        if (modal) modal.classList.add('hidden');

        if (window.app && window.app.showToast) {
          window.app.showToast(`Revised counter-offer of ₹${price.toLocaleString('en-IN')} dispatched to farmer!`, 'negotiated');
        } else if (window.showSystemAlert) {
          window.showSystemAlert('Counter-Offer Dispatched', `Your revised proposal of ₹${price.toLocaleString('en-IN')} has been sent to the farmer.`, 'success');
        }

        this.renderOrderHistory();
      });
    }
  }

  // Open Consumer Counter-Offer Modal
  openConsumerCounterModal(orderId) {
    const orders = window.appStore.getOrders();
    const ord = orders.find(o => String(o.id) === String(orderId));
    if (!ord) return;

    const modal = document.getElementById('consumer-counter-modal');
    if (!modal) return;

    const orderIdVal = document.getElementById('ccounter-order-id-val');
    const cropNameEl = document.getElementById('ccounter-crop-name');
    const orderIdEl = document.getElementById('ccounter-order-id');
    const farmerNameEl = document.getElementById('ccounter-farmer-name');
    const qtyUnitEl = document.getElementById('ccounter-quantity-unit');
    const farmerCounterEl = document.getElementById('ccounter-farmer-counter');
    const priorOfferEl = document.getElementById('ccounter-prior-offer');
    const priceInput = document.getElementById('ccounter-price-input');
    const notesInput = document.getElementById('ccounter-notes-input');

    if (orderIdVal) orderIdVal.value = ord.id;
    if (cropNameEl) cropNameEl.textContent = ord.cropName || 'Produce';
    if (orderIdEl) orderIdEl.textContent = `#${ord.id}`;
    if (farmerNameEl) farmerNameEl.textContent = ord.farmerName || 'Farmer';
    if (qtyUnitEl) qtyUnitEl.textContent = `${ord.quantity} ${ord.unit || 'Quintals'}`;

    const farmerCounter = ord.counterPrice || ord.offeredPrice;
    if (farmerCounterEl) farmerCounterEl.textContent = `₹${(farmerCounter).toLocaleString('en-IN')} / ${ord.unit || 'Qtl'}`;
    if (priorOfferEl) priorOfferEl.textContent = `₹${(ord.offeredPrice || 0).toLocaleString('en-IN')} / ${ord.unit || 'Qtl'}`;

    // Suggested revised price: compromise between prior offer and farmer counter
    const suggested = Math.round((farmerCounter + (ord.offeredPrice || farmerCounter)) / 2);
    if (priceInput) priceInput.value = suggested;
    if (notesInput) notesInput.value = '';

    if (priceInput) {
      priceInput.dispatchEvent(new Event('input'));
    }

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
    if (priceInput) priceInput.focus();
  }

  updateNotificationBadge() {
    const badge = document.getElementById('consumer-notif-counter');
    if (badge && window.appStore) {
      const notifs = window.appStore.getNotifications('consumer') || [];
      const unreadCount = notifs.filter(n => !n.read).length;
      badge.textContent = unreadCount;
      if (unreadCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  // Consumer (Wholesale Buyer) Notifications & Alerts Feed
  renderConsumerNotifications() {
    this.updateNotificationBadge();
    const container = document.getElementById('consumer-notifications-list');
    if (!container) return;

    const notifs = window.appStore.getNotifications('consumer');

    // Attach mark read & clear buttons
    const markReadBtn = document.getElementById('consumer-notif-mark-read-btn');
    if (markReadBtn && !markReadBtn._hasHandler) {
      markReadBtn._hasHandler = true;
      markReadBtn.addEventListener('click', () => {
        window.appStore.markAllNotificationsRead('consumer');
        this.renderConsumerNotifications();
      });
    }

    const clearBtn = document.getElementById('consumer-notif-clear-btn');
    if (clearBtn && !clearBtn._hasHandler) {
      clearBtn._hasHandler = true;
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all buyer notifications?')) {
          window.appStore.clearNotifications('consumer');
          this.renderConsumerNotifications();
        }
      });
    }

    if (notifs.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <i data-lucide="bell-off" class="w-6 h-6"></i>
          </div>
          <h4 class="font-bold text-slate-800 text-sm">No Buyer Alerts</h4>
          <p class="text-xs text-slate-400">You are all caught up! New order acceptances, dispatch GPS tracking, and quality certificates will appear here.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const typeIcons = {
      order: { icon: 'shopping-bag', bg: 'bg-emerald-100 text-emerald-800' },
      accepted: { icon: 'check-circle-2', bg: 'bg-emerald-100 text-emerald-800' },
      transit: { icon: 'truck', bg: 'bg-blue-100 text-blue-800' },
      harvest: { icon: 'sprout', bg: 'bg-lime-100 text-lime-800' },
      quality: { icon: 'award', bg: 'bg-purple-100 text-purple-800' },
      escrow: { icon: 'shield-check', bg: 'bg-indigo-100 text-indigo-800' },
      negotiated: { icon: 'arrow-left-right', bg: 'bg-amber-100 text-amber-800' },
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
                ${n.truckNumber ? `<span>• Truck: <b class="text-blue-700 font-bold">${n.truckNumber}</b></span>` : ''}
                ${n.cropName ? `<span>• Crop: <b class="text-emerald-700 font-bold">${n.cropName}</b></span>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  render() {
    this.renderCart();
    this.updateLiveTracking();
    this.updateNotificationBadge();
    if (this.activeTab === 'marketplace') {
      this.renderMarketplace();
    } else if (this.activeTab === 'orders') {
      this.renderOrderHistory();
    } else if (this.activeTab === 'notifications') {
      this.renderConsumerNotifications();
    }
  }
}

window.consumerController = new ConsumerController();

