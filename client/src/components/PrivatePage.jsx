import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/privatePage.css";
const PrivatePage = ({ history }) => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");

  useEffect(() => {
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };

    fetchPrivateDate();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };
  console.log("private token", localStorage.getItem("authToken"));

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div className="card">
        <h2 className="card_item">Yayyy!🎉</h2>
        <h2>{privateData}😎 </h2>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: "blue", color: "white", padding: "5px" }}>
          Log out 🙃
        </button>
      </div>
    </>
  );
};

export default PrivatePage;
