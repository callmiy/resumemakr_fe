import React from "react";
import { RouteComponentProps } from "react-router-dom";

import "./resume.scss";
import "./header.scss";
import { FIRST_LEVEL_CLASS, SECOND_LEVEL_CLASS } from "../constants";
import ResumeForm from "../ResumeForm";
import { FormValues } from "../ResumeForm/resume-form";

interface Props extends RouteComponentProps<{}> {}

enum Action {
  EDITING = "EDITING",
  PREVIEWING = "PREVIEWING"
}

interface State {
  action: Action;
  values?: FormValues;
}

export class Resume extends React.Component<Props, State> {
  state: State = {
    action: Action.EDITING
  };

  render() {
    const { action, values } = this.state;

    return (
      <div className={`${FIRST_LEVEL_CLASS} Resume`}>
        <Header />
        <div className={SECOND_LEVEL_CLASS}>
          <div className="side-bar">Side bar</div>

          <div className="main-container">
            <div className="main">
              {action === Action.EDITING && (
                <ResumeForm initialValues={values} />
              )}
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
