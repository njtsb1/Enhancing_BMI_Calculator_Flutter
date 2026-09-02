(() => {
  'use strict';

  const translations = {
    en: {
      title: 'BMI Calculator',
      formTitle: 'BMI Calculator',
      name: 'Name',
      weight: 'Weight (kg)',
      height: 'Height (m)',
      weightHelp: 'Use dot or comma for decimals',
      heightHelp: 'Use dot or comma for decimals',
      clear: 'Clear',
      calculate: 'Calculate BMI',
      resultPrefix: 'Your BMI is:',
      classification: {
        severe: 'Severe Thinness',
        moderate: 'Moderate Thinness',
        mild: 'Mild Thinness',
        healthy: 'Healthy',
        overweight: 'Overweight',
        obese1: 'Obesity Class I',
        obese2: 'Obesity Class II (Severe)',
        obese3: 'Obesity Class III (Morbid)'
      },
      errorInvalid: 'Please enter valid numeric values for weight and height.',
      errorPositive: 'Weight and height must be positive numbers.',
      cleared: 'Form cleared.',
      noResults: 'No results yet. Enter weight and height to calculate BMI.',
      saved: 'saved'
    },
    pt: {
      title: 'Calculadora de IMC',
      formTitle: 'Calculadora de IMC',
      name: 'Nome',
      weight: 'Peso (kg)',
      height: 'Altura (m)',
      weightHelp: 'Use ponto ou vírgula para decimais',
      heightHelp: 'Use ponto ou vírgula para decimais',
      clear: 'Limpar',
      calculate: 'Calcular IMC',
      resultPrefix: 'Seu IMC é:',
      classification: {
        severe: 'Magreza grave',
        moderate: 'Magreza moderada',
        mild: 'Magreza leve',
        healthy: 'Saudável',
        overweight: 'Sobrepeso',
        obese1: 'Obesidade Grau I',
        obese2: 'Obesidade Grau II (severa)',
        obese3: 'Obesidade Grau III (mórbida)'
      },
      errorInvalid: 'Por favor insira valores numéricos válidos para peso e altura.',
      errorPositive: 'Peso e altura devem ser números positivos.',
      cleared: 'Formulário limpo.',
      noResults: 'Sem resultados. Insira peso e altura para calcular o IMC.',
      saved: 'salvos'
    },
    es: {
      title: 'Calculadora de IMC',
      formTitle: 'Calculadora de IMC',
      name: 'Nombre',
      weight: 'Peso (kg)',
      height: 'Altura (m)',
      weightHelp: 'Use punto o coma para decimales',
      heightHelp: 'Use punto o coma para decimales',
      clear: 'Limpiar',
      calculate: 'Calcular IMC',
      resultPrefix: 'Tu IMC es:',
      classification: {
        severe: 'Delgadez grave',
        moderate: 'Delgadez moderada',
        mild: 'Delgadez leve',
        healthy: 'Saludable',
        overweight: 'Sobrepeso',
        obese1: 'Obesidad Grado I',
        obese2: 'Obesidad Grado II (Severa)',
        obese3: 'Obesidad Grado III (Mórbida)'
      },
      errorInvalid: 'Por favor ingresa valores numéricos válidos para peso y altura.',
      errorPositive: 'Peso y altura deben ser números positivos.',
      cleared: 'Formulario limpiado.',
      noResults: 'Sin resultados. Ingresa peso y altura para calcular el IMC.',
      saved: 'guardados'
    }
  };

  const el = {
    html: document.documentElement,
    title: document.getElementById('app-title'),
    formTitle: document.getElementById('form-title'),
    name: document.getElementById('name'),
    weight: document.getElementById('weight'),
    height: document.getElementById('height'),
    weightHelp: document.getElementById('weight-help'),
    heightHelp: document.getElementById('height-help'),
    clearBtn: document.getElementById('clear-btn'),
    calcBtn: document.getElementById('calc-btn'),
    form: document.getElementById('bmi-form'),
    error: document.getElementById('error'),
    lang: document.getElementById('lang'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    resultsList: document.getElementById('results-list'),
    count: document.getElementById('count'),
    clearAll: document.getElementById('clear-all')
  };

  const storageKey = 'bmi_results_v1';
  const prefsKey = 'bmi_prefs_v1';

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    const normalized = value.trim().replace(',', '.');
    return Number(normalized);
  }

  class Person {
    constructor(name = '', weight = 0, height = 0) {
      this.name = String(name || '').trim();
      this.weight = Number(weight);
      this.height = Number(height);
    }
  }

  function calculateBMI(person) {
    if (!(person instanceof Person)) throw new TypeError('Expected Person');
    if (!isFinite(person.weight) || !isFinite(person.height)) throw new TypeError('Invalid numeric values');
    if (person.weight <= 0 || person.height <= 0) throw new RangeError('Non-positive values');
    const bmi = person.weight / (person.height * person.height);
    return Number(bmi.toFixed(1));
  }

  function classifyBMI(bmi, t) {
    if (bmi < 16) return t.classification.severe;
    if (bmi >= 16 && bmi < 17) return t.classification.moderate;
    if (bmi >= 17 && bmi < 18.5) return t.classification.mild;
    if (bmi >= 18.5 && bmi < 25) return t.classification.healthy;
    if (bmi >= 25 && bmi < 30) return t.classification.overweight;
    if (bmi >= 30 && bmi < 35) return t.classification.obese1;
    if (bmi >= 35 && bmi < 40) return t.classification.obese2;
    return t.classification.obese3;
  }

  const storage = {
    get(key, fallback = null) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  };

  function moonSVG() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>`;
  }
  function sunSVG() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zM20.24 4.84l-1.79 1.79 1.8 1.79 1.79-1.79-1.8-1.79zM23 11v2h-3v-2h3zM4.22 19.78l1.79-1.79-1.8-1.79-1.79 1.79 1.8 1.79zM12 6a6 6 0 100 12 6 6 0 000-12zM19.78 19.78l-1.79-1.79-1.8 1.79 1.79 1.79 1.8-1.79z" fill="currentColor"/></svg>`;
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      el.html.classList.add('light');
      el.themeToggle.setAttribute('aria-pressed', 'false');
      el.themeIcon.innerHTML = sunSVG();
    } else {
      el.html.classList.remove('light');
      el.themeToggle.setAttribute('aria-pressed', 'true');
      el.themeIcon.innerHTML = moonSVG();
    }
    const prefs = storage.get(prefsKey, {});
    prefs.theme = theme;
    storage.set(prefsKey, prefs);
  }

  function toggleTheme() {
    const isLight = el.html.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
  }

  function applyLanguage(lang) {
    const t = translations[lang] || translations.en;
    el.title.textContent = t.title;
    el.formTitle.textContent = t.formTitle;
    document.getElementById('label-name').textContent = t.name;
    document.getElementById('label-weight').textContent = t.weight;
    document.getElementById('label-height').textContent = t.height;
    el.weightHelp.textContent = t.weightHelp;
    el.heightHelp.textContent = t.heightHelp;
    el.clearBtn.textContent = t.clear;
    el.calcBtn.textContent = t.calculate;
    el.lang.value = lang;
    const prefs = storage.get(prefsKey, {});
    prefs.lang = lang;
    storage.set(prefsKey, prefs);
    renderList(); // update count text and any language-dependent labels
  }

  function loadPrefs() {
    const prefs = storage.get(prefsKey, {});
    const theme = prefs.theme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(theme === 'light' ? 'light' : 'dark');
    const lang = prefs.lang || 'en';
    applyLanguage(lang);
  }

  function saveResult(entry) {
    const list = storage.get(storageKey, []);
    list.unshift(entry);
    storage.set(storageKey, list);
  }

  function loadResults() {
    return storage.get(storageKey, []);
  }

  function clearResults() {
    storage.set(storageKey, []);
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function renderList() {
    const lang = el.lang.value || 'en';
    const t = translations[lang];
    const list = loadResults();
    el.resultsList.innerHTML = '';
    el.count.textContent = `${list.length} ${t.saved}`;
    if (!list.length) {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.textContent = t.noResults;
      el.resultsList.appendChild(li);
      return;
    }

    list.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.setAttribute('data-index', index);

      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = item.bmi.toFixed(1);

      const body = document.createElement('div');
      body.className = 'item-body';

      const title = document.createElement('div');
      title.className = 'item-title';
      title.textContent = item.name || 'Anonymous';

      const meta = document.createElement('div');
      meta.className = 'item-meta';
      meta.textContent = `${item.weight} kg • ${item.height} m • ${item.classification}`;

      const time = document.createElement('div');
      time.className = 'item-time';
      time.textContent = formatTime(item.ts);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn small';
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove result ${index + 1}`);
      removeBtn.addEventListener('click', () => {
        removeAt(index);
      });

      body.appendChild(title);
      body.appendChild(meta);

      li.appendChild(avatar);
      li.appendChild(body);
      li.appendChild(time);
      li.appendChild(removeBtn);

      el.resultsList.appendChild(li);
    });
  }

  function removeAt(index) {
    const list = loadResults();
    list.splice(index, 1);
    storage.set(storageKey, list);
    renderList();
  }

  function clearAll() {
    clearResults();
    renderList();
  }

  function onClearForm() {
    el.form.reset();
    el.error.textContent = translations[el.lang.value].cleared;
    el.name.focus();
  }

  function onSubmit(e) {
    e.preventDefault();
    el.error.textContent = '';
    const lang = el.lang.value || 'en';
    const t = translations[lang];

    const name = el.name.value || '';
    const weightRaw = el.weight.value;
    const heightRaw = el.height.value;

    const weight = parseNumber(weightRaw);
    const height = parseNumber(heightRaw);

    if (!isFinite(weight) || !isFinite(height) || Number.isNaN(weight) || Number.isNaN(height)) {
      el.error.textContent = t.errorInvalid;
      return;
    }
    if (weight <= 0 || height <= 0) {
      el.error.textContent = t.errorPositive;
      return;
    }

    try {
      const person = new Person(name, weight, height);
      const bmi = calculateBMI(person);
      const classification = classifyBMI(bmi, t);

      const entry = {
        name: person.name,
        weight: person.weight,
        height: person.height,
        bmi: bmi,
        classification: classification,
        ts: Date.now()
      };

      saveResult(entry);
      renderList();

      el.weight.value = '';
      el.height.value = '';
      el.error.textContent = '';

      // brief visual feedback
      el.calcBtn.textContent = `${t.calculate} ✓`;
      setTimeout(() => { el.calcBtn.textContent = t.calculate; }, 900);

    } catch (err) {
      console.error(err);
      el.error.textContent = t.errorInvalid;
    }
  }

  function init() {
    loadPrefs();
    renderList();

    el.clearBtn.addEventListener('click', onClearForm);
    el.form.addEventListener('submit', onSubmit);
    el.lang.addEventListener('change', (ev) => applyLanguage(ev.target.value));
    el.themeToggle.addEventListener('click', toggleTheme);
    el.clearAll.addEventListener('click', clearAll);

    el.themeToggle.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggleTheme();
      }
    });

    [el.weight, el.height].forEach(input => {
      input.addEventListener('input', (ev) => {
        const cleaned = ev.target.value.replace(/[^\d.,-]/g, '');
        if (cleaned !== ev.target.value) ev.target.value = cleaned;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
