var str = window.location.href;
var url = new URL(str);
var idProduct = url.searchParams.get("id");
let article = "";
const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");

getArticle();

// Récupération des articles de l'API
function getArticle() {
  fetch("http://localhost:3000/api/products/" + idProduct)
    .then((res) => {
      return res.json();
    })

    // Répartition des données de l'API dans le DOM
    .then(async function (resultatAPI) {
      article = await resultatAPI;
      if (article) {
        getPost(article);
      }
    })
    .catch((error) => {
      console.log("Erreur de la requête API");
    });
}

function getPost(article) {
  // Insertion de l'image
  let productImg = document.createElement("img");
  document.querySelector(".item__img").appendChild(productImg);
  productImg.src = article.imageUrl;
  productImg.alt = article.altTxt;

  // Insertion du titre "h1"
  let productName = document.getElementById("title");
  productName.innerHTML = article.name;

  // autre façon d'insérer l'élement
  //document.getElementById('title').innerHTML = article.name;

  // Insertion du prix
  let productPrice = document.getElementById("price");
  productPrice.innerHTML = article.price;

  // Insertion de la description
  let productDescription = document.getElementById("description");
  productDescription.innerHTML = article.description;

  // Insertion des options de couleurs
  for (let colors of article.colors) {
    let productColors = document.createElement("option");
    document.querySelector("#colors").appendChild(productColors);
    productColors.value = colors;
    productColors.innerHTML = colors;
  }
  addToCart(article);
}

//Gestion du panier
function addToCart(article) {
  const btn_envoyerPanier = document.querySelector("#addToCart");

  //Ecouter le panier avec 2 conditions : couleur non nulle et quantité entre 1 et 100
  btn_envoyerPanier.addEventListener("click", (event) => {
    if (
      quantityPicked.value > 0 &&
      quantityPicked.value <= 100 &&
      quantityPicked.value != 0 &&
      colorPicked.value != ""
    ) {
      //Recupération du choix de la couleur
      let choixCouleur = colorPicked.value;

      //Recupération du choix de la quantité
      let choixQuantite = quantityPicked.value;

      //Récupération des options de l'article à ajouter au panier
      let optionsProduit = {
        idProduit: idProduct,
        couleurProduit: choixCouleur,
        quantiteProduit: Number(choixQuantite),
      };

      //Initialisation du local storage
      let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));

      //Fenêtre pop-up redirection vers le panier
      const popupConfirmation = () => {
        if (
          window.confirm(
            `Votre commande de ${choixQuantite} ${article.name} ${choixCouleur} est ajoutée au panier. Souhaitez vous être redirigé vers le panier ?`
          )
        ) {
          window.location.href = "cart.html";
        }
      };

      //Importation dans le local storage
      //Si le panier comporte déjà au moins 1 article
      if (produitLocalStorage) {
        const resultFind = produitLocalStorage.find(
          (el) =>
            el.idProduit === idProduct && el.couleurProduit === choixCouleur
        );
        //Si le produit commandé est déjà dans le panier
        if (resultFind) {
          let newQuantite =
            parseInt(optionsProduit.quantiteProduit) +
            parseInt(resultFind.quantiteProduit);
          resultFind.quantiteProduit = newQuantite;
          localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
          popupConfirmation();
          //Si le produit commandé n'est pas dans le panier
        } else {
          produitLocalStorage.push(optionsProduit);
          localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
          popupConfirmation();
        }
        //Si le panier est vide
      } else {
        produitLocalStorage = [];
        produitLocalStorage.push(optionsProduit);
        localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
        popupConfirmation();
      }
    } else {
      alert("Vous devez sélectionner un produit (couleur / quantité) ");
    }
  });
}
