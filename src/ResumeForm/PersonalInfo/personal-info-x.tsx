import React from "react";
import { Icon, Card, TextArea } from "semantic-ui-react";
import { FastField } from "formik";

import { PersonalInfoVal } from "./personal-info";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import PhotoField from "../PhotoField";
import { Section } from "../resume-form";

interface Props {
  values: PersonalInfoVal;
  label: Section;
}

export class PersonalInfo extends React.Component<Props, {}> {
  render() {
    const { label } = this.props;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="user outline" />}
          data-testid="personal-info-section"
        />

        <BioData />

        <FirstColumn />
      </>
    );
  }
}

export default PersonalInfo;

function BioData() {
  return (
    <>
      <Card>
        <Card.Content>
          <div className="names">
            <FastField
              name={makeName("first_name")}
              label="First name"
              component={RegularField}
            />

            <FastField
              name={makeName("last_name")}
              label="Last name"
              component={RegularField}
            />
          </div>

          <FastField
            name={makeName("profession")}
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
          name={makeName("address")}
          label="Address"
          comp={TextArea}
          component={RegularField}
        />

        <FastField name="phone" label="Phone" component={RegularField} />

        <FastField
          name={makeName("email")}
          label="Email"
          type="email"
          component={RegularField}
        />

        <FastField
          name={makeName("date_of_birth")}
          label="Date of birth yyyy-mm-dd"
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(suffix: string) {
  return `personalInfo.${suffix}`;
}
