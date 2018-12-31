import React from "react";

import { Segment, Label } from "semantic-ui-react";

interface Props extends React.Props<{}> {
  ico: JSX.Element;
  label: string;
}

export function SectionLabel({ children, label, ico }: Props) {
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

export default SectionLabel;
