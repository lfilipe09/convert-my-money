const api = require('./api.bcb')
const axios = require('axios')

//no arquivo package.json, se coloca um "jest : collectCoverage", mostra o quanto já testou das funções

//fez uma copia falsa do axios pra não chamar ele de verdade
jest.mock('axios')

test('getCotacaoAPI', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 5.25 }
      ]
    }
  }
  axios.get.mockResolvedValue(res)
  api.getCotacaoAPI('url').then(resp => {
    expect(resp).toEqual(res)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})

test('extractCotacao', () => {
  const cotacao = api.extraCotacao({
    data: {
      value: [
        { cotacaoVenda: 5.25 }
      ]
    }
  })
  expect(cotacao).toBe(5.25)
})

//O describe serve para agrupar vários testes
describe('getToday', () => {
  const RealDate = Date //fazendo uma cópia daquele date para guardar

  function mockDate(date) {
    global.Date = class extends RealDate {
      constructor() {
        return new RealDate(date)
      }
    }
  }

  afterEach(() => {
    global.Date = RealDate //depois dos testes volta o date para o que era antes
  })

  test('getToday', () => {
    mockDate('2019-01-01T12:00:00z')
    const today = api.getToday()
    expect(today).toBe('1-1-2019')
  })
})

test('getURL', () => {
  const url = api.getUrl('MINHA-DATA')
  expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27MINHA-DATA%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})

//jest.fn criou versões falsas de cada função
test('getCotacao', () => {

  const res = {
  }

  const getToday = jest.fn()
  getToday.mockReturnValue('01-01-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockResolvedValue(res)

  const extraCotacao = jest.fn()
  extraCotacao.mockReturnValue(3.9)

  api.pure
    .getCotacao({ getToday, getUrl, getCotacaoAPI, extraCotacao })()
    .then(res => {
      expect(res).toBe(3.9)
    })
})

//Testando quando da erro para usar o .catch:
test('getCotacao', () => {

  const res = {
    data: {
      value: [
        { cotacaoVenda: 3.90 }
      ]
    }
  }

  const getToday = jest.fn()
  getToday.mockReturnValue('01-01-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockReturnValue(Promise.reject('err'))

  const extraCotacao = jest.fn()
  extraCotacao.mockReturnValue(3.9)

  api.pure
    .getCotacao({ getToday, getUrl, getCotacaoAPI, extraCotacao })()
    .then(res => {
      expect(res).toBe('')
    })
})