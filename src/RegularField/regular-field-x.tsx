import React from "react";
import { FieldProps } from "formik";
import { Input, Form } from "semantic-ui-react";

interface Props<Values> extends FieldProps<Values> {
  label: string | JSX.Element;
  // tslint:disable-next-line:no-any
  comp?: React.ComponentClass<any>;
}

export function RegularField<Values>({
  field,
  label,
  comp: Component = Input
}: Props<Values>) {
  const { value, name } = field;

  return (
    <Form.Field>
      {"string" === typeof label ? (
        <label htmlFor={name}>{label}</label>
      ) : (
        label
      )}

      <Component {...field} value={value || ""} id={field.name} />
    </Form.Field>
  );
}

export default RegularField;
