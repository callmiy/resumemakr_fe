import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import { resumeFullFrag, resumeDownloadFrag } from "./resume_full.fragment";
import {
  GetResume,
  GetResumeVariables,
  ResumeDownload,
  ResumeDownloadVariables
} from "./apollo-gql";

export const getResumeQuery = gql`
  query GetResume($input: GetResumeInput!) {
    getResume(input: $input) {
      ...ResumeFullFrag
    }
  }

  ${resumeFullFrag}
`;

export const resumeDownloadQuery = gql`
  query ResumeDownload($input: GetResumeInput!) {
    getResume(input: $input) {
      ...ResumeDownloadFrag
    }
  }

  ${resumeDownloadFrag}
`;

export type GetResumeProps = DataValue<GetResume, GetResumeVariables>;

export type ResumeDownloadProps = DataValue<
  ResumeDownload,
  ResumeDownloadVariables
>;
