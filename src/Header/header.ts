import { UserLocalGqlProps } from "../State/auth.local.query";

export interface OwnProps {
  leftMenuItems?: JSX.Element[];
  rightMenuItems?: JSX.Element[];
}

export interface Props extends OwnProps, UserLocalGqlProps {}
