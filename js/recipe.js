const detailContainer = document.getElementById('recipeDetail');

function getRecipeId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderDetail() {
  const id = parseInt(getRecipeId());
  if (!id) {
    showError();
    return;
  }

  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    showError();
    return;
  }

  document.title = `${recipe.name} - 美食食谱`;

  detailContainer.innerHTML = `
    <div class="detail-header">
      <div class="detail-icon">
        <img src="${recipe.icon || '图片/1-红烧排骨.png'}" alt="${recipe.name}" onerror="this.src='图片/1-红烧排骨.png'">
      </div>
      <div class="detail-header-info">
        <h1 class="detail-name">${recipe.name}</h1>
        <p class="detail-desc">${recipe.description || ''}</p>
        <div class="detail-meta">
          <span class="recipe-tag time">⏱ ${recipe.time}</span>
          <span class="recipe-tag difficulty ${recipe.difficulty_class}">${recipe.difficulty}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h2>📝 所需食材</h2>
      <ul class="ingredient-list">
        ${(recipe.ingredients || []).map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>

    <div class="detail-section">
      <h2>👨‍🍳 制作步骤</h2>
      <ol class="step-list">
        ${(recipe.steps || []).map((content, i) =>
          `<li><span class="step-num">${i + 1}</span> ${content}</li>`
        ).join('')}
      </ol>
    </div>
  `;
}

function showError() {
  detailContainer.innerHTML = `
    <div class="detail-error">
      <p>未找到该菜谱</p>
      <a href="index.html" class="back-link">返回首页</a>
    </div>
  `;
}

renderDetail();
