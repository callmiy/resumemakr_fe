import React from "react";
import styled, { css } from "styled-components/macro";

export function wrapped<T>(
  Component: React.ComponentClass<T> | React.FunctionComponent<T>
) {
  return function withClassNameInner(props: T) {
    return <Component {...props} />;
  };
}

export const VisuallyHidden = css`
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility  */
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
`;

export const resetVisuallyHidden = css`
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility  */
  position: absolute !important;
  height: initial;
  width: initial;
  overflow: visible;
  clip: initial;
`;

export const openSansMixin = css`
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
`;

export const btnMixin = css`
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

export const NavBtn = styled.div.attrs({
  tabIndex: 0,
  "aria-haspopup": "true"
})`
  ${btnMixin}
  position: relative;
  padding: 0 1em;

  /* &:focus, */
  /* &:active, */
  &:hover1 {
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

export const EpicBtnIcon = styled.i`
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
  vertical-align: middle;
  margin-right: 0.5em;
`;

export const AppMain = styled.div`
  flex: 1;
`;

export const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const AppHeader = styled.div`
  flex-shrink: 0;
  height: 60px;
`;
