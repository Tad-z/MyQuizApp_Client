import React, { useEffect, useState } from "react";
import { getServerData } from "../helper/helper";

export default function ResultTable() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getServerData(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/result`
      );
      let res = data.results;
      setResults(res);
    })();
    console.log("r",results);
  });

  return (
    <div>
      <table>
        <thead className="table-header">
          <tr className="table-row">
            <td>Name</td>
            <td>Attempts</td>
            <td>Earned Points</td>
            <td>Result</td>
          </tr>
        </thead>
        <tbody>
          {!results && <div>No data found</div>}
          {results?.map((result) => {
            return(
              <tr className="table-body" key={result?._id}>
                <td>{result?.username}</td>
                <td>{result?.attempts}</td>
                <td>{result?.points}</td>
                <td>{result?.status}</td>
              </tr>
            ); 
          })}
        </tbody>
      </table>
    </div>
  );
}
