import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait } from "react-testing-library";

import { Home } from "./home-x";
import { renderWithRouter, fillField, WithData } from "../test_utils";
import { makeResumeRoute } from "../routing";

import {
  CreateResumeTitle,
  CreateResumeTitle_resume_resume,
  CreateResumeTitleVariables
} from "../graphql/apollo-gql";

it("renders ok", async () => {
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
  // tslint:disable-next-line:no-any
  const Ui = renderWithRouter(Home, { push: mockPush }).Ui as any;

  // Given that a user is on the home page
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
