import './App.css';
import { useState,useEffect } from "react";

const parseLines = (text,count,type) => {
  const lines = text.split('\n');
  const nonEmptyLines = lines
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => line.match(/@(\w+)/g));
  let newnonEmptyLines = nonEmptyLines.filter((x) => x != null);
  console.log(nonEmptyLines)
  if(newnonEmptyLines.length !== count){
    return false;
  }

  let results = [];
  
  if(type === "tournament"){
    for(let x = 0; x < count; x+=2){
      results.push(`${x/2+1}. ${newnonEmptyLines[x]} vs ${newnonEmptyLines[x+1]}`)
    }
  }else{
    for(let x = 0; x < count/2; x++){
      results.push(`${x+1}. ${newnonEmptyLines[x]} vs ${newnonEmptyLines[x+count/2]}`)
    }
  }
  
  return(results);
}



function App() {
  const [data, setData] = useState(''); 
  const [results, setResults] = useState([]); 
  const [count, setCount] = useState(localStorage.getItem('count') || 8); 
  const [type,setType] = useState(localStorage.getItem("type") || "tournament");
  const [error,setError] = useState(false);
  const [countError,setCountError] = useState(false);

  const handleInputChange = ({ target: { value } }) => {
    setData(value);
  };

  const handleSelectChange = ({ target: { value } }) => {
    setCount(value);
    localStorage.setItem('count', value);
  };

  const handleSelectTypeChange = ({ target: { value } }) => {
    setType(value);
    localStorage.setItem('type', value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(((type === "battle") && (+count !== 22)) || ((type !== "battle") && (+count === 22))){
      setError(true);
    }else{
      setError(false);
      setCountError(false);
      const result = await parseLines(data,+count,type);
      if(!result){
        setCountError(true);
      }else{
        setResults(result);
      }
    }
  };

  useEffect(() => {
    setCount(localStorage.getItem('count') || 8);
  }, []);

  return (
    <div className="App">
        <h1>efteams.uz <a href="https://efteams.uz"><i className="fa-solid fa-globe" style={{"color": "#74C0FC"}}></i></a></h1>
        <a href="https://t.me/eF_Teams">@ef_teams <i className="fa-brands fa-telegram" style={{"color": "#74C0FC"}}></i></a>
        <p>Talab va takliflar uchun 👇</p>
        <a href="https://t.me/shoha_op">@shoha_op <i className="fa-brands fa-telegram" style={{"color": "#74C0FC"}}></i></a>
        
        <form onSubmit={handleSubmit}>
          <textarea
              className="form-field"
              type="text"
              name="usernames"
              placeholder="text"
              value={data}
              onChange={handleInputChange}
          />
          <select value={count} onChange={handleSelectChange} className="form-field select">
            <option value={8}>8 turnir</option>
            <option value={16}>16 turnir</option>
            <option value={22}>22 battle</option>
            <option value={32}>32 turnir</option>
            <option value={64}>64 turnir</option>
            <option value={128}>128 turnir</option>
          </select>
          {error ? (<p style={{color: "red"}}>battle uchun 22 o'yinchi tanlang</p>) : (<p></p>)}
          {countError ? (<p style={{color: "red"}}>kiritilgan o'yinchilar soni belgilangan songa tengmas</p>) : (<p></p>)}
          <select value={type} onChange={handleSelectTypeChange} className="form-field select">
            <option value={"tournament"}>Turnir</option>
            <option value={"battle"}>Battle</option>
          </select>
          <button type="submit" className='button-65' >
              Qura
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
