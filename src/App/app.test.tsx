import React from "react";
import ReactDOM from "react-dom";
import App from "./app-x";

it("renders without crashing", done => {
  const div = document.createElement("div");
  ReactDOM.render(<App persistCache={jest.fn()} />, div);

  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(div);
    done();
  });
});
