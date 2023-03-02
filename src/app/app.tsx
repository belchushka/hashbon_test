import './style.css'
import Home from "@/pages/home";
import {useInit} from "@/shared/hooks";
import {LoadingOverlay} from "@mantine/core";

function App() {
  const { loading } = useInit()
  return (
      <div>
        <LoadingOverlay visible={loading}/>
        {!loading &&  <Home/>}
      </div>
  )
}

export default App
