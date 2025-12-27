// ===========================
// 1. KÜTÜPHANE BÖLÜMÜ
// ===========================

const shelf = document.getElementById("book-shelf");

async function loadLibrary() {
    if (!shelf) return;
    
    try {
        const response = await fetch('books.json');

        if(!response.ok) {
            throw new Error("Library list not found");
        }

        const books = await response.json();

        books.forEach((book) => {
            const bookSpine = document.createElement("div");
            bookSpine.classList.add("book-spine");

            // Desc yoksa boş string ata
            const description = book.desc ? book.desc : "";

            // DÜZELTME BURADA YAPILDI: 'class' ve 'spine-title' doğru yazıldı.
            bookSpine.innerHTML = `
                <span class="spine-title">${book.title}</span>
                <div class="spine-details">
                    <span class="spine-author">${book.author}</span>
                    <span class="spine-year">${book.year}</span>
                    <p class="spine-desc">${description}</p>
                </div>
             `;

             // make focusable for keyboard users
             bookSpine.setAttribute('tabindex', '0');
             bookSpine.setAttribute('aria-expanded', 'false');

             // declare role for assistive tech and support tap-to-open on mobile
             bookSpine.setAttribute('role', 'button');

             bookSpine.addEventListener('click', () => {
                 if (window.innerWidth <= 768) {
                     // close other open books and update aria state
                     document.querySelectorAll('.book-spine.open').forEach(b => {
                         if (b !== bookSpine) {
                             b.classList.remove('open');
                             b.setAttribute('aria-expanded', 'false');
                         }
                     });

                     const isOpen = bookSpine.classList.toggle('open');
                     bookSpine.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

                     if (isOpen) {
                         bookSpine.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                     }
                 }
             });

             bookSpine.addEventListener('keydown', (e) => {
                 if (e.key === 'Enter') bookSpine.click();
                 if (e.key === 'Escape') bookSpine.classList.remove('open');
             });

             shelf.appendChild(bookSpine);
        });

    } catch (err) {
        console.error(err);
        shelf.innerHTML = '<p style="color:#555; padding:20px;">Library encountered an error while loading</p>'
    }
}

loadLibrary();

// Add a one-time document click handler to close opened book on outside click
if (!window._libraryCloseHandlerAdded) {
    window._libraryCloseHandlerAdded = true;
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.book-spine')) {
            document.querySelectorAll('.book-spine.open').forEach(b => b.classList.remove('open'));
        }
    });
}


// ===========================
// 2. GITHUB API BÖLÜMÜ
// ===========================

const USERNAME = "denizozaycan06-lab";
const repoList = document.getElementById("repo-list");

async function getGithubRepos() {
    if (!repoList) return; // Hata almamak için kontrol

    try {
      const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&direction=desc`);

      if (!response.ok) { throw new Error("Network Error"); }

        const data = await response.json();

        repoList.innerHTML = '';

        data.slice(0, 8).forEach(repo => {
            const div = document.createElement("div");
            div.classList.add("repo-item");

            const lang = repo.language ? repo.language : 'Code';
            const desc = repo.description ? repo.description : 'No description provided.';

            div.innerHTML = `
                <div class="repo-row">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                    <span class="repo-lang">${lang}</span>
                </div>
                <span class="repo-desc">${desc}</span>
            `;

            repoList.appendChild(div);
        });
      } catch (err) {
        repoList.innerHTML = '<p style="color:red; padding:15px;">Failed to load repositories.</p>';
        console.error(err);
      }
    }

getGithubRepos();



//platon mağrası

const missionList = document.getElementById('timeline-target');

async function loadMissions() {
    if (!missionList) return;


    try {
        const response = await fetch('timeline.json');
        if (!response.ok) throw new Error("Mission log not found");

        const missions = await response.json();

        missions.forEach(mission => {
            const div = document.createElement('div');

            div.classList.add('mission-item',mission.status);

            div.innerHTML = `
            <div class="mission-meta">
                <span class="mission-date">${mission.date}</span>
                <span class="mission-category">[ ${mission.category} ]</span>
            </div>
            <h3 class="mission-title">
                ${mission.title}
            </h3>

            <p class="mission-desc">
                > ${mission.description}
            </p>
            `;

           missionList.appendChild(div); 
        });
    } catch (err) {
        console.error(err);
        missionList.innerHTML = '<p style="color:#555; text-align:center;">// SYSTEM ERROR: LOGS NOT FOUND</p>';
    }
}

loadMissions();