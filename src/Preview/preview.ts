import { RouteComponentProps } from "react-router-dom";

import { GetResumeProps } from "../graphql/get-resume.query";

export interface OwnProps extends RouteComponentProps<{ title: string }> {
  mode: Mode;
}

export interface Props extends OwnProps, GetResumeProps {}

export enum Mode {
  download = "download",
  preview = "preview"
}
