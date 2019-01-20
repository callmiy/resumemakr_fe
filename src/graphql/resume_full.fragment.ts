import gql from "graphql-tag";

const ratedFrag = gql`
  fragment RatedFrag on Rated {
    id
    description
    level
    index
  }
`;

export const resumeFullFrag = gql`
  fragment ResumeFullFrag on Resume {
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

    personalInfo {
      id
      address
      dateOfBirth
      email
      firstName
      lastName
      phone
      photo
      profession
      __typename
    }

    experiences {
      id
      index
      achievements
      companyName
      fromDate
      position
      toDate
      __typename
    }

    skills {
      id
      index
      description
      achievements
      __typename
    }

    education {
      id
      index
      course
      fromDate
      toDate
      school
      achievements
      __typename
    }
  }

  ${ratedFrag}
`;

export default resumeFullFrag;
