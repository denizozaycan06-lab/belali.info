//libary kısmı değişcek JSON a geççen
const myLibary = [
    {
        title: "The Stranger",
        author: "Albert Camus",
        year: 1942,
        desc:"aaa",
    },
        {
        title: "1984",
        author: "George Orwell",
        year: 1948,
        desc:"",
    },
        {
            title:"Make it Stick",
            author:"Peter C. Brown",
            year:2014,
            desc:"",
        },
        
        {
            title:"Les Misérables",
            author:"Victor Hugo",
            year:1862,
            desc:"",
        },

        {
            title:"Dead Souls",
            author:"Nikolai Gogol",
            year:1842,
            desc:"",
        },

        {
            title:"Brief Answers to the Big Questions",
            author:"Stephen Hawking",
            year:2018,
            desc:"",
        },
];




const shelf = document.getElementById("book-shelf");

myLibary.forEach((book) => {
    const bookSpine = document.createElement("div");
     bookSpine.classList.add("book-spine");


     bookSpine.innerHTML = `
       <span class="spine-title">${book.title}</span>
        <div class="spine-details">
            <span class="spine-author">${book.author}</span>
            <span class="spine-year">${book.year}</span>
            <p class="spine-desc">${book.desc}</p>
        </div>
    `;

    shelf.appendChild(bookSpine);
});


const USERNAME = "denizozaycan06-lab";
const repoList = document.getElementById("repo-list");

async function getGithubRepos() {
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
        repoList.innerHTML = '<p class="error">Failed to load repositories.</p>';
        console.error(err);
      }
    }


getGithubRepos();