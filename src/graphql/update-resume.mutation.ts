import gql from "graphql-tag";
import { MutationFn, graphql } from "react-apollo";

import { resumeMinimalFrag } from "./resume_minimal.fragment";
import { UpdateResume, UpdateResumeVariables } from "./apollo-gql";

export const updateResume = gql`
  mutation UpdateResume($input: UpdateResumeInput!) {
    updateResume(input: $input) {
      resume {
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
    }
  }

  ${resumeMinimalFrag}
`;

export default updateResume;

export interface UpdateResumeProps {
  updateResume?: MutationFn<UpdateResume, UpdateResumeVariables>;
}

export const updateResumeGql = graphql<
  {},
  UpdateResume,
  UpdateResumeVariables,
  UpdateResumeProps | void
>(updateResume, {
  props: ({ mutate }) => {
    if (!mutate) {
      return undefined;
    }

    return {
      updateResume: mutate
    };
  }
});
