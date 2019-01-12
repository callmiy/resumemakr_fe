import gql from "graphql-tag";

import { resumeMinimalFrag } from "./resume_minimal.fragment";

export const resumeFullFrag = gql`
  fragment ResumeFullFrag on Resume {
    ...ResumeMinimalFrag

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
      achievements
      companyName
      fromDate
      position
      toDate
      __typename
    }

    skills {
      id
      description
      achievements
      __typename
    }

    education {
      id
      course
      fromDate
      toDate
      school
      achievements
      __typename
    }
  }

  ${resumeMinimalFrag}
`;

export default resumeFullFrag;
