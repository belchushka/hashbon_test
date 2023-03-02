import React, {useEffect, useState} from 'react';
import {ICurrencySelect} from "./types";
import {Select, SelectItem} from "@mantine/core";
import {db} from "@db";

export const CurrencySelect: React.FC<ICurrencySelect> = ({exclude, ...props}) => {
  const [data, setData] = useState<Array<SelectItem>>([])
  useEffect(()=>{
    const currencies = db.getCurrencies()
    setData(currencies.map(el=>{
      return {
        label: el,
        value: el
      }
    }))
  },[])

  const excludedData = (()=>{
    return data.filter(el=>el.value !== exclude)
  })()
  return (
     <Select data={excludedData} {...props}/>
  );
};
