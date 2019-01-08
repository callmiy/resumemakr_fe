import { RouteComponentProps } from "react-router-dom";

import { CurrentResumeTitleLocalMutationProps } from "../State/current-resume-title.local.mutation";

import { CreateResumeTitleProps } from "../graphql/create-resume-title.mutation";

import { ResumeTitlesProps } from "../graphql/resume-titles.query";

export interface OwnProps extends RouteComponentProps<{}> {}

export interface Props
  extends CreateResumeTitleProps,
    CurrentResumeTitleLocalMutationProps,
    OwnProps,
    ResumeTitlesProps {}
