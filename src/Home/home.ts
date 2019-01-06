import { RouteComponentProps } from "react-router-dom";

import { CurrentResumeTitleLocalMutationProps } from "../State/current-resume-title.local.mutation";

export interface OwnProps extends RouteComponentProps<{}> {}

export interface Props extends CurrentResumeTitleLocalMutationProps, OwnProps {}
