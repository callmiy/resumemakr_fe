import gql from "graphql-tag";

const ratedFrag = gql`
  fragment RatedFrag on Rated {
    description
    level
  }
`;

export const resumeMinimalFrag = gql`
  fragment ResumeMinimalFrag on Resume {
    id
    title
    description

    additionalSkills {
      ...RatedFrag
    }

    languages {
      ...RatedFrag
    }
  }

  ${ratedFrag}
`;

export default resumeMinimalFrag;
