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
  TitleRight,
  Description,
  Ul
} from "./preview-styles";

import { SkillVal } from "../Skills/skills";
import { ExperienceVal } from "../Experiences/experiences";

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
      personalInfo: {
        first_name,
        last_name,
        profession,
        address,
        phone,
        email
      },
      skills,
      experiences
    } = this.props.values;

    const { src } = this.state;

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
              <Img src={src} alt={`${first_name} ${last_name} photo`} />
            </Section>
          )}

          <Section>
            <TitleLeft>Additional Skills</TitleLeft>
          </Section>
        </Left>

        <Right>
          <Section>
            <TitleRight>Skills</TitleRight>

            {skills.map((skill, index) => (
              <Skill key={index} skill={skill} index={index} />
            ))}
          </Section>

          <Section>
            <TitleRight>Experience</TitleRight>

            {experiences.map((exp, index) => (
              <Experience key={index} exp={exp} index={index} />
            ))}
          </Section>
        </Right>
      </Container>
    );
  }
}

export default Preview;

function Skill({
  skill: { description, achievements },
  index
}: {
  skill: SkillVal;
  index: number;
}) {
  return (
    <>
      <Description>{description}</Description>

      <Ul>
        {achievements.map((achievement, ind) => (
          <li key={ind}>{achievement}</li>
        ))}
      </Ul>
    </>
  );
}

function Experience({
  exp: { position, achievements, from_date, to_date, companyName },
  index
}: {
  exp: ExperienceVal;
  index: number;
}) {
  return (
    <div className="experience-container">
      <div className="left">
        {from_date} {(to_date && `-${to_date}`) || ""}
      </div>

      <div className="right">
        <Description className="position">{position}</Description>

        <div className="company">{companyName}</div>

        <Ul>
          {achievements.map((achievement, ind) => (
            <li key={ind}>{achievement}</li>
          ))}
        </Ul>
      </div>
    </div>
  );
}
