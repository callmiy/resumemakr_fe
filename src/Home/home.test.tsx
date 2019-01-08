import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait } from "react-testing-library";
import { ApolloError } from "apollo-client";

import { Home } from "./home-x";
import { renderWithRouter, fillField, WithData } from "../test_utils";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";

import {
  CreateResumeTitle,
  CreateResumeTitle_resume_resume,
  CreateResumeTitleVariables
} from "../graphql/apollo-gql";

const HomeP = Home as HomePartial;

it("renders loading indicator", () => {
  /**
   * Given a user is on the home page
   */
  const {
    getByTestId,
    queryByText,
    rerender,
    queryByTestId,
    getByText
  } = render(<HomeP loading={true} />);

  /**
   * She sees the loading indicator
   */
  expect(getByTestId("loading resume titles")).toBeInTheDocument();

  /**
   * But she does not see the add new button
   */
  expect(queryByText("+")).not.toBeInTheDocument();

  rerender(<HomeP loading={false} />);

  /**
   * Later she sees that loading indicator is gone
   */
  expect(queryByTestId("loading resume titles")).not.toBeInTheDocument();

  /**
   * And that "add new" button has shown
   */
  expect(getByText("+")).toBeInTheDocument();
});

it("renders error", () => {
  const error = {
    message: "Failed to fetch"
  } as ApolloError;

  /**
   * Given a user is on the home page
   */
  const { queryByTestId, getByText } = render(<HomeP error={error} />);

  /**
   * She sees no loading indicator on the page
   */
  expect(queryByTestId("loading resume titles")).not.toBeInTheDocument();

  /**
   * And she sees an error message
   */

  expect(getByText(error.message)).toBeInTheDocument();

  /**
   * And she see the "add new" button
   */
  expect(getByText("+")).toBeInTheDocument();
});

it("creates resume title", async () => {
  const title = "my awesome resume";
  const mockPush = jest.fn();
  const mockSetCurrentResumeTitle = jest.fn();

  const result: WithData<CreateResumeTitle> = {
    data: {
      resume: {
        resume: {
          title
        } as CreateResumeTitle_resume_resume
      }
    }
  };

  const mockCreateResumeTitle = jest.fn(() => Promise.resolve(result));
  const { Ui } = renderWithRouter(HomeP, { push: mockPush });

  /**
   * Given that a user is on the home page
   */
  const { getByLabelText, queryByLabelText, getByText } = render(
    <Ui
      setCurrentResumeTitle={mockSetCurrentResumeTitle}
      createResumeTitle={mockCreateResumeTitle}
    />
  );

  /**
   * She sees there is no UI with text "Enter resume title"
   */
  expect(queryByLabelText(/Enter resume title/)).not.toBeInTheDocument();

  /**
   * When she clicks on new button
   */
  fireEvent.click(getByText("+"));

  /**
   * And fills the field labelled "Enter resume title" with resume title
   */
  fillField(getByLabelText(/Enter resume title/), title);

  /**
   * And clicks on the yes button
   */
  fireEvent.click(getByText("Yes"));

  /**
   * She is redirected to the page where she can fill her resume
   */
  const input: CreateResumeTitleVariables = {
    input: {
      title
    }
  };

  await wait(() =>
    expect(mockCreateResumeTitle).toBeCalledWith({
      variables: input
    })
  );

  await wait(() =>
    expect(mockSetCurrentResumeTitle).toBeCalledWith({
      variables: {
        title
      }
    })
  );

  expect(mockPush).toBeCalledWith(makeResumeRoute(title));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

type HomePartial = React.ComponentClass<Partial<Props>>;
