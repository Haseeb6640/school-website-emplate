document.addEventListener("DOMContentLoaded", function () {
    if (window.location.hash) {
        setTimeout(() => {
            const el = document.querySelector(window.location.hash);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 300); // wait for layout to settle
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById('navbarContent');
    const navbarNav = document.querySelector('.navbar');
    const toggler = document.querySelector('.navbar-toggler');

    // Close menu when clicking any nav link
    document.querySelectorAll('#navbarContent .nav-link').forEach(link => {
        link.addEventListener('click', function () {
            const bsCollapse = bootstrap.Collapse.getInstance(navbar);
            if (bsCollapse) bsCollapse.hide();
        });
    });

    // Ensure toggler initializes Bootstrap collapse correctly
    toggler.addEventListener('click', function () {
        bootstrap.Collapse.getOrCreateInstance(navbar);
    });

    // Close when clicking outside the navbar + toggle (for both desktop and mobile)
    document.addEventListener('click', function (e) {
        // Check if navbar is currently open/shown
        if (!navbar.classList.contains('show')) {
            return;
        }

        const isClickInsideNavbar = navbar.contains(e.target);
        const isClickOnToggler = toggler.contains(e.target);
        const isClickInsideNavbarNav = navbarNav.contains(e.target);

        // Close if click is outside navbar, toggler, and the navbar container
        if (!isClickInsideNavbar && !isClickOnToggler && !isClickInsideNavbarNav) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbar);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });

    // Close navbar on touch outside on mobile devices
    document.addEventListener('touchstart', function (e) {
        // Check if navbar is currently open/shown
        if (!navbar.classList.contains('show')) {
            return;
        }

        const isClickInsideNavbar = navbar.contains(e.target);
        const isClickOnToggler = toggler.contains(e.target);
        const isClickInsideNavbarNav = navbarNav.contains(e.target);

        // Close if touch is outside navbar, toggler, and the navbar container
        if (!isClickInsideNavbar && !isClickOnToggler && !isClickInsideNavbarNav) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbar);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    }, true);

    // ===== NAVIGATION SCROLL HIGHLIGHTING SYSTEM =====
    function setActiveNavLink(id) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        if (id) {
            const activeLink = document.querySelector(`.nav-link[href="${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;
        
        const navHeight = navbarNav.offsetHeight + 10;
        const scrollPos = window.scrollY;
        
        let activeSection = null;
        
        // Find which section is currently in view
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if scroll position is within this section
            if (scrollPos + navHeight >= sectionTop && scrollPos + navHeight < sectionBottom) {
                activeSection = section.getAttribute('id');
                break;
            }
        }
        
        // If no section found, check which is closest below viewport
        if (!activeSection) {
            for (let section of sections) {
                const sectionTop = section.offsetTop;
                if (sectionTop > scrollPos + navHeight) {
                    activeSection = section.getAttribute('id');
                    break;
                }
            }
        }
        
        // Fallback to first section
        if (!activeSection && sections.length > 0) {
            activeSection = sections[0].getAttribute('id');
        }
        
        if (activeSection) {
            setActiveNavLink('#' + activeSection);
        }
    }
    
    // Throttled scroll event
    let scrollTimeout = null;
    window.addEventListener('scroll', function() {
        if (scrollTimeout !== null) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            updateActiveNavLink();
        }, 50);
    }, { passive: true });
    
    // Initial call on page load
    setTimeout(() => {
        updateActiveNavLink();
    }, 100);
});

// Theme switching functionality
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Initialize active theme and background buttons
        const savedTheme = localStorage.getItem('theme') || 'indigo';
        const savedBg = localStorage.getItem('bg') || 'gradient';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.documentElement.setAttribute('data-bg', savedBg);
        
        // Set active class on theme buttons
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
        
        // Back to top button
        const backToTopButton = document.querySelector('.back-to-top');
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navbarContent = document.querySelector('#navbarContent');
        

        
        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (navbarContent.classList.contains('show')) {
                    navbarContent.classList.remove('show');
                }
            });
        });
        
        // Form submission handling
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you shortly.');
                contactForm.reset();
            });
        }
        
        // Article modal content
        const articleModal = document.getElementById('articleModal');
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        
        // Article data
        const articles = {
            1: {
                title: "The Future of Education: Technology in the Classroom",
                img: "https://images.unsplash.com/photo-1585241936939-be4099591252?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWNsZXxlbnwwfHwwfHx8MA%3D%3D",
                date: "October 12, 2023",
                author: "Dr. Sarah Chen",
                content: `<p>Technology has revolutionized nearly every aspect of our lives, and education is no exception. In recent years, we've witnessed a significant shift in how technology is integrated into classrooms, transforming traditional teaching methods and creating new opportunities for student engagement and learning.</p>
                
                <h5>Interactive Learning Platforms</h5>
                <p>Modern classrooms are increasingly utilizing interactive learning platforms that allow students to engage with material in dynamic ways. These platforms often include gamified elements, instant feedback mechanisms, and adaptive learning paths that adjust to each student's progress.</p>
                
                <h5>Virtual and Augmented Reality</h5>
                <p>VR and AR technologies are creating immersive learning experiences that were previously impossible. Students can now explore ancient civilizations, dissect virtual organisms, or travel through the human bloodstream - all from their classroom.</p>
                
                <h5>AI-Powered Personalization</h5>
                <p>Artificial intelligence is enabling truly personalized learning experiences. AI algorithms can analyze student performance data to identify knowledge gaps, suggest targeted learning materials, and even predict which concepts students might struggle with.</p>
                
                <h5>Challenges and Considerations</h5>
                <p>While technology offers tremendous benefits, it also presents challenges. Digital equity remains a concern, as not all students have equal access to devices and reliable internet connections. Additionally, educators must balance technology use with developing essential interpersonal skills and critical thinking abilities.</p>
                
                <p>At Harmony Heights, we're committed to thoughtfully integrating technology into our curriculum, ensuring it enhances rather than replaces the vital human connections that form the foundation of effective education.</p>`
            },
            2: {
                title: "Prioritizing Student Mental Health in Academic Settings",
                img: "https://images.unsplash.com/photo-1523580494863-8837768c95a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                date: "October 5, 2023",
                author: "Dr. Michael Rodriguez",
                content: `<p>In today's fast-paced academic environment, student mental health has become a critical concern. The pressures of academic performance, social dynamics, and future planning can take a significant toll on students' wellbeing. At Harmony Heights, we believe that supporting mental health is not just an added benefit but a fundamental component of quality education.</p>
                
                <h5>Creating Supportive Environments</h5>
                <p>Schools must cultivate environments where students feel safe expressing their emotions and seeking help when needed. This involves training faculty and staff to recognize signs of distress and establishing clear protocols for mental health support.</p>
                
                <h5>Integrating Mindfulness Practices</h5>
                <p>Research shows that mindfulness practices can significantly reduce stress and improve focus. Simple techniques like guided breathing exercises, brief meditation sessions, and mindful movement can be incorporated into the school day without disrupting academic schedules.</p>
                
                <h5>Balancing Academic Rigor with Wellbeing</h5>
                <p>While academic excellence remains important, we must reconsider what constitutes true educational success. This involves evaluating assessment methods, reducing unnecessary stress points, and emphasizing growth over perfection.</p>
                
                <h5>Peer Support Programs</h5>
                <p>Student-led mental health initiatives can be particularly effective. Peer support programs, mentoring systems, and mental health awareness campaigns led by students for students create a culture of mutual care and understanding.</p>
                
                <h5>Collaboration with Families</h5>
                <p>Effective mental health support extends beyond school walls. Regular communication with families, resources for parents, and coordinated approaches between home and school create a comprehensive support network for students.</p>
                
                <p>By prioritizing mental health alongside academic achievement, we're not just preparing students for exams - we're equipping them with the resilience and emotional intelligence needed for lifelong success and fulfillment.</p>`
            },
            3: {
                title: "Creating Inclusive Learning Environments for All Students",
                img: "https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                date: "September 28, 2023",
                author: "Prof. Elena Petrova",
                content: `<p>Inclusive education goes beyond merely accommodating students with different learning needs - it's about creating environments where every student feels valued, supported, and empowered to reach their full potential. At Harmony Heights, we're committed to building classrooms that celebrate diversity and provide equitable learning opportunities for all.</p>
                
                <h5>Universal Design for Learning</h5>
                <p>UDL is a framework that emphasizes creating flexible learning environments that can accommodate individual learning differences. This involves providing multiple means of representation, expression, and engagement to ensure all students can access and participate in learning.</p>
                
                <h5>Differentiated Instruction</h5>
                <p>Effective teachers adapt their instructional methods to meet diverse student needs. This might involve varying the complexity of assignments, offering choice in how students demonstrate understanding, or providing additional support structures for those who need them.</p>
                
                <h5>Culturally Responsive Teaching</h5>
                <p>Inclusion extends to cultural, linguistic, and socioeconomic diversity. Culturally responsive teaching involves recognizing students' cultural backgrounds as assets, incorporating diverse perspectives into curriculum, and creating classroom norms that respect all identities.</p>
                
                <h5>Physical Environment Considerations</h5>
                <p>Inclusive classrooms consider physical accessibility, sensory needs, and flexible seating arrangements. Thoughtful design can remove barriers and create spaces where all students feel comfortable and capable.</p>
                
                <h5>Collaborative Learning Approaches</h5>
                <p>Structured collaborative activities can help students learn from one another's strengths and perspectives. Well-designed group work encourages interdependence while allowing for individual contributions based on each student's abilities.</p>
                
                <h5>Professional Development for Educators</h5>
                <p>Creating inclusive classrooms requires ongoing training and support for teachers. This includes developing skills in identifying diverse learning needs, adapting instructional materials, and implementing effective accommodations.</p>
                
                <p>When we commit to true inclusion, we're not just adapting education for some students - we're improving it for all students. Inclusive practices benefit everyone by fostering empathy, collaboration, and innovative thinking that prepares students for our diverse world.</p>`
            }
        };
        
        // Set up read more buttons
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const articleId = this.getAttribute('data-article');
                const article = articles[articleId];
                
                if (article) {
                    document.getElementById('articleModalLabel').textContent = article.title;
                    document.getElementById('modalArticleImg').src = article.img;
                    document.getElementById('modalArticleImg').alt = article.title;
                    document.getElementById('modalArticleDate').textContent = article.date;
                    document.getElementById('modalArticleAuthor').textContent = `By ${article.author}`;
                    document.getElementById('modalArticleContent').innerHTML = article.content;
                }
            });
        });
        
        // Achievement data
        const achievements = {
            1: {
                title: "National Science Olympiad Champions",
                category: "Science & Technology",
                img: "https://plus.unsplash.com/premium_photo-1713102864696-e44ae2503d6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TmF0aW9uYWwlMjBTY2llbmNlJTIwT2x5bXBpYWQlMjBDaGFtcGlvbnN8ZW58MHx8MHx8fDA%3D",
                content: `<p>Our robotics team secured the prestigious first place at the National Science Olympiad, showcasing exceptional problem-solving abilities and cutting-edge technical expertise.</p>
                
                <h5>Highlights of Achievement</h5>
                <p>The team competed against over 300 schools nationwide, demonstrating remarkable innovation in the areas of:</p>
                <ul>
                    <li>Advanced robotics design and engineering</li>
                    <li>Automated problem-solving systems</li>
                    <li>Sustainable technology implementation</li>
                    <li>Innovative coding and AI applications</li>
                </ul>
                
                <h5>Team Recognition</h5>
                <p>Our five-member robotics team received individual awards and scholarships for their outstanding performance. The team also received a $10,000 grant to expand our school's STEM laboratory facilities.</p>
                
                <h5>Impact on School</h5>
                <p>This achievement has inspired younger students to participate in STEM competitions and has elevated the reputation of Harmony Heights in the field of science and technology education.</p>`
            },
            2: {
                title: "State Debate Championship",
                category: "Literary Excellence",
                img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fERlYmF0ZXxlbnwwfHwwfHx8MA%3D%3Ds",
                content: `<p>Our talented debate team won the State Interschool Championship for the third consecutive year, demonstrating exceptional critical thinking and outstanding communication skills.</p>
                
                <h5>Championship Details</h5>
                <p>This unprecedented achievement of three consecutive state championships places our school in an elite category of debate programs in the nation. The team competed in multiple debate formats including:</p>
                <ul>
                    <li>Policy Debate - Won first place overall</li>
                    <li>Lincoln-Douglas Debate - 2 students in finals</li>
                    <li>Public Forum - Won regional championship</li>
                    <li>Parliamentary Debate - 3 consecutive wins</li>
                </ul>
                
                <h5>Team Composition</h5>
                <p>The debate team consists of 12 dedicated students from grades 9-12, led by our experienced coaches. Many of our debaters have secured full scholarships to prestigious universities based on their debate achievements.</p>
                
                <h5>Future Prospects</h5>
                <p>With this success, our debate program continues to attract talented students and has become a model program for schools across the state. We are confident in defending our title next year!</p>`
            },
            3: {
                title: "International Math Olympiad Medalists",
                category: "Mathematics",
                img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                content: `<p>Three of our exceptional students earned gold medals at the International Mathematics Olympiad, placing our school among the top 5 in the country and bringing immense pride to our institution.</p>
                
                <h5>Medal Winners</h5>
                <p>The three outstanding mathematicians who won gold medals are:</p>
                <ul>
                    <li><strong>Aarav Patel</strong> - Gold Medal (Score: 42/42)</li>
                    <li><strong>Zara Mahmoud</strong> - Gold Medal (Score: 41/42)</li>
                    <li><strong>Chen Wei</strong> - Gold Medal (Score: 40/42)</li>
                </ul>
                
                <h5>International Competition</h5>
                <p>The International Mathematics Olympiad is the most prestigious mathematics competition for high school students, with participation from over 100 countries. Our students competed against the brightest young mathematical minds from around the world.</p>
                
                <h5>Rigorous Preparation</h5>
                <p>Our students underwent intense preparation under the guidance of our dedicated mathematics faculty, with weekly training sessions, problem-solving workshops, and mentorship from mathematics professors. Their success reflects years of dedication and passion for mathematics.</p>
                
                <h5>National Recognition</h5>
                <p>This achievement has brought national recognition to Harmony Heights, and our students have been invited to present their problem-solving techniques at international mathematics conferences.</p>`
            }
        };
        
        // Set up achievement read more buttons
        const achievementReadMoreBtns = document.querySelectorAll('.achievement-read-more');
        achievementReadMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const achievementId = this.getAttribute('data-achievement');
                const achievement = achievements[achievementId];
                
                if (achievement) {
                    document.getElementById('achievementModalLabel').textContent = achievement.title;
                    document.getElementById('modalAchievementImg').src = achievement.img;
                    document.getElementById('modalAchievementImg').alt = achievement.title;
                    document.getElementById('modalAchievementCategory').textContent = achievement.category;
                    document.getElementById('modalAchievementContent').innerHTML = achievement.content;
                }
            });
        });
    });

// Hero Carousel Data - Headlines synchronized with images
const heroSlides = [
  {
    title: "Empowering Minds. Shaping Futures.",
    description: "We inspire students to think boldly, learn deeply, and grow into confident individuals prepared for tomorrow’s challenges.",
    image: "https://d6pldk4490zsr.cloudfront.net/wp-content/uploads/2019/06/5.jpg"
  },
  {
    title: "Committed to Academic Excellence",
    description: "With a strong foundation in academics and critical thinking, we prepare students for success in a rapidly changing world.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "A Community Where Every Student Belongs",
    description: "Learning, growing, and achieving together in a supportive environment that nurtures potential and celebrates success.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "Innovative Learning for Tomorrow’s Leaders",
    description: "Through modern teaching methods and creative exploration, we encourage students to discover, create, and achieve more.",
    image: "https://images.unsplash.com/photo-1600689416865-31b6d7b0f9f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
  }
];


// Function to update hero content based on active slide
function updateHeroContent(activeIndex) {
const slide = heroSlides[activeIndex];
document.getElementById('hero-title').textContent = slide.title;
document.getElementById('hero-description').textContent = slide.description;
}

// Function to set random slide on page load
function setRandomSlide() {
const randomIndex = Math.floor(Math.random() * heroSlides.length);
const carousel = document.getElementById('heroCarousel');
const carouselInstance = bootstrap.Carousel.getInstance(carousel) || new bootstrap.Carousel(carousel);
carouselInstance.to(randomIndex);
updateHeroContent(randomIndex);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
// Set random slide on page load
setRandomSlide();

// Update content when carousel changes
const heroCarousel = document.getElementById('heroCarousel');
heroCarousel.addEventListener('slide.bs.carousel', function(event) {
    updateHeroContent(event.to);
});
});

//from here article.html//
        // Articles data will be loaded from articles.json
        let allArticles = [];
        let currentFilter = '';

        // DOM Elements
        const articlesContainer = document.getElementById('articlesContainer');
        const filterPills = document.querySelectorAll('.filter-pill');
        const noResults = document.getElementById('noResults');

        // Fetch articles from JSON
        async function fetchArticles() {
            try {
                const response = await fetch('articles.json');
                const data = await response.json();
                allArticles = data.articles;
                renderArticles();
                setupFilters();
            } catch (error) {
                console.error('Error loading articles:', error);
                articlesContainer.innerHTML = '<div class="col-12 text-center text-danger"><p>Failed to load articles. Please try again later.</p></div>';
            }
        }

        // Filter articles based on category
        function filterArticles() {
            return allArticles.filter(article => {
                if (!currentFilter) return true;
                return article.category === currentFilter;
            });
        }

        // Render all filtered articles at once
        function renderArticles() {
            const filteredArticles = filterArticles();

            // Show/hide no results
            if (filteredArticles.length === 0) {
                articlesContainer.classList.add('d-none');
                noResults.classList.remove('d-none');
            } else {
                articlesContainer.classList.remove('d-none');
                noResults.classList.add('d-none');
            }

            // Clear container
            articlesContainer.innerHTML = '';

            // Render all filtered articles
            filteredArticles.forEach(article => {
                const articleCol = document.createElement('div');
                articleCol.className = 'col-md-6 col-lg-4 mb-4';
                articleCol.innerHTML = `
                    <div class="article-card">
                        <img src="${article.image}" alt="${article.title}" class="article-img">
                        <div class="article-content">
                            <span class="article-category">${article.category}</span>
                            <h3 class="article-title">${article.title}</h3>
                            <p class="article-description">${article.description}</p>
                            <div class="article-meta">
                                <span><i class="far fa-calendar me-1"></i> ${article.year}</span>
                                <span><i class="fas fa-users me-1"></i> ${article.class}</span>
                            </div>
                            <a href="article-details.html?id=${article.id}" class="read-more-link">
                                Read More <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                `;
                articlesContainer.appendChild(articleCol);
            });
        }

        // Setup filter event listeners
        function setupFilters() {
            filterPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    // Remove active class from all pills
                    filterPills.forEach(p => p.classList.remove('active'));
                    
                    // Add active class to clicked pill
                    pill.classList.add('active');
                    
                    // Update current filter
                    currentFilter = pill.getAttribute('data-filter');
                    
                    // Re-render articles
                    renderArticles();
                });
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
            const savedTheme = localStorage.getItem('theme') || 'indigo';
            const savedBg = localStorage.getItem('bg') || 'gradient';
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.documentElement.setAttribute('data-bg', savedBg);
        }
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            fetchArticles();
        });
        // from here articles-details.html js//
        // Animate on Scroll Initialization
document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            } else {
                entry.target.classList.remove('aos-animate');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
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

// ===== GALLERY SECTION =====
// All gallery images organized in sets of 6
const allGalleryPhotos = [
    { src: 'Images/DWBH8217.JPG.jpeg', alt: 'School Event Photo' },
    { src: 'Images/event2.jpeg', alt: 'Event Celebration 2' },
    { src: 'Images/event3.jpeg', alt: 'Event Celebration 3' },
    { src: 'Images/event4.jpeg', alt: 'Event Celebration 4' },
    { src: 'Images/event5.jpeg', alt: 'Event Celebration 5' },
    { src: 'Images/event6.jpeg', alt: 'Event Celebration 6' },
    { src: 'Images/event7.jpeg', alt: 'Event Celebration 7' },
    { src: 'Images/event.jpeg', alt: 'Event Celebration' },
    { src: 'Images/HLNK8157.JPG.jpeg', alt: 'School Activity Photo' },
    { src: 'Images/Home1.jpeg', alt: 'Home Page Image 1' },
    { src: 'Images/home2.jpeg', alt: 'Home Page Image 2' },
    { src: 'Images/IMG_5649.JPG.jpeg', alt: 'School Photo 5649' },
    { src: 'Images/signal-2026-02-13-143911_005.jpeg', alt: 'Signal Image 005' },    
    { src: 'Images/IMG_5651.JPG.jpeg', alt: 'School Photo 5651' },
    { src: 'Images/IMG_5661.JPG.jpeg', alt: 'School Photo 5661' },
    { src: 'Images/signal-2026-02-13-143911_003.jpeg', alt: 'Signal Image 003' },
    { src: 'Images/IMG_5663.JPG.jpeg', alt: 'School Photo 5663' },
    { src: 'Images/IMG_7528.JPG.jpeg', alt: 'School Photo 7528' },
    { src: 'Images/IMG_E5649.JPG.jpeg', alt: 'School Photo E5649' },
    { src: 'Images/IMG_E5651.JPG.jpeg', alt: 'School Photo E5651' },
    { src: 'Images/IMG_E5663.JPG.jpeg', alt: 'School Photo E5663' },
    { src: 'Images/signal-2026-02-13-143911_002.jpeg', alt: 'Signal Image 002' },
    { src: 'Images/signal-2026-02-13-143911.jpeg', alt: 'Signal Image' }
];

const PHOTOS_PER_PAGE = 6;
let currentGalleryPage = 0;

// Function to get photos for current page
function getPhotosForCurrentPage() {
    const startIndex = currentGalleryPage * PHOTOS_PER_PAGE;
    const endIndex = startIndex + PHOTOS_PER_PAGE;
    return allGalleryPhotos.slice(startIndex, endIndex);
}

// Function to check if there are more photos
function hasMorePhotos() {
    const nextPageStart = (currentGalleryPage + 1) * PHOTOS_PER_PAGE;
    return nextPageStart < allGalleryPhotos.length;
}

// Function to update pagination dots
function updatePaginationDots() {
    const totalPages = Math.ceil(allGalleryPhotos.length / PHOTOS_PER_PAGE);
    const paginationContainer = document.getElementById('galleryPagination');
    paginationContainer.innerHTML = '';
    
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'pagination-dot';
        if (i === currentGalleryPage) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', function() {
            currentGalleryPage = i;
            const photosToShow = getPhotosForCurrentPage();
            renderGalleryItems(photosToShow);
            updatePaginationDots();
            updateMorePhotosButton();
        });
        paginationContainer.appendChild(dot);
    }
}

// Function to update More Photos button text
function updateMorePhotosButton() {
    const btn = document.getElementById('morePhotosBtn');
    if (hasMorePhotos()) {
        btn.innerHTML = 'More Photos <i class="fas fa-arrow-right ms-2"></i>';
    } else {
        btn.innerHTML = 'Back to Gallery <i class="fas fa-arrow-left ms-2"></i>';
    }
}

// Function to render gallery items
function renderGalleryItems(images) {
    const galleryContainer = document.getElementById('galleryContainer');
    galleryContainer.innerHTML = '';
    
    images.forEach((image, index) => {
        const col = document.createElement('div');
        col.className = 'col-12';
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openLightbox(image.src);
        });
        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${image.src}`);
            this.style.display = 'none';
            galleryItem.style.backgroundColor = '#e9ecef';
            galleryItem.style.display = 'flex';
            galleryItem.style.alignItems = 'center';
            galleryItem.style.justifyContent = 'center';
            const errorMsg = document.createElement('p');
            errorMsg.style.color = '#999';
            errorMsg.style.textAlign = 'center';
            errorMsg.textContent = 'Image not found';
            galleryItem.appendChild(errorMsg);
        });
        img.addEventListener('load', function() {
            console.log(`Successfully loaded image: ${image.src}`);
        });
        
        galleryItem.appendChild(img);
        col.appendChild(galleryItem);
        galleryContainer.appendChild(col);
    });
}

// Function to load more photos
function loadMorePhotos() {
    if (hasMorePhotos()) {
        // Move to next page
        currentGalleryPage++;
        const photosToShow = getPhotosForCurrentPage();
        renderGalleryItems(photosToShow);
        updatePaginationDots();
        updateMorePhotosButton();
    } else {
        // Back to first page
        currentGalleryPage = 0;
        const photosToShow = getPhotosForCurrentPage();
        renderGalleryItems(photosToShow);
        updatePaginationDots();
        updateMorePhotosButton();
    }
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('galleryContainer')) {
        currentGalleryPage = 0;
        const photosToShow = getPhotosForCurrentPage();
        renderGalleryItems(photosToShow);
        updatePaginationDots();
        updateMorePhotosButton();
    }
});

// ===== LIGHTBOX FUNCTIONALITY =====
let currentZoomLevel = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

// Gallery array tracking for arrow navigation
let currentImageIndex = 0;

// Open lightbox
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    // Find current index in all gallery photos
    currentImageIndex = allGalleryPhotos.findIndex(img => img.src === imageSrc);
    
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    currentZoomLevel = 1;
    resetImageZoom();
    updateArrowButtonVisibility();
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    lightbox.classList.remove('active');
    currentZoomLevel = 1;
    resetImageZoom();
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Zoom in function
function zoomIn() {
    if (currentZoomLevel < MAX_ZOOM) {
        currentZoomLevel += ZOOM_STEP;
        applyZoom();
    }
}

// Zoom out function
function zoomOut() {
    if (currentZoomLevel > MIN_ZOOM) {
        currentZoomLevel -= ZOOM_STEP;
        applyZoom();
    }
}

// Reset zoom
function resetImageZoom() {
    currentZoomLevel = 1;
    applyZoom();
}

// Apply zoom transformation
function applyZoom() {
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.style.transform = `scale(${currentZoomLevel})`;
}

// Navigate to next image
function nextGalleryImage() {
    if (currentImageIndex < allGalleryPhotos.length - 1) {
        currentImageIndex++;
        const lightboxImage = document.getElementById('lightboxImage');
        lightboxImage.src = allGalleryPhotos[currentImageIndex].src;
        currentZoomLevel = 1;
        resetImageZoom();
        updateArrowButtonVisibility();
    }
}

// Navigate to previous image
function prevGalleryImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        const lightboxImage = document.getElementById('lightboxImage');
        lightboxImage.src = allGalleryPhotos[currentImageIndex].src;
        currentZoomLevel = 1;
        resetImageZoom();
        updateArrowButtonVisibility();
    }
}

// Update arrow button visibility
function updateArrowButtonVisibility() {
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');
    
    if (prevBtn) {
        prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
    }
    if (nextBtn) {
        nextBtn.style.display = currentImageIndex < allGalleryPhotos.length - 1 ? 'block' : 'none';
    }
}

// Event listeners for lightbox controls
function initializeLightboxControls() {
    const lightbox = document.getElementById('imageLightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetZoomBtn = document.getElementById('resetZoomBtn');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (!lightbox || !closeBtn) return; // Exit if elements don't exist
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Double-click to zoom in/out on the image
    if (lightboxImage) {
        lightboxImage.addEventListener('dblclick', function(e) {
            e.stopPropagation(); // Prevent click from bubbling to lightbox
            if (currentZoomLevel === MIN_ZOOM) {
                // If at minimum zoom, zoom in to maximum
                currentZoomLevel = MAX_ZOOM;
                applyZoom();
            } else {
                // If zoomed in, reset to minimum zoom
                currentZoomLevel = MIN_ZOOM;
                applyZoom();
            }
        });
    }
    
    // Zoom controls
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (resetZoomBtn) resetZoomBtn.addEventListener('click', resetImageZoom);
    
    // Arrow navigation
    if (prevBtn) prevBtn.addEventListener('click', prevGalleryImage);
    if (nextBtn) nextBtn.addEventListener('click', nextGalleryImage);
    
    // Keyboard arrow navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevGalleryImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextGalleryImage();
        }
    });
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('imageLightbox');
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// Keyboard shortcuts for zoom
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
    } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
    } else if (e.key === '0') {
        e.preventDefault();
        resetImageZoom();
    }
});

// Initialize lightbox when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLightboxControls);
} else {
    initializeLightboxControls();
}




