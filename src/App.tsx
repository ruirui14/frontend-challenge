//import './App.css'
import { useEffect,useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const items = Array.from({ length: 40 }, (_, i) => `項目 ${i + 1}`);
  const [data,setData] = useState<any[]>([]);
  const [error,setError] = useState<string | null>(null);
  const [loading,setLoading] = useState(true);

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
        setData(result);  
      } catch ( error:any) {
          setError(error.message);
      } finally {
          setLoading(false);
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
          <div>
            <h2>都道府県</h2>
          </div>

          <div>
            {items.map((item) => (
              <label key={item} >
                <input type="checkbox" id="hokka" name="hokka" />
                北海道
              </label>
            ))}
            
          </div>
        </div>
    </>
  )
}

export default App
