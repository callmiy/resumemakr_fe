import React from "react";
import { Button, Card, Input, Form } from "semantic-ui-react";
import { Formik, FastField, FieldProps } from "formik";

import "./resume-form.scss";
import { FormValues } from "./resume-form";
import PhotoField from "../PhotoField";

export class ResumeForm extends React.Component {
  render() {
    return (
      <div className="ResumeForm">
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            profession: "",
            photo: null
          }}
          onSubmit={() => null}
          render={this.renderForm}
          // validationSchema={ValidationSchema}
          validateOnChange={false}
        />
      </div>
    );
  }

  private renderForm = () => {
    return (
      <Form>
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

        <Button type="submit" name="resume-form-submit">
          Submit
        </Button>
      </Form>
    );
  };
}

export default ResumeForm;

function RegularField({
  field,
  label
}: { label: string } & FieldProps<FormValues>) {
  return (
    <Form.Field>
      <label htmlFor={field.name}>{label}</label>

      <Input {...field} />
    </Form.Field>
  );
}
