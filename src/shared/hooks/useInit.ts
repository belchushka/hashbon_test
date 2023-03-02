import {useEffect, useState} from "react";
import {db} from "@db";
export const useInit = ()=>{
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(()=>{
    const fetch = async ()=>{
      try {
        await db.loadData()
        setLoading(false)
      }catch (e) {
        setError(true)
      }
    }
    fetch()
  },[])

  return {
    loading,
    error
  }
}
