const express = require('express')
const app = express()
const path = require('path') //tratamento do path para que funcione no zait now
const convert = require('./lib/convert')
const apiBCB = require('./lib/api.bcb')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public'))) //lugar para colocar arquivos, css etc

app.get('/', async (req, res) => {
  const cotacao = await apiBCB.getCotacao()
  res.render('home', {
    cotacao
  })
})

app.get('/cotacao', (req, res) => {
  const { cotacao, quantidade } = req.query //já extrai o valor
  if (cotacao && quantidade) { //Se quantidade e cotacao é diferente de null ou vazio...
    const conversao = convert.convert(cotacao, quantidade)
    res.render('cotacao', {
      error: false,
      cotacao: convert.toMoney(cotacao),
      quantidade: convert.toMoney(quantidade),
      conversao
    })
  } else {
    res.render('cotacao', {
      error: 'Valores Invalidos'
    })
  }
})

app.listen(3000, err => {
  if (err) {
    console.log('não foi possível iniciar')
  } else {
    console.log('ConvertMyMoney está online')
  }
})