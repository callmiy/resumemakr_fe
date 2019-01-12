import gql from "graphql-tag";

const ratedFrag = gql`
  fragment RatedFrag on Rated {
    id
    description
    level
  }
`;

export const resumeMinimalFrag = gql`
  fragment ResumeMinimalFrag on Resume {
    id
    title
    description
    hobbies
    __typename

    additionalSkills {
      ...RatedFrag
      __typename
    }

    languages {
      ...RatedFrag
      __typename
    }
  }

  ${ratedFrag}
`;

export default resumeMinimalFrag;
