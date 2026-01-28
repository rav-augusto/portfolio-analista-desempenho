// ========================================
// NAVEGAÇÃO
// ========================================

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// MODAL DE ANÁLISE
// ========================================

const modal = document.getElementById('analiseModal');

function openAnalise(analiseId) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Desenha os radares após abrir o modal
    setTimeout(() => {
        drawRadarChart('modal-radar1', playerData.player1);
        drawRadarChart('modal-radar2', playerData.player2);
        drawRadarChart('modal-radar3', playerData.player3);
    }, 100);
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Fechar modal ao clicar fora
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Tabs do modal
const modalTabs = document.querySelectorAll('.modal-tab');
const modalPanes = document.querySelectorAll('.modal-pane');

modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        modalTabs.forEach(t => t.classList.remove('active'));
        modalPanes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// ========================================
// ANIMAÇÕES DE SCROLL
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            if (entry.target.classList.contains('competencias')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// ========================================
// RADAR CHARTS
// ========================================

// DADOS DOS JOGADORES - EDITE AQUI COM OS DADOS REAIS
const playerData = {
    player1: {
        labels: ['Força', 'Velocidade', 'Técnica', 'Dinâmica', 'Inteligência', '1x1', 'Atitude', 'Potencial'],
        data: [3.5, 4.0, 4.5, 4.0, 4.5, 4.0, 3.5, 4.5] // Notas de 0 a 5
    },
    player2: {
        labels: ['Força', 'Velocidade', 'Técnica', 'Dinâmica', 'Inteligência', '1x1', 'Atitude', 'Potencial'],
        data: [4.0, 4.5, 3.5, 4.0, 3.5, 4.5, 4.0, 4.0]
    },
    player3: {
        labels: ['Força', 'Velocidade', 'Técnica', 'Dinâmica', 'Inteligência', '1x1', 'Atitude', 'Potencial'],
        data: [3.0, 3.5, 4.0, 4.5, 4.0, 3.5, 4.5, 4.0]
    }
};

function drawRadarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 25;
    const labels = data.labels;
    const values = data.data;
    const numPoints = labels.length;
    const angleStep = (Math.PI * 2) / numPoints;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circles
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Axis lines and labels
    ctx.strokeStyle = '#ccc';
    ctx.fillStyle = '#666';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        const labelX = centerX + Math.cos(angle) * (radius + 18);
        const labelY = centerY + Math.sin(angle) * (radius + 18);
        ctx.fillText(labels[i].substring(0, 5), labelX, labelY + 3);
    }

    // Data polygon
    ctx.beginPath();
    ctx.fillStyle = 'rgba(26, 95, 42, 0.3)';
    ctx.strokeStyle = '#1a5f2a';
    ctx.lineWidth = 2;

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = values[i] / 5;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Data points
    ctx.fillStyle = '#f7931e';
    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = values[i] / 5;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// PARALLAX
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-bg');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

// Use esta função para atualizar os dados dos jogadores
function updatePlayerData(playerId, newData) {
    playerData[playerId] = newData;
    console.log(`Dados do ${playerId} atualizados!`);
}

// Exemplo de como adicionar uma nova análise (para referência futura)
function addNewAnalise(config) {
    console.log('Para adicionar novas análises, edite o HTML na seção .analises-grid');
    console.log('Config recebida:', config);
}

console.log('===========================================');
console.log('PORTFÓLIO - ANALISTA DE DESEMPENHO');
console.log('Licença B CBF');
console.log('===========================================');
console.log('');
console.log('Para editar os dados dos jogadores no radar:');
console.log('updatePlayerData("player1", { labels: [...], data: [...] })');
console.log('');
console.log('Exemplo:');
console.log('updatePlayerData("player1", {');
console.log('  labels: ["Força", "Velocidade", "Técnica", "Dinâmica", "Inteligência", "1x1", "Atitude", "Potencial"],');
console.log('  data: [4.0, 4.5, 4.0, 3.5, 4.5, 4.0, 4.0, 5.0]');
console.log('})');
