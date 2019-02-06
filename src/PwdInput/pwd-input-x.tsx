import React from "react";
import { FieldProps } from "formik";
import { Form, Input, Icon } from "semantic-ui-react";
import "styled-components/macro";
import { Link } from "react-router-dom";

import { createResetRoute } from "../routing";

type PwdType = "password" | "text";

interface State {
  pwdType: PwdType;
}

interface Props<TFormValues> extends FieldProps<TFormValues> {
  pwdType?: PwdType;
  onToggle: (type: PwdType) => void;
}

export class PwdInput<T> extends React.PureComponent<Props<T>, State> {
  state: State = { pwdType: "password" };

  render() {
    const { field } = this.props;
    const { pwdType } = this.state;
    const id = makeId(field.name);

    return (
      <Form.Field>
        <label
          htmlFor={id}
          css={`
            display: flex !important;
            justify-content: space-between;
          `}
        >
          <span>Passwort</span>

          <Link to={createResetRoute()}>Passwort Vergessen?</Link>
        </label>

        <Input icon={true} placeholder="" data-testid={id}>
          <input {...field} type={pwdType} autoComplete="off" id={id} />

          {pwdType === "password" && field.value && (
            <Icon
              name="eye"
              className="link"
              data-testid="password-unmask"
              onClick={() => this.setState({ pwdType: "text" })}
            />
          )}

          {pwdType === "text" && field.value && (
            <Icon
              name="eye slash"
              className="link"
              data-testid="password-mask"
              onClick={() => this.setState({ pwdType: "password" })}
            />
          )}
        </Input>
      </Form.Field>
    );
  }
}

export default PwdInput;

export function makeId(name: string) {
  return `pwd-input-${name}`;
}
