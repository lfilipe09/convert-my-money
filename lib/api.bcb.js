const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
const getCotacaoAPI = url => axios.get(url)
const extraCotacao = res => res.data.value[0].cotacaoVenda
getToday = () => {
  const today = new Date()
  return (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear()
}

//Para conseguirmos testar no outro módulo temos que injetar as dependencias (as outras funcoes que tao dentro de getCotacao) para passar pro teste, por isos tem um parenteses antes do async() com a chave de todas

const getCotacao = ({ getToday, getUrl, getCotacaoAPI, extraCotacao }) => async () => {
  try {
    const today = getToday()
    const url = getUrl(today)
    const res = await getCotacaoAPI(url)
    const cotacao = extraCotacao(res)
    return cotacao
  } catch (err) {
    return '' //ignorando o erro
  }
}

//Aqui exportou-se o getCotacao com todas as dependencias e um pure com a mesma função original

module.exports = {
  getToday,
  getUrl,
  getCotacaoAPI,
  getCotacao: getCotacao({ getToday, getUrl, getCotacaoAPI, extraCotacao }),
  extraCotacao,
  pure: {
    getCotacao
  }
}