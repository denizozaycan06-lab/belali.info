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

             shelf.appendChild(bookSpine);
        });

    } catch (err) {
        console.error(err);
        shelf.innerHTML = '<p style="color:#555; padding:20px;">Library encountered an error while loading</p>'
    }
}

loadLibrary();


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