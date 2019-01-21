import { RouteComponentProps } from "react-router-dom";

import { ResumeDownloadProps } from "../graphql/get-resume.query";

export interface OwnProps extends RouteComponentProps<{ title: string }> {
  mode: Mode;
}

export interface Props extends OwnProps, ResumeDownloadProps {}

export enum Mode {
  download = "download",
  preview = "preview"
}
