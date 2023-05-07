// import axios from 'axios';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import axios from "axios";

export default function SignInPage() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const handleChange = (e) => {
    // console.log(e.target.value);
    setName(e.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    const request = {
      userName: username,
    };
    //if the Username Exists the Navigate to home else Make a pop Up page
    try {
      axios.post("http://localhost:750/verifyUsername", request).then((res) => {
        console.log(res.data);
        if (res.data) {
          console.log("The UserName exists");
          // console.log(username+" passed to home")
          navigate("/home", { state: { userName: username } });
        } else {
          alert("Username does not exists");
        }
      });
    } catch (err) {
      alert(err);
    }
  };
  return (
    <div className="text-center m-5-auto">
      <h2>Sign in to us</h2>
      <form
        onSubmit={(event) => {
          handleClick(event);
        }}
      >
        <p>
          <label>Username or email address</label>
          <br />
          <input
            type="text"
            name="first_name"
            required
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </p>
        <p>
          <button id="sub_btn" type="submit">
            Login
          </button>
        </p>
      </form>
      <footer>
        <p>
          First time? <Link to="/register">Create an account</Link>.
        </p>
        <p>
          <Link to="/forget-password">Forgot Password</Link>
        </p>
        <p>
          <Link to="/">Back to Homepage</Link>.
        </p>
      </footer>
    </div>
  );
}
