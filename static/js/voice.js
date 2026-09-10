// Voice Assistant & Hands-Free Speech Parser for Farmers
class VoiceListingAssistant {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.onParsedCallback = null;
    this.onStateChangeCallback = null;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN'; // Indian English dialect

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.processSpokenText(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false, event.error);
      };
    }
  }

  startListening(onParsed, onStateChange) {
    this.onParsedCallback = onParsed;
    this.onStateChangeCallback = onStateChange;

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition start caught error:', err);
      }
    } else {
      // Fallback simulation if microphone or speech recognition is blocked or unsupported in current environment
      if (this.onStateChangeCallback) this.onStateChangeCallback(true, 'simulated');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  // Parse spoken agricultural voice command into form values
  processSpokenText(text) {
    const lower = text.toLowerCase();
    const parsed = {
      rawText: text,
      cropName: '',
      category: 'Cereals',
      quantity: 50,
      unit: 'Quintal',
      isOrganic: false,
      harvestDaysAgo: 2,
      price: 2600,
      grade: 'A',
      confidence: 0.95
    };

    // 1. Organic detection
    if (lower.includes('organic') || lower.includes('jaivik') || lower.includes('pesticide free') || lower.includes('chemical free')) {
      parsed.isOrganic = true;
    }

    // 2. Crop matching & category
    if (lower.includes('wheat') || lower.includes('gehun') || lower.includes('sharbati')) {
      parsed.cropName = 'Sharbati Golden Wheat';
      parsed.category = 'Cereals';
      parsed.unit = 'Quintal';
    } else if (lower.includes('mango') || lower.includes('alphonso') || lower.includes('aam') || lower.includes('ratnagiri')) {
      parsed.cropName = 'Alphonso Ratnagiri Mangoes';
      parsed.category = 'Fruits';
      parsed.unit = 'Crates (12 Doz/crate)';
    } else if (lower.includes('rice') || lower.includes('basmati') || lower.includes('chawal') || lower.includes('paddy')) {
      parsed.cropName = 'Pusa 1121 Basmati Rice (Paddy)';
      parsed.category = 'Cereals';
      parsed.unit = 'Quintal';
    } else if (lower.includes('tomato') || lower.includes('tamatar')) {
      parsed.cropName = 'Red Hybrid Vine Tomatoes';
      parsed.category = 'Vegetables';
      parsed.unit = 'Crates (25kg/crate)';
    } else if (lower.includes('turmeric') || lower.includes('haldi') || lower.includes('lakadong')) {
      parsed.cropName = 'Lakadong High-Curcumin Turmeric';
      parsed.category = 'Spices';
      parsed.unit = 'Quintal';
    } else if (lower.includes('mustard') || lower.includes('sarson')) {
      parsed.cropName = 'Yellow Mustard Seed (Sarson)';
      parsed.category = 'Oilseeds';
      parsed.unit = 'Quintal';
    } else if (lower.includes('onion') || lower.includes('pyaz')) {
      parsed.cropName = 'Nashik Red Onions';
      parsed.category = 'Vegetables';
      parsed.unit = 'Quintal';
    } else if (lower.includes('cotton') || lower.includes('kapas')) {
      parsed.cropName = 'BT Hybrid Long Staple Cotton';
      parsed.category = 'Cash Crops';
      parsed.unit = 'Quintal';
    } else {
      parsed.cropName = text.split(' ').slice(1, 4).join(' ');
    }

    // 3. Quantity matching
    const qtyMatch = lower.match(/(\d+)\s*(quintal|quintals|crate|crates|kg|tons?|bags?)/i) || lower.match(/(?:list|add|post)?\s*(\d+)/i);
    if (qtyMatch) {
      parsed.quantity = parseInt(qtyMatch[1], 10);
      if (qtyMatch[2]) {
        const u = qtyMatch[2].toLowerCase();
        if (u.startsWith('crate')) parsed.unit = 'Crates';
        else if (u.startsWith('ton')) parsed.unit = 'Tons';
        else if (u.startsWith('kg')) parsed.unit = 'Kg';
        else parsed.unit = 'Quintal';
      }
    }

    // 4. Harvest timeline matching ("harvested 2 days ago", "harvested yesterday", "harvested today")
    if (lower.includes('yesterday')) {
      parsed.harvestDaysAgo = 1;
    } else if (lower.includes('today')) {
      parsed.harvestDaysAgo = 0;
    } else {
      const daysMatch = lower.match(/(\d+)\s*days?\s*ago/i) || lower.match(/harvest(?:ed)?\s*(\d+)/i);
      if (daysMatch) {
        parsed.harvestDaysAgo = parseInt(daysMatch[1], 10);
      }
    }

    // 5. Price matching ("at 2800 rupees", "price 2500", "2800 per quintal")
    const priceMatch = lower.match(/(?:at|price|rate|rs\.?|inr|rupees)\s*(\d+)/i) || lower.match(/(\d{3,5})\s*(?:rupees|rs|\/)/i);
    if (priceMatch) {
      parsed.price = parseInt(priceMatch[1], 10);
    }

    // 6. Grade matching
    if (lower.includes('grade a plus') || lower.includes('grade a+') || lower.includes('export')) {
      parsed.grade = 'A+';
    } else if (lower.includes('grade a') || lower.includes('premium')) {
      parsed.grade = 'A';
    } else if (lower.includes('grade b') || lower.includes('standard')) {
      parsed.grade = 'B';
    } else if (lower.includes('grade c')) {
      parsed.grade = 'C';
    }

    if (this.onParsedCallback) {
      this.onParsedCallback(parsed);
    }

    this.speakFeedback(`Understood. Auto-filled listing for ${parsed.quantity} ${parsed.unit} of ${parsed.cropName} at ₹${parsed.price}.`);
    return parsed;
  }

  speakFeedback(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  }

  // Pre-canned voice sample simulations for testing in sandbox/browser without mic
  simulateVoiceSample(sampleKey) {
    const samples = {
      wheat: "List 50 quintals of organic Sharbati wheat harvested 2 days ago at 2750 rupees per quintal Grade A plus",
      mango: "Add 120 crates of Alphonso mangoes harvested 1 day ago at 1850 rupees Grade A plus organic",
      tomato: "List 80 crates of fresh vine tomatoes harvested yesterday at 480 rupees Grade A organic",
      rice: "Post 60 quintals of Basmati rice harvested 4 days ago at 3800 rupees Grade A"
    };

    const text = samples[sampleKey] || samples.wheat;
    return this.processSpokenText(text);
  }
}

window.voiceAssistant = new VoiceListingAssistant();

