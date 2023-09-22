import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
// import TextExpander from "./textExpander";
import './index.css';
import App from './App';
// import StarRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    {/* <TextExpander buttonColor="red" colapsedNumWords={5} className="box">
      Space travel is the ultimate adventure! Imagine soaring past the stars and
      exploring new worlds. It's the stuff of dreams and science fiction, but
      believe it or not, space travel is a real thing. Humans and robots are
      constantly venturing out into the cosmos to uncover its secrets and push
      the boundaries of what's possible.
    </TextExpander>
    <TextExpander buttonColor="orange" colapsedNumWords={14} className="box" buttonInline={false} expanded={true}>
      Space travel is the ultimate adventure! Imagine soaring past the stars and
      exploring new worlds. It's the stuff of dreams and science fiction, but
      believe it or not, space travel is a real thing. Humans and robots are
      constantly venturing out into the cosmos to uncover its secrets and push
      the boundaries of what's possible.
    </TextExpander> */}
    <App />
    {/* <StarRating color={'#35A29F'} size={20} maxRating={3}/> */}
  </StrictMode>
);
