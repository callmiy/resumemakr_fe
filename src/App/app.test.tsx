import React from "react";
import { render, wait } from "react-testing-library";

import App from "./app-x";
import { renderWithApollo } from "../test_utils";

it("renders without crashing", async () => {
  // tslint:disable-next-line:no-any
  const Ui = renderWithApollo(App as any).Ui as any;
  const { unmount } = render(<Ui persistCache={jest.fn()} />);
  await wait(() => expect(unmount()).toBe(true));
});
