/**
 * AMERTALOKA - Blog Module
 * Handles loading and displaying blog posts from JSON
 */

let blogData = null;

/**
 * Initialize blog on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
  await loadBlogPosts();
  
  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid) {
    renderBlogPosts(blogGrid);
  }
});

/**
 * Load blog posts from JSON
 */
async function loadBlogPosts() {
  try {
    const response = await fetch('data/blog.json');
    if (!response.ok) throw new Error('Failed to load blog posts');
    blogData = await response.json();
    return blogData;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogData = { posts: [], categories: [] };
    return blogData;
  }
}

/**
 * Render blog posts to grid
 */
function renderBlogPosts(container, limit = null) {
  if (!blogData || !blogData.posts) {
    container.innerHTML = '<p>Loading posts...</p>';
    return;
  }

  let posts = [...blogData.posts];

  if (limit) {
    posts = posts.slice(0, limit);
  }

  container.innerHTML = posts.map(post => createBlogCard(post)).join('');

  // Add reveal animation
  container.querySelectorAll('.blog-card').forEach((card, index) => {
    card.classList.add('reveal');
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.1,
        }
      );
    } else {
      card.classList.add('active');
    }
  });
}

/**
 * Create blog card HTML
 */
function createBlogCard(post) {
  const dateFormatted = formatDate(post.date);

  return `
    <article class="blog-card">
      <div class="blog-card__image">
        ${post.image 
          ? `<img src="${post.image}" alt="${post.title}" loading="lazy">`
          : `<div class="blog-card__image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-caption">Article Image</span>
            </div>`
        }
      </div>
      <div class="blog-card__content">
        <div class="blog-card__meta">
          <span class="blog-card__category">${post.category}</span>
          <span class="blog-card__date">${dateFormatted}</span>
        </div>
        <h3 class="blog-card__title">${post.title}</h3>
        <p class="blog-card__excerpt">${post.excerpt}</p>
        <a href="#" class="blog-card__link">
          Baca Selengkapnya
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
  `;
}

/**
 * Format date to Indonesian locale
 */
function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Export for global use
window.blog = {
  load: loadBlogPosts,
  render: renderBlogPosts,
  getData: () => blogData,
};
