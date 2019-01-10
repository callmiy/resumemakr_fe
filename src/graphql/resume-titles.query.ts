import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import { ResumeTitles, ResumeTitlesVariables } from "./apollo-gql";

const resumeTitlesFrag = gql`
  fragment ResumeTitlesFrag on ResumeConnection {
    edges {
      node {
        id
        title
        updatedAt
        __typename
      }
    }
  }
`;

export const resumeTitles = gql`
  query ResumeTitles($howMany: Int!) {
    listResumes(first: $howMany) {
      ...ResumeTitlesFrag
      __typename
    }
  }

  ${resumeTitlesFrag}
`;

export default resumeTitles;

export type ResumeTitlesProps = DataValue<ResumeTitles, ResumeTitlesVariables>;
