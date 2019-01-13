import React from "react";
import { Form } from "semantic-ui-react";
import { Cancelable } from "lodash";
import lodashDebounce from "lodash/debounce";
import lodashIsEqual from "lodash/isEqual";
import lodashIsEmpty from "lodash/isEmpty";
import update from "immutability-helper";

import {
  FormValues,
  Section,
  toSection,
  sectionsList,
  lastSectionIndex,
  Props
} from "./resume-form";

import {
  PreviewBtn,
  PreviewBtnIcon,
  EditBtn,
  PrevBtnIcon,
  BottomNavs,
  NextBtn,
  NextBtnIcon,
  Container
} from "./resume-form-styles";

import { ToolTip } from "../styles/mixins";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import PersonalInfo from "../PersonalInfo";
import Experiences from "../Experiences";
import Education from "../Education";
import AdditionalSkills from "../AdditionalSkills";
import Languages from "../Languages";
import Hobbies from "../Hobbies";
import Skills from "../Skills";
import Loading from "../Loading";
import { ALREADY_UPLOADED } from "../constants";
import { UpdateResumeInput } from "../graphql/apollo-gql";

enum Action {
  editing = "editing",
  previewing = "previewing"
}

interface State {
  action: Action;
  section: Section;
}

let valuesTracker: FormValues | null = null;

let debounceUpdateResume: (ResumeForm["updateResume"] & Cancelable) | undefined;

export class ResumeForm extends React.Component<Props, State> {
  state: State = {
    action: Action.editing,
    section: Section.personalInfo
  };

  constructor(props: Props) {
    super(props);

    debounceUpdateResume = lodashDebounce<ResumeForm["updateResume"]>(
      this.updateResume,
      500
    );
  }

  componentDidMount() {
    valuesTracker = this.props.values;
  }

  componentWillMount() {
    if (debounceUpdateResume) {
      debounceUpdateResume.cancel();
    }
  }

  componentDidUpdate() {
    if (debounceUpdateResume) {
      debounceUpdateResume();
    }
  }

  render() {
    const { loading, error: graphQlLoadingError, values } = this.props;

    if (!lodashIsEmpty(graphQlLoadingError)) {
      return <div>{JSON.stringify(graphQlLoadingError)}</div>;
    }

    const { action, section } = this.state;

    const sectionIndex = sectionsList.indexOf(section);
    if (loading || lodashIsEmpty(values)) {
      return (
        <Container>
          <Loading />
        </Container>
      );
    }

    return (
      <Container>
        <Form>
          {this.renderCurrEditingSection(values)}

          {action === Action.previewing && (
            <Preview mode={PreviewMode.preview} />
          )}

          <BottomNavs>
            {action === Action.editing && (
              <>
                {sectionIndex !== lastSectionIndex && (
                  <PreviewBtn
                    onClick={() => {
                      this.setState({ action: Action.previewing });
                    }}
                  >
                    <ToolTip>Partial: preview your resume</ToolTip>

                    <PreviewBtnIcon />

                    <span>Preview</span>
                  </PreviewBtn>
                )}

                {sectionIndex > 0 && (
                  <EditBtn
                    onClick={() =>
                      this.setState({ section: toSection(section, "prev") })
                    }
                  >
                    <ToolTip>
                      {`Previous resume section ${toSection(
                        section,
                        "prev"
                      ).toLowerCase()}`}
                    </ToolTip>

                    <PrevBtnIcon />

                    <span>Previous</span>
                  </EditBtn>
                )}

                {sectionIndex < lastSectionIndex && (
                  <NextBtn
                    onClick={() =>
                      this.setState({ section: toSection(section, "next") })
                    }
                  >
                    <ToolTip>
                      {`Next resume section ${toSection(
                        section,
                        "next"
                      ).toLowerCase()}`}
                    </ToolTip>

                    <span>Next</span>

                    <NextBtnIcon />
                  </NextBtn>
                )}

                {this.renderPreviewFinalBtn(sectionIndex)}
              </>
            )}

            {action === Action.previewing && (
              <EditBtn
                onClick={() => this.setState({ action: Action.editing })}
              >
                <ToolTip>Show resume editor</ToolTip>

                <PrevBtnIcon />

                <span>Back to Editor</span>
              </EditBtn>
            )}
          </BottomNavs>
        </Form>
      </Container>
    );
  }

  private renderPreviewFinalBtn = (sectionIndex: number) => {
    if (sectionIndex === lastSectionIndex) {
      return (
        <NextBtn
          onClick={() => {
            this.setState({ action: Action.previewing });
          }}
        >
          <ToolTip>End: preview your resume</ToolTip>

          <span>Preview Your resume</span>

          <NextBtnIcon />
        </NextBtn>
      );
    }

    return null;
  };

  private renderCurrEditingSection = (values: FormValues) => {
    const { action, section } = this.state;

    if (action !== Action.editing) {
      return null;
    }

    if (section === Section.personalInfo) {
      return <PersonalInfo values={values.personalInfo} label={section} />;
    }

    if (section === Section.experiences) {
      return <Experiences values={values.experiences} label={section} />;
    }

    if (section === Section.education) {
      return <Education label={section} values={values.education} />;
    }

    if (section === Section.addSkills) {
      return (
        <AdditionalSkills
          label={section}
          values={values.additionalSkills || []}
        />
      );
    }

    if (section === Section.langs) {
      return <Languages label={section} values={values.languages} />;
    }

    if (section === Section.hobbies) {
      return <Hobbies label={section} values={values.hobbies} />;
    }

    if (section === Section.skills) {
      return <Skills label={section} values={values.skills} />;
    }

    return null;
  };

  private updateResume = async () => {
    let values = this.props.values;

    /**
     * if valuesTracker is empty (null or {}), then it means we are probably
     * on a render before getResume from apollo is resolved and we don't
     * want to save the form.
     */
    if (!valuesTracker || lodashIsEmpty(valuesTracker)) {
      valuesTracker = values;
      return;
    }

    const isStringPhoto =
      "string" === typeof (values.personalInfo && values.personalInfo.photo);

    /**
     * If we are not uploading a fresh photo file, tell the server so.
     */
    if (isStringPhoto) {
      values = update(values, {
        personalInfo: {
          photo: {
            $set: ALREADY_UPLOADED
          }
        }
      });

      valuesTracker = update(valuesTracker, {
        personalInfo: {
          photo: {
            $set: ALREADY_UPLOADED
          }
        }
      });
    }

    if (lodashIsEqual(values, valuesTracker)) {
      return;
    }

    /**
     * Immediately after user updates photo, value tracker will have type File
     * but a string will be returned from the server.  This mismatch i.e.
     * string<->File will cause re-update. So we prevent this here.
     */

    const photoTracking =
      // tslint:disable-next-line:no-any
      valuesTracker.personalInfo && (valuesTracker.personalInfo.photo as any);

    if (photoTracking instanceof File && isStringPhoto) {
      valuesTracker = { ...values };
      return;
    }

    const { updateResume } = this.props;

    if (!updateResume) {
      return;
    }

    valuesTracker = { ...values };

    try {
      updateResume({
        variables: {
          input: {
            ...(values as UpdateResumeInput)
          }
        }
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(
        "\n\t\tLogging start\n\n\n\n update catch error\n",
        error,
        "\n\n\n\n\t\tLogging ends\n"
      );
    }
  };
}

export default ResumeForm;
