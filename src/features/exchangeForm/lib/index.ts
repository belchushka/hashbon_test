
type Errors = {
  amount?: boolean,
  from?:boolean,
  to?: boolean
}
export const validate = ({
  amount,
    from,
    to
}: {
  amount: string,
  from: string | null,
  to: string | null
}): Errors=>{
  const errors: Errors = {
    amount: false,
    from: false,
    to: false
  }
  if (amount.length===0 || +amount===0){
    errors['amount'] = true
  }

  if (from===null){
    errors['from'] = true
  }

  if (to===null){
    errors['to'] = true
  }

  return errors
}
