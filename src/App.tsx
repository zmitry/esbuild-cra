import React from "react";
// for we
// import { ReactComponent as Logo } from "./logo.svg";
// for esbuild
import Logo from "./logo.svg";
// for react svg import
// import {ReactComponent as Logo} from "svgr:./logo.svg";

import { Button } from "@material-ui/core";
import { upperFirst } from "lodash-es";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={Logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. asd{" "}
          {upperFirst("fasd")}) asdf adfa
        </p>
        <Button>Click</Button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
