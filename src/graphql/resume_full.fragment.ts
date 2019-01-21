import gql from "graphql-tag";

const ratedFrag = gql`
  fragment RatedFrag on Rated {
    id
    description
    level
    index
    __typename
  }
`;

const personalInfoFrag = gql`
  fragment PersonalInfoFrag on PersonalInfo {
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
`;

const experienceFrag = gql`
  fragment ExperienceFrag on Experience {
    id
    index
    achievements
    companyName
    fromDate
    position
    toDate
    __typename
  }
`;

const educationFrag = gql`
  fragment EducationFrag on Education {
    id
    index
    course
    fromDate
    toDate
    school
    achievements
    __typename
  }
`;

const skillFrag = gql`
  fragment SkillFrag on Skill {
    id
    index
    description
    achievements
    __typename
  }
`;

const resumeMiniFrag = gql`
  fragment ResumeMiniFrag on Resume {
    id
    title
    description
    hobbies
    __typename
  }
`;

export const resumeFullFrag = gql`
  fragment ResumeFullFrag on Resume {
    ...ResumeMiniFrag

    additionalSkills {
      ...RatedFrag
    }

    languages {
      ...RatedFrag
    }

    personalInfo {
      ...PersonalInfoFrag
    }

    experiences {
      ...ExperienceFrag
    }

    skills {
      ...SkillFrag
    }

    education {
      ...EducationFrag
    }
  }

  ${ratedFrag}
  ${personalInfoFrag}
  ${experienceFrag}
  ${educationFrag}
  ${skillFrag}
  ${resumeMiniFrag}
`;

export default resumeFullFrag;

export const resumeDownloadFrag = gql`
  fragment ResumeDownloadFrag on Resume {
    ...ResumeMiniFrag

    additionalSkills {
      ...RatedFrag
    }

    languages {
      ...RatedFrag
    }

    personalInfo {
      id
      address
      dateOfBirth
      email
      firstName
      lastName
      phone
      encodedPhoto
      profession
      __typename
    }

    experiences {
      ...ExperienceFrag
    }

    skills {
      ...SkillFrag
    }

    education {
      ...EducationFrag
    }
  }

  ${ratedFrag}
  ${experienceFrag}
  ${educationFrag}
  ${skillFrag}
  ${resumeMiniFrag}
`;
