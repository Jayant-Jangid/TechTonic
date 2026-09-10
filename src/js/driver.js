// Truck Driver Dashboard: Logistics Panel (Capacity, Pricing, Assigned Route A to B, Trip History)

class DriverController {
  constructor() {
    this.activeTab = 'route'; // 'route' | 'loads' | 'history' | 'config' | 'notifications'
    this.initEventListeners();
    this.updateNotificationBadge();
    if (window.appStore && typeof window.appStore.syncOrdersWithDatabase === 'function') {
      window.appStore.syncOrdersWithDatabase();
    }
  }

  initEventListeners() {
    window.appStore.subscribe((event, payload) => {
      if (['driver_updated', 'route_updated', 'driver_load_created', 'order_added', 'order_updated', 'data_reset', 'notifications_updated', 'notification_added'].includes(event)) {
        this.updateNotificationBadge();
        this.render();
      } else if (event === 'gps_telemetry_updated') {
        this.updateLiveTracking(payload);
      }
    });

    // Driver Portal Tab Navigation
    document.querySelectorAll('.driver-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Active Truck Map Recenter GPS Button
    const mapCenterBtn = document.getElementById('driver-map-center-btn');
    if (mapCenterBtn) {
      mapCenterBtn.addEventListener('click', () => {
        const pin = document.getElementById('driver-active-truck-pin');
        if (pin) {
          pin.classList.add('scale-125');
          setTimeout(() => pin.classList.remove('scale-125'), 600);
        }
        const telemetry = window.appStore.getLiveGpsTelemetry();
        const alertMsg = `Centering GPS Nav: Vehicle MH-15-EG-4482\nCurrent Speed: ${telemetry.speedMs} m/s • Corridor: ${telemetry.corridorLocation} • ${telemetry.remainingMetersFormatted} to Destination.`;
        if (window.showSystemAlert) {
          window.showSystemAlert('Driver GPS Navigation', alertMsg, 'info');
        } else {
          alert(alertMsg);
        }
      });
    }

    // Capacity & Vehicle Form
    const capacityForm = document.getElementById('driver-capacity-form');
    if (capacityForm) {
      capacityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const maxCap = document.getElementById('driver-max-cap-input').value;
        const vehicleType = document.getElementById('driver-vehicle-type-select').value;
        window.appStore.updateDriverCapacity(maxCap, vehicleType);
        if (window.showSystemAlert) {
          window.showSystemAlert('Payload Capacity Updated', 'Vehicle payload capacity settings successfully updated!', 'success');
        } else {
          alert('Vehicle payload capacity successfully updated!');
        }
      });
    }

    // Pricing Form
    const pricingForm = document.getElementById('driver-pricing-form');
    if (pricingForm) {
      pricingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const baseKm = document.getElementById('driver-base-km-input').value;
        const perQtl = document.getElementById('driver-per-qtl-input').value;
        window.appStore.updateDriverPricing(baseKm, perQtl);
        if (window.showSystemAlert) {
          window.showSystemAlert('Tariff Updated', 'Freight tariff rates successfully updated!', 'success');
        } else {
          alert('Freight tariff rates updated!');
        }
      });
    }

    // Route Status Action Stepper
    const routeActionBtn = document.getElementById('route-status-action-btn');
    if (routeActionBtn) {
      routeActionBtn.addEventListener('click', () => {
        this.advanceRouteStatus();
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.driver-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.className = 'driver-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-slate-900 text-white shadow-xs';
      } else {
        btn.className = 'driver-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200';
      }
    });

    const views = ['route', 'loads', 'history', 'config', 'notifications'];
    views.forEach(v => {
      const el = document.getElementById(`driver-view-${v}`);
      if (el) {
        if (v === tabName) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    if (tabName === 'history' || tabName === 'loads') {
      if (window.appStore && typeof window.appStore.syncOrdersWithDatabase === 'function') {
        window.appStore.syncOrdersWithDatabase();
      }
    }

    if (tabName === 'history') {
      this.renderOrderHistory();
    } else if (tabName === 'loads') {
      this.renderAvailableLoads();
    } else if (tabName === 'route') {
      this.renderAssignedRoute();
    } else if (tabName === 'notifications') {
      this.renderDriverNotifications();
    }
  }

  updateLiveTracking(telemetry) {
    if (!telemetry) telemetry = window.appStore.getLiveGpsTelemetry();
    const routePath = document.getElementById('driver-route-path');
    const truckPin = document.getElementById('driver-active-truck-pin');
    if (routePath && truckPin) {
      try {
        const totalLen = routePath.getTotalLength();
        const pt = routePath.getPointAtLength(telemetry.progress * totalLen);
        truckPin.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);

        const texts = truckPin.querySelectorAll('text');
        if (texts.length >= 3) {
          texts[1].textContent = `Active Truck MH-15-EG-4482`;
          texts[2].textContent = `${telemetry.speedMs} m/s • ${telemetry.remainingMetersFormatted} to Destination`;
        }
      } catch (e) {}
    }

    const distanceStatEl = document.getElementById('route-distance-stat');
    const timeStatEl = document.getElementById('route-time-stat');
    if (distanceStatEl) distanceStatEl.textContent = `${telemetry.totalDistanceKm} km (${telemetry.remainingMetersFormatted} left)`;
    if (timeStatEl) timeStatEl.textContent = telemetry.etaHours;
  }

  async advanceRouteStatus() {
    const driver = window.appStore.getDriverData();
    if (!driver.assignedRoute) return;

    const currentStatus = driver.assignedRoute.status;
    let nextStatus = '';
    let nextLabel = '';

    if (currentStatus === 'assigned') {
      nextStatus = 'loading';
      nextLabel = 'Arrived at Farm Gate - Cargo Loading in Progress';
    } else if (currentStatus === 'loading') {
      nextStatus = 'in_transit';
      nextLabel = 'Cargo Loaded & Sealed - En Route to Destination (Point B)';
    } else if (currentStatus === 'in_transit') {
      const otp = window.showSystemPrompt
        ? await window.showSystemPrompt('Delivery Verification', 'Enter Buyer Delivery Confirmation OTP (Demo code: 4821):', '4821')
        : prompt('Enter Buyer Delivery Confirmation OTP (Demo code: 4821):', '4821');
      if (otp) {
        nextStatus = 'delivered';
        nextLabel = 'Consignment Delivered Successfully. Payment Credited!';
      } else {
        return;
      }
    } else if (currentStatus === 'delivered') {
      if (window.showSystemAlert) {
        window.showSystemAlert('Trip Completed', 'This consignment trip is already marked as delivered. Check the available load board below for new freight assignments.', 'info');
      } else {
        alert('This trip is already completed. Check the available load board below for new freight opportunities.');
      }
      return;
    }

    window.appStore.updateRouteStatus(nextStatus, nextLabel);
  }

  renderCapacityMeter() {
    const driver = window.appStore.getDriverData();
    const maxCap = driver.maxCapacityTons || 10.0;
    const bookedCap = driver.bookedCapacityTons || 0;
    const availableCap = Math.max(0, maxCap - bookedCap);
    const fillPercent = Math.min(100, Math.round((bookedCap / maxCap) * 100));

    const meterBar = document.getElementById('capacity-progress-bar');
    const meterPercent = document.getElementById('capacity-percent-badge');
    const maxCapEl = document.getElementById('driver-max-cap-display');
    const bookedCapEl = document.getElementById('driver-booked-cap-display');
    const availableCapEl = document.getElementById('driver-available-cap-display');

    if (meterBar) meterBar.style.width = `${fillPercent}%`;
    if (meterPercent) meterPercent.textContent = `${fillPercent}% Utilized`;
    if (maxCapEl) maxCapEl.textContent = `${maxCap.toFixed(1)} Tons`;
    if (bookedCapEl) bookedCapEl.textContent = `${bookedCap.toFixed(1)} Tons`;
    if (availableCapEl) availableCapEl.textContent = `${availableCap.toFixed(1)} Tons Remaining`;

    // Inputs sync
    const maxInput = document.getElementById('driver-max-cap-input');
    const vehicleSelect = document.getElementById('driver-vehicle-type-select');
    if (maxInput) maxInput.value = maxCap;
    if (vehicleSelect) vehicleSelect.value = driver.vehicleType;
  }

  renderPricingPanel() {
    const driver = window.appStore.getDriverData();
    const baseKmInput = document.getElementById('driver-base-km-input');
    const perQtlInput = document.getElementById('driver-per-qtl-input');

    if (baseKmInput) baseKmInput.value = driver.pricing?.basePerKm || 28;
    if (perQtlInput) perQtlInput.value = driver.pricing?.perQuintalPer100Km || 16;
  }

  renderAssignedRoute() {
    const driver = window.appStore.getDriverData();
    const route = driver.assignedRoute;
    const container = document.getElementById('driver-assigned-route-card');

    if (!container) return;

    if (!route) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <i data-lucide="map-pin-off" class="w-10 h-10 mx-auto mb-2 text-slate-300"></i>
          <p class="font-bold text-slate-700 text-sm">No Active Route Assigned</p>
          <p class="text-xs text-slate-400 mt-1">Accept a cargo request from the Available Freight Loads tab to begin a trip.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const actionBtn = document.getElementById('route-status-action-btn');
    if (actionBtn) {
      if (route.status === 'assigned') {
        actionBtn.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4"></i> Arrived at Farm Gate (Point A)`;
        actionBtn.className = 'w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2';
      } else if (route.status === 'loading') {
        actionBtn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> Confirm Loaded & Start Transit`;
        actionBtn.className = 'w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2';
      } else if (route.status === 'in_transit') {
        actionBtn.innerHTML = `<i data-lucide="package-check" class="w-4 h-4"></i> Arrived at Destination (Point B) & Deliver`;
        actionBtn.className = 'w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2';
      } else if (route.status === 'delivered') {
        actionBtn.innerHTML = `<i data-lucide="award" class="w-4 h-4"></i> Consignment Delivered • Paid ₹${route.routeStats.tripFee}`;
        actionBtn.className = 'w-full py-3.5 px-4 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm cursor-default flex items-center justify-center gap-2';
      }
    }

    // Dynamic Waypoints UI
    const waypointsContainer = document.getElementById('driver-waypoints-track');
    if (waypointsContainer && route.waypoints) {
      waypointsContainer.innerHTML = route.waypoints.map((wp, idx) => `
        <div class="flex items-start gap-3 relative pb-6 last:pb-0">
          ${idx < route.waypoints.length - 1 ? '<div class="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-200"></div>' : ''}
          <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
            wp.completed ? 'bg-emerald-600 text-white' : wp.isCurrent ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse' : 'bg-slate-100 text-slate-400 border border-slate-300'
          }">
            <i data-lucide="${wp.completed ? 'check' : wp.isCurrent ? 'truck' : 'circle'}" class="w-3.5 h-3.5"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-slate-900">${wp.name}</div>
            <div class="text-[11px] text-slate-400">${wp.time} ${wp.isCurrent ? '• <b class="text-amber-600 font-semibold">Live GPS Location</b>' : ''}</div>
          </div>
        </div>
      `).join('');
    }

    // Route summary card details
    const tripIdEl = document.getElementById('route-trip-id');
    const originNameEl = document.getElementById('route-origin-name');
    const destNameEl = document.getElementById('route-dest-name');
    const cargoDescEl = document.getElementById('route-cargo-desc');
    const distanceStatEl = document.getElementById('route-distance-stat');
    const timeStatEl = document.getElementById('route-time-stat');
    const payoutStatEl = document.getElementById('route-payout-stat');
    const statusBadgeEl = document.getElementById('route-status-label-badge');

    if (tripIdEl) tripIdEl.textContent = route.tripId;
    if (originNameEl) originNameEl.textContent = route.origin.name;
    if (destNameEl) destNameEl.textContent = route.destination.name;
    if (cargoDescEl) cargoDescEl.textContent = `${route.cargo.cropName} (${route.cargo.quantity} • ${route.cargo.weightTons} Tons)`;
    if (distanceStatEl) distanceStatEl.textContent = `${route.routeStats.totalDistanceKm} km (${route.routeStats.coveredDistanceKm} km done)`;
    if (timeStatEl) timeStatEl.textContent = route.routeStats.estimatedHours;
    if (payoutStatEl) payoutStatEl.textContent = `₹${route.routeStats.tripFee.toLocaleString('en-IN')}`;
    if (statusBadgeEl) statusBadgeEl.textContent = route.statusLabel;

    // Supplementary Transit Parameters
    const specs = route.transitSpecs || {};
    const sealEl = document.getElementById('driver-spec-seal');
    const tempEl = document.getElementById('driver-spec-temp');
    const humEl = document.getElementById('driver-spec-humidity');
    const fastagEl = document.getElementById('driver-spec-fastag');
    const ewayEl = document.getElementById('driver-spec-eway');
    const fuelEl = document.getElementById('driver-spec-fuel');
    const haulEl = document.getElementById('driver-spec-haul');

    if (sealEl) sealEl.textContent = specs.cargoSealNo || 'MH-SEAL-882914-A';
    if (tempEl) tempEl.textContent = `${specs.temperatureC || 18.4}°C (Optimal)`;
    if (humEl) humEl.textContent = `${specs.humidityPercent || 62}% RH`;
    if (fastagEl) fastagEl.textContent = specs.fastagStatus || '✓ Cleared at Ghoti Toll';
    if (ewayEl) ewayEl.textContent = specs.ewayBillNo || 'EWB-2940-1184-7729';
    if (fuelEl) fuelEl.textContent = `${specs.estimatedFuelLiters || 38.5} L Diesel (~₹3,465)`;
    if (haulEl) haulEl.textContent = specs.haulDetails || '25 Quintals Sharbati Wheat • 50 Gunny Bags (Grade A+)';

    const originAddrEl = document.getElementById('route-origin-addr');
    const destAddrEl = document.getElementById('route-dest-addr');
    if (originAddrEl) originAddrEl.textContent = route.origin.fullAddress || route.origin.address || route.origin.shortAddress || '';
    if (destAddrEl) destAddrEl.textContent = route.destination.fullAddress || route.destination.address || route.destination.shortAddress || '';

    this.updateLiveTracking();
    if (window.lucide) window.lucide.createIcons();
  }

  renderAvailableLoads() {
    const driver = window.appStore.getDriverData();
    const container = document.getElementById('driver-loads-list');
    const countBadge = document.getElementById('driver-loads-count-badge');
    if (!container) return;

    const loads = driver.availableLoads || [];
    if (countBadge) countBadge.textContent = loads.length;

    if (loads.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <i data-lucide="check-circle-2" class="w-10 h-10 mx-auto mb-2 text-emerald-500"></i>
          <p class="font-bold text-slate-700 text-sm">No Pending Freight Loads</p>
          <p class="text-xs text-slate-400 mt-1">All current farm consignments have been accepted or routed.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = loads.map(load => `
      <div class="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-bold text-slate-900 text-sm">${load.cropName}</h4>
            <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">${load.urgency}</span>
            <span class="font-mono text-[10px] text-slate-400">#LOAD-${load.id}</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 mt-2">
            <div>
              <span class="text-slate-400 block text-[10px]">Origin:</span>
              <b class="text-slate-700">${load.from}</b>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Destination:</span>
              <b class="text-slate-700">${load.to}</b>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Payload:</span>
              <b class="text-slate-700">${load.weightTons} Tons</b>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Distance:</span>
              <b class="text-slate-700">${load.distanceKm} km</b>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">Guaranteed Payout</span>
            <span class="font-extrabold text-emerald-700 text-base">₹${load.payout.toLocaleString('en-IN')}</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="decline-load-btn px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition"
              data-load-id="${load.id}" data-crop="${load.cropName}">
              Decline
            </button>
            <button type="button" class="accept-load-btn px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
              data-load-id="${load.id}">
              Accept Load
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Accept button listener
    container.querySelectorAll('.accept-load-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const loadId = btn.dataset.loadId;
        const load = (window.appStore.getDriverData().availableLoads || []).find(l => l.id === loadId);
        const cropName = load ? load.cropName : 'Consignment';
        window.appStore.assignLoadToDriver(loadId);
        window.appStore.addNotification(
          'accepted',
          'Freight Transit Accepted',
          `Carrier Gurpreet Singh accepted transit for ${cropName} (Load #${loadId}). Truck MH-15-EG-4482 en route to farm gate pickup.`,
          { loadId, role: 'all' }
        );
        if (window.app && window.app.showToast) {
          window.app.showToast(`✓ Accepted freight load for ${cropName}! Manifest activated.`, 'accepted');
        }
        this.switchTab('route');
      });
    });

    // Attach Decline button listener
    container.querySelectorAll('.decline-load-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const loadId = btn.dataset.loadId;
        const cropName = btn.dataset.crop || 'freight load';
        if (confirm(`Decline freight load for "${cropName}"? It will be removed from your board.`)) {
          window.appStore.declineDriverLoad(loadId);
          window.appStore.addNotification(
            'declined',
            'Freight Load Declined',
            `Carrier Gurpreet Singh declined freight transit request for ${cropName}. Reassigned to backup carrier network.`,
            { loadId, role: 'all' }
          );
          if (window.app && window.app.showToast) {
            window.app.showToast(`Freight load for ${cropName} declined and removed from transit board.`, 'declined');
          }
          this.renderAvailableLoads();
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Dedicated Order & Trip History View
  renderOrderHistory() {
    const driver = window.appStore.getDriverData();
    const container = document.getElementById('driver-history-list');
    const countEl = document.getElementById('driver-history-count');
    if (!container) return;

    const history = driver.orderHistory || [];
    if (countEl) countEl.textContent = `${history.length} Completed Trips`;

    if (history.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <i data-lucide="history" class="w-10 h-10 mx-auto mb-2 text-slate-300"></i>
          <p class="font-bold text-slate-700 text-sm">No Completed Trips Recorded Yet</p>
          <p class="text-xs text-slate-400 mt-1">Completed consignments will appear here with payout summaries and verification records.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = history.map(trip => `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition hover:border-blue-300 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-slate-700">${trip.tripId}</span>
              <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                ${trip.status.toUpperCase()}
              </span>
              <span class="text-xs text-slate-400">• Completed on ${trip.completedDate}</span>
            </div>
            <h4 class="font-bold text-slate-900 text-sm mt-1">${trip.cropName}</h4>
            <p class="text-xs text-slate-500">${trip.cropHaulDetails}</p>
          </div>

          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">Freight Payout Credited</span>
            <span class="text-lg font-extrabold text-emerald-700">₹${trip.payout.toLocaleString('en-IN')}</span>
            <span class="text-amber-500 text-xs font-bold block">★ ${trip.driverRating} Rating</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span class="text-slate-400 block text-[10px]">Corridor Route</span>
            <span class="font-bold text-slate-800">${trip.route}</span>
            <span class="text-[11px] text-slate-500 block">${trip.distanceKm} km • Fuel: ${trip.fuelConsumedLiters}L</span>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span class="text-slate-400 block text-[10px]">Transit Compliance</span>
            <span class="font-mono text-[11px] font-bold text-slate-800">${trip.ewayBillNo}</span>
            <span class="text-[11px] text-emerald-700 font-medium block">Seal: ${trip.cargoSealNo}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span class="text-slate-400 block text-[10px]">Tolls & FASTag</span>
            <span class="text-[11px] font-bold text-slate-800">${trip.fastagStatus}</span>
            <span class="text-[10px] text-slate-500 block">APMC Mandi Clearance Verified</span>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  renderDriverStats() {
    const driver = window.appStore.getDriverData();
    const earningsEl = document.getElementById('driver-today-earnings');
    const tripsEl = document.getElementById('driver-weekly-trips');
    const mileageEl = document.getElementById('driver-mileage-stat');
    const ratingEl = document.getElementById('driver-rating-stat');

    if (earningsEl) earningsEl.textContent = `₹${driver.stats.todayEarnings.toLocaleString('en-IN')}`;
    if (tripsEl) tripsEl.textContent = `${driver.stats.weeklyTrips} Trips`;
    if (mileageEl) mileageEl.textContent = driver.stats.dieselEfficiency;
    if (ratingEl) ratingEl.textContent = `★ ${driver.stats.rating}`;
  }

  updateNotificationBadge() {
    const badge = document.getElementById('driver-notif-count-badge');
    if (badge && window.appStore) {
      const notifs = window.appStore.getNotifications('driver') || [];
      const unreadCount = notifs.filter(n => !n.read).length;
      badge.textContent = unreadCount;
      if (unreadCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  // Truck Driver Dispatch Alerts & Logistics Notifications Feed
  renderDriverNotifications() {
    this.updateNotificationBadge();
    const container = document.getElementById('driver-notifications-list');
    if (!container) return;

    const notifs = window.appStore.getNotifications('driver');

    // Attach mark read & clear buttons
    const markReadBtn = document.getElementById('driver-notif-mark-read-btn');
    if (markReadBtn && !markReadBtn._hasHandler) {
      markReadBtn._hasHandler = true;
      markReadBtn.addEventListener('click', () => {
        window.appStore.markAllNotificationsRead('driver');
        this.renderDriverNotifications();
      });
    }

    const clearBtn = document.getElementById('driver-notif-clear-btn');
    if (clearBtn && !clearBtn._hasHandler) {
      clearBtn._hasHandler = true;
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all carrier notifications?')) {
          window.appStore.clearNotifications('driver');
          this.renderDriverNotifications();
        }
      });
    }

    if (notifs.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <i data-lucide="bell-off" class="w-6 h-6"></i>
          </div>
          <h4 class="font-bold text-slate-800 text-sm">No Carrier Alerts</h4>
          <p class="text-xs text-slate-400">You are all caught up! New freight loads, pickup readiness, toll clearances, and payments will appear here.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const typeIcons = {
      load: { icon: 'package-search', bg: 'bg-amber-100 text-amber-800' },
      pickup: { icon: 'map-pin', bg: 'bg-emerald-100 text-emerald-800' },
      route: { icon: 'navigation', bg: 'bg-blue-100 text-blue-800' },
      payment: { icon: 'banknote', bg: 'bg-green-100 text-green-800' },
      transit: { icon: 'truck', bg: 'bg-indigo-100 text-indigo-800' },
      accepted: { icon: 'check-circle-2', bg: 'bg-emerald-100 text-emerald-800' },
      info: { icon: 'info', bg: 'bg-slate-100 text-slate-800' }
    };

    container.innerHTML = notifs.map(n => {
      const iconMeta = typeIcons[n.type] || typeIcons.info;
      return `
        <div class="p-4 rounded-2xl border transition-all ${n.read ? 'bg-white border-slate-200 opacity-90' : 'bg-amber-50/50 border-amber-300 shadow-xs'} flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl ${iconMeta.bg} flex items-center justify-center flex-shrink-0 mt-0.5">
              <i data-lucide="${iconMeta.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="font-bold text-slate-900 text-sm">${n.title}</span>
                ${!n.read ? '<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>' : ''}
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">${n.message}</p>
              <div class="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                <span>${n.timeAgo || 'Recently'}</span>
                ${n.fare ? `<span>• Fare Payment: <b class="text-emerald-700 font-bold">${n.fare}</b></span>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  updateDriverHeaderProfile() {
    const currentUser = window.appStore.getCurrentUser();
    if (!currentUser) return;
    const profile = window.appStore.getProfile(currentUser.id) || {};
    const nameEl = document.getElementById('driver-header-name');
    const detailsEl = document.getElementById('driver-header-details');

    if (nameEl) {
      nameEl.textContent = currentUser.name || 'Commercial Logistics Partner';
    }
    if (detailsEl) {
      const dl = profile.drivingLicense || currentUser.drivingLicense || 'MH-15-2018009214';
      const rc = profile.vehicleNo || currentUser.vehicleNo || 'MH-15-EG-4482';
      const vType = profile.vehicleType || currentUser.vehicleType || '10-Wheeler Multi-Axle';
      detailsEl.textContent = `DL: ${dl} • Vehicle: ${rc} (${vType})`;
    }
  }

  render() {
    this.updateDriverHeaderProfile();
    this.renderCapacityMeter();
    this.renderPricingPanel();
    this.renderAssignedRoute();
    this.renderAvailableLoads();
    this.renderDriverStats();
    this.updateLiveTracking();
    this.updateNotificationBadge();
    if (this.activeTab === 'history') {
      this.renderOrderHistory();
    } else if (this.activeTab === 'notifications') {
      this.renderDriverNotifications();
    }
  }
}

window.driverController = new DriverController();

