import React from "react";
import {
  Card,
  Input,
  Form,
  TextArea,
  Label,
  Icon,
  Segment
} from "semantic-ui-react";
import {
  Formik,
  FastField,
  FieldProps,
  FormikProps,
  FieldArray,
  FieldArrayRenderProps
  // FormikActions
} from "formik";

import "./resume-form.scss";
import {
  FormValues,
  initialFormValues,
  Experience,
  emptyExperience,
  validationSchema
} from "./resume-form";
import PhotoField from "../PhotoField";
import { noOp } from "../utils";
import {
  PreViewButton,
  PreViewButtonIcon,
  EditBtn,
  ToolTip,
  LeftArrow,
  ActionContainer
} from "./resume-form-styles";

enum Action {
  editing = "editing",
  previewing = "previewing"
}

interface State {
  action: Action;
}

interface Props {
  onPreview: (values: FormValues) => void;
  initialValues?: FormValues;
}

export class ResumeForm extends React.Component<Props, State> {
  state: State = { action: Action.editing };

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
    const { action } = this.state;

    return (
      <Form>
        {action === Action.editing && <Edit values={values} />}

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

interface EditProps {
  values: FormValues;
}

function Edit({ values }: EditProps) {
  return (
    <>
      <SectionLabel
        label="Personal Information"
        ico={<Icon name="user outline" />}
      />
      <BioData />

      <FirstColumn />

      <SectionLabel label="Experience" ico={<Icon name="won" />} />

      <FieldArray
        name="experiences"
        render={arrayHelper =>
          values.experiences.map((exp, index) => (
            <Company
              key={index}
              index={index}
              exp={exp}
              arrayHelper={arrayHelper}
            />
          ))
        }
      />
    </>
  );
}

interface RegularFieldProps extends FieldProps<FormValues> {
  label: string | JSX.Element;
  // tslint:disable-next-line:no-any
  comp?: React.ComponentClass<any>;
}

function RegularField({
  field,
  label,
  comp: Component = Input
}: RegularFieldProps) {
  return (
    <Form.Field>
      {"string" === typeof label ? (
        <label htmlFor={field.name}>{label}</label>
      ) : (
        label
      )}

      <Component {...field} id={field.name} />
    </Form.Field>
  );
}

function BioData() {
  return (
    <>
      <Card>
        <Card.Content>
          <div className="names">
            <FastField
              name="first_name"
              label="First name"
              component={RegularField}
            />

            <FastField
              name="last_name"
              label="Last name"
              component={RegularField}
            />
          </div>

          <FastField
            name="profession"
            label="Profession"
            component={RegularField}
          />
        </Card.Content>
      </Card>

      <FastField name="photo" component={PhotoField} />
    </>
  );
}

function FirstColumn() {
  return (
    <Card>
      <Card.Content>
        <Card.Header>1st column</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name="address"
          label="Address"
          comp={TextArea}
          component={RegularField}
        />

        <FastField name="phone" label="Phone" component={RegularField} />

        <FastField
          name="email"
          label="Email"
          type="email"
          component={RegularField}
        />

        <FastField
          name="date_of_birth"
          label="Date of birth yyyy-mm-dd"
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

interface CompanyProps {
  index: number;
  exp?: Experience;
  arrayHelper: FieldArrayRenderProps;
}

function Company({
  index,
  exp = { ...emptyExperience },
  arrayHelper
}: CompanyProps) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>Company #{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeExpFieldName(index, "line1")}
          label="Line 1 (e.g. position)"
          defaultValue={exp.line1}
          component={RegularField}
        />

        <FastField
          name={makeExpFieldName(index, "line2")}
          label="Line 2 (e.g. company, department)"
          defaultValue={exp.line2}
          component={RegularField}
        />

        <FastField
          name={makeExpFieldName(index, "from_date")}
          label="Date from"
          defaultValue={exp.from_date}
          component={RegularField}
        />

        <FastField
          name={makeExpFieldName(index, "to_date")}
          label="Date to (optional)"
          defaultValue={exp.to_date}
          component={RegularField}
        />

        <FieldArray
          name={makeExpFieldName(index, "texts")}
          render={helper => (
            <div>
              <div>Experiences</div>

              {exp.texts.map((text, ind) => (
                <ExperienceText
                  key={ind}
                  text={text}
                  textIndex={ind}
                  expFieldName={makeExpFieldName(index, "texts")}
                  arrayHelper={helper}
                />
              ))}
            </div>
          )}
        />
      </Card.Content>
    </Card>
  );
}

interface ExperienceTextProps {
  textIndex: number;
  text: string;
  expFieldName: string;
  arrayHelper: FieldArrayRenderProps;
}

function ExperienceText({
  textIndex,
  text,
  expFieldName
}: ExperienceTextProps) {
  const fieldName = `${expFieldName}[${textIndex}]`;
  return (
    <FastField
      name={fieldName}
      label={
        <div>
          {`# ${textIndex + 1}`}

          <label className="visually-hidden" htmlFor={fieldName}>
            Experience {textIndex + 1} text
          </label>
        </div>
      }
      defaultValue={text}
      comp={TextArea}
      component={RegularField}
    />
  );
}

interface SectionLabelProps extends React.Props<{}> {
  ico: JSX.Element;
  label: string;
}

function SectionLabel({ children, label, ico }: SectionLabelProps) {
  return (
    <Segment raised={true} className="section-heading">
      <Label as="div" ribbon={true} className="segment-label">
        <div className="icon-container">{ico}</div>

        <div className="label-text">{label}</div>
      </Label>

      {children}
    </Segment>
  );
}

function makeExpFieldName(index: number, key: keyof Experience) {
  return `experiences[${index}].${key}`;
}
