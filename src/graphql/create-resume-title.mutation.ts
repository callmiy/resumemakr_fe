import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { resumeMinimalFrag } from "./resume_minimal.fragment";
import { CreateResumeTitle, CreateResumeTitleVariables } from "./apollo-gql";

export const createResumeTitle = gql`
  mutation CreateResumeTitle($resume: ResumeInput!) {
    resume(resume: $resume) {
      ...ResumeMinimalFrag
    }
  }

  ${resumeMinimalFrag}
`;

export default createResumeTitle;

export interface CreateResumeTitleProps {
  createResumeTitle?: MutationFn<CreateResumeTitle, CreateResumeTitleVariables>;
}
