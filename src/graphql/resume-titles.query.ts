import gql from "graphql-tag";

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

export const getResumeTitles = gql`
  query GetResumeTitles {
    resumes {
      ...ResumeTitlesFrag
    }
  }

  ${resumeTitlesFrag}
`;

export default getResumeTitles;
