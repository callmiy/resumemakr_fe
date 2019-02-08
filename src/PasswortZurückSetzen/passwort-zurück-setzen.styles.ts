import styled from "styled-components/macro";

import {
  AppContainer,
  berechtigungBreiteCss,
  visuallyHidden
} from "../styles/mixins";

export const anfordernFormularZeit = 500;
export const anfordernNachrichtZeit = 500;

export const Behalter = styled(AppContainer)`
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

  .pzs__anfordern-formular--animate-exit {
    transform: translateX(0);
  }

  .pzs__anfordern-formular--animate-exit-active {
    transform: translateX(-100%);
    transition: all ${anfordernFormularZeit}ms;
  }

  .pzs__anfordern-nachricht {
    ${berechtigungBreiteCss}
    position: relative;
  }

  .pzs__anfordern-nachricht--animate-enter,
  .pzs__anfordern-nachricht--animate-appear {
    transform: translateX(100%);
  }

  .pzs__anfordern-nachricht--animate-enter-active {
    transform: translateX(0);
    transition: all ${anfordernNachrichtZeit}ms;
  }

  .pzs__anfordern-nachricht--animate-exit {
  }

  .pzs__anfordern-nachricht--animate-exit-active {
    transition: all 500ms;
  }

  .pzs__anfordern-nachricht__zu-einloggin {
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
  }

  .pzs__anfordern-etikett {
    ${visuallyHidden}
  }
`;

export const FormularBereich = styled.div`
  margin: 0 0 1em;

  ${({ istVersteckt }: { istVersteckt: boolean }) =>
    istVersteckt ? visuallyHidden : ""};
`;
