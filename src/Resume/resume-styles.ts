import styled from "styled-components/macro";
import { Menu } from "semantic-ui-react";

import { AppContainer, wrapped, navBtn, AppMain } from "../styles/mixins";

const DownloadBtnWrapped = wrapped(Menu.Item);

export const DownloadBtn = styled(DownloadBtnWrapped)`
  ${navBtn}
  color: #09f !important;
  background: #f4f4f4 !important;
  border-color: currentColor !important;
  border-width: 2px !important;
  line-height: 24px !important;
`;

export const Container = styled(AppContainer)`
  ${AppMain} {
    display: flex;
  }

  .side-bar {
    min-height: 100%;
    width: 45px;
    min-width: 45px;
    background: #2e353e;
    color: #fff;
    font-size: 1.2rem;
    margin-right: 20px;
  }

  .main-container {
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    min-height: 100%;

    &.preview {
      max-width: 900px;
      margin: 0 auto;
    }
  }

  .main {
    padding: 10px;
    max-width: 800px;
    margin: auto;
  }

  .segment-label {
    position: relative;
    background-color: #0099ff !important;
    border-color: #0099ff !important;
    font-size: 1.3em;

    .icon-container {
      width: 60px;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 15px;
      left: 0;
      top: 0;
      bottom: 0;
      background-color: darken($color: #0099ff, $amount: 10);
    }

    .label-text {
      padding-left: 65px;
      display: inline-block;
    }
  }
`;
