import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps<{}> {}

export class Resume extends React.Component<Props> {
  render() {
    return <div>CV</div>;
  }
}

export default Resume;
