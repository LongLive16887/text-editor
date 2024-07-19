import './App.css';
import { useState } from "react";

const parseLines = (text) => {
  const lines = text.split('\n');
  const nonEmptyLines = lines
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => line.match(/@(\w+)/g));
  console.log(nonEmptyLines);
  let newnonEmptyLines = nonEmptyLines.filter((x) => x != null);
  console.log(newnonEmptyLines)
  let results = [];
  
  for(let x = 0; x < 32; x+=2){
    results.push(`${x/2+1}. ${newnonEmptyLines[x]} vs ${newnonEmptyLines[x+1]}`)
  }

  return(results);
}

function App() {
  const [data, setData] = useState(''); // Инициализируем пустой строкой
  const [results, setResults] = useState([]); // Инициализируем пустым массиво

  const handleInputChange = ({ target: { value } }) => {
    setData(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await parseLines(data);
    setResults(result);
  };

  return (
    <div className="App">
        <form onSubmit={handleSubmit}>
          <textarea
              className="form-field"
              type="text"
              name="usernames"
              placeholder="text"
              value={data}
              onChange={handleInputChange}
          />
          <button type="submit">
              Отправить
          </button>
        </form>
        <div className="results">
          {results.length > 0 ? (
            results.map((line, index) => <p key={index}>{line}</p>)
          ) : null}
        </div>
    </div>
  );
}

export default App;
