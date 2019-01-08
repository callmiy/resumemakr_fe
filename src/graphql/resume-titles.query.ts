import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import { ResumeTitles } from "./apollo-gql";

const resumeTitlesFrag = gql`
  fragment ResumeTitlesFrag on ResumeConnection {
    edges {
      node {
        id
        _id
        title
      }
    }
  }
`;

export const resumeTitles = gql`
  query ResumeTitles {
    resumes {
      ...ResumeTitlesFrag
    }
  }

  ${resumeTitlesFrag}
`;

export default resumeTitles;

export type ResumeTitlesProps = DataValue<ResumeTitles>;
