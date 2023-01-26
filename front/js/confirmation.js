// La fonction main() définit une variable "orderId" qui récupère la valeur de l'identifiant de 
// commande passé dans l'URL. Il utilise ensuite la propriété "searchParams" URL pour
// récupérer la valeur de "orderId" dans l'URL
// Il utilise ensuite la propriété innerText de l'élément HTML ayant l'id "orderId" pour afficher cette valeur.
function main() {
  var str = window.location.href;
  var url = new URL(str);
  var orderId = url.searchParams.get("orderId");

  const idNode = document.getElementById("orderId");
  idNode.innerText = orderId;
}

main();
