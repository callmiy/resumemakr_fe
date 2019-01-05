import styled, { css } from "styled-components";
import { Icon } from "semantic-ui-react";

import { Mode } from "./preview";
import { wrapped } from "../styles/mixins";

const PersonalIcon1 = wrapped(Icon);
export const PersonalIcon = styled(PersonalIcon1)`
  margin-right: 10px !important;
`;

interface ContainerProps {
  mode: Mode;
}

export const Container = styled.div`
  font-size: 1rem;
  font-family: "Arimo" !important;
  display: flex;
  overflow-wrap: break-word;
  word-break: break-word;
  line-height: normal;
  background-color: #ffffff;
  box-shadow: 0 0.5em 2.5em 0 rgba(0, 0, 0, 0.25);
  margin-top: 2em !important;

  ${({ mode }: ContainerProps) =>
    mode === Mode.download &&
    css`
      margin-top: 0 !important;
      box-shadow: none;
      min-height: 100%;
      border: 1px solid #d6cdcd;
    `};

  position: relative;
  color: #292b2c;

  .experience-container {
    display: flex;

    .left {
      width: 20%;
    }

    .right {
      flex: 1;
      padding-left: 4em;
    }

    .company {
      margin-top: -1.2em;
      margin-bottom: 1.5em;
    }
  }
`;

const LeftRight = styled.div`
  font-family: "Arimo" !important;
  vertical-align: top;
  padding: 1em;
`;

export const Left = styled(LeftRight)`
  width: 25%;
  background-color: #373d48;
  color: #fff;
`;

export const Right = styled(LeftRight)`
  flex: 1;
  line-height: 1.7em;
`;

export const Section = styled.div`
  font-family: "Arimo" !important;
  position: relative;
  margin-top: 1em;

  &:first-of-type {
    padding-top: 0;
  }
`;

export const NamePos = styled.h1`
  font-family: "Arimo" !important;
  color: #fff;
  margin-top: -0.4em;
  margin: 0;
  padding: 0;
  line-height: 1.2em;
  font-weight: 300;
`;

export const Name = styled.span`
  font-family: "Arimo" !important;
  font-weight: 700;
  font-style: normal;
  display: block;
`;

export const Profession = styled.div`
  font-size: 1.5em;
  font-family: "Arimo" !important;
  margin-top: 0.2em;
`;

const TitleH3 = styled.h3`
  font-family: "Arimo" !important;
  font-style: normal;

  line-height: 1.5em;
  margin-bottom: 1em;
`;

export const TitleLeft = styled(TitleH3)`
  font-size: 1.3em;
  padding: 0.5em 1em;
  z-index: 1;
  white-space: nowrap;
  background-color: #252932;
  vertical-align: middle;
  margin-left: -${10 / 13}em;
  margin-right: -${10 / 13}em;
`;

export const TitleRight = styled(TitleH3)`
  padding-bottom: 0.2em;
  border-top-style: solid;
  border-bottom-style: solid;
  border-top-width: 0.1em;
  border-bottom-width: 0.1em;
  border-color: #d5d6d6;
  z-index: 1;
  white-space: nowrap;
`;

export const PersonalTitle = styled.h4`
  font-family: "Arimo" !important;

  line-height: 1.7em;
  margin: 0 0 0.7em 0 !important;
`;

export const PersonalText = styled.p`
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1.7em !important;

  &:nth-child(2) {
    display: inline-block;
  }
`;

export const Img = styled.div`
  background-image: ${({ backgroundImg }: { backgroundImg: string }) =>
    backgroundImg};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  min-height: 170px;
`;

export const Description = styled.div`
  margin-bottom: 1.2em;
  margin-top: 1.2em;
  font-weight: 600;
`;

export const Ul = styled.ul`
  li {
    list-style-type: disc;
    margin-left: 2em;
  }
`;
