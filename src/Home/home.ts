import { RouteComponentProps } from "react-router-dom";

import { CreateResumeProps } from "../graphql/create-resume.mutation";
import { ResumeTitlesProps } from "../graphql/resume-titles.query";
import { DeleteResumeProps } from "../graphql/delete-resume.mutation";
import { CloneResumeProps } from "../graphql/clone-resume.mutation";

export interface OwnProps extends RouteComponentProps<{}> {}

export interface Props
  extends CreateResumeProps,
    OwnProps,
    ResumeTitlesProps,
    DeleteResumeProps,
    CloneResumeProps {}
