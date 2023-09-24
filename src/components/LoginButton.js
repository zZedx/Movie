import { useState } from "react";

const style1 = {
  position: "absolute",
  top: "0",
  right: "0",
  transform: "translateX(100%) translateY(-100%)",
  height: "100vh",
  width: "100vw",
  zIndex: 1000,
  overflow: "hidden",
  transition: "all 0.3s",
};
const style2 = {
  transform: "translateX(0) translateY(0)",
  backgroundColor: "rgba(0 , 0, 0 , 0.6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};
const closeBtn = {
  cursor: "pointer",
  position: "absolute",
  right: "5rem",
  top: "5rem",
};
const formStyle = {
  display: "flex",
  gap: "3rem",
  flexDirection: "column",
  width: "50%",
};
const formDivStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};
const inputStyle = {
  height: "3rem",
  padding:'0.5rem'
};
const btnStyle = {
  width: "fit-content",
  padding: "1rem 2rem",
  backgroundColor: "var(--color-primary)",
  cursor: "pointer",
  color: "white",
  margin: "0 auto 1rem",
};
const altbtnStyle = {
  width: "fit-content",
  padding: "0.5rem 1.5rem",
  background: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
  margin: "0 auto 1rem",
};

export default function LoginButton({isUser , setIsUser}) {
  const [toggle, setToggle] = useState(false);
  const mainStyle = {
    width: "4rem",
    textAlign: "center",
  };
  const button = {
    cursor: "pointer",
    zIndex: "10001",
  };
  return (
    <div style={mainStyle} className="num-results">
      <span style={button} onClick={() => setToggle(true)}>
        {!toggle && "Login"}
      </span>
      <LoginForm isUser={isUser} setIsUser={setIsUser} toggle={toggle} setToggle={setToggle} />
    </div>
  );
}

function LoginForm({ toggle, setToggle , isUser , setIsUser }) {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    if (login) {
      const storedToken = localStorage.getItem('token');
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" , Authorization: `Bearer ${storedToken}`},
        body: JSON.stringify({ username, password }),
      });
      if(res.ok){
        const data = await res.json()
        console.log(data)
        setToggle(false)
      }else{
        console.log('Error')
      }
    } else {
      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
    }
  }

  return (
    <div style={toggle ? { ...style1, ...style2 } : style1}>
      <span onClick={() => setToggle(false)} style={closeBtn}>
        ❌
      </span>
      {toggle && (
        <form style={formStyle} action="" onSubmit={(e) => handleSubmit(e)}>
          <div className="name" style={formDivStyle}>
            <label htmlFor="username">Username</label>
            <input
              style={inputStyle}
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="password" style={formDivStyle}>
            <label htmlFor="password">Password</label>
            <input
              style={inputStyle}
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button style={btnStyle}>{login ? "Login" : "Register"}</button>
        </form>
      )}
      <button style={altbtnStyle} onClick={() => setLogin((e) => !e)}>
        {!login ? "Login" : "Register"}
      </button>
    </div>
  );
}
