import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { MutationFn } from "react-apollo";

export const currentResumeTitleLocalMutation = gql`
  mutation CurrentResumeTitleLocalMutation($title: String!) {
    currentResumeTitle(title: $title) @client
  }
`;

export default currentResumeTitleLocalMutation;

export interface Variable {
  title: string;
}

type Fn = MutationFn<Variable, Variable>;

export interface CurrentResumeTitleLocalMutationProps {
  setCurrentResumeTitle?: Fn;
}

export const currentResumeTitleLocalMutationGql = <TOwnProps>() =>
  graphql<
    TOwnProps,
    Variable,
    Variable,
    CurrentResumeTitleLocalMutationProps | void
  >(currentResumeTitleLocalMutation, {
    props: props => {
      const mutate = props.mutate as Fn;

      if (!mutate) {
        return undefined;
      }

      return {
        setCurrentResumeTitle: mutate
      };
    }
  });
