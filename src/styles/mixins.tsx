import React from "react";
import styled, { css } from "styled-components/macro";
import { Modal, ModalProps } from "semantic-ui-react";

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
    color 0.4s ease-in-out, box-shadow 0.4s ease-in-out !important;
  text-align: center !important;
  display: inline-block !important;
  white-space: nowrap !important;
  vertical-align: middle !important;
  touch-action: manipulation !important;
  cursor: pointer !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  background-image: none !important;
  text-decoration: none !important;
  font-weight: 400 !important;
  border-style: solid !important;
  border-radius: 3px !important;
  font-size: 1.5rem !important;
  line-height: 36px !important;
`;

export const ToolTip = styled.span`
  ${VisuallyHidden}
  color: #ffffff;
`;

export const navBtn = css`
  ${btnMixin}
  position: relative !important;
  padding: 0 1em !important;

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

export const NavBtn = styled.div.attrs({
  tabIndex: 0,
  "aria-haspopup": "true"
})`
  ${navBtn}
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
  width: 1180px;
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

export const appBgColor = "#f4f4f4";

export const AppContainer = styled.div`
  background-color: ${appBgColor};
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

const Modal1 = wrapped<ModalProps>(Modal);

export const AppModal = styled(Modal1)`
  &.ui.modal {
    width: 90%;
    font-size: 1.6rem;
    max-width: 500px;

    & > .header {
      ${openSansMixin};
      font-size: 1.8rem;
      font-weight: 500;
      min-height: 70px;
      padding: 0em 1.5rem !important;
      background: #323942;
      color: #fff;
      line-height: 70px;
    }

    .ui.button {
      font-size: 1.5rem;
    }
  }
`;
