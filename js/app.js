async function loadBooks(){

try{

let response = await fetch("data/books.json")

if(!response.ok){
throw new Error("Erreur chargement")
}

let books = await response.json();

displayBooks(books)
}

catch(error){
console.log(error)
}


}

function displayBooks(books){
    console.log(books);

const container = document.querySelector("#book-list")

books.forEach(book => {

let col = document.createElement("div")
col.className="col-md-4" ;
 
    const card         = document.createElement("div");
    const bookImg      = document.createElement("img");
    const divCardBody  = document.createElement("div");
    const bookTitre    = document.createElement("h5");
    const bookAuthor   = document.createElement("p");
    const bookRating   = document.createElement("p");
    const detailbtn    = document.createElement("button");

    // ── Contenu ────────────────────────────────────
    bookImg.setAttribute("src", book.image);
    bookTitre.textContent  = book.title;
    bookAuthor.textContent = "Auteur : " + book.author;
    bookRating.textContent = "⭐ Note : " + book.rating;
    detailbtn.setAttribute("data-id", book.id);
    detailbtn.textContent  = "Voir Details";

   
    card.classList.add("card", "col-md-3");
    bookImg.classList.add("card-img-top");
    divCardBody.classList.add("card-body");
    detailbtn.classList.add("btn", "voir-details");

   
    divCardBody.appendChild(bookTitre);
    divCardBody.appendChild(bookAuthor);
    divCardBody.appendChild(bookRating);
    divCardBody.appendChild(detailbtn);

    card.appendChild(bookImg);
    card.appendChild(divCardBody);

    container.appendChild(card);
  });

  addEvents();
}

function addEvents(){

const buttons = document.querySelectorAll(".voir-details")

buttons.forEach((button)=>{

button.addEventListener("click",function(){

const id = this.dataset.id

window.location = "book.html?id=" + id

})

})

}

loadBooks();


