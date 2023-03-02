type Field<T> = {
  value: T,
  error: boolean
}

export type State = {
  from: Field<string | null>,
  to: Field<string | null>,
  amount: Field<string>,
}

export type Action = {
  type: "SET",

  payload: {
    name: keyof State,
    value?: any,
    error?: boolean
  }
}

export const initialState: State = {
  from:{
    error: false,
    value: null
  },
  to:{
    error: false,
    value: null
  },
  amount:{
    error: false,
    value: ""
  },
}
export const reducer = (state: State, {type, payload}: Action)=>{
  const {name, ...rest} = payload
  switch (type){
    case "SET":
      return {
        ...state,
        [name]:{
          ...state[name],
          ...rest
        }
      }
    default:
      return state
  }
}
