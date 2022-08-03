/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  Form,
  Modal,
  ModalVariant,
  PageSection,
  ProgressStep,
  ProgressStepper,
  SelectOption,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import { Link, useNavigate, useParams } from 'react-router-dom';
import opcBase from '@one-platform/opc-base';

import { useToggle, useURQL } from 'hooks';
import { useBreadcrumb } from 'context/BreadcrumbContext';
import { ApiEmailGroup } from 'api/types';

import { APIBasicDetailsForm } from './components/APIBasicDetailsForm';
import { APISchemaForm } from './components/APISchemaForm';
import { APIReview } from './components/APIReview';
import {
  wizardValidationSchemas,
  wizardStepDetails,
  GET_API_SCHEMA_FILE,
  GET_USERS_QUERY,
  GET_CMDB_CODES,
} from './APICUDPage.helpers';
import {
  FormData,
  HandleSchemaValidationArg,
  ListCMDBCodeQuery,
  UserRoverDetails,
  UserSearchQuery,
} from './APICUDPage.types';
import {
  useCreateNamespace,
  useDeleteANamespace,
  useGetANamespaceBySlug,
  useUpdateNamespace,
  useGetOutages,
} from './hooks';
import {
  CreateNamespaceType,
  UseGetAPISchemaFileQuery,
  UseGetAPISchemaFileVariable,
} from './hooks/types';

const MAX_WIZARD_STEPS = 3;
const FORM_DEFAULT_VALUE = {
  schemas: [
    {
      environments: [
        {
          headers: [{ key: '', value: '' }],
        },
      ],
    },
  ],
};

const APICUDPage = () => {
  const [wizardStep, setWizardStep] = useState(1);
  const { handleDynamicCrumbs } = useBreadcrumb();
  const userInfo = opcBase.auth?.getUserInfo();
  const navigate = useNavigate();
  const { slug } = useParams();
  const gqlClient = useURQL();
  const isUpdate = Boolean(slug);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useToggle();

  // gql queries
  const [createNsState, createNamespace] = useCreateNamespace();
  const [, updateANamespace] = useUpdateNamespace();
  const [deleteNamespaceState, deleteANamespace] = useDeleteANamespace();
  const { isLoading: isNamespaceLoading, data: nsData } = useGetANamespaceBySlug({ slug });
  const { data: outageComponents } = useGetOutages();

  const namespace = nsData?.getNamespaceBySlug;
  const id = namespace?.id;

  const formMethod = useForm<FormData>({
    defaultValues: FORM_DEFAULT_VALUE,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(
      wizardValidationSchemas[wizardStep as keyof typeof wizardValidationSchemas]
    ),
  });

  const { handleSubmit, reset } = formMethod;

  // effect for breadcrumb data
  useEffect(() => {
    if (!isNamespaceLoading && isUpdate && namespace?.name && namespace?.slug) {
      handleDynamicCrumbs({
        'api-name': { label: namespace.name, url: `/apis/${namespace.slug}` },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamespaceLoading, namespace?.name, namespace?.slug, isUpdate]);

  /**
   * This effect validated whether user has edit access if not move them to explore
   * Checks user is in owner list or in createdBy
   */
  useEffect(() => {
    if (!isNamespaceLoading && isUpdate && namespace) {
      const userUuid = userInfo?.rhatUUID;
      const isApiCreatedUser = userUuid === (namespace?.createdBy as UserRoverDetails)?.rhatUUID;
      const isOwner =
        namespace?.owners.findIndex(
          (owner) => owner.group === ApiEmailGroup.USER && owner.user.rhatUUID === userUuid
        ) !== -1;
      const hasEditAccess = isApiCreatedUser || isOwner;
      if (!hasEditAccess) navigate('/apis');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamespaceLoading, namespace, isUpdate, userInfo?.rhatUUID]);

  /**
   * In update mode the form is prefilled with API config data
   */
  useEffect(() => {
    if (!isNamespaceLoading && isUpdate && namespace) {
      const owners = namespace.owners.map((owner) => ({
        group: owner.group,
        mid: owner.group === ApiEmailGroup.USER ? owner?.user?.rhatUUID : owner?.email,
        email: owner.group === ApiEmailGroup.USER ? owner?.user?.mail : owner?.email,
      }));
      reset({
        ...namespace,
        owners,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamespaceLoading, namespace, isUpdate]);

  const isLastStep = wizardStep === MAX_WIZARD_STEPS;

  const formatFormData = ({ id: nsId, slug: nSlug, outageStatus, ...data }: FormData) => {
    return {
      ...data,
      outageStatusAppID: outageStatus?.id || null,
      owners: data.owners.map(({ group, mid }) => ({ group, mid })),
      schemas: data.schemas.map((schema) => ({
        ...schema,
        environments: schema.environments.map(({ slug: eSlug, ...env }) => ({
          ...env,
          headers: (env?.headers || [])
            .filter(({ id: hId, key, value }) => (hId && key) || (key && value))
            .map(({ id: hID, key, value }) => (hID ? { id: hID, key } : { key, value })),
        })),
      })),
    };
  };

  const handleCreateNamespace = async (data: FormData) => {
    const payload = formatFormData(data) as CreateNamespaceType;
    try {
      const res = await createNamespace({ payload });
      if (res.error) {
        window.OpNotification.danger({
          subject: 'Failed to create API',
          body: res.error?.message,
        });
        return;
      }
      navigate(`/apis/${res.data?.createNamespace.slug}`);
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Failed to create API',
      });
    }
  };

  const handleUpdateNamespace = async (data: FormData) => {
    const payload = formatFormData(data) as CreateNamespaceType;
    delete (payload as any).createdBy;
    try {
      const res = await updateANamespace({ payload, id: id as string });
      if (res.error) {
        window.OpNotification.danger({
          subject: 'Failed to update API',
          body: res.error?.message,
        });
        return;
      }
      navigate(`/apis/${res.data?.updateNamespace.slug}`);
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Failed to update API',
      });
    }
  };

  const handleSchemaValidation = async ({ envSlug, ...config }: HandleSchemaValidationArg) => {
    try {
      const res = await gqlClient
        .query<UseGetAPISchemaFileQuery, UseGetAPISchemaFileVariable>(GET_API_SCHEMA_FILE, {
          config,
          envSlug,
        })
        .toPromise();

      if (!res.error) {
        window.OpNotification.success({
          subject: 'Successfully validated schema',
        });
      } else {
        window.OpNotification.danger({
          subject: 'Failed to fetch schema',
        });
      }

      return res.data?.fetchAPISchema;
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Failed to fetch schema',
      });
    }
    return undefined;
  };

  const handleApiDelete = async (): Promise<void> => {
    if (deleteNamespaceState.fetching) return;
    const res = await deleteANamespace({ id: id as string });
    if (res.error) {
      window.OpNotification.danger({
        subject: `Failed to delete API`,
        body: res.error?.message,
      });
    } else {
      navigate('/apis');
    }
  };

  const onFormSubmit = (data: FormData) => {
    if (wizardStep < MAX_WIZARD_STEPS) {
      setWizardStep((state) => state + 1);
      return;
    }
    if (isUpdate) {
      handleUpdateNamespace(data);
    } else {
      handleCreateNamespace(data);
    }
  };

  const onPrev = () => {
    if (wizardStep > 1) {
      setWizardStep((state) => state - 1);
    }
  };

  const onSearchOwners = async (search: string): Promise<JSX.Element[]> => {
    if (!search || search.length < 3) {
      return [
        <SelectOption key="no-result" value="Please type atleast 3 characters" isPlaceholder />,
      ];
    }

    try {
      const res = await gqlClient.query<UserSearchQuery>(GET_USERS_QUERY, { search }).toPromise();
      const options = (res.data?.searchRoverUsers || []).map((owner) => (
        <SelectOption
          key={`user:${owner.mail}-owner-${owner.rhatUUID}`}
          value={{
            ...owner,
            toString: () => owner.cn,
          }}
          description={owner.mail}
        />
      ));
      return options;
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Failed to search for users',
      });
    }
    return [];
  };

  const onSearchCMDB = async (search: string): Promise<JSX.Element[]> => {
    if (!search || search.length < 3) {
      return [
        <SelectOption key="no-result" value="Please type atleast 3 characters" isPlaceholder />,
      ];
    }

    try {
      const res = await gqlClient
        .query<ListCMDBCodeQuery>(GET_CMDB_CODES, { name: search })
        .toPromise();
      const options = (res.data?.listCMDBCodes || []).map((code) => (
        <SelectOption
          key={`cmdb:${code.appID}`}
          value={code.appID}
          description={`Application: ${code.name}`}
        />
      ));
      return options;
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Failed to search for cmdb codes',
      });
    }
    return [];
  };

  if (isUpdate && isNamespaceLoading) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  return (
    <PageSection
      isCenterAligned
      isWidthLimited
      style={{ backgroundColor: 'var(--pf-global--BackgroundColor--light-300)' }}
      className="pf-u-h-100 pf-u-pb-4xl"
    >
      <Form
        onSubmit={handleSubmit(onFormSubmit)}
        style={{ maxWidth: '1080px', margin: 'auto' }}
        autoComplete="off"
      >
        <FormProvider {...formMethod}>
          <Stack hasGutter>
            {/* Top Stepper */}
            <StackItem>
              <Card>
                <CardBody>
                  <ProgressStepper isCenterAligned>
                    {wizardStepDetails.map(({ title }, index) => (
                      <ProgressStep
                        variant={wizardStep <= index ? 'pending' : 'success'}
                        id={`wizard-step-icon-${index}`}
                        key={`wizard-step-icon-${index + 1}`}
                        titleId={`wizard-step-icon-${index}`}
                        aria-label={title}
                        isCurrent={wizardStep === index + 1}
                      >
                        {title}
                      </ProgressStep>
                    ))}
                  </ProgressStepper>
                </CardBody>
              </Card>
            </StackItem>
            {/* Form Steps */}
            <StackItem>
              <CSSTransition in={wizardStep === 1} timeout={200} classNames="fade-in" unmountOnExit>
                <APIBasicDetailsForm
                  onSearchOwners={onSearchOwners}
                  outageComponents={outageComponents?.listAPIOutageStatus}
                />
              </CSSTransition>
            </StackItem>
            <StackItem>
              <CSSTransition in={wizardStep === 2} timeout={200} classNames="fade-in" unmountOnExit>
                <APISchemaForm
                  handleSchemaValidation={handleSchemaValidation}
                  isUpdate={isUpdate}
                  onSearchCMDB={onSearchCMDB}
                />
              </CSSTransition>
            </StackItem>
            <StackItem>
              <CSSTransition in={wizardStep === 3} timeout={200} classNames="fade-in" unmountOnExit>
                <APIReview />
              </CSSTransition>
            </StackItem>
            {/* Form Action Buttons */}
            <StackItem>
              <Card>
                <CardBody>
                  <Split hasGutter>
                    <SplitItem>
                      <Button type="submit" isLoading={createNsState.fetching}>
                        {isLastStep ? (isUpdate ? 'Update' : 'Create') : 'Next'}
                      </Button>
                    </SplitItem>
                    <SplitItem>
                      <Button variant="secondary" onClick={onPrev} isDisabled={wizardStep === 1}>
                        Back
                      </Button>
                    </SplitItem>
                    <SplitItem isFilled>
                      <Link to={isUpdate ? `/apis/${namespace?.slug}` : '/apis'}>
                        <Button variant="link">Cancel</Button>
                      </Link>
                    </SplitItem>
                    {isUpdate && (
                      <SplitItem>
                        <Button variant="link" isDanger onClick={setIsDeleteConfirmationOpen.on}>
                          Delete
                        </Button>
                      </SplitItem>
                    )}
                  </Split>
                </CardBody>
              </Card>
            </StackItem>
          </Stack>
        </FormProvider>
      </Form>
      <Modal
        variant={ModalVariant.medium}
        title={`Delete ${namespace?.name} API`}
        titleIconVariant="danger"
        isOpen={isDeleteConfirmationOpen}
        onClose={setIsDeleteConfirmationOpen.off}
        actions={[
          <Button
            key="confirm"
            variant="primary"
            onClick={handleApiDelete}
            isLoading={deleteNamespaceState.fetching}
          >
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={setIsDeleteConfirmationOpen.off}>
            Cancel
          </Button>,
        ]}
      >
        This action is irreversible. Are you sure you want to delete this API?
      </Modal>
    </PageSection>
  );
};

export default APICUDPage;
