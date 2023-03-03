import React, {FormEventHandler, Reducer, useReducer, useState} from 'react';
import {Box, Button, Collapse, Grid, Input, Text, Title} from "@mantine/core";
import {CurrencySelect} from "@/entities/currency";
import {reducer, initialState, State, Action} from "../model";
import {validate} from "@/features/exchangeForm/lib";
import {db} from "@db";

export const ExchangeForm = () => {
  const [data, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState)
  const [rate, setRate] = useState<null | number>(null)
  const [result, setResult] = useState<null | number>(null)
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const onSubmit: FormEventHandler<HTMLFormElement> = (event)=>{
    event.preventDefault()
    let formValid = true
    const errors = validate({
      amount: data.amount.value,
      from: data.from.value,
      to: data.to.value
    });
    for(const k of Object.keys(errors)){
      const key = k as keyof typeof errors
      const hasError = errors[key]
      dispatch({
        type: "SET",
        payload:{
          name: key,
          error: hasError
        }
      })
      if (hasError){
        formValid = false
      }
    }
    if (formValid){
      const {error, data: convertionData} = db.getConvertation({
        from: data.from.value as string,
        to: data.to.value as string,
        amount: data.amount.value
      })
      if (error){
        setError(error.message)
        setShowResult(false)
        return
      }
      if (convertionData){
        setRate(convertionData.rate)
        setResult(convertionData.result)
        setShowResult(true)
        setError(null)
      }
    }
  }

  const changeFieldHandler = (payload: Action['payload'])=>{
    setShowResult(false)
    dispatch({
      type: "SET",
      payload
    })
  }

  return (
      <Box style={{
        width: "600px"
      }}>
        <form onSubmit={onSubmit}>
          <Grid>
            <Grid.Col span={12}>
              <Title size="x-large">Converter</Title>
            </Grid.Col>
            <Grid.Col span={6}>
              <CurrencySelect error={data.from.error} exclude={data.to.value} value={data.from.value} onChange={(value)=>{
                changeFieldHandler({
                  name: 'from',
                  value
                })
              }} size="md" placeholder="From"/>
            </Grid.Col>
            <Grid.Col  span={6}>
              <CurrencySelect error={data.to.error} exclude={data.from.value} value={data.to.value} onChange={(value)=>{
                changeFieldHandler({
                  name: 'to',
                  value
                })
              }} size="md" placeholder="To"/>
            </Grid.Col>
            <Grid.Col span={12}>
              <Input error={data.amount.error} size="md" value={data.amount.value} onChange={ev=>{
                changeFieldHandler({
                  name: 'amount',
                  value: ev.target.value
                })
              }} type="number" placeholder="Amount"/>
            </Grid.Col>

            <Collapse in={error !== null}>
              <Grid.Col span={12}>
                <Text color="red">
                  {error}
                </Text>
              </Grid.Col>

            </Collapse>
            <Collapse style={{
            width: "100%"}
            } in={showResult}>
              <Grid.Col span={12}>
                <Grid>
                  <Grid.Col span={12}>
                    <Text color="grey">
                      Курс: {rate} {data.from.value} / 1 {data.to.value}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text weight={600} color="black">
                      Итого: {result} {data.to.value}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Collapse>

            <Grid.Col span={12}>
              <Button type="submit" size="md" fullWidth>
                Convert
              </Button>
            </Grid.Col>
          </Grid>

        </form>
      </Box>

  );
};

