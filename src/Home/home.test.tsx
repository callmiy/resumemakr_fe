import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait } from "react-testing-library";
import { ApolloError } from "apollo-client";

import { Home } from "./home-x";
import {
  renderWithRouter,
  fillField,
  WithData,
  renderWithApollo,
  HistoryProps
} from "../test_utils";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";

import {
  CreateResume,
  CreateResume_createResume_resume,
  CreateResumeVariables,
  ResumeTitles_listResumes,
  ResumeTitles_listResumes_edges_node,
  DeleteResume
} from "../graphql/apollo-gql";

const HomeP = Home as React.ComponentClass<Partial<Props>>;

it("renders loading indicator", () => {
  /**
   * Given a user is on the home page
   */
  const { Ui } = setUp();

  const {
    getByTestId,
    queryByText,
    rerender,
    queryByTestId,
    getByText
  } = render(<Ui loading={true} />);

  /**
   * She sees the loading indicator
   */
  expect(getByTestId("loading resume titles")).toBeInTheDocument();

  /**
   * But she does not see the add new button
   */
  expect(queryByText("+")).not.toBeInTheDocument();

  rerender(<Ui loading={false} />);

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
  const { Ui } = setUp();
  const { queryByTestId, getByText } = render(<Ui error={error} />);

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

it("renders message if user has not created resume", () => {
  /**
   * Given a user has not created any resumes previously
   */
  const resumes: ResumeTitles_listResumes = {
    edges: [],
    __typename: "ResumeConnection"
  };

  /**
   * When she navigates to the home page
   */
  const { Ui } = setUp();

  const { getByText } = render(<Ui listResumes={resumes} />);

  /**
   * Then she sees a message that she has not created any resumes previously
   */
  const $noResumes = getByText(/You have no resumes/i);

  /**
   * When she clicks on this message
   */
  fireEvent.click($noResumes);

  /**
   * Then she sees a UI asking her to create a new resume
   */
  expect(getByText(/Create new resume/)).toBeInTheDocument();
});

it("renders resume titles", () => {
  /**
   * Given a user has resumes in the system
   */
  const titles = ["My awesome title 1", "My awesome title 2"];

  const resumes: ResumeTitles_listResumes = {
    edges: [
      {
        node: {
          title: titles[0],
          id: "1"
        } as ResumeTitles_listResumes_edges_node
      },

      {
        node: {
          title: titles[1],
          id: "2"
        } as ResumeTitles_listResumes_edges_node
      }
    ],
    __typename: "ResumeConnection"
  };

  /**
   * When she visits the home page
   */
  const mockPush = jest.fn();
  const { Ui } = setUp({ historyProps: { push: mockPush } });
  const { getByText } = render(<Ui listResumes={resumes} />);

  /**
   * Then she should see her resumes' titles
   */
  titles.forEach(t => expect(getByText(t)).toBeInTheDocument());

  /**
   * When she clicks on the second title
   */
  fireEvent.click(getByText(titles[1]));

  /**
   * Then she is redirected to page to edit the resume
   */
  expect(mockPush).toBeCalledWith(makeResumeRoute(titles[1]));
});

it("creates resume", async () => {
  const title = "my awesome resume";
  const mockPush = jest.fn();

  const result: WithData<CreateResume> = {
    data: {
      createResume: {
        resume: {
          title
        } as CreateResume_createResume_resume
      }
    }
  };

  const mockCreateResume = jest.fn(() => Promise.resolve(result));
  const { Ui } = setUp({ historyProps: { push: mockPush } });

  /**
   * Given that a user is on the home page
   */
  const { getByLabelText, queryByLabelText, getByText } = render(
    <Ui createResume={mockCreateResume} />
  );

  /**
   * She sees there is no UI with text "Title e.g. name of company to send to"
   */
  expect(
    queryByLabelText(/Title e.g. name of company to send to/)
  ).not.toBeInTheDocument();

  /**
   * When she clicks on new button
   */
  fireEvent.click(getByText("+"));

  /**
   * And fills the field labelled "Title e.g. name of company to send to" with resume title
   */
  fillField(getByLabelText(/Title e.g. name of company to send to/), title);

  /**
   * And clicks on the yes button
   */
  fireEvent.click(getByText("Yes"));

  /**
   * She is redirected to the page where she can fill her resume
   */
  await wait(() => {
    const args = mockCreateResume.mock.calls[0][0];
    expect(args.variables.input.title).toBe(title);
  });

  expect(mockPush).toBeCalledWith(makeResumeRoute(title));
});

it("renders error if deleteResume prop not injected", async () => {
  /**
   * Given there are resumes in the system
   */

  const resumes: ResumeTitles_listResumes = {
    edges: [
      {
        node: {
          title: "Title 1",
          id: "1"
        } as ResumeTitles_listResumes_edges_node
      }
    ],
    __typename: "ResumeConnection"
  };

  /**
   * When a user visits the home page
   */
  const { Ui } = setUp();

  const { getByText, queryByText, getByTestId } = render(
    <Ui listResumes={resumes} />
  );

  /**
   * Then she sees no UI showing resume can not be deleted
   */
  expect(queryByText(/unable to delete resume/i)).not.toBeInTheDocument();

  /**
   * When she deletes one of the displayed resume titles
   */
  fireEvent.click(getByText(/delete title 1/i));
  fireEvent.click(getByTestId("yes to delete Title 1"));

  /**
   * Then she sees an error UI saying the resume can not be deleted
   */
  expect(getByText(/unable to delete resume/i)).toBeInTheDocument();
});

it("deletes resume", async () => {
  /**
   * Given there are resumes in the system
   */

  const titles = ["My awesome title 1", "My awesome title 2"];

  const resumes: ResumeTitles_listResumes = {
    edges: [
      {
        node: {
          title: titles[0],
          id: "1"
        } as ResumeTitles_listResumes_edges_node
      },

      {
        node: {
          title: titles[1],
          id: "2"
        } as ResumeTitles_listResumes_edges_node
      }
    ],
    __typename: "ResumeConnection"
  };

  /**
   * When a user visits the home page
   */

  const result: WithData<DeleteResume> = {
    data: {
      deleteResume: {
        resume: {
          id: "2",
          title: titles[1]
        }
      }
    }
  };

  const deleteResume = jest.fn(() => Promise.resolve(result));

  const { Ui } = setUp();

  const { getByText, queryByText, getByTestId } = render(
    <Ui listResumes={resumes} deleteResume={deleteResume} />
  );

  const successRegexp = new RegExp(`deleted successfully`, "i");
  const confirmRegexp = new RegExp(`Sure to delete`, "i");

  /**
   * She sees one of her resumes' title on the page
   */
  expect(getByTestId(`${titles[1]} row`)).toBeInTheDocument();

  /**
   * And she sees no UI asking her to confirm if she wants to delete resume
   */
  expect(queryByText(confirmRegexp)).not.toBeInTheDocument();

  /**
   * When she clicks to delete one of the displayed resume titles
   */
  fireEvent.click(getByText(new RegExp(`delete ${titles[1]}`, "i")));

  /**
   * Then she sees UI asking her to confirm if she wants to delete resume
   */
  expect(getByText(confirmRegexp)).toBeInTheDocument();

  /**
   * When she clicks on 'no she does not want to delete resume'
   */
  fireEvent.click(getByTestId(`no to delete ${titles[1]}`));

  /**
   * Then she sees the UI asking her to confirm if she wants to delete resume
   * is gone
   */
  expect(queryByText(confirmRegexp)).not.toBeInTheDocument();

  /**
   * When she clicks to delete one of the displayed resume titles
   */
  fireEvent.click(getByText(new RegExp(`delete ${titles[1]}`, "i")));

  /**
   * Then she sees no UI showing resume has been deleted
   */
  expect(queryByText(successRegexp)).not.toBeInTheDocument();

  /**
   * When she confirms to delete resume
   */
  fireEvent.click(getByTestId(`yes to delete ${titles[1]}`));

  /**
   * Then she sees a UI showing her action succeeded
   */

  await wait(() => {
    const $successMsg = getByText(successRegexp);
    expect($successMsg).toBeInTheDocument();

    /**
     * When she clicks on the success message
     */
    fireEvent.click($successMsg);

    /**
     * Then she sees that the message has disappeared
     */
    expect(queryByText(successRegexp)).not.toBeInTheDocument();
  });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

interface SetUpProps {
  historyProps?: HistoryProps;
}

function setUp(props: SetUpProps = {}) {
  const { Ui: ui, ...routers } = renderWithRouter(HomeP, props.historyProps);
  const { Ui, ...apollo } = renderWithApollo(ui);

  return { Ui, ...routers, ...apollo };
}
