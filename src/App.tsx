//import './App.css'
import { useEffect,useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

//const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  //const items = Array.from({ length: 40 }, (_, i) => `項目 ${i + 1}`);
  const [datas,setData] = useState<any[]>([]);
  const [error,setError] = useState<string | null>(null);
  const [selectPref, setSelectPref] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<any[]>([]);

  //都道府県一覧を取得
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

  const handleCheckBox = async (prefCode: number, checked: boolean) => {
    if (checked) {
      setSelectPref((prev) => [...prev, prefCode]);
      await fetchPopulation(prefCode);
    }else{
      setSelectPref((prev) => prev.filter((code) => code !== prefCode));
      setPopulationData((prev) => prev.filter((p) => p.prefCode !== prefCode));
    }
  };

  //人口構成取得
  const fetchPopulation = async (prefCode: number) => {
    try{
      const response = await fetch(`api/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      console.log(`人口構成 (${prefCode})`, result.result.data);
      setPopulationData((prev) => [
        ...prev,
        {prefCode, data: result.result.data},
      ])
    }catch (error){
      console.error("人口構成取得エラー",error);
    }
  };


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
                <input type="checkbox" 
                id={`data-${data.prefCode}`} 
                name={`${data.prefName}`} 
                onChange={(e) => handleCheckBox(data.prefCode, e.target.checked)}
                />
                {data.prefName}
              </label>
            ))}
            
          </div>
        </div>
    </>
  )
}

export default App
