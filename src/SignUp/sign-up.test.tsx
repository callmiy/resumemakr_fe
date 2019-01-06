import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait, waitForElement } from "react-testing-library";

import { SignUp } from "./sign-up-x";
import { Props } from "./sign-up";
import { makeClient, renderWithRouter, fillField } from "../test_utils";
import { ROOT_URL, LOGIN_URL } from "../routing";

it("renders correctly and submits", async () => {
  const user = {};
  const result = {
    data: {
      registration: user
    }
  };

  const mockRegUser = makeRegUserFunc(result);
  const mockUpdateLocalUser = jest.fn();

  const { ui, mockPush } = makeComp({
    regUser: mockRegUser,
    updateLocalUser: mockUpdateLocalUser
  });

  const { container, getByText, getByLabelText } = render(ui);

  const $signUp = container.firstChild as HTMLDivElement;
  expect($signUp).toContainElement(getByText(/Sign up to create your resume/));
  expect($signUp).toContainElement(
    getByText(/Already have an account\? Login/)
  );

  const $button = getByText(/Submit/);
  expect($button.getAttribute("name")).toBe("sign-up-submit");
  expect($button).toBeDisabled();

  const $source = getByLabelText("Source");
  expect($source.getAttribute("value")).toBe("password");
  expect($source).toHaveAttribute("readonly");
  const $sourceParent = $source.closest(".form-field") as HTMLDivElement;
  expect($sourceParent.classList).toContain("disabled");

  const $name = getByLabelText("Name");
  expect($name).toBe(document.activeElement);

  const $email = getByLabelText("Email");
  expect($email.getAttribute("type")).toBe("email");

  const $pwd = getByLabelText("Password");
  expect($pwd.getAttribute("type")).toBe("password");

  const $pwdConfirm = getByLabelText("Password Confirm");
  expect($pwdConfirm.getAttribute("type")).toBe("password");

  fillField($name, "Kanmii");
  fillField($email, "me@me.com");
  fillField($pwd, "awesome pass");
  fillField($pwdConfirm, "awesome pass");
  expect($button).not.toHaveAttribute("disabled");
  fireEvent.click($button);

  await wait(() =>
    expect(mockUpdateLocalUser).toHaveBeenCalledWith({ variables: { user } })
  );

  expect(mockPush).toBeCalledWith(ROOT_URL);
});

it("renders error if regUser function is null", async () => {
  const { ui, mockScrollToTop } = makeComp({ regUser: undefined });
  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByTestId("sign-up-form-error"));
  expect($error).toContainElement(getByText(/Unknown error/));
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if password and password confirm are not same", async () => {
  const { ui, mockScrollToTop } = makeComp({ regUser: makeRegUserFunc() });
  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillField(getByLabelText("Name"), "Kanmii");
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText("Password"), "awesome pass");
  fillField(getByLabelText("Password Confirm"), "awesome pass1");
  fireEvent.click(getByText(/Submit/));

  const $error = await waitForElement(() => getByTestId("sign-up-form-error"));
  expect($error).toContainElement(getByText(/Passwords do not match/i));
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if server returns error", async () => {
  const mockRegUser = jest.fn(() =>
    Promise.reject({
      message: "email"
    })
  );

  const { ui, mockScrollToTop } = makeComp({
    regUser: mockRegUser,
    updateLocalUser: jest.fn()
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);
  fillForm(getByLabelText, getByText);

  const $error = await waitForElement(() => getByTestId("sign-up-form-error"));
  expect($error).toContainElement(getByText(/email/i));
  expect(mockScrollToTop).toBeCalled();
});

it("redirects to login", () => {
  const { ui, mockReplace } = makeComp();
  const { getByText } = render(ui);
  fireEvent.click(getByText(/Already have an account\? Login/));
  expect(mockReplace).toBeCalledWith(LOGIN_URL);
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:no-any
function makeRegUserFunc(data?: any) {
  if (data) {
    return jest.fn(() => Promise.resolve(data));
  }

  return jest.fn();
}

// tslint:disable-next-line:no-any
function fillForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText("Name"), "Kanmii");
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText("Password"), "awesome pass");
  fillField(getByLabelText("Password Confirm"), "awesome pass");
  fireEvent.click(getByText(/Submit/));
}

function makeComp(params: Props | {} = {}) {
  const mockScrollToTop = jest.fn();
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const client = makeClient();
  const { Ui, ...rest } = renderWithRouter(SignUp, {
    push: mockPush,
    replace: mockReplace
  });
  // tslint:disable-next-line:no-any
  const Ui1 = Ui as any;

  return {
    ...rest,
    ui: <Ui1 scrollToTop={mockScrollToTop} client={client} {...params} />,
    mockScrollToTop,
    mockPush,
    mockReplace
  };
}
