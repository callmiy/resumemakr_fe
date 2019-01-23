import { RouteComponentProps } from "react-router-dom";

import { GetResumeProps } from "../graphql/get-resume.query";

export interface OwnProps
  extends RouteComponentProps<{ title: string }>,
    GetResumeProps {
  mode: Mode;
}

export type Props = OwnProps;

export enum Mode {
  download = "download",
  preview = "preview"
}
