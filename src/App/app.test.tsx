import React from "react";
import { render, wait } from "react-testing-library";

import App from "./app-x";
import { renderWithApollo, renderWithRouter } from "../test_utils";
import { Props } from "./app";

const AppP = App as React.ComponentClass<Partial<Props>>;

it("renders without crashing", async () => {
  const { Ui: ui } = renderWithRouter(AppP);
  const { Ui } = renderWithApollo(ui);
  const { unmount } = render(<Ui persistCache={jest.fn()} />);
  await wait(() => expect(unmount()).toBe(true));
});
