import React from "react";
import { RouteComponentProps } from "react-router-dom";

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
              <ResumeForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Resume;

function Header() {
  return <div className="resume-header">Header</div>;
}
