import React from "react";

import { FormValues } from "../resume-form";
import {
  Container,
  Left,
  Section,
  NamePos,
  FirstName,
  Profession,
  TitleLeft,
  PersonalTitle,
  PersonalText,
  Img,
  Right,
  TitleRight
} from "./preview-styles";

interface Props {
  values: FormValues;
}

interface State {
  src?: string;
}

export class Preview extends React.Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const {
      values: {
        personalInfo: { photo }
      }
    } = this.props;

    if (!photo) {
      return;
    }

    this.setState({ src: URL.createObjectURL(photo) });
  }

  componentWillUnmount() {
    const { src } = this.state;

    if (!src) {
      return;
    }

    URL.revokeObjectURL(src);
  }

  render() {
    const {
      first_name,
      last_name,
      profession,
      address,
      phone,
      email
    } = this.props.values.personalInfo;

    const { src } = this.state;

    // tslint:disable-next-line:no-console
    console.log(
      "\n\t\tLogging start\n\n\n\n this.props\n",
      this.props.values,
      src,
      "\n\n\n\n\t\tLogging ends\n"
    );

    return (
      <Container data-testid="preview-resume-section">
        <Left>
          <Section>
            <NamePos>
              <FirstName>{first_name}</FirstName>
              <FirstName>{last_name}</FirstName>
            </NamePos>

            <Profession>{profession}</Profession>
          </Section>

          <Section>
            <TitleLeft>Personal Info</TitleLeft>

            <PersonalTitle>
              Address
              {address.split("\n").map((s, k) => (
                <PersonalText key={k}>{s.trim()}</PersonalText>
              ))}
            </PersonalTitle>

            <PersonalTitle>
              Phone
              <PersonalText>{phone}</PersonalText>
            </PersonalTitle>

            <PersonalTitle>
              Email
              <PersonalText>{email}</PersonalText>
            </PersonalTitle>
          </Section>

          {src && (
            <Section>
              <Img src={src} />
            </Section>
          )}

          <Section>
            <TitleLeft>Additional Skills</TitleLeft>
          </Section>
        </Left>

        <Right>
          <Section>
            <TitleRight>Skills Summary</TitleRight>
          </Section>
        </Right>
      </Container>
    );
  }
}

export default Preview;
