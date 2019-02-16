import { RouteComponentProps } from "react-router-dom";
import styled from "styled-components/macro";

import { AuthPathMatch } from "../routing";
import { AppContainer } from "../styles/mixins";

export interface Merkmale extends RouteComponentProps<AuthPathMatch> {
  // tslint:disable-next-line: no-any
  component: React.LazyExoticComponent<any>;
}

export interface FlipProps {
  flipClassName: string;
}

//////////////////////// STYLES  ////////////////////////

export const timeout = 1;
const animationTimeoutMilli = "600ms";

export const Flipper = styled.div`
  &.flip-appear {
    transform: rotateY(0deg);
  }

  &.flip-enter-done {
    transform: rotateY(180deg);
    transition: ${animationTimeoutMilli};
    transform-style: preserve-3d;
  }

  .front,
  .back {
    /* hide back of pane during swap */
    backface-visibility: hidden;

    &.animating {
      transform: rotateY(180deg);
    }
  }
`;

export const Container = styled(AppContainer)`
  .flip-container {
    perspective: 1000px;
  }
`;
