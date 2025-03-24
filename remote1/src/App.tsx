import { useState } from "react";
import Header from 'host/Header'
import isValidEmail from "host/emailValidator";
import utils from "host/utils";
import "./App.css"; 

const App = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(isValidEmail(value));
  };

  return (
    <div className="remote1-content">
      <Header title="Remote App One"></Header>
      <div>
        <input
          type="text"
          value={email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        <p>{isValid ? "Valid Email" : "Invalid Email"}</p>

        {
        /* 
          <p>Squared 4 = {sqr(4)}</p>
           <p>Sum 4 + 5 = {sum(4,5)}</p> 
        */
        }

        <p>Squared 4 = {utils.sqr(4)}</p>
        <p>Sum 4 + 5 = {utils.sum(4,5)}</p>
      </div>
    </div>
  );
};

export default App;