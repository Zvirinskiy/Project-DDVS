const postTitle = document.getElementById('post-title');
const postDescription = document.getElementById('post-description');
const postAuthor = document.getElementById('post-author');
const postDate = document.getElementById('post-date');
const savePostBtn = document.getElementById('save-post');
const postList = document.getElementById('post-items');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort-posts');
const clearAllBtn = document.getElementById('clear-all');
const dateFilterStart = document.getElementById('filter-start-date');
const dateFilterEnd = document.getElementById('filter-end-date');
const postCount = document.getElementById('post-count');

let editIndex = null;

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  renderPosts(posts);
}

function renderPosts(posts) {
  postList.innerHTML = '';
  posts.forEach((post, index) => displayPost(post, index));
  updatePostCount(posts.length);
}

function displayPost(post, index) {
  const postItem = document.createElement('li');
  postItem.className = 'post-item';
  postItem.innerHTML = `
    <div>
      <strong>${post.title}</strong> - ${post.author} <br>
      ${post.description} <br>
      <small>${post.date || 'Дата не вказана'}</small>
    </div>
    <div class="actions">
      <button class="btn btn-edit" onclick="editPost(${index})">Редагувати</button>
      <button class="btn btn-delete" onclick="confirmDelete(${index})">Видалити</button>
    </div>
  `;
  postList.appendChild(postItem);
}

function updatePostCount(count) {
  postCount.textContent = `Кількість постів: ${count}`;
}

savePostBtn.onclick = function () {
  const title = postTitle.value.trim();
  const description = postDescription.value.trim();
  const author = postAuthor.value.trim();
  const date = postDate.value.trim();

  if (!title || !author) return alert('Заголовок та Автор є обов’язковими');

  const posts = JSON.parse(localStorage.getItem('posts')) || [];

  if (editIndex === null) {
    posts.push({ title, description, author, date });
  } else {
    posts[editIndex] = { title, description, author, date };
    editIndex = null;
  }

  localStorage.setItem('posts', JSON.stringify(posts));
  loadPosts();
  postTitle.value = '';
  postDescription.value = '';
  postAuthor.value = '';
  postDate.value = '';
};

function editPost(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const post = posts[index];
  postTitle.value = post.title;
  postDescription.value = post.description;
  postAuthor.value = post.author;
  postDate.value = post.date;
  editIndex = index;
}

function confirmDelete(index) {
  if (confirm('Ви впевнені, що хочете видалити цей пост?')) {
    deletePost(index);
  }
}

function deletePost(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.splice(index, 1);
  localStorage.setItem('posts', JSON.stringify(posts));
  loadPosts();
}

searchInput.oninput = function () {
  const searchValue = searchInput.value.toLowerCase();
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchValue) || post.author.toLowerCase().includes(searchValue));
  renderPosts(filteredPosts);
};

sortSelect.onchange = function () {
  const sortBy = sortSelect.value;
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    return a.author.localeCompare(b.author);
  });
  renderPosts(sortedPosts);
};

loadPosts();
