document.addEventListener("DOMContentLoaded", async function () {

  // 1. Récupérer l'ID dans l'URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // 2. Charger et afficher le livre
  try {
    const response = await fetch("data/books.json");
    const books = await response.json();

    const book = books.find(b => b.id == id);

    if (!book) {
      document.getElementById("book-details").textContent = "Livre introuvable.";
      return;
    }

    afficherLivre(book);

  } catch (error) {
    console.error("Erreur :", error);
  }

  // 3. Afficher les commentaires déjà sauvegardés
  afficherCommentaires(id);

  // 4. Soumission du formulaire
  document.getElementById("reviewForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const utilisateur = document.getElementById("utilisateur").value;
    const rating      = document.getElementById("rating").value;
    const comment     = document.getElementById("comment").value;

    // Validation
    if (utilisateur === "" || rating === "" || comment === "") {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("La note doit être entre 1 et 5 !");
      return;
    }

    // Créer le commentaire
    const nouveauCommentaire = {
      utilisateur: utilisateur,
      rating: rating,
      comment: comment,
      date: new Date().toLocaleDateString()
    };

    // Sauvegarder dans localStorage
    sauvegarderCommentaire(id, nouveauCommentaire);

    // Rafraîchir l'affichage
    afficherCommentaires(id);

    // Vider le formulaire
    document.getElementById("utilisateur").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("comment").value = "";

    alert("Commentaire ajouté !");
  });

});

// ─── Afficher le livre ───────────────────────────────────────
function afficherLivre(book) {

  const container = document.getElementById("book-details");

  // Image
  const img = document.createElement("img");
  img.src = book.image;
  img.alt = book.title;
  img.className = "img-fluid rounded mb-3";
  img.style.maxWidth = "200px";

  // Titre
  const titre = document.createElement("h2");
  titre.textContent = book.title;

  // Auteur
  const auteur = document.createElement("p");
  auteur.textContent = "Auteur : " + book.author;

  // Note
  const note = document.createElement("p");
  note.textContent = "✭ Note : " + book.rating;

  // Description
  const description = document.createElement("p");
  description.textContent = book.description ?? "Aucune description disponible.";

  // Bouton retour
  const retour = document.createElement("button");
  retour.className = "btn btn-secondary mb-4";
  retour.textContent = "← Retour au catalogue";
  retour.addEventListener("click", function () {
    window.location.href = "index.html";
  });

  // Assemblage
  container.appendChild(img);
  container.appendChild(titre);
  container.appendChild(auteur);
  container.appendChild(note);
  container.appendChild(description);
  container.appendChild(retour);
}

// ─── Sauvegarder commentaire dans localStorage ───────────────
function sauvegarderCommentaire(id, commentaire) {

  // Récupérer les commentaires existants
  const cle = "reviews_" + id;
  const existants = JSON.parse(localStorage.getItem(cle)) || [];

  // Ajouter le nouveau
  existants.push(commentaire);

  // Sauvegarder
  localStorage.setItem(cle, JSON.stringify(existants));
}

// ─── Afficher les commentaires ───────────────────────────────
function afficherCommentaires(id) {

  const container = document.getElementById("reviews");
  container.innerHTML = "";

  const cle = "reviews_" + id;
  const commentaires = JSON.parse(localStorage.getItem(cle)) || [];

  if (commentaires.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "Aucun commentaire pour ce livre.";
    container.appendChild(msg);
    return;
  }

  commentaires.forEach(function (c) {

    const card = document.createElement("div");
    card.className = "card mb-2 p-3";

    const nom = document.createElement("strong");
    nom.textContent = c.utilisateur;

    const etoiles = document.createElement("span");
    etoiles.textContent = " ✭ " + c.rating + "/5";
    etoiles.style.color = "#f5a623";

    const date = document.createElement("small");
    date.textContent = " — " + c.date;
    date.style.color = "#aaa";

    const texte = document.createElement("p");
    texte.textContent = c.comment;
    texte.className = "mt-2 mb-0";

    card.appendChild(nom);
    card.appendChild(etoiles);
    card.appendChild(date);
    card.appendChild(texte);

    container.appendChild(card);
  });
}
