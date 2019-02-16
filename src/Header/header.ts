import { RouteComponentProps } from "react-router-dom";

import { UserLocalGqlProps } from "../State/auth.local.query";
import { UserLocalMutationProps } from "../State/user.local.mutation";
import { AuthPathMatch } from "../routing";

export interface OwnProps extends RouteComponentProps<AuthPathMatch> {
  leftMenuItems?: JSX.Element[];
  rightMenuItems?: JSX.Element[];
}

export interface Props
  extends OwnProps,
    UserLocalGqlProps,
    UserLocalMutationProps {}
