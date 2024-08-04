import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import ConvertForm from "./ConvertForm";
import RateTable from "./RateTable";
import Rate from "../types/Rate";

// At the beginning I've used public proxy server to fetch data from CNB API
// const urlOrigin: string =
//   "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";
// const proxyUrl: string = `https://proxy.cors.sh/` + urlOrigin;

// Later I've deployed my own proxy server at Heroku (https://github.com/lukasmacha/proxy-conv)
const proxyUrl: string = "https://proxy-conv-f6a5d00f4c2b.herokuapp.com/fetch-data";

  
  // Parse one line
  // Country|Currency|Amount|Code|Rate
  // Australia|dollar|1|AUD|15.192
  function parseLine(line: string): Rate | null {
    const splits = line.split("|");
    return splits.length > 1
      ? {
          country: splits[0],
          currency: splits[1],
          amount: parseInt(splits[2]),
          code: splits[3],
          rate: parseFloat(splits[4]),
        }
      : null;
  }

  const Container = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    @media only screen and (max-width: 900px) {
      flex-direction: column;
    }
  `;
  const Component = styled.div`
    flex: 1;
    padding: 20px;
    margin: 10px;
    min-width: 400px;
  `;

  const Header = styled.h3`
    padding: 20px 0px;
  `;

  function App() {
    const { data, error, isLoading } = useQuery({
      queryKey: ["rates"],
      queryFn: async () => {
        const resp = await fetch(proxyUrl, {
          // headers: { "x-cors-api-key": "temp_7251f9c08b9166e1fb57f8392da9b490" },} // used for the public proxy server
        });
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return (await resp.text())
          .split("\n")
          .slice(2) // ignore first two header lines
          .map(parseLine)
          .filter((r) => !!r) as Rate[]; // last line may be null
      },
    });

    if (error) {
      console.log("Error from xyz: ", error);
      return <div>Error: {JSON.stringify(error)}</div>;
    }

    return (
      <Container>
        <Component>
          <Header>Exchange Rates</Header>
          <RateTable data={data} />
        </Component>
        <Component>
          <Header>Converter</Header>
          <ConvertForm rates={data} />
        </Component>
      </Container>
    );
  }

export default App;
