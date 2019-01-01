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
        email,
        date_of_birth
      },
      skills,
      experiences,
      additionalSkills,
      education,
      hobbies,
      languages
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

            {date_of_birth && (
              <PersonalTitle>
                Phone
                <PersonalText>{date_of_birth}</PersonalText>
              </PersonalTitle>
            )}

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

          {additionalSkills && additionalSkills.length && (
            <Section>
              <TitleLeft>Additional Skills</TitleLeft>

              {additionalSkills.map((s, index) => (
                <span key={index}>{s.description}</span>
              ))}
            </Section>
          )}

          {languages && languages.length && (
            <Section>
              <TitleLeft>Languages</TitleLeft>

              {languages.map((s, index) => (
                <span key={index}>
                  {s.description} [{s.ratingDescription}]
                </span>
              ))}
            </Section>
          )}

          {hobbies && hobbies.length && (
            <Section>
              <TitleLeft>Hobbies</TitleLeft>

              {hobbies.map((s, index) => (
                <span key={index}>{s}</span>
              ))}
            </Section>
          )}
        </Left>

        <Right>
          <Section>
            <TitleRight>Skills</TitleRight>

            {skills.map(({ description, achievements }, index) => (
              <React.Fragment key={index}>
                <Description>{description}</Description>

                <Ul>
                  {achievements.map((achievement, ind) => (
                    <li key={ind}>{achievement}</li>
                  ))}
                </Ul>
              </React.Fragment>
            ))}
          </Section>

          <Section>
            <TitleRight>Experience</TitleRight>

            {experiences.map(
              (
                { position, achievements, from_date, to_date, companyName },
                index
              ) => (
                <div key={index} className="experience-container">
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
              )
            )}
          </Section>

          <Section>
            <TitleRight>Education</TitleRight>

            {education.map(
              ({ course, school, from_date, to_date, achievements }, index) => (
                <div key={index} className="experience-container">
                  <div className="left">
                    {from_date} {(to_date && `-${to_date}`) || ""}
                  </div>

                  <div className="right">
                    <Description className="position">{course}</Description>

                    <div className="company">{school}</div>

                    {achievements && achievements.length && (
                      <Ul>
                        {achievements.map((achievement, ind) => (
                          <li key={ind}>{achievement}</li>
                        ))}
                      </Ul>
                    )}
                  </div>
                </div>
              )
            )}
          </Section>
        </Right>
      </Container>
    );
  }
}

export default Preview;
