function main() {
  var str = window.location.href;
  var url = new URL(str);
  var orderId = url.searchParams.get("orderId");

  const idNode = document.getElementById("orderId");
  idNode.innerText = orderId;
}

main();
