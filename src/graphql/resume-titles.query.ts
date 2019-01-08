import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import { ResumeTitles, ResumeTitlesVariables } from "./apollo-gql";

const resumeTitlesFrag = gql`
  fragment ResumeTitlesFrag on ResumeConnection {
    edges {
      node {
        id
        title
      }
    }
  }
`;

export const resumeTitles = gql`
  query ResumeTitles($howMany: Int!) {
    resumes(first: $howMany) {
      ...ResumeTitlesFrag
    }
  }

  ${resumeTitlesFrag}
`;

export default resumeTitles;

export type ResumeTitlesProps = DataValue<ResumeTitles, ResumeTitlesVariables>;
