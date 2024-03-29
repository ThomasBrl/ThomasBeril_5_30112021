fillSection();

// Récupération des articles de l'API
// La fonction getArticle utilise la méthode fetch pour envoyer une requête à l'API à l'URL spécifiée en utilisant l'ID de l'article.
// Elle return la réponse sous format json 
async function getArticles() {
  var articlesCatch = await fetch("http://localhost:3000/api/products");
  return await articlesCatch.json();
}

// Cette fonction asynchrone "fillSection" récupère des articles à partir 
// d'une API en utilisant la fonction "getArticles" qui retourne une promesse  
// Elle utilise la méthode "then" pour gérer la promesse résolue et ajoute des articles au DOM en 
// créant des éléments HTML  
// En cas d'erreur, elle utilise la méthode "catch" pour gérer la promesse rejetée sous forme d'erreur
async function fillSection() {
  var result = await getArticles()
    .then(function (resultatAPI) {
      const articles = resultatAPI;
      console.table(articles);

      for (let article in articles) {
        // Insertion de l'élément "a"
        let productLink = document.createElement("a");
        document.querySelector(".items").appendChild(productLink);
        productLink.href = `product.html?id=${resultatAPI[article]._id}`;

        // Insertion de l'élément "article"
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        // Insertion de l'image
        let productImg = document.createElement("img");
        productArticle.appendChild(productImg);
        productImg.src = resultatAPI[article].imageUrl;
        productImg.alt = resultatAPI[article].altTxt;

        // Insertion du titre "h3"
        let productName = document.createElement("h3");
        productArticle.appendChild(productName);
        productName.classList.add("productName");
        productName.innerHTML = resultatAPI[article].name;

        // Insertion de la description "p"
        let productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.classList.add("productName");
        productDescription.innerHTML = resultatAPI[article].description + " €";

        // Insertion du prix
        let productPrice = document.createElement("price");
        productArticle.appendChild(productPrice);
        productPrice.classList.add("productName");
        productPrice.innerHTML = resultatAPI[article].price;
      }
    })
    .catch(function (error) {
      return error;
    });
}

// autre methode pour récuperer
/*
  let items = document.getElementsByClassName("items");
     for (let article in articles) 
        {
  let product = `<a href="${article._id}">
            <article>
              <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
              <h3 class="productName">${article.title}</h3>
              <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
            </article>
          </a> `

          items.appendChild(product);
    }
*/
