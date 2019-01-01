import { css } from "styled-components";

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
