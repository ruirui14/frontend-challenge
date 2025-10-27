//import { useState } from 'react'
//import './App.css'


function App() {
  const items = Array.from({ length: 40 }, (_, i) => `項目 ${i + 1}`);
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
