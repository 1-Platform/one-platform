import { useContext, useEffect } from "react";
import {
  Card,
  CardBody,
  Stack,
  StackItem,
  Form,
  FormGroup,
  Radio,
  Grid,
  GridItem,
  TextInput,
  Title,
  ActionGroup,
  Button,
  Popover,
  Tooltip,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  createFeedbackConfigService,
  updateFeedbackConfigService,
} from "services/feedbackConfig";
import Header from "../Header";
import Loader from "../Loader";
import { AppContext } from "context/AppContext";
import useFeedbackConfig from "hooks/useFeedbackConfig";
import { requiredMsg } from "utils/formErrorMsg";

const feedbackTargets = [
  {
    isEnabled: true,
    id: "JIRA",
    name: "JIRA",
    description: process.env.REACT_APP_FEEDBACK_JIRA_API,
    url: process.env.REACT_APP_FEEDBACK_JIRA_API,
  },
  {
    isEnabled: false,
    id: "GITLAB",
    name: "Gitlab",
    description: process.env.REACT_APP_FEEDBACK_GITLAB_API,
    url: process.env.REACT_APP_FEEDBACK_GITLAB_API,
  },
  {
    isEnabled: false,
    id: "GITHUB",
    name: "GitHub",
    description: process.env.REACT_APP_FEEDBACK_GITHUB_API,
    url: process.env.REACT_APP_FEEDBACK_GITHUB_API,
  },
  {
    isEnabled: false,
    id: "EMAIL",
    name: "Other",
    description: "Other JIRA, Gitlab instances or Email",
    url: null,
  },
];

type FormData = {
  sourceType: FeedbackSource;
  feedbackEmail: string;
  sourceApiUrl: string;
  projectKey: string;
};

const formSchema = yup
  .object({
    sourceType: yup.string().trim().required(requiredMsg("Feedback Target")),
    feedbackEmail: yup
      .string()
      .email()
      .trim()
      .required(requiredMsg("Email Address")),
    sourceApiUrl: yup.string().trim().required(requiredMsg("Source API URL")),
    projectKey: yup.string().when("sourceType", {
      is: "JIRA",
      then: yup.string().required(requiredMsg("Project Key")).trim(),
      otherwise: yup.string().nullable().notRequired(),
    }),
  })
  .required();

function ConfigureFeedback() {
  /**
   * appId: it is the unique slug generated for an app used in url
   * app.id: its db id of an app in app service. Used for reference in other services
   */
  const { appId, loading: appLoading, app } = useContext(AppContext);
  const {
    feedbackConfig,
    setFeedbackConfig,
    loading: feedbackConfigLoading,
  } = useFeedbackConfig(appId);
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting, isDirty, isValid },
    reset,
  } = useForm<FormData>({ resolver: yupResolver(formSchema) });

  const isJiraSelectedFeedback = watch("sourceType") === "JIRA";

  useEffect(() => {
    reset(feedbackConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackConfig]);

  const isUpdate = Boolean(feedbackConfig.id);

  const saveFeedbackConfig = async (formData: FormData) => {
    const data = { ...formData, appId: app.id };
    try {
      if (isUpdate) {
        await updateFeedbackConfigService(feedbackConfig.id, data);
        setFeedbackConfig((state) => ({ ...state, ...data }));
      } else {
        const { id } = await createFeedbackConfigService(data);
        setFeedbackConfig((state) => ({ ...state, ...data, id }));
      }
      window.OpNotification?.success({ subject: "Feedback Saved!" });
    } catch (error) {
      window.OpNotification?.danger({
        subject: "An error occured when saving the changes.",
        body: "Please try again later.",
      });
    }
    return;
  };

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Header title="Configure Feedback" />
        </StackItem>

        {(appLoading || feedbackConfigLoading) && <Loader />}

        {!appLoading && !feedbackConfigLoading && (
          <StackItem>
            <Card isRounded>
              <CardBody>
                <Form
                  onSubmit={handleSubmit(saveFeedbackConfig)}
                  onReset={() => reset(feedbackConfig)}
                >
                  <Controller
                    control={control}
                    name="sourceType"
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <FormGroup
                        isRequired
                        fieldId="sourceType"
                        label="Feedback Target"
                        labelIcon={
                          <Popover bodyContent="The target where the feeback should be submitted as an issue or a ticket.">
                            <Button
                              variant="plain"
                              type="button"
                              aria-label="More info for name field"
                              onClick={(e) => e.preventDefault()}
                              aria-describedby="simple-form-name-01"
                              className="pf-c-form__group-label-help"
                            >
                              <ion-icon name="help-circle-outline"></ion-icon>
                            </Button>
                          </Popover>
                        }
                      >
                        <Grid hasGutter md={6}>
                          {feedbackTargets.map((target) => (
                            <GridItem key={target.id}>
                              {!target.isEnabled && (
                                <Tooltip
                                  position="bottom"
                                  content="This target is currently under development"
                                  reference={() =>
                                    document.getElementById(
                                      "feedback-source-type--" + target.id
                                    ) as HTMLElement
                                  }
                                />
                              )}
                              <Card
                                id={"feedback-source-type--" + target.id}
                                isRounded
                                isFlat
                                isCompact
                                aria-disabled={target.isEnabled}
                                isSelectable={target.isEnabled}
                                isSelected={value === target.id}
                                onClick={() => {
                                  if (target.isEnabled) {
                                    setValue("sourceApiUrl", target.url || "");
                                    return onChange(target.id);
                                  }
                                }}
                              >
                                <CardBody>
                                  <Radio
                                    id={target.id}
                                    name="sourceType"
                                    label={target.name}
                                    description={target.description}
                                    isChecked={value === target.id}
                                  />
                                </CardBody>
                              </Card>
                            </GridItem>
                          ))}
                        </Grid>
                        {error?.message && (
                          <HelperText>
                            <HelperTextItem variant="error">
                              {error?.message}
                            </HelperTextItem>
                          </HelperText>
                        )}
                      </FormGroup>
                    )}
                  />
                  {isJiraSelectedFeedback && (
                    <div className="jira-fields">
                      <Title headingLevel="h4">JIRA Configuration</Title>
                      <Controller
                        control={control}
                        name="projectKey"
                        defaultValue=""
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <FormGroup
                            fieldId="projectKey"
                            label="Project Key"
                            isRequired
                            helperTextInvalid={error?.message}
                            helperTextInvalidIcon={<ExclamationCircleIcon />}
                            validated={
                              Boolean(error?.message) ? "error" : "default"
                            }
                          >
                            <TextInput
                              isRequired
                              id="projectKey"
                              name="projectKey"
                              aria-describedby="jira-project-key"
                              validated="default"
                              placeholder="Enter the JIRA project key (i.e. ONEPLAT)"
                              value={value}
                              onChange={onChange}
                            ></TextInput>
                          </FormGroup>
                        )}
                      />
                    </div>
                  )}

                  <Controller
                    name="feedbackEmail"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <FormGroup
                        fieldId="feedbackEmail"
                        label="Email Address"
                        isRequired
                        helperTextInvalid={error?.message}
                        helperTextInvalidIcon={<ExclamationCircleIcon />}
                        validated={
                          Boolean(error?.message) ? "error" : "default"
                        }
                      >
                        <TextInput
                          isRequired
                          id="feedbackEmail"
                          name="feedbackEmail"
                          aria-describedby="feedback-email"
                          validated="default"
                          placeholder="Provide a support email address"
                          value={value}
                          onChange={onChange}
                        ></TextInput>
                      </FormGroup>
                    )}
                  />

                  <ActionGroup>
                    <Button
                      variant="primary"
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={!isDirty || !isValid}
                    >
                      Save
                    </Button>
                    <Button variant="link" type="reset">
                      Cancel
                    </Button>
                  </ActionGroup>
                </Form>
              </CardBody>
            </Card>
          </StackItem>
        )}
      </Stack>
    </>
  );
}

export default ConfigureFeedback;
