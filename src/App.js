import './App.css';
import { useState, useEffect } from "react";

const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }
  return result;
};

function App() {
  const [type, setType] = useState(localStorage.getItem("type") || "");
  const [count, setCount] = useState(Number(localStorage.getItem("count")) || null);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [playerList, setPlayerList] = useState("");
  const [isRandom, setIsRandom] = useState(localStorage.getItem("isRandom") === "true");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("type", type);
    localStorage.setItem("count", count);
    localStorage.setItem("isRandom", isRandom);
  }, [type, count, isRandom]);

  const parsePlayers = (text) => {
    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line)
      .map(line => line.match(/@(\w+)/g))
      .filter(match => match)
      .flat();
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setCount(null);
    setTeam1("");
    setTeam2("");
    setPlayerList("");
    setResults([]);
    setError("");
  };

  const handleCountChange = (e) => {
    setCount(Number(e.target.value));
    setError("");
  };

  const copyWithoutSpaces = () => {
    const textToCopy = results.join("\n");
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Qura bo'sh qatorlarsiz saqlandi :)"))
      .catch(() => alert("Qura saqlanmadi :("));
  };

  const copyWithSpaces = () => {
    const textToCopy = results.join("\n\n");
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Qura bo'sh qatorlar bilan saqlandi :)"))
      .catch(() => alert("Qura saqlanmadi :("));
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "tournament") {
      const players = parsePlayers(playerList);

      if (players.length !== count) {
        setError(`Kutilayotgan o'yinchilar soni ${count} ta, ammo ${players.length} ta topildi.`);
        return;
      }

      const orderedPlayers = isRandom ? shuffleArray(players) : players;
      const pairs = [];

      for (let i = 0; i < orderedPlayers.length; i += 2) {
        pairs.push(`${i / 2 + 1}. ${orderedPlayers[i]} vs ${orderedPlayers[i + 1]}`);
      }

      setResults(pairs);
      setError("");
    }

    if (type === "battle") {
      const team1Players = parsePlayers(team1);
      const team2Players = parsePlayers(team2);

      if (team1Players.length !== count || team2Players.length !== count) {
        setError(`Ikkala jamoada ham ${count} ta o'yinchi bo'lishi kerak.`);
        return;
      }

      const orderedTeam1 = isRandom ? shuffleArray(team1Players) : team1Players;
      const orderedTeam2 = isRandom ? shuffleArray(team2Players) : team2Players;
      const matches = [];

      for (let i = 0; i < count; i++) {
        matches.push(`${i + 1}. ${orderedTeam1[i]} vs ${orderedTeam2[i]}`);
      }

      setResults(matches);
      setError("");
    }
  };

  return (
    <div className="App">
      <h1>Qura</h1>
      <a href="https://t.me/eF_Teams">@ef_teams <i className="fa-brands fa-telegram" style={{"color": "#74C0FC"}}></i></a>
      <p>Talab va takliflar uchun 👇</p>
      <a href="https://t.me/shoha_op">@shoha_op <i className="fa-brands fa-telegram" style={{"color": "#74C0FC"}}></i></a>
      <a href="https://t.me/efteams_info/972">Foydalanish uchun qo'llanma <i className="fa-brands fa-telegram" style={{"color": "#74C0FC"}}></i></a>
      <form onSubmit={handleSubmit}>
        <select value={type} onChange={handleTypeChange} className="form-field select">
          <option value="">Turini tanlang</option>
          <option value="tournament">Turnir</option>
          <option value="battle">Battle</option>
        </select>

        {(type === "tournament" || type === "battle") && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={isRandom}
                onChange={(e) => setIsRandom(e.target.checked)}
                className='checkbox'
              />
              Random
            </label>
          </div>
        )}

        {type === "tournament" && (
          <>
            <select value={count || ""} onChange={handleCountChange} className="form-field select">
              <option value="">O'yinchilar sonini tanlang</option>
              {[8, 16, 32, 64, 128].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <textarea
              placeholder="O'yinchilar ro'yxatini kiriting (har birini yangi qatordan, @username formatida)"
              value={playerList}
              onChange={(e) => setPlayerList(e.target.value)}
              className="form-field"
            />
          </>
        )}

        {type === "battle" && (
          <>
            <select value={count || ""} onChange={handleCountChange} className="form-field select">
              <option value="">Formatni tanlang</option>
              {[3, 5, 7, 11, 13, 15, 17].map(num => (
                <option key={num} value={num}>{`${num}x${num}`}</option>
              ))}
            </select>
            <textarea
              placeholder="1-jamoa o'yinchilari (har birini yangi qatordan, @username formatida)"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="form-field"
            />
            <textarea
              placeholder="2-jamoa o'yinchilari (har birini yangi qatordan, @username formatida)"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="form-field"
            />
          </>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className='wrapper-div'>
          <button type="submit" className="button-65">Qura</button>
        </div>
      </form>

      

      {results.length > 0 && (
        <div className="results">
          <div>
          <button onClick={copyWithSpaces} className="button-65" style={{margin: "0px"}}>
            Copy
          </button>
          <button onClick={copyWithoutSpaces} className="button-65" style={{margin: "0px",backgroundColor: "green", marginLeft: "1rem"}}>
            Copy
          </button>
          </div>
          <h2 style={{margin: "0px"}}>Qura natijalari:</h2>
          {results.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default App;
