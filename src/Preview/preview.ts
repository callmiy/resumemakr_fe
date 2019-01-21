import { RouteComponentProps } from "react-router-dom";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client";

import {
  GetResume_getResume,
  ResumeDownload_getResume
} from "../graphql/apollo-gql";

export interface OwnProps
  extends RouteComponentProps<{ title: string }>,
    WithApolloClient<{}> {
  mode: Mode;
  resume?: GetResume_getResume | ResumeDownload_getResume;
}

export type Props = OwnProps;

export enum Mode {
  download = "download",
  preview = "preview"
}

export interface State {
  resume?: GetResume_getResume | ResumeDownload_getResume;
  loading?: boolean;
  gqlError?: ApolloError;
  error?: string;
}
