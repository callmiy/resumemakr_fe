import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait, waitForElement } from "react-testing-library";

import { Login } from "./login-x";
import { Props } from "./login";
import { SIGN_UP_URL, ROOT_URL } from "../routing";
import { renderWithRouter, fillField, WithData } from "../test_utils";

import {
  LoginMutation,
  LoginMutation_login_user,
  UserFragment
} from "../graphql/apollo-gql";

const LoginP = Login as React.ComponentClass<Partial<Props>>;

it("renders correctly and submits", async () => {
  const user = {} as LoginMutation_login_user;
  const login = { user };
  const result: WithData<LoginMutation> = {
    data: {
      login
    }
  };

  const mockLogin = makeLoginFunc(result);
  const mockUpdateLocalUser = jest.fn();

  const { ui, mockPush } = makeComp({
    login: mockLogin,
    updateLocalUser: mockUpdateLocalUser
  });

  const { container, getByText, getByLabelText } = render(ui);
  const $login = container.firstChild;
  expect($login).toContainElement(getByText(/Login to your account/));
  expect($login).toContainElement(getByText(/Don't have an account\? Sign Up/));

  const $button = getByText(/Submit/);
  expect($button.getAttribute("name")).toBe("login-submit");
  expect($button).toBeDisabled();

  const $email = getByLabelText("Email");
  expect($email.getAttribute("type")).toBe("email");

  const $pwd = getByLabelText("Password");
  expect($pwd.getAttribute("type")).toBe("password");

  fillField($email, "me@me.com");
  fillField($pwd, "awesome pass");
  expect($button).not.toHaveAttribute("disabled");
  fireEvent.click($button);

  await wait(() =>
    expect(mockUpdateLocalUser).toBeCalledWith({ variables: { user } })
  );

  expect(mockPush).toBeCalledWith(ROOT_URL);
});

it("renders error if login function is null", async () => {
  const { ui } = makeComp({
    login: undefined
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/Unknown error/));
});

it("renders error if email is invalid", async () => {
  const { ui } = makeComp({
    login: makeLoginFunc()
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillField(getByLabelText("Email"), "invalid email");
  fillField(getByLabelText("Password"), "awesome pass");
  fireEvent.click(getByText(/Submit/));
  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/email/i));
});

it("renders error if password is invalid", async () => {
  const { ui } = makeComp({
    login: makeLoginFunc()
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillField(getByLabelText("Email"), "awesome@email.com");
  fillField(getByLabelText("Password"), "12");
  fireEvent.click(getByText(/Submit/));
  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/too short/i));
});

it("renders error if server returns error", async () => {
  const mockLogin = jest.fn(() =>
    Promise.reject({
      message: "Invalid email/password"
    })
  );

  const { ui } = makeComp({
    login: mockLogin,
    updateLocalUser: jest.fn()
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);
  fillForm(getByLabelText, getByText);

  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/Invalid email\/password/i));
});

it("redirects to sign up", () => {
  const { ui, mockReplace } = makeComp();
  const { getByText } = render(ui);
  fireEvent.click(getByText(/Don't have an account\? Sign Up/));
  expect(mockReplace).toBeCalledWith(SIGN_UP_URL);
});

it("logs out user if logged in", async () => {
  const mockUpdateLocalUser = jest.fn();
  const user = {} as UserFragment;

  const { ui } = makeComp({
    updateLocalUser: mockUpdateLocalUser,
    user
  });

  const {} = render(ui);

  await wait(() =>
    expect(mockUpdateLocalUser).toBeCalledWith({
      variables: {
        user: null
      }
    })
  );
});

it("does not log out user if user not logged in", async () => {
  const mockUpdateLocalUser = jest.fn();
  const user = null;

  const { ui } = makeComp({
    updateLocalUser: mockUpdateLocalUser,
    user
  });

  const {} = render(ui);
  expect(mockUpdateLocalUser).not.toBeCalled();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:no-any
function makeLoginFunc(data?: any) {
  if (data) {
    return jest.fn(() => Promise.resolve(data));
  }

  return jest.fn();
}

// tslint:disable-next-line:no-any
function fillForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText("Password"), "awesome pass");
  fireEvent.click(getByText(/Submit/));
}

function makeComp(params: Props | {} = {}) {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const { Ui, ...rest } = renderWithRouter(LoginP, {
    push: mockPush,
    replace: mockReplace
  });

  return {
    ...rest,
    ui: <Ui {...params} />,
    mockPush,
    mockReplace
  };
}
