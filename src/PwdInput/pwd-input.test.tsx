import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent } from "react-testing-library";
import { Formik, Field } from "formik";

import PwdInput from ".";
import { makeId } from "./pwd-input-x";
import { renderWithRouter } from "../test_utils";

it("renders correctly", () => {
  const name = "pwd";

  const { Ui } = renderWithRouter(function App() {
    return (
      <Formik
        onSubmit={() => null}
        initialValues={{ [name]: "" }}
        validateOnChange={false}
        render={() => <Field name={name} component={PwdInput} />}
      />
    );
  });

  const id = makeId(name);
  const { container, queryByTestId, getByLabelText, getByTestId } = render(
    <Ui />
  );

  const $comp = container.firstChild as HTMLDivElement;

  expect(getByTestId("pass-input-comp")).toHaveAttribute("for", id);

  expect($comp).not.toContainElement(queryByTestId("password-unmask"));
  expect($comp).not.toContainElement(queryByTestId("password-mask"));

  const $pwd = getByLabelText(/Passwort/i);
  const pwd = "awesome pass";

  fireEvent.change($pwd, {
    target: { value: pwd }
  });

  expect($comp).toContainElement(getByTestId("password-unmask"));

  fireEvent.change($pwd, {
    target: { value: "" }
  });

  expect($comp).not.toContainElement(queryByTestId("password-unmask"));

  fireEvent.change($pwd, {
    target: { value: pwd }
  });

  fireEvent.click(getByTestId("password-unmask"));
  expect($comp).not.toContainElement(queryByTestId("password-unmask"));

  const $maskPwd = getByTestId("password-mask");
  expect($comp).toContainElement($maskPwd);

  fireEvent.click($maskPwd);
  expect($comp).not.toContainElement(queryByTestId("password-mask"));
  expect($comp).toContainElement(getByTestId("password-unmask"));
});
