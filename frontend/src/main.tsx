import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import App from "./App";
import NotistackProvider from "./NotistackProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NotistackProvider>
          <App />
        </NotistackProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
