import React from 'react';
import ReactDOM from 'react-dom';
// import Lotto from "./components/Lotto";
import Lotto from "./components/Lotto_hooks";
import {hot} from "react-hot-loader/root";
const Hot = hot(Lotto);
ReactDOM.render(
  <Hot />,
  document.getElementById('root')
)
