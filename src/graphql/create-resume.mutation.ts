import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { resumeMinimalFrag } from "./resume_minimal.fragment";
import { CreateResume, CreateResumeVariables } from "./apollo-gql";

export const createResume = gql`
  mutation CreateResume($input: CreateResumeInput!) {
    createResume(input: $input) {
      resume {
        ...ResumeMinimalFrag
      }
    }
  }

  ${resumeMinimalFrag}
`;

export default createResume;

export interface CreateResumeProps {
  createResumeTitle?: MutationFn<CreateResume, CreateResumeVariables>;
}
