import React from 'react';
import {Box} from "@mantine/core";
import {ExchangeForm} from "@/features";

const Home = () => {
  return (
      <Box style={{
        width: "100%",
        height: "100vh",
        display:"flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <ExchangeForm/>

      </Box>
  );
};

export default Home;
