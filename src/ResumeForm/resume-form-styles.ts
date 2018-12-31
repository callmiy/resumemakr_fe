import styled, { css } from "styled-components";

import { VisuallyHidden, resetVisuallyHidden } from "../styles/mixins";

const btnMixin = css`
  transition: background 0.4s ease-in-out, border-color 0.4s ease-in-out,
    color 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  text-align: center;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  text-decoration: none;
  font-weight: 400;
  border-style: solid;
  border-radius: 3px;
  font-size: 1.5rem;
  line-height: 36px;
`;

export const ToolTip = styled.span`
  ${VisuallyHidden}
  color: #ffffff;
`;

const NavBtn = styled.div.attrs({
  tabIndex: 0,
  "aria-haspopup": "true"
})`
  ${btnMixin}
  position: relative;

  /* &:focus, */
  &:hover,
  &:active {
    ${ToolTip} {
      ${btnMixin}
      vertical-align: middle;
      left: 50%;
      top: -54px;
      transform: translateX(-50%);
      font-size: 1.2rem;
      background: #09f;
      line-height: 1.5rem;
      padding: 12px;
      border-radius: 4px;
      ${resetVisuallyHidden}

      &:before {
        position: absolute;
        left: 50%;
        bottom: -7px;
        margin-left: -10px;
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 0 10px;
        border-color: #09f transparent transparent transparent;
      }
    }
  }
`;

export const PreviewBtn = styled(NavBtn)`
  padding: 0 1em;
  color: #09f !important;
  border-width: 2px;
  background: #f4f4f4;
  border-color: currentColor;
`;

export const NextBtn = styled(NavBtn)`
  box-shadow: 0 2px 0 #007cce;
  margin-left: 10px;
  border-width: 2px 2px 0 2px;
  margin-bottom: 2px;
  padding: 0 1em;
  color: #fff !important;
  background: #09f;
  border-color: transparent;
`;

export const EditBtn = styled(NavBtn)`
  box-shadow: 0 2px 0 #d75c57;
  border-width: 2px 2px 0 2px;
  margin-bottom: 2px;
  padding: 0 1em;
  color: #fff !important;
  background: #ff6d67;
  border-radius: 3px;
  border-color: transparent;
  margin-left: 10px;
`;

const eoIconMixin = css`
  font-family: "epic-outlines" !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-variant: normal !important;
  text-transform: none !important;
  speak: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
`;

const BtnIcon = styled.i`
  ${eoIconMixin}
  vertical-align: middle;
`;

export const PreviewBtnIcon = styled(BtnIcon)`
  margin-right: 0.5em;

  &:before {
    content: "\\e28f";
  }
`;

export const PrevBtnIcon = styled(BtnIcon)`
  margin-right: 0.5em;

  &:before {
    content: "\\e195";
  }
`;

export const NextBtnIcon = styled(BtnIcon)`
  margin-left: 0.5em;

  &:before {
    content: "\\e270";
  }
`;

export const BottomNavs = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 10px;
  z-index: 1000;
`;
