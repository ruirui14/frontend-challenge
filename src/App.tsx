//import './App.css'
import { useEffect,useState } from "react";

// const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  //const items = Array.from({ length: 40 }, (_, i) => `項目 ${i + 1}`);
  const [datas,setData] = useState<any[]>([]);
  const [error,setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/api/v1/prefectures", {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "X-API-KEY": API_KEY,
          },
        });

        if(!response.ok) throw new Error(`Error: ${response.status}`)

        const result = await response.json();
        console.log("APIの結果", result);
        setData(result.result);  
      } catch ( error : any) {
          setError(error.message);
      } finally {
          console.log();
      }  
      };
      fetchData();
  },[]);

  return (
    <>  
        <title>都道府県別総人口推移グラフ</title>
        <div>
          <h1>都道府県別総人口推移グラフ</h1>
        </div>

        <div>
            <h2>都道府県</h2>
          <div>
            {datas.map((data) => (
              <label key={data.prefCode} >
                <input type="checkbox" id={`data-${data.prefCode}`} name={`${data.prefName}`} />
                {data.prefName}
              </label>
            ))}
            
          </div>
        </div>
    </>
  )
}

export default App
