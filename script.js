// script.js - Complete with Women Timer + Levels + Day Reset + Persistence

// Data (full Arabic)
const maleExercises = {
  chest: [
    {id: 'bench1', name: 'مبتدئ - Bench Press', desc: 'بناء أساسي', difficulty: 'مبتدئ', icon: '🏋️', category: 'chest'},
    {id: 'bench2', name: 'متوسط - Incline Press', desc: 'الجزء العلوي', difficulty: 'متوسط', icon: '🏋️', category: 'chest'},
    {id: 'bench3', name: 'متقدم - Heavy Bench', desc: 'قوة كاملة', difficulty: 'متقدم', icon: '🏋️', category: 'chest'}
  ],
  // ... other categories with 3 levels each (مبتدئ/متوسط/متقدم)
  back: [
    {id: 'dead1', name: 'مبتدئ - Romanian Deadlift', desc: 'أساس الظهر', difficulty: 'مبتدئ', icon: '⚡', category: 'back'},
    {id: 'dead2', name: 'متوسط - Pull Ups', desc: 'لاتس عريض', difficulty: 'متوسط', icon: '🧗', category: 'back'},
    {id: 'dead3', name: 'متقدم - Deadlift', desc: 'قوة كاملة', difficulty: 'متقدم', icon: '⚡', category: 'back'}
  ]
  // Continue for shoulders, biceps, etc...
};

const femaleExercises = {
  glutes: [
    {id: 'glutes1', name: 'مبتدئ - Glute Bridge', desc: 'تفعيل المؤخرة', difficulty: 'مبتدئ', icon: '🍑', category: 'glutes'},
    {id: 'glutes2', name: 'متوسط - Donkey Kicks', desc: 'عزل المؤخرة', difficulty: 'متوسط', icon: '🍑', category: 'glutes'},
    {id: 'glutes3', name: 'متقدم - Hip Thrust', desc: 'نمو المؤخرة', difficulty: 'متقدم', icon: '🍑', category: 'glutes'},
    {id: 'glutes4', name: 'متقدم جدا - Abduction', desc: 'الجانب الخارجي', difficulty: 'متقدم', icon: '🍑', category: 'glutes'}
  ],
  legs: [
    {id: 'legs1', name: 'مبتدئ - Bodyweight Squats', desc: 'أساس الفخذ', difficulty: 'مبتدئ', icon: '🦵', category: 'legs'},
    {id: 'legs2', name: 'متوسط - Lunges', desc: 'تنحيف', difficulty: 'متوسط', icon: '🦵', category: 'legs'},
    {id: 'legs3', name: 'متقدم - Sumo Squats', desc: 'الداخلي', difficulty: 'متقدم', icon: '🦵', category: 'legs'}
  ],
  // arms, core, cardio with 3 levels each
  arms: [
    {id: 'arms1', name: 'مبتدئ - Pushups', desc: 'ذراع أساسي', difficulty: 'مبتدئ', icon: '💪', category: 'arms'},
    {id: 'arms2', name: 'متوسط - Dips', desc: 'تراي مشدود', difficulty: 'متوسط', icon: '💪', category: 'arms'},
    {id: 'arms3', name: 'متقدم - Curls', desc: 'شكل الذراع', difficulty: 'متقدم', icon: '💪', category: 'arms'}
  ],
  core: [
    {id: 'core1', name: 'مبتدئ - Crunches', desc: 'خصر أساسي', difficulty: 'مبتدئ', icon: '🧘', category: 'core'},
    {id: 'core2', name: 'متوسط - Planks', desc: 'قوة البطن', difficulty: 'متوسط', icon: '🧘', category: 'core'},
    {id: 'core3', name: 'متقدم - Leg Raises', desc: 'البطن السفلي', difficulty: 'متقدم', icon: '🧘', category: 'core'}
  ],
  cardio: [
    {id: 'cardio1', name: 'مبتدئ - Walking', desc: 'حرق خفيف', difficulty: 'مبتدئ', icon: '🔥', category: 'cardio'},
    {id: 'cardio2', name: 'متوسط - Jump Rope', desc: 'حرق دهون', difficulty: 'متوسط', icon: '🔥', category: 'cardio'},
    {id: 'cardio3', name: 'متقدم - HIIT', desc: 'حرق قوي', difficulty: 'متقدم', icon: '🔥', category: 'cardio'}
  ]
};

// Plans
const maleWorkoutPlan = ['Day 1: Chest + Triceps', 'Day 2: Back + Biceps', 'Day 3: 🔴 Rest', 'Day 4: Shoulders', 'Day 5: Legs', 'Day 6: Abs + Cardio', 'Day 7: 🔴 Rest'];
const femaleWorkoutPlan = ['Day 1: Glutes + Booty', 'Day 2: Legs + Thighs', 'Day 3: 🔴 Rest', 'Day 4: Arms + Upper Body', 'Day 5: Core + Flexibility', 'Day 6: Cardio + HIIT', 'Day 7: 🔴 Rest'];

const maleDayMaps = [
  ['chest', 'triceps'], 
  ['back', 'biceps'], 
  null, 
  ['shoulders'], 
  ['legs'], 
  ['abs', 'cardio'], 
  null 
];

const femaleDayMaps = [
  ['glutes'], 
  ['legs'], 
  null, 
  ['arms'], 
  ['core'], 
  ['cardio'], 
  null 
];

// Persistence keys
const USER_NAME = 'userName';
const CURRENT_DAY = 'currentDay';
const LAST_DAY_RESET = 'lastDayReset';
const SAVED_EXERCISES = 'savedExercises';
const WOMEN_SAVED = 'womenSaved';
const WOMEN_TIMER_TIME = 'womenTimerTime';
const WORKOUTS_DONE = 'workoutsDone';
const TIMER_STATE = 'timerState'; // 0 stop, 1 running, 2 paused

// Timer globals
let timerInterval;
let currentTime = 0;
let isPaused = false;
let pauseTime = 0;

// Login (name only)
function login() {
  const name = document.getElementById('userName').value.trim();
  if (!name) return alert('اكتب اسمك');
  localStorage.setItem(USER_NAME, name);
  localStorage.setItem(CURRENT_DAY, '0'); // Reset days to 0
  document.getElementById('userName').value = '';
  window.location.href = 'index.html';
}

function checkLogin() {
  if (localStorage.getItem(USER_NAME)) {
    window.location.href = 'index.html';
  }
}

// Day system - midnight reset
function updateDaySystem() {
  const now = new Date();
  const todayStr = now.toDateString();
  const lastReset = localStorage.getItem(LAST_DAY_RESET);
  let day = parseInt(localStorage.getItem(CURRENT_DAY) || '0');
  
  if (lastReset !== todayStr) {
    localStorage.setItem(LAST_DAY_RESET, todayStr);
    day = (day + 1) % 7;
    localStorage.setItem(CURRENT_DAY, day.toString());
  }
  return day;
}

// Load username
function loadUsername() {
  const name = localStorage.getItem(USER_NAME);
  if (name) document.querySelectorAll('.username').forEach(el => el.textContent = name);
}

function loadGenderWorkoutPlan() {
  const gender = localStorage.getItem('userGender') || 'male';
  const plan = gender === 'male' ? maleWorkoutPlan : femaleWorkoutPlan;
  const dayMaps = gender === 'male' ? maleDayMaps : femaleDayMaps;
  const exercisesData = gender === 'male' ? maleExercises : femaleExercises;
  
  let html = '';
  plan.forEach((dayTitle, index) => {
    html += `<div class="workout-day stagger" data-day="${index}">`;
    
    if (dayTitle.includes('🔴')) {
      html += `<h3 class="font-display mb-4 text-2xl">${dayTitle}</h3><p class="text-secondary">Take it easy 💪</p>`;
    } else {
      html += `
        <h3 class="font-display mb-2 text-2xl">${dayTitle}</h3>
        <p class="mb-4 text-secondary">Click to see exercises</p>
        <div class="exercises-grid">`;
      
      const categories = dayMaps[index] || [];
      categories.forEach(cat => {
        const catExercises = exercisesData[cat] || [];
        catExercises.slice(0, 4).forEach(ex => {  // Show top 4
          html += `
            <div class="exercise-mini" data-exercise-id="${ex.id}">
              <div class="text-2xl mb-1">${ex.icon}</div>
              <h5>${ex.name.replace(/^[^ -]+ - /, '')}</h5>
              <span class="badge text-xs">${ex.difficulty}</span>
              <button class="btn btn-sm mt-2 save-mini-btn" onclick="toggleMiniExercise('${ex.id}', '${ex.name}', '${cat}')">حفظ</button>
            </div>`;
        });
      });
      
      if (categories.length === 0) {
        html += '<div class="exercise-mini col-span-full text-center py-8">Custom day - Add your routine</div>';
      }
      
      html += '</div>';
    }
    
    html += '</div>';
  });
  
  document.getElementById('workout-days').innerHTML = html;
  
  // Initialize mini buttons
  initMiniButtonStates();
}

function toggleMiniExercise(id, name, category) {
  const isWomenPage = window.location.pathname.includes('women.html');
  const storageKey = isWomenPage ? WOMEN_SAVED : SAVED_EXERCISES;
  let saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const existingIndex = saved.findIndex(s => s.id === id);
  
  if (existingIndex > -1) {
    saved.splice(existingIndex, 1);
    event.target.textContent = 'حفظ';
    event.target.classList.remove('saved');
  } else {
    saved.push({id, name, category, icon: ''});
    event.target.textContent = 'محفوظ';
    event.target.classList.add('saved');
  }
  
  localStorage.setItem(storageKey, JSON.stringify(saved));
  
  if (!isWomenPage && document.getElementById('saved-list')) {
    displaySavedExercises();
  }
}

function initMiniButtonStates() {
  const isWomenPage = window.location.pathname.includes('women.html');
  const storageKey = isWomenPage ? WOMEN_SAVED : SAVED_EXERCISES;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  document.querySelectorAll('.save-mini-btn').forEach(btn => {
    const onclick = btn.getAttribute('onclick');
    const match = onclick.match(/['"]([^'"]+)['"]/);
    if (match) {
      const exId = match[1];
      if (saved.find(s => s.id === exId)) {
        btn.textContent = 'محفوظ';
        btn.classList.add('saved');
      }
    }
  });
}

// Toggle day expansion
function toggleDay(dayIndex) {
  const dayEl = document.querySelector(`[data-day="${dayIndex}"]`);
  dayEl.classList.toggle('expanded');
}

// Women page functions
function loadWomenPage() {
  loadUsername();
  updateDaySystem();
  showWomenCategory('glutes'); // Default glutes
  displayWomenSaved();
  loadWomenTimer();
}

function showWomenCategory(category) {
  // Active button
  document.querySelectorAll('#women-tabs button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Show levels: beginner/medium/advanced
  const exercises = femaleExercises[category] || [];
  let html = '';
  exercises.forEach(ex => {
    html += `
      <div class="bento-item glass card women-exercise-level">
        <div style="font-size: 3rem; margin-bottom: 1rem;">${ex.icon}</div>
        <h4>${ex.name}</h4>
        <span class="badge">${ex.difficulty}</span>
        <p>${ex.desc}</p>
        <button class="btn mt-auto" onclick="womenAddExercise('${ex.id}', '${ex.name}')">حفظ</button>
      </div>
    `;
  });
  document.getElementById('women-exercises-grid').innerHTML = html;
}

// Women add/save
function womenAddExercise(id, name) {
  let saved = JSON.parse(localStorage.getItem(WOMEN_SAVED) || '[]');
  const existingIndex = saved.findIndex(s => s.id === id);
  if (existingIndex > -1) {
    saved.splice(existingIndex, 1);
    event.target.textContent = 'حفظ';
    event.target.disabled = false;
  } else {
    const activeBtn = document.querySelector('#women-tabs button.active');
    const category = activeBtn ? activeBtn.textContent.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase() : 'general';
    saved.push({id, name, category});
    event.target.textContent = '✓ محفوظ';
    event.target.disabled = true;
  }
  localStorage.setItem(WOMEN_SAVED, JSON.stringify(saved));
  displayWomenSaved();
}

// Women saved list
function displayWomenSaved() {
  const saved = JSON.parse(localStorage.getItem(WOMEN_SAVED) || '[]');
  let html = saved.map(ex => `
    <div class="bento-item glass card">
      ${ex.icon || '👑'} <strong>${ex.name}</strong>
      <span class="badge">${ex.category}</span>
      <button class="btn btn-secondary" onclick="womenRemoveExercise('${ex.id}')">حذف</button>
    </div>
  `).join('');
  document.getElementById('women-plan').innerHTML = html || '<div class="bento-item bento-2x2 glass card text-center p-8">ابدئي بإضافة تمارين</div>';
}

function womenRemoveExercise(id) {
  let saved = JSON.parse(localStorage.getItem(WOMEN_SAVED) || '[]');
  saved = saved.filter(ex => ex.id !== id);
  localStorage.setItem(WOMEN_SAVED, JSON.stringify(saved));
  displayWomenSaved();
}

// Women timer (perfect resume)
function womenStartTimer() {
  if (timerInterval) return;
  const savedTime = parseInt(localStorage.getItem(WOMEN_TIMER_TIME) || '0');
  currentTime = savedTime;
  timerInterval = setInterval(() => {
    if (!isPaused) currentTime++;
    const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secs = (currentTime % 60).toString().padStart(2, '0');
    document.getElementById('women-timer').textContent = `${mins}:${secs}`;
    localStorage.setItem(WOMEN_TIMER_TIME, currentTime.toString());
  }, 1000);
}

function womenPauseResumeTimer() {
  isPaused = !isPaused;
  const btn = event.target;
  btn.textContent = isPaused ? 'استكمال' : 'إيقاف';
}

function womenResetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = false;
  currentTime = 0;
  document.getElementById('women-timer').textContent = '00:00';
  localStorage.setItem(WOMEN_TIMER_TIME, '0');
  event.target.previousElementSibling.textContent = 'إيقاف';
}

function loadWomenTimer() {
  const savedTime = parseInt(localStorage.getItem(WOMEN_TIMER_TIME) || '0');
  if (savedTime > 0) {
    document.getElementById('women-timer').textContent = new Date(savedTime * 1000).toISOString().substr(14, 5);
  }
}

// Exercises page (keep all visible)
function showAllExercises() {
  const gender = localStorage.getItem('userGender') || 'male';
  const data = gender === 'male' ? maleExercises : femaleExercises;
  let html = '';
  
  Object.keys(data).forEach(cat => {
    // Category header card
    html += `
      <div class="workout-day-like glass card cursor-pointer p-6 mb-4" onclick="filterCategory('${cat}')">
        <div class="flex items-center gap-4">
          <div class="text-4xl">${getCategoryIcon(cat)}</div>
          <div>
            <h3 class="font-display text-xl">${getCategoryName(cat)}</h3>
            <p class="text-secondary">${data[cat].length} تمرين</p>
          </div>
        </div>
      </div>`;
    
    // Exercises for this category
    data[cat].forEach(ex => {
      html += `
        <div class="bento-item glass card p-6 hoverable">
          <div class="text-5xl mb-4">${ex.icon}</div>
          <h4 class="font-bold mb-2 text-xl">${ex.name}</h4>
          <div class="badges mb-4">
            <span class="badge">${ex.difficulty}</span>
            <span class="badge bg-secondary">${cat}</span>
          </div>
          <p class="text-secondary mb-4">${ex.desc}</p>
          <button class="btn w-full" onclick="addExercise('${ex.id}', '${ex.name}', '${cat}')">حفظ</button>
        </div>`;
    });
  });
  
  document.getElementById('exercise-grid').innerHTML = html;
  
  // Re-attach event listeners if needed
  attachCategoryListeners();
  
  // Initialize button states
  setTimeout(initButtonStates, 200);
}

function initButtonStates() {
  const isWomenPage = window.location.pathname.includes('women.html');
  const storageKey = isWomenPage ? WOMEN_SAVED : SAVED_EXERCISES;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const buttons = document.querySelectorAll('.bento-item button[onclick*="addExercise"], .women-exercise-level button[onclick*="addExercise"], .women-exercise-level button[onclick*="womenAddExercise"]');
  
  buttons.forEach(btn => {
    const onclick = btn.getAttribute('onclick');
    const match = onclick.match(/['"]([^'"]+)['"]/);
    if (match) {
      const exId = match[1];
      if (saved.find(s => s.id === exId)) {
        btn.textContent = '✓ محفوظ';
        btn.disabled = true;
      }
    }
  });
}

function getCategoryIcon(cat) {
  const icons = {
    chest: '🏋️', back: '⚡', glutes: '🍑', legs: '🦵', arms: '💪', core: '🧘', cardio: '🔥'
  };
  return icons[cat] || '💪';
}

function getCategoryName(cat) {
  const names = {
    chest: 'الصدر', back: 'الظهر', glutes: 'المؤخرة', legs: 'الفخذين', arms: 'الذراعين', core: 'البطن', cardio: 'الكارديو'
  };
  return names[cat] || cat;
}

function filterCategory(cat) {
  // Optional: filter/scroll to category
  console.log('Filter to category:', cat);
  alert('تمرينات ' + getCategoryName(cat) + ' جاهزة!');
}

function attachCategoryListeners() {
  // Future enhancement
}

function addExercise(id, name, category = '') {
  const isWomenPage = window.location.pathname.includes('women.html');
  const storageKey = isWomenPage ? WOMEN_SAVED : SAVED_EXERCISES;
  let saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const existingIndex = saved.findIndex(s => s.id === id);
  
  if (existingIndex > -1) {
    // Remove (toggle off)
    saved.splice(existingIndex, 1);
    localStorage.setItem(storageKey, JSON.stringify(saved));
    event.target.textContent = 'حفظ';
    event.target.disabled = false;
    
    console.log(`Removed ${name} from saved`);
  } else {
    // Add (toggle on)
    saved.push({id, name, category, icon: ''});
    localStorage.setItem(storageKey, JSON.stringify(saved));
    event.target.textContent = '✓ محفوظ';
    event.target.disabled = true;
    
    console.log(`Saved ${name}`);
  }
  
  // Always refresh saved list
  if (!isWomenPage && document.getElementById('saved-list')) {
    displaySavedExercises();
  } else if (isWomenPage && document.getElementById('women-plan')) {
    displayWomenSaved();
  }
  
  // Update all buttons states
  setTimeout(initButtonStates, 100);
}

function displaySavedExercises() {
  const saved = JSON.parse(localStorage.getItem(SAVED_EXERCISES) || '[]');
  let html = saved.map(ex => `
    <div class="bento-item glass card p-4">
      <span class="text-2xl mb-1">${ex.icon || '💪'}</span>
      <strong>${ex.name}</strong>
      <span class="badge">${ex.category}</span>
      <button class="btn btn-secondary" onclick="removeSavedExercise('${ex.id}')">حذف</button>
    </div>
  `).join('');
  document.getElementById('saved-list').innerHTML = html || '<div class="bento-item bento-2x2 glass card text-center p-8">No saved exercises yet. Start adding!</div>';
}

function removeSavedExercise(id) {
  let saved = JSON.parse(localStorage.getItem(SAVED_EXERCISES) || '[]');
  saved = saved.filter(ex => ex.id !== id);
  localStorage.setItem(SAVED_EXERCISES, JSON.stringify(saved));
  displaySavedExercises();
  initButtonStates();
}

// Day system for all pages
function updateCurrentDay() {
  const day = updateDaySystem();
  // Update UI if needed
}

// Index homepage functions
function initHomepage() {

  
  // Calories input
  const caloriesInput = document.getElementById('calories-input');
  const savedCalories = localStorage.getItem('caloriesBurned') || '0';
  caloriesInput.value = savedCalories;
  caloriesInput.addEventListener('input', (e) => {
    localStorage.setItem('caloriesBurned', e.target.value);
  });
  
  // Streak
  const streakDisplay = document.getElementById('streak-display');
  const streak = localStorage.getItem('streakDays') || '0';
  streakDisplay.textContent = `${streak} day`;
  
  updateStreak();
}

// Streak logic
function updateStreak() {
  const lastWorkout = localStorage.getItem('lastWorkoutDate');
  const today = new Date().toDateString();
  
  if (lastWorkout !== today) {
    const streak = parseInt(localStorage.getItem('streakDays') || '0');
    localStorage.setItem('streakDays', streak.toString());
    localStorage.setItem('lastWorkoutDate', today);
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadUsername();
  const path = window.location.pathname.split('/').pop();
  if (path === 'index.html' || path === '') initHomepage();
  if (path === 'women.html') loadWomenPage();
  if (path === 'exercises.html') showAllExercises();
  if (path === 'workout.html') {
    loadGenderWorkoutPlan();
  }
  updateCurrentDay();
});
