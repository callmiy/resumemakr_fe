import React from "react";
import { Form } from "semantic-ui-react";
import { Formik, FormikProps } from "formik";

import "./resume-form.scss";
import { FormValues, initialFormValues, validationSchema } from "./resume-form";
import { noOp } from "../utils";
import {
  PreViewButton,
  PreViewButtonIcon,
  EditBtn,
  ToolTip,
  LeftArrow,
  ActionContainer
} from "./resume-form-styles";
import Preview from "./Preview";
import PersonalInfo from "./PersonalInfo";
import Experiences from "./Experiences";

enum Action {
  editing = "editing",
  previewing = "previewing"
}

enum Section {
  personalInfo,
  experiences
}

interface State {
  action: Action;
  section: Section;
}

interface Props {
  onPreview: (values: FormValues) => void;
  initialValues?: FormValues;
}

export class ResumeForm extends React.Component<Props, State> {
  state: State = {
    action: Action.editing,
    section: Section.personalInfo
  };

  render() {
    return (
      <div className="ResumeForm">
        <Formik
          initialValues={this.props.initialValues || initialFormValues}
          onSubmit={noOp}
          render={this.renderForm}
          validationSchema={validationSchema}
          validateOnChange={false}
        />
      </div>
    );
  }

  private renderForm = ({ values, ...props }: FormikProps<FormValues>) => {
    const { action, section } = this.state;

    return (
      <Form>
        {action === Action.editing && section === Section.personalInfo && (
          <PersonalInfo values={values.personalInfo} />
        )}

        {action === Action.editing && section === Section.experiences && (
          <Experiences values={values.experiences} />
        )}

        {action === Action.previewing && <Preview values={values} />}

        <ActionContainer>
          {action === Action.previewing && (
            <EditBtn onClick={() => this.setState({ action: Action.editing })}>
              <ToolTip>Want to edit your resume?</ToolTip>
              <LeftArrow />
              <span>Back to Editor</span>
            </EditBtn>
          )}

          {action === Action.editing && (
            <PreViewButton
              onClick={() => {
                this.setState({ action: Action.previewing });
              }}
            >
              <PreViewButtonIcon />
              <span>Preview</span>
            </PreViewButton>
          )}
        </ActionContainer>
      </Form>
    );
  };
}

export default ResumeForm;
