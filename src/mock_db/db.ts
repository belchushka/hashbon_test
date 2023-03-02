
type GetConvertationParams = {
  from: string,
  to: string,
  amount: string,
}

type GetConvertationReturn = {
  error?: {
    message: string
  },
  data?: {
    rate: number,
    result: number
  }
}

class DB {
  private data: Document | null = null;
  public async loadData(){
    const data = await fetch("https://matbea.com/xml/bestchange.xml")
    const xml = await data.text()
    this.data = new DOMParser().parseFromString(xml, "text/xml")
  }

  public getCurrencies(): Array<string>{
    if (this.data){
      const currencies = new Set<string>()
      const items = this.data.getElementsByTagName("item")
      for(const item of items){
        const currency = item.getElementsByTagName("from")[0]
        if (currency){
          currencies.add(currency.innerHTML)
        }
      }
      return Array.from(currencies)
    }
    return []
  }

  public getConvertation(params: GetConvertationParams): GetConvertationReturn{
    if (this.data){
      const items = this.data.getElementsByTagName("item")
      let convertation = null
      for(const item of items){
        const from = item.getElementsByTagName("from")[0].innerHTML
        const to = item.getElementsByTagName("to")[0].innerHTML
        const fromFee = item.getElementsByTagName("fromfee")[0].innerHTML
        const toFee = item.getElementsByTagName("tofee")[0].innerHTML
        const inData = item.getElementsByTagName("in")[0].innerHTML
        const out = item.getElementsByTagName("out")[0].innerHTML
        const amount = item.getElementsByTagName("amount")[0].innerHTML
        const minAmount = item.getElementsByTagName("minamount")[0].innerHTML
        const maxAmount = item.getElementsByTagName("maxamount")[0].innerHTML
        if (from === params.from && to === params.to){
          convertation = {
            from,
            to,
            fromFee,
            toFee,
            inData,
            out,
            amount,
            minAmount,
            maxAmount
          }
          break
        }
      }
      if (convertation){
        if (+params.amount < +convertation.minAmount){
          return {
            error: {
              message: `Сумма должна быть больше ${convertation.minAmount} ${params.from}`
            }
          }
        }

        if (+params.amount > +convertation.maxAmount){
          return {
            error: {
              message: `Сумма должна быть меньше ${convertation.maxAmount} ${params.from}`
            }
          }
        }
        const fromFeePercentage = +convertation.fromFee / 100
        const toFeePercentage = +convertation.toFee / 100
        const rate = +convertation.inData / +convertation.out
        const result = ((+params.amount * (1 - fromFeePercentage)) / rate) * (1-toFeePercentage)

        return {
          data:{
            rate: rate,
            result: result
          }
        }
      }
    }
    return {
      error: {
        message: "Такой перевод пока невозможен"
      }
    }
  }
}

export const db = new DB()
