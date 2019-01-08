import styled from "styled-components/macro";

import { AppContainer, VisuallyHidden, AppMain } from "../styles/mixins";

export const HomeContainer = styled(AppContainer)`
  position: relative;

  .new {
    position: absolute;
    right: 20px;
    bottom: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border-width: 1px;
    border-color: transparent;
    background: #09f;
    box-shadow: 0 2px 0 #007cce;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 3em;
    font-weight: 600;
    cursor: pointer;
  }
`;

export const InputLabel = styled.label`
  ${VisuallyHidden}
`;

export const HomeMain = styled(AppMain)`
  padding: 0.5em;
`;
