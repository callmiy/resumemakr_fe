import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Section } from "../resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { Hobby, defaultVal } from "./hobbies";

interface Props {
  label: Section;
  values?: Hobby[];
}

export class Hobbies extends React.Component<Props, {}> {
  render() {
    const { label, values = [] } = this.props;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="hobbies-section"
        />

        <FieldArray
          name="hobbies"
          render={arrayHelper =>
            values.map((hobby, index) => (
              <Hob
                key={index}
                index={index}
                hobby={hobby}
                arrayHelper={arrayHelper}
              />
            ))
          }
        />
      </>
    );
  }
}

export default Hobbies;

interface HobbyProps {
  index: number;
  hobby?: Hobby;
  arrayHelper: FieldArrayRenderProps;
}

function Hob({ index, hobby = defaultVal, arrayHelper }: HobbyProps) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>#{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index)}
          label="Description (e.g. hiking)"
          defaultValue={hobby}
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(index: number) {
  return `hobbies[${index}]`;
}
