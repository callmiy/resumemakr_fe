import styled from "styled-components/macro";

import { AppContainer, visuallyHidden } from "../styles/mixins";

export const Behälter = styled(AppContainer)``;

export const FormularBereich = styled.div`
  margin: 0 0 1em;

  ${({ istVersteckt }: { istVersteckt: boolean }) =>
    istVersteckt ? visuallyHidden : ""}
`;
