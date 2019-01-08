import styled from "styled-components/macro";

export const Container = styled.div`
  flex-shrink: 0;
  background: #fff;

  & > .ui.secondary.menu {
    max-width: 1180px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.01);
    margin-left: auto;
    margin-right: auto;

    .logo {
      background: url(/android-icon-36x36.png) no-repeat 0 !important;
      background-size: 36px 36px !important;
      height: 48px;
      overflow: hidden;
      text-align: left;
      text-indent: -119988px;
      text-transform: capitalize;
      width: 36px;
    }
  }
`;
