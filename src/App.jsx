import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>EventSync Admin</h1>
    </div>
  );
}

export default App;