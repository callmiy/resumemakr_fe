import styled from "styled-components";

export const Container = styled.div`
  font-family: "Arimo" !important;
  display: flex;
  overflow-wrap: break-word;
  word-break: break-word;
  line-height: normal;
  margin-top: 2rem !important;
  background-color: #ffffff;
  box-shadow: 0 0.5rem 2.5rem 0 rgba(0, 0, 0, 0.25);
  position: relative;
  color: #292b2c;

  .experience-container {
    display: flex;

    .left {
      width: 20%;
    }

    .right {
      flex: 1;
      padding-left: 4rem;
    }

    .company {
      margin-top: -1.2rem;
      margin-bottom: 1.5rem;
    }
  }
`;

const containerDivsPadding = "1.5rem";

const LeftRight = styled.div`
  font-family: "Arimo" !important;
  vertical-align: top;
  padding: ${containerDivsPadding};
`;

export const Left = styled(LeftRight)`
  width: 30%;
  background-color: #373d48;
  color: #fff;
`;

export const Right = styled(LeftRight)`
  flex: 1;
  font-size: 1.8rem;
  line-height: 1.7em;
`;

export const Section = styled.div`
  font-family: "Arimo" !important;
  position: relative;
  padding-top: 1.5rem
  padding-bottom: 1rem;

  &:first-of-type {
    padding-top: 0;
  }
`;

export const NamePos = styled.h1`
  font-family: "Arimo" !important;
  color: #fff;
  margin-top: -0.4rem;
  margin: 0;
  padding: 0;
  line-height: 1.2em;
  font-size: 2.5rem;
  font-weight: 300;
`;

export const FirstName = styled.span`
  font-family: "Arimo" !important;
  font-weight: 500;
  font-style: normal;
  display: block;
`;

export const Profession = styled.div`
  font-family: "Arimo" !important;
  margin: 0;
  padding: 0;
  font-size: 1.8rem;
  font-weight: 200;
  margin-top: 0.7rem;
`;

const TitleH3 = styled.h3`
  font-family: "Arimo" !important;
  font-style: normal;
  font-size: 2.2rem;
  line-height: 1.5em;
  margin-bottom: 1rem;
`;

export const TitleLeft = styled(TitleH3)`
  padding: 0.5rem 1rem;
  z-index: 1;
  white-space: nowrap;
  background-color: #252932;
  vertical-align: middle;
  margin-left: -${containerDivsPadding};
  margin-right: -${containerDivsPadding};
`;

export const TitleRight = styled(TitleH3)`
  padding-bottom: 0.2rem;
  border-top-style: solid;
  border-bottom-style: solid;
  border-top-width: 0.1rem;
  border-bottom-width: 0.1rem;
  border-color: #d5d6d6;
  z-index: 1;
  white-space: nowrap;
`;

export const PersonalTitle = styled.h4`
  font-family: "Arimo" !important;
  font-size: 1.5rem;
  line-height: 1.7em;
  margin: 0 0 0.7em 0 !important;
`;

export const PersonalText = styled.p`
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1.7em !important;
`;

export const Img = styled.img`
  width: 100%;
  max-width: 33rem;
  min-width: 100px;
  max-height: 60rem;
  height: auto;
  background-color: #fff;
  border-color: #fff;
  vertical-align: middle;
  border-style: none;
  src: ${({ src }: { src: string }) => src};
`;

export const Description = styled.div`
  margin-bottom: 1.2rem;
  margin-top: 1.2rem;
  font-weight: 600;
`;

export const Ul = styled.ul`
  li {
    list-style-type: disc;
    margin-left: 2rem;
  }
`;
