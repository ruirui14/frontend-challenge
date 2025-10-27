//import './App.css'
import { useEffect,useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

//const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type PopulationYearData = {
  year: number;
  value: number;
};

type PopulationResponse = {
  message: null;
  result: {
    boundaryYear: number;
    data: {
      label: string;
      data: PopulationYearData[];
    }[];
  };
};

type PopulationData = {
  prefCode: number;
  prefName: string;
  data: PopulationYearData[];
};

function App() {
  //const items = Array.from({ length: 40 }, (_, i) => `項目 ${i + 1}`);
  const [datas,setData] = useState<Prefecture[]>([]);
  const [error,setError] = useState<string | null>(null);
  const [selectPref, setSelectPref] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);

  const [chartNumber,setChartNumber] = useState<Highcharts.Options>({
    title: {
      text: "都道府県別人口推移グラフ",
    },
    xAxis: {
      title: {text: "年度"},
    },
    yAxis: {
      title: {text: "人口"},
    },
    series: [] as Highcharts.SeriesOptionsType[],
  });

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

  const handleCheckBox = async (prefCode: number,prefName: string,checked: boolean,) => {
    if (checked) {
      setSelectPref((prev) => [...prev, prefCode]);
      await fetchPopulation(prefCode,prefName);
    }else{
      setSelectPref((prev) => prev.filter((code) => code !== prefCode));
      setPopulationData((prev) => prev.filter((p) => p.prefCode !== prefCode));

      setChartNumber((prev) => ({
      ...prev,
      series: (prev.series as Highcharts.SeriesOptionsType[]).filter(
          (s) => (s as Highcharts.SeriesLineOptions).name !== prefName
        ),
    }));

    }
  };

  //人口構成取得
  const fetchPopulation = async (prefCode: number, prefName: string ) => {
    try{
      const response = await fetch(`/api/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );
      const result:PopulationResponse = await response.json();
      const data = result.result.data.find((d) => d.label === "総人口")?.data as PopulationYearData[];
      const years = data.map((d) => d.year.toString());
      const values = data.map((d) => d.value);
      console.log(`人口構成 (${prefCode})`, result.result.data);
      setPopulationData((prev) => [
        ...prev,
        {prefCode,prefName, data},
      ])

      setChartNumber((prev) => ({
        ...prev,
        xAxis: {...prev.xAxis, categories: years},
        series: [
          ...(prev.series as Highcharts.SeriesOptionsType[]),
          { type: "line", name: prefName, data: values },
        ],
      }));
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCheckBox(data.prefCode, data.prefName ,e.target.checked)
                }
                />
                {data.prefName}
              </label>
            ))}
            
          </div>
        </div>

        <HighchartsReact highcharts={Highcharts} options={chartNumber} />

    </>
  )
}

export default App
