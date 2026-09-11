const sidebar = document.querySelector('.sidebar');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLogo = document.querySelector('.mobile-logo');
const searchInput = document.querySelector('.search-box input');
const menuItems = document.querySelectorAll('.menu-item');
const currentPage = window.location.pathname.split('/').pop() || 'series.html';

menuItems.forEach((item) => {
    const href = item.getAttribute('href') || '';
    const pageName = href.split('/').pop();
    if (pageName === currentPage) {
        item.classList.add('active');
    }

    item.addEventListener('click', (event) => {
        if (href.startsWith('#')) {
            event.preventDefault();
        }

        menuItems.forEach((menu) => menu.classList.remove('active'));
        item.classList.add('active');

        if (sidebar) {
            sidebar.classList.remove('open');
        }
        if (mobileLogo) {
            mobileLogo.hidden = false;
        }
    });
});

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        if (!sidebar) return;
        sidebar.classList.toggle('open');
        if (mobileLogo) {
            mobileLogo.hidden = sidebar.classList.contains('open');
        }
    });
}

function closeSidebarOnOutsideClick(event) {
    if (!sidebar || !sidebar.classList.contains('open')) return;
    const clickOnMenu = mobileMenu && mobileMenu.contains(event.target);
    if (sidebar.contains(event.target) || clickOnMenu) return;
    sidebar.classList.remove('open');
    if (mobileLogo) {
        mobileLogo.hidden = false;
    }
}

document.addEventListener('click', closeSidebarOnOutsideClick);
document.addEventListener('touchstart', closeSidebarOnOutsideClick, { passive: true });

if (searchInput) {
    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.toLowerCase().trim();
        document.querySelectorAll('.match-card, .group-card').forEach((card) => {
            if (!keyword) {
                card.hidden = false;
                return;
            }
            card.hidden = !card.innerText.toLowerCase().includes(keyword);
        });
    });
}

document.querySelectorAll('.group-card button').forEach((button) => {
    button.addEventListener('click', () => {
        const joined = button.textContent.trim() === 'Joined';
        button.textContent = joined ? 'Join' : 'Joined';
        button.classList.toggle('joined', !joined);
    });
});

document.querySelectorAll('.outline-btn').forEach((button) => {
    button.addEventListener('click', () => {
        alert('Profile page will be opened here!');
    });
});

function sortGroupsByMatch() {
    const list = document.querySelector('.group-list');
    if (!list) return;
    const groups = Array.from(list.querySelectorAll('.group-card'));
    groups.sort((a, b) => {
        const ma = parseFloat(a.getAttribute('data-match') || '0');
        const mb = parseFloat(b.getAttribute('data-match') || '0');
        return mb - ma;
    });
    groups.forEach((group) => list.appendChild(group));
}

document.addEventListener('DOMContentLoaded', () => {
    sortGroupsByMatch();

    const matchCards = Array.from(document.querySelectorAll('.swipe-match-card'));
    if (!matchCards.length) return;

    let activeIndex = 0;
    const showCard = () => {
        matchCards.forEach((card, index) => {
            card.style.display = index === activeIndex ? 'flex' : 'none';
        });
    };

    const advanceCard = (liked) => {
        const card = matchCards[activeIndex];
        if (!card) return;
        const name = card.querySelector('h3')?.textContent.trim() || 'This user';
        if (liked) {
            alert(`You liked ${name}. Chat started!`);
        }
        activeIndex += 1;
        if (activeIndex >= matchCards.length) {
            activeIndex = 0;
            alert('No more matches left right now.');
        }
        showCard();
    };

    const attachSwipe = (card) => {
        let startX = 0;
        let deltaX = 0;

        const handleTouchStart = (event) => {
            const touch = event.touches && event.touches[0];
            if (!touch) return;
            startX = touch.clientX;
        };

        const handleTouchMove = (event) => {
            const touch = event.touches && event.touches[0];
            if (!touch) return;
            const currentX = touch.clientX;
            deltaX = currentX - startX;
            if (Math.abs(deltaX) > 10) {
                card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 18}deg)`;
            }
        };

        const handleTouchEnd = () => {
            if (deltaX > 90) {
                advanceCard(true);
            } else if (deltaX < -90) {
                advanceCard(false);
            }
            card.style.transform = '';
            deltaX = 0;
        };

        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handleTouchMove, { passive: true });
        card.addEventListener('touchend', handleTouchEnd);
        card.addEventListener('touchcancel', handleTouchEnd);
    };

    matchCards.forEach((card) => {
        card.querySelector('.like-btn')?.addEventListener('click', () => advanceCard(true));
        card.querySelector('.pass-btn')?.addEventListener('click', () => advanceCard(false));
        attachSwipe(card);
    });

    showCard();
});

