import { useEffect, useState } from "react";

function TestAPI() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Backend Test</h2>
      <p>{message || "Cargando..."}</p>
    </div>
  );
}

export default TestAPI;