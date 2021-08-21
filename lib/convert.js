const convert = (cotacao, quantidade) => {
  return cotacao * quantidade
}

const toMoney = valor => {
  return parseFloat(valor).toFixed(2)
}
//to fixed eh quantos digitos quer depois da virgula. o parseFloat é pra converter pra float. Tudo isso pra ficar com carinha de dinheiro com so centavos

module.exports = {
  convert,
  toMoney
}