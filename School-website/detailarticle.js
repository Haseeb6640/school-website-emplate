// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch articles and display the requested one
async function loadArticle() {
    const articleId = parseInt(getQueryParam('id'));
    
    if (!articleId) {
        document.getElementById('articleTitle').textContent = 'Article Not Found';
        document.getElementById('articleDescription').textContent = 'The requested article could not be found.';
        return;
    }

    // Fallback data in case fetch fails (for local file testing)
    const fallbackData = {
        articles: [
            {
                id: 1,
                title: "The Future of Education: Technology in the Classroom",
                description: "Exploring how emerging technologies are transforming teaching methods and student learning experiences in the 21st century classroom.",
                content: [
                    "Technology has revolutionized nearly every aspect of our lives, and education is no exception. In recent years, we've witnessed a significant shift in how technology is integrated into classrooms, transforming traditional teaching methods and creating new opportunities for student engagement and learning.",
                    "Modern classrooms are increasingly utilizing interactive learning platforms that allow students to engage with material in dynamic ways. These platforms often include gamified elements, instant feedback mechanisms, and adaptive learning paths that adjust to each student's progress.",
                    "VR and AR technologies are creating immersive learning experiences that were previously impossible. Students can now explore ancient civilizations, dissect virtual organisms, or travel through the human bloodstream - all from their classroom.",
                    "Artificial intelligence is enabling truly personalized learning experiences. AI algorithms can analyze student performance data to identify knowledge gaps, suggest targeted learning materials, and even predict which concepts students might struggle with."
                ],
                category: "Technology",
                year: 2023,
                class: "All",
                image: "https://i0.wp.com/www.lurnable.com/content/wp-content/uploads/2025/01/9751.jpg?fit=1000%2C667&ssl=1",
                youtube: "https://youtu.be/xxxxxx"
            },
            {
                id: 2,
                title: "Prioritizing Student Mental Health in Academic Settings",
                description: "A comprehensive look at strategies schools can implement to support student wellbeing and create a balanced learning environment.",
                content: [
                    "In today's fast-paced academic environment, student mental health has become a critical concern. The pressures of academic performance, social dynamics, and future planning can take a significant toll on students' wellbeing.",
                    "Schools must cultivate environments where students feel safe expressing their emotions and seeking help when needed. This involves training faculty and staff to recognize signs of distress and establishing clear protocols for mental health support.",
                    "Research shows that mindfulness practices can significantly reduce stress and improve focus. Simple techniques like guided breathing exercises, brief meditation sessions, and mindful movement can be incorporated into the school day without disrupting academic schedules.",
                    "While academic excellence remains important, we must reconsider what constitutes true educational success. This involves evaluating assessment methods, reducing unnecessary stress points, and emphasizing growth over perfection."
                ],
                category: "Wellness & Mental Health",
                year: 2023,
                class: "High School",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8bnZzxRsyVj5Gc4cVF6u9MDWulq7HBHYdhA&s",
                youtube: "https://youtu.be/yyyyyy"
            },
            {
                id: 3,
                title: "Creating Inclusive Learning Environments for All Students",
                description: "How schools can adapt teaching methodologies and physical spaces to accommodate diverse learning needs and abilities.",
                content: [
                    "Inclusive education goes beyond merely accommodating students with different learning needs - it's about creating environments where every student feels valued, supported, and empowered to reach their full potential.",
                    "UDL is a framework that emphasizes creating flexible learning environments that can accommodate individual learning differences. This involves providing multiple means of representation, expression, and engagement to ensure all students can access and participate in learning.",
                    "Effective teachers adapt their instructional methods to meet diverse student needs. This might involve varying the complexity of assignments, offering choice in how students demonstrate understanding, or providing additional support structures for those who need them.",
                    "Inclusion extends to cultural, linguistic, and socioeconomic diversity. Culturally responsive teaching involves recognizing students' cultural backgrounds as assets, incorporating diverse perspectives into curriculum, and creating classroom norms that respect all identities."
                ],
                category: "Inclusion",
                year: 2023,
                class: "All",
                image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5jbHVzaXZlJTIwZWR1Y2F0aW9ufGVufDB8fDB8fHww",
                youtube: "https://youtu.be/zzzzzz"
            }
        ]
    };

    try {
        let data;
        try {
            const response = await fetch('articles.json');
            if (!response.ok) throw new Error('Network response was not ok');
            data = await response.json();
            console.log('Articles loaded from JSON file');
        } catch (fetchError) {
            console.warn('Failed to fetch articles.json, using fallback data:', fetchError);
            data = fallbackData;
        }
        
        const article = data.articles.find(a => a.id === articleId);

        if (!article) {
            throw new Error('Article not found');
        }

        // Update page title
        document.title = `${article.title} | Harmony Heights School`;

        // Update header
        document.getElementById('articleTitle').textContent = article.title;
        document.getElementById('articleDescription').textContent = article.description;

        // Update main image
        document.getElementById('mainImage').src = article.image;
        document.getElementById('mainImage').alt = article.title;

        // Update meta
        document.getElementById('articleCategory').textContent = article.category;
        document.getElementById('articleYear').textContent = article.year;
        document.getElementById('articleClass').textContent = article.class;

        // Update article body
        const articleBody = document.getElementById('articleBody');
        articleBody.innerHTML = '';
        article.content.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            articleBody.appendChild(p);
        });

        // Load related articles
        loadRelatedArticles(data.articles, article.category, articleId);

    } catch (error) {
        console.error('Error loading article:', error);
        document.getElementById('articleTitle').textContent = 'Error Loading Article';
        document.getElementById('articleDescription').textContent = 'There was an error loading the article. Please try again later.';
    }
}

// Load related articles
function loadRelatedArticles(allArticles, currentCategory, currentId) {
    const related = allArticles
        .filter(a => a.category === currentCategory && a.id !== currentId)
        .slice(0, 3);

    const relatedContainer = document.getElementById('relatedArticles');
    relatedContainer.innerHTML = '';

    if (related.length === 0) {
        document.querySelector('.related-articles-section').style.display = 'none';
        return;
    }

    related.forEach(article => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="related-article-card">
                <img src="${article.image}" alt="${article.title}" class="related-article-img">
                <div class="related-article-content">
                    <span class="related-article-category">${article.category}</span>
                    <h4 class="related-article-title">${article.title}</h4>
                    <p class="related-article-desc">${article.description}</p>
                    <a href="article-details.html?id=${article.id}" class="read-more-link">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        relatedContainer.appendChild(col);
    });
}

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize theme if exists (from index.html)
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'blue';
    const savedBg = localStorage.getItem('bg') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-bg', savedBg);
}

// Setup theme switching functionality
function setupThemeSwitching() {
    // Theme selectors
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update active state
            themeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Background selectors
    const bgOptions = document.querySelectorAll('.bg-option');
    bgOptions.forEach(option => {
        option.addEventListener('click', function() {
            const bgType = this.getAttribute('data-bg');
            document.documentElement.setAttribute('data-bg', bgType);
            localStorage.setItem('bg', bgType);
            
            // Update active state
            bgOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Set active class on theme buttons
    const savedTheme = localStorage.getItem('theme') || 'blue';
    const savedBg = localStorage.getItem('bg') || 'light';
    themeBtns.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Set active class on background options
    bgOptions.forEach(opt => {
        if (opt.getAttribute('data-bg') === savedBg) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeSwitching();
    loadArticle();
});
 // Customizer panel toggle
        const customizerToggle = document.querySelector('.customizer-toggle');
        const customizerPanel = document.querySelector('.customizer-panel');
        const customizerClose = document.querySelector('.customizer-close');
        
        customizerToggle.addEventListener('click', function() {
            customizerPanel.classList.toggle('active');
        });
        
        customizerClose.addEventListener('click', function() {
            customizerPanel.classList.remove('active');
        });
const messages = [
    "Education shapes character, builds confidence, and opens doors to limitless opportunities.",
    "Learning today empowers students to lead tomorrow with responsibility and integrity.",
    "Knowledge, discipline, and values are the foundation of true success.",
    "Great schools don’t just teach subjects, they nurture future leaders."
];

const textElement = document.getElementById("motivationText");
let index = 0;

function changeText() {
    textElement.style.opacity = 0;

    setTimeout(() => {
        textElement.textContent = messages[index];
        textElement.style.opacity = 1;
        index = (index + 1) % messages.length;
    }, 500);
}

// first text
changeText();

// change every 8 seconds
setInterval(changeText, 8000);