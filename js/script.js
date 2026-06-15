const categoryMap = {
  all: '全部菜谱', chinese: '中华美食', western: '西餐烘焙',
  dessert: '小吃甜点', soup: '汤羹饮品', salad: '沙拉凉菜'
};

const recipeGrid = document.getElementById('recipeGrid');
const categoryList = document.getElementById('categoryList');
const tabBar = document.getElementById('tabBar');
const sectionTitle = document.getElementById('sectionTitle');
const searchInput = document.getElementById('searchInput');
const recommendList = document.getElementById('recommendList');
const randomBtn = document.getElementById('randomBtn');
const randomResult = document.getElementById('randomResult');
const navItems = document.querySelectorAll('.nav-item');

let currentView = 'home';
let currentCategory = 'all';
let currentSearch = '';

function getRecipes(category, search) {
  let filtered = [...recipes];
  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category_key === category);
  }
  if (search && search.trim()) {
    const kw = search.trim().toLowerCase();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(kw) ||
      (r.tags || []).some(t => t.toLowerCase().includes(kw))
    );
  }
  return filtered;
}

function renderRecipes(recipesToRender) {
  if (!recipesToRender || recipesToRender.length === 0) {
    recipeGrid.innerHTML = '<div class="empty-state">没有找到匹配的菜谱</div>';
    return;
  }
  recipeGrid.innerHTML = recipesToRender.map(r => `
    <div class="recipe-card" data-id="${r.id}">
      <div class="recipe-icon">
        <img src="${r.icon || '图片/1-红烧排骨.png'}" alt="${r.name}" loading="lazy" onerror="this.src='图片/1-红烧排骨.png'">
      </div>
      <div class="recipe-info">
        <div class="recipe-name">${r.name}</div>
        <div class="recipe-desc">${r.description || ''}</div>
        <div class="recipe-meta">
          <span class="recipe-tag time">⏱ ${r.time}</span>
          <span class="recipe-tag difficulty ${r.difficulty_class}">${r.difficulty}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCategoryGrid() {
  const cats = [
    { key: 'chinese', label: '中华美食', icon: '🥟', color: '#FF6B35' },
    { key: 'western', label: '西餐烘焙', icon: '🥖', color: '#FF9800' },
    { key: 'dessert', label: '小吃甜点', icon: '🍰', color: '#E91E63' },
    { key: 'soup', label: '汤羹饮品', icon: '🍲', color: '#4CAF50' },
    { key: 'salad', label: '沙拉凉菜', icon: '🥗', color: '#2196F3' }
  ];

  recipeGrid.innerHTML = `
    <div class="category-grid">
      ${cats.map(c => {
        const count = recipes.filter(r => r.category_key === c.key).length;
        return `
          <div class="category-card" data-category="${c.key}">
            <div class="category-card-icon" style="background:${c.color}15; color:${c.color}">${c.icon}</div>
            <div class="category-card-name">${c.label}</div>
            <div class="category-card-count">${count} 道菜谱</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.querySelectorAll('.category-card').forEach(el => {
    el.addEventListener('click', () => {
      setActiveCategory(el.dataset.category);
      setActiveView('home');
    });
  });
}

function setActiveView(view) {
  currentView = view;
  navItems.forEach(el => el.classList.toggle('active', el.dataset.view === view));

  if (view === 'home') {
    sectionTitle.textContent = '🔥 热门菜谱';
    tabBar.style.display = 'flex';
    applyFilters();
  } else if (view === 'hot') {
    sectionTitle.textContent = '🔥 热门推荐（从简单到困难）';
    tabBar.style.display = 'flex';
    const sorted = [...recipes].sort((a, b) => {
      const diff = { '简单': 1, '中等': 2, '困难': 3 };
      return (diff[a.difficulty] || 2) - (diff[b.difficulty] || 2);
    });
    renderRecipes(sorted);
  } else if (view === 'newest') {
    sectionTitle.textContent = '✨ 最新菜谱';
    tabBar.style.display = 'flex';
    const sorted = [...recipes].sort((a, b) => new Date(b.date) - new Date(a.date));
    renderRecipes(sorted);
  } else if (view === 'category') {
    sectionTitle.textContent = '📂 菜谱分类';
    tabBar.style.display = 'none';
    renderCategoryGrid();
  }
}

function applyFilters() {
  const result = getRecipes(currentCategory, currentSearch);
  renderRecipes(result);
}

function setActiveCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.category-item').forEach(el =>
    el.classList.toggle('active', el.dataset.category === category));
  document.querySelectorAll('.tab-item').forEach(el =>
    el.classList.toggle('active', el.dataset.category === category));
  applyFilters();
}

navItems.forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveView(el.dataset.view);
  });
});

categoryList.addEventListener('click', (e) => {
  const item = e.target.closest('.category-item');
  if (item) { setActiveCategory(item.dataset.category); setActiveView('home'); }
});

tabBar.addEventListener('click', (e) => {
  const item = e.target.closest('.tab-item');
  if (item) { setActiveCategory(item.dataset.category); setActiveView('home'); }
});

searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  if (currentView === 'home') applyFilters();
});

recommendList.addEventListener('click', (e) => {
  const item = e.target.closest('.recommend-item');
  if (item) {
    const id = parseInt(item.dataset.id);
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      setActiveCategory(recipe.category_key);
      setActiveView('home');
      currentSearch = '';
      searchInput.value = '';
      setTimeout(() => {
        const card = document.querySelector(`.recipe-card[data-id="${id}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
});

randomBtn.addEventListener('click', () => {
  const r = recipes[Math.floor(Math.random() * recipes.length)];
  randomResult.innerHTML = `<div class="random-dish">🍽️ ${r.name}</div>`;
});

recipeGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.recipe-card');
  if (card) window.location.href = `recipe.html?id=${card.dataset.id}`;
});

setActiveView('home');
