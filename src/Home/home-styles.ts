import styled from "styled-components/macro";
import { lighten } from "polished";

import {
  AppContainer,
  visuallyHidden,
  AppMain,
  appBgColor
} from "../styles/mixins";

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
  ${visuallyHidden}
`;

export const HomeMain = styled(AppMain)`
  font-size: 1.4em;
  padding: 10px;
`;

const bgColor = lighten(0.026, appBgColor);

export const Titles = styled.div`
  max-width: 800px;
  background: #ffffff;

  & > .header {
    background-color: ${bgColor};
    padding: 10px 10px 20px 10px;
    font-size: 1.3em;
    font-weight: 700;
  }

  .ui.grid {
    & > .row {
      padding: 10px;
      border-bottom: 1px solid ${appBgColor};

      &:first-child {
        padding-top: 20px;
        border-bottom: none;
      }

      &:last-child {
        border-bottom: none;
      }

      &.row-header {
        background-color: ${bgColor};
        margin-top: 20px;
        margin-left: 10px;
        margin-right: 10px;
        text-transform: uppercase;
        color: blue;
        font-weight: 600;
        font-size: 0.8em;

        & > .title {
          padding-left: 0;
        }
      }

      & > .controls {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .clickable {
    cursor: pointer;
  }

  .ui.circular.label {
    min-width: 1.5em;
    min-height: 1.5em;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;

    .icon {
      margin: 0 0 2.8px 1px !important;
      opacity: 1;
      font-size: 0.8em;
    }
  }
`;

export const CtrlLabelText = styled.span`
  ${visuallyHidden}
`;

export const DeleteResumeSuccess = styled.div`
  font-size: 0.7em;
  font-weight: 400;
  margin-top: 10px;
  margin-bottom: -15px;

  & > div {
    border: 1px solid #1e99ff;
    display: inline-block;
    padding-right: 10px;
  }

  .ui.horizontal.label {
    background-color: #1e99ff !important;
    border-color: #1e99ff !important;
  }
`;
