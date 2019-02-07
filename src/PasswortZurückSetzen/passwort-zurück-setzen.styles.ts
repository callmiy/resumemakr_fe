import styled from "styled-components/macro";

import { AppContainer, visuallyHidden } from "../styles/mixins";

export const Behälter = styled(AppContainer)`
  .anfordern {
    height: initial;
    min-height: 0 !important;
  }

  .anfordern__intro {
    color: #000 !important;
    font-weight: bolder !important;
  }

  .anfordern__btn {
    margin-top: 50px !important;
  }

  .berechtigung-karte__intro {
    flex-shrink: 0;
  }

  .email-error {
    margin-top: 5px;
    color: #9f3a38;
  }
`;

export const FormularBereich = styled.div`
  margin: 0 0 1em;

  ${({ istVersteckt }: { istVersteckt: boolean }) =>
    istVersteckt ? visuallyHidden : ""};
`;
