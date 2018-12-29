import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Label, Icon, Segment } from "semantic-ui-react";

import "./resume.scss";
import "./header.scss";
import { FIRST_LEVEL_CLASS, SECOND_LEVEL_CLASS } from "../constants";
import ResumeForm from "../ResumeForm";

interface Props extends RouteComponentProps<{}> {}

export class Resume extends React.Component<Props> {
  render() {
    return (
      <div className={`${FIRST_LEVEL_CLASS} Resume`}>
        <Header />
        <div className={SECOND_LEVEL_CLASS}>
          <div className="side-bar">Side bar</div>

          <div className="main-container">
            <div className="main">
              <PersonalInfo />

              <ResumeForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Resume;

function PersonalInfo() {
  return (
    <Segment raised={true} className="section-heading">
      <Label as="div" ribbon={true} className="segment-label">
        <div className="icon-container">
          <Icon name="user outline" />
        </div>

        <div className="label-text">Personal Information</div>
      </Label>
    </Segment>
  );
}

function Header() {
  return <div className="header">Header</div>;
}
