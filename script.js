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

        {

        }

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
