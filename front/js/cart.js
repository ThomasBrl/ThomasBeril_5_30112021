// Récupération des informations des produits depuis l'API et du local storage 
fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function getKanap(api) {
    let products = JSON.parse(localStorage.getItem("produit"));
    displayItem(api, products);
    getTotalQty(api, products);
  })
  .catch(function (error) {
    console.log(error);
  });

// Fonction pour afficher les produits dans le DOM et les modifier ou les supprimer du panier : 
// - Affichage des produits dans le panier 
// - Modification de la quantité d'un produit dans le panier
// - Suppression d'un produit du panier
function displayItem(api, products) {
  if (products === null || products.length === 0) {
    const emptyCart = document.createElement("p");
    emptyCart.innerText = "Votre panier est vide";
    document.querySelector("#cart__items").appendChild(emptyCart);
  } else {
    for (let product of products) {
      console.log(product);
      for (let data of api) {
        if (product.idProduit === data._id) {
          createProductCard(product, data);
        }
      }
    }
    changeQty(api, products);
    deleteItem(api, products);
  }
}

// Création des cartes dans le DOM pour chaque produit du panier 
function createProductCard(localStorage, api) {
  console.log(api);
  const produitPanier = 
  `<article class="cart__item" data-id="${api._id}" data-color=${localStorage.couleurProduit}>
    <div class="cart__item__img">
      <img src="${api.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${api.name} - ${localStorage.couleurProduit}</h2>
        <p id="partielPrice">${api.price} €</p>
     </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté :</p>
          <input type="number" class="itemQuantity" data-id="${api._id}" name="itemQuantity" min="1" max="100" pattern="[0-9]+" value="${localStorage.quantiteProduit}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p id="deleteItem" class="deleteItem">Supprimer</p>
       </div>
      </div>
    </div>
   </article>`;
  document.getElementById("cart__items");
  document.insertAdjacentHTML("beforeend", produitPanier);
}

// On calcule le nombre de produit dans le panier et le prix total
function getTotalQty(api, products) {
  // On créer une variable qu'on incrémente à chaque tour de boucle ( SUMQTY ) et une autre pour le prix total ( PRICETOTAL )
  let sumQty = 0;
  let priceTotal = 0;
  if (products === null) {
    document.getElementById("totalQuantity").innerText = "";
  } else {
    for (let product of products) {
      sumQty = sumQty + parseInt(product.quantiteProduit);
    }

    // Si j'ai au moins un produit dans le panier 
    // alors je calcule le prix total et j'affiche le nombre de produit dans le panier et le prix total :
    // Sinon le panier est vide donc j'informe le client
    if (sumQty >= 1) {
      for (let product of products) {
        for (let data of api) {
          if (product.idProduit === data._id) {
            priceTotal = priceTotal + product.quantiteProduit * data.price;
          }
        }
      }
      document.getElementById("totalQuantity").innerText = sumQty;
      document.getElementById("totalPrice").innerText = priceTotal;
    } else {
    }
  }
}

// Fonction pour modifier la quantité d'un produit dans le panier
// Cette fonction permet de changer la quantité d'un produit dans le panier en utilisant l'API.
// Elle utilise l'événement "change" pour vérifier si la quantité d'un produit est modifiée.
// Elle récupère ensuite l'élément HTML correspondant au produit et ses données (id et couleur).
// Avec les données elle vérifie si le produit existe dans le tableau de produits si oui, elle met à jour la quantité dans le tableau. 
// Elle enregistre ensuite les modifications dans le local storage et met à jour le total de quantité d'articles dans le panier.
function changeQty(api, products) {
  const inputs = document.querySelectorAll(".itemQuantity");
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      const product = input.closest("article");
      const productId = product.dataset.id;
      const productColor = product.dataset.color;
      if (
        products.some(
          (e) => e.idProduit === productId && e.couleurProduit === productColor
        )
      ){
        let objIndex = products.findIndex(
          (product) =>
            product.idProduit === productId &&
            product.couleurProduit === productColor
        );
        products[objIndex].quantiteProduit = input.valueAsNumber;
      }
      let productsJson = JSON.stringify(products);
      localStorage.setItem("produit", productsJson);
      getTotalQty(api, products);
    });
  });
}

// Fonction pour supprimer un produit du panier
// La fonction deleteItem() prend en entrée deux paramètres : api et products 
// Elle permet de delet un produit du panier en cliquant sur le bouton "supprimer" 
// La méthode .querySelectorAll() permet de sélectionner tous les boutons de suppression d'article 
// puis elle boucle pour ajouter un écouteur d'événement "click" à chacun d'eux
// Lorsque l'utilisateur clique sur un bouton de suppression, l'élément HTML associé à l'article est supprimé de la page 
// (méthode .remove()) et l'élément correspondant est aussi supprimé du tableau products 
// Enfin, elle utilise la méthode JSON.stringify() pour convertir le tableau mis à jour en string 
// pour le stocker dans le localStorage, et appelle la fonction getTotalQty() pour mettre à jour le total du panier
function deleteItem(api, products) {
  const itemDelete = document.querySelectorAll(".deleteItem");
  itemDelete.forEach((item) => {
    item.addEventListener("click", function () {
      const product = item.closest("article");
      product.remove();
      const productId = product.dataset.id;
      const productColor = product.dataset.color;
      if (
        products.some(
          (e) => e.idProduit === productId && e.couleurProduit === productColor
        )
      ) {
        let objIndex = products.findIndex(
          (product) =>
            product.idProduit === productId &&
            product.couleurProduit === productColor
        );
        products.splice(objIndex, 1);
        let productsJson = JSON.stringify(products);
        localStorage.setItem("produit", productsJson);
        getTotalQty(api, products);
      }
    });
  });
}

let firstName = document.getElementById("firstName");
firstName.addEventListener("change", function () {
  validFirstName(this);
});

// Fonction pour verifier si le regex "lastname" est respecté ou pas
function validFirstName(inputFirstName) {
  let textRegExp = new RegExp("^([a-zA-Z]+(?:. |-| |'))*[a-zA-Z]*$");

  if (!textRegExp.test(inputFirstName.value)) {
    document.getElementById("firstNameErrorMsg").innerText = "Exemple : alex";
    return false;
  } else if (inputFirstName.value.length < 2) {
    document.getElementById("firstNameErrorMsg").innerText =
      "Vérifiez votre Nom";
    return false;
  } else {
    document.getElementById("firstNameErrorMsg").innerText = "";
    return true;
  }
}

let lastName = document.getElementById("lastName");
lastName.addEventListener("change", function () {
  validLastName(this);
});

// Fonction pour verifier si le regex "name" est respecté ou pas
function validLastName(inputLastName) {
  let textRegExp = new RegExp("^([a-zA-Z]+(?:. |-| |'))*[a-zA-Z]*$");

  if (!textRegExp.test(inputLastName.value)) {
    document.getElementById("lastNameErrorMsg").innerText = "Exemple : doireau";
    return false;
  } else if (inputLastName.value.length < 3) {
    document.getElementById("lastNameErrorMsg").innerText =
      "Vérifiez votre prenom";
    return false;
  } else {
    document.getElementById("lastNameErrorMsg").innerText = "";
    return true;
  }
}

let address = document.getElementById("address");
address.addEventListener("change", function () {
  validAddress(this);
});

// Fonction pour verifier si le regex "address" est respecté ou pas
function validAddress(inputAddress) {
  let textRegExp = new RegExp(
    "[0-9]{1,4}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)"
  );

  if (!textRegExp.test(inputAddress.value)) {
    document.getElementById("addressErrorMsg").innerText =
      "Exemple : 81 avenue maurice chevalier";
    return false;
  } else if (inputAddress.value.length < 4) {
    document.getElementById("addressErrorMsg").innerText =
      "Vérifiez votre adresse";
    return false;
  } else {
    document.getElementById("addressErrorMsg").innerText = "";
    return true;
  }
}

let city = document.getElementById("city");
city.addEventListener("change", function () {
  validCity(this);
});
// Fonction pour verifier si le regex "city" est respecté ou pas
function validCity(inputCity) {
  let textRegExp = new RegExp("^([a-zA-Z]+(?:. |-| |'))*[a-zA-Z]*$");

  if (!textRegExp.test(inputCity.value)) {
    document.getElementById("cityErrorMsg").innerText = "Exemple : Paris";
    return false;
  } else if (inputCity.value.length < 5) {
    document.getElementById("cityErrorMsg").innerText = "Saisissez votre ville";
    return false;
  } else {
    document.getElementById("cityErrorMsg").innerText = "";
    return true;
  }
}

let email = document.getElementById("email");
email.addEventListener("change", function () {
  validEmail(this);
});

// Fonction pour verifier si le regex"email" est respecté ou pas
function validEmail(inputEmail) {
  let emailRegExp = new RegExp(
    /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/
  );

  if (!emailRegExp.test(inputEmail.value)) {
    document.getElementById("emailErrorMsg").innerText =
      "Exemple : contact@kanap.fr";
    return false;
  } else if (inputEmail.value.length < 6) {
    document.getElementById("emailErrorMsg").innerText =
      "Vérifiez votre email, elle semble incomplète";
    return false;
  } else {
    document.getElementById("emailErrorMsg").innerText = "";
    return true;
  }
}

// Recuperer les infos saisie par l'utilisateur
document.getElementById("order").addEventListener("click", function (e) {
  e.preventDefault();

  const products = JSON.parse(localStorage.getItem("produit"));
  if (products === null || products.length < 1) {
    alert("Panier vide");
  } else if (
    // verification des infos saisie par l'utilisateur
    validFirstName(firstName) == true &&
    validLastName(lastName) == true &&
    validAddress(address) == true &&
    validCity(city) == true &&
    validEmail(email) == true
  ) {
    const productsId = [];
    products.forEach((product) => {
      productsId.push(product.idProduit);
    });

    const order = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: productsId,
    };
    orderProduct(order);
  }
});

// Envoi de l'utilisateur vers la page de confirmation en supprimant le localStorage :
// La fonction "orderProduct" utilise la méthode fetch pour envoyer une requête HTTP de type "POST" 
// à une API avec les données de la commande "order" passée en paramètre
// Si la réponse est positive, la réponse est convertie en format JSON et l'utilisateur est redirigé vers 
// la page de confirmation de commande avec l'ID de la commande passé en paramètre
// Si une erreur se produit, elle est affichée dans la console
// A la fin le localStorage est vidé
function orderProduct(order) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      // Typage de la requete en format JSON
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
  .then(function (res) {
    if (res.ok) {
       return res.json();
    }
  })
  .then(function (value) {
    window.location = `./confirmation.html?orderId=${value.orderId}`;
    window.location = "./confirmation.html?orderId=" + value.orderId;
    localStorage.clear();
  })
  .catch(function (error) {
    console.log(error);
  });
}
