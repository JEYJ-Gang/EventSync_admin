import { useEffect } from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
function App() {

  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default App;