import React from "react";
import { TextArea, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField } from "formik";

import { CircularLabel } from "../styles/mixins";
import RegularField from "../RegularField";
import { FormContext } from "../ResumeForm/resume-form";

interface Props {
  values: string[];
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
  hiddenLabel?: string;
  header?: JSX.Element;
}

export class ListStrings extends React.Component<Props> {
  static contextType = FormContext;
  context!: React.ContextType<typeof FormContext>;

  render() {
    const {
      values,
      fieldName: parentFieldName,
      arrayHelper,
      hiddenLabel,
      header
    } = this.props;

    const { valueChanged } = this.context;

    const valuesLen = values.length;

    return (
      <div>
        {header && header}

        {values.map((value, index) => {
          const fieldName = `${parentFieldName}[${index}]`;
          const index1 = index + 1;

          return (
            <FastField
              key={index}
              name={fieldName}
              label={
                <div className="with-controls list-string-header ">
                  {`# ${index1}`}

                  <div>
                    {valuesLen > 1 && (
                      <CircularLabel
                        color="blue"
                        onClick={function onSwapAchievementsUp() {
                          arrayHelper.swap(index, index1);
                          valueChanged();
                        }}
                      >
                        <Icon name="arrow down" />
                      </CircularLabel>
                    )}

                    {valuesLen > 1 && (
                      <CircularLabel
                        color="red"
                        onClick={function onRemoveAchievement() {
                          arrayHelper.remove(index);
                          valueChanged();
                        }}
                      >
                        <Icon name="remove" />
                      </CircularLabel>
                    )}

                    <CircularLabel
                      color="green"
                      onClick={function onAddAchievement() {
                        arrayHelper.insert(index1, "");
                        valueChanged();
                      }}
                    >
                      <Icon name="add" />
                    </CircularLabel>

                    {index1 > 1 && (
                      <CircularLabel
                        color="blue"
                        onClick={function onSwapAchievementsUp() {
                          arrayHelper.swap(index, index - 1);
                          valueChanged();
                        }}
                      >
                        <Icon name="arrow up" />
                      </CircularLabel>
                    )}
                  </div>

                  <label className="visually-hidden" htmlFor={fieldName}>
                    {hiddenLabel && hiddenLabel}
                  </label>
                </div>
              }
              defaultValue={value}
              comp={TextArea}
              component={RegularField}
            />
          );
        })}
      </div>
    );
  }
}

export default ListStrings;
