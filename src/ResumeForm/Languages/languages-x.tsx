import React from "react";
import { Icon } from "semantic-ui-react";

import { Section } from "../resume-form";
import SectionLabel from "../SectionLabel";

interface Props {
  label: Section;
}

export class Languages extends React.Component<Props, {}> {
  render() {
    const { label } = this.props;

    return (
      <div>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="languages-section"
        />
      </div>
    );
  }
}

export default Languages;
