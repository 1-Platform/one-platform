import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Bullseye,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  PageSection,
  Popover,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { yupResolver } from '@hookform/resolvers/yup';
import opcBase from '@one-platform/opc-base';
import * as Yup from 'yup';

import { ApiCatalogLinks } from 'router';
import { useToggle } from 'hooks';
import { debounce, callbackify, reqErrorMsg, emailErrorMsg } from 'utils';
import { Select } from 'components/Select';
import { useBreadcrumb } from 'context/BreadcrumbContext';

import { useSearchUsers } from 'graphql/users';
import { useCreateNamespace, useDeleteNamespace, useUpdateNamespace } from 'graphql/namespace';
import { UserRoverDetails } from 'graphql/users/types';
import { ApiCategory, ApiEmailGroup } from 'graphql/namespace/types';

import { useGetANamespace } from './hooks';
import { EnvironmentFormSection } from './components/EnvironmentFormSection';
import { EnvHeaderFormSection } from './components/EnvHeaderFormSection';
import { ApiTypeSelector } from './components/ApiTypeSelector';
import { ApiOwner, FormData } from './types';

import styles from './apiCUDPage.module.scss';

const schema = Yup.object({
  name: Yup.string().trim().required(reqErrorMsg('Name')),
  description: Yup.string().trim().min(200).required(reqErrorMsg('Description')),
  appUrl: Yup.string().url().trim().required(reqErrorMsg('Application URL')),
  schemaEndpoint: Yup.string().url().trim().required(reqErrorMsg('Schema URL')),
  environments: Yup.array(
    Yup.object({
      name: Yup.string().trim().required(reqErrorMsg('Name')),
      apiBasePath: Yup.string().url().trim().required(reqErrorMsg('API Base Path')),
    }).required()
  ).required(reqErrorMsg('Environments')),
  headers: Yup.array(
    Yup.object({
      key: Yup.string().trim(),
      value: Yup.string().trim(),
    })
  ),
  category: Yup.string()
    .oneOf([ApiCategory.GRAPHQL, ApiCategory.REST])
    .required(reqErrorMsg('API Category')),
  owners: Yup.array(
    Yup.object({
      group: Yup.string()
        .trim()
        .required()
        .oneOf([ApiEmailGroup.MAILING_LIST, ApiEmailGroup.USER])
        .required(),
      mid: Yup.string().when('group', {
        is: (value: string) => value === ApiEmailGroup.MAILING_LIST,
        then: Yup.string().email(emailErrorMsg(`Owner's mailing list`)).trim().required(),
        otherwise: Yup.string().trim().required(),
      }),
      email: Yup.string().trim().required(),
    }).required(reqErrorMsg('Owners'))
  )
    .min(1)
    .required(reqErrorMsg('Owners')),
});

export const ApiCUDPage = (): JSX.Element => {
  const { id } = useParams();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useToggle();
  const { handleDynamicCrumbs } = useBreadcrumb();
  const userInfo = opcBase.auth?.getUserInfo();
  const isUpdate = Boolean(id);
  const navigate = useNavigate();

  // owner dropdown management states
  const [ownerValue, setOwnerValue] = useState('');

  // graphql query and mutation hooks
  const { isLoading: isNamespaceLoading, data: namespace } = useGetANamespace({ id });
  const { isLoading: isOwnerListLoading, data: ownerOptionList } = useSearchUsers({
    search: ownerValue,
  });
  const [, createANamespace] = useCreateNamespace();
  const [, updateANamespace] = useUpdateNamespace();
  const [deleteNamespaceState, deleteANamepspace] = useDeleteNamespace();

  // form management
  const methods = useForm<FormData>({
    defaultValues: {
      environments: [{ apiBasePath: '', name: '' }],
      headers: [{ key: '', value: '' }],
    },
    resolver: yupResolver(schema),
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // effect for breadcrumb data
  useEffect(() => {
    const nsRecord = namespace?.getNamespaceById;
    if (!isNamespaceLoading && isUpdate && nsRecord) {
      handleDynamicCrumbs({
        'api-name': { label: nsRecord?.name, url: `/apis/${nsRecord?.id}` },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamespaceLoading, namespace, isUpdate]);

  /**
   * This effect validated whether user has edit access if not move them to explore
   * Checks user is in owner list or in createdBy
   */
  useEffect(() => {
    const api = namespace?.getNamespaceById;
    if (!isNamespaceLoading && isUpdate && api) {
      const userUuid = userInfo?.rhatUUID;
      const isApiCreatedUser = userUuid === (api?.createdBy as UserRoverDetails)?.rhatUUID;
      const isOwner =
        api?.owners.findIndex(
          (owner) => owner.group === ApiEmailGroup.USER && owner.user.rhatUUID === userUuid
        ) !== -1;
      const hasEditAccess = isApiCreatedUser || isOwner;
      if (!hasEditAccess) navigate('/apis');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamespaceLoading, namespace?.getNamespaceById, isUpdate, userInfo?.rhatUUID]);

  /**
   * In update mode the form is prefilled with API config data
   */
  useEffect(() => {
    const namespaceDefault = namespace?.getNamespaceById;
    if (!isNamespaceLoading && isUpdate && namespaceDefault) {
      const owners = namespaceDefault.owners.map((owner) => ({
        group: owner.group,
        mid: owner.group === ApiEmailGroup.USER ? owner?.user?.rhatUUID : owner?.email,
        email: owner.group === ApiEmailGroup.USER ? owner?.user?.mail : owner?.email,
      }));
      reset({
        ...namespaceDefault,
        owners,
        headers:
          namespaceDefault?.headers?.length === 0
            ? [{ key: '', value: '' }]
            : namespaceDefault?.headers,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamespaceLoading, namespace?.getNamespaceById, isUpdate]);

  // some preprocessing before form submission
  const handleFormParsing = (data: FormData) => {
    const headers = data.headers.filter(({ key }) => Boolean(key));
    const slug = nanoid(6);
    const owners = data.owners.map(({ mid, group }) => ({ mid, group }));
    return { ...data, createdBy: userInfo?.rhatUUID || '', headers, slug, owners };
  };

  /**
   * Form submission has two operation of create or update
   * After preprocessing datam by checking isUpdate flag
   * Its send as update or create operation
   */
  const handleFormSubmit = async (data: FormData) => {
    const payload = handleFormParsing(data);
    let res;
    if (isUpdate) res = await updateANamespace({ id, payload });
    else res = await createANamespace({ payload });
    if (res.error) {
      window.OpNotification.danger({
        subject: `Failed to ${isUpdate ? 'update' : 'create'} API`,
        body: res.error?.message,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiId = isUpdate ? id : (res.data as any)?.createNamespace?.id;
      navigate(`/apis/${apiId}`);
    }
  };

  const handleApiDelete = async (): Promise<void> => {
    if (deleteNamespaceState.fetching) return;
    const res = await deleteANamepspace({ id });
    if (res.error) {
      window.OpNotification.danger({
        subject: `Failed to delete API`,
        body: res.error?.message,
      });
    } else {
      navigate('/apis');
    }
  };

  /**
   * All the functions below are used for Owner Select
   * Its an Async Multi Creatable Select.
   * It's used for selecting either a owner or a mailing list
   */
  const handleOwnerSelectTypeaheadChange = (value: string) => {
    setOwnerValue(value);
  };

  /**
   * Function to handle owner selecting and also removing an owner
   * SelectedOption will be string:
   *  1. Created
   *  2. Clicking the cross button on a selected one
   * It will be an object when its selected from an option list
   * If the owner/mailing list is already selected it must be removed
   */
  const onSelect = (
    ownersSelected: ApiOwner[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (...event: any[]) => void,
    event: React.MouseEvent | React.ChangeEvent,
    selectedOption: string | SelectOptionObject
  ): void => {
    const isMailingList = typeof selectedOption === 'string'; // if not it will be rhatUuid
    const selection = isMailingList ? selectedOption : (selectedOption as UserRoverDetails).mail;

    const isOwnerAlreadySelected =
      ownersSelected.findIndex((owner) => owner.email === selection) !== -1;
    const newOwner = {
      group: !isMailingList ? 'USER' : 'MAILING_LIST',
      mid: !isMailingList ? (selectedOption as UserRoverDetails).rhatUUID : selection,
      email: selection,
    };
    const newOwners = isOwnerAlreadySelected
      ? ownersSelected.filter((owner) => owner.email !== selection)
      : [...ownersSelected, newOwner];
    onChange(newOwners);
    setOwnerValue('');
  };

  // Memorized function to render OwnerList by change in Search term
  const renderOwnerOptions = useMemo(() => {
    if (isOwnerListLoading)
      return [<SelectOption key="user:select" isDisabled value="Searching..." />];

    if (ownerValue.length < 3)
      return [<SelectOption key="user:select" isDisabled value="Enter atleast 3 characters" />];

    return ownerOptionList?.searchRoverUsers?.map((owner) => (
      <SelectOption
        key={`user:${owner.mail}-owner-${owner.rhatUUID}`}
        value={{
          ...owner,
          toString: () => owner.cn,
        }}
        description={owner.mail}
      />
    ));
  }, [ownerValue, isOwnerListLoading, ownerOptionList?.searchRoverUsers]);

  // owner filter to override the default fiter inside sleect
  const onFilterOwnerList = (_: React.ChangeEvent<HTMLInputElement>, typeAheadValue: string) => {
    if (!typeAheadValue || !renderOwnerOptions) {
      return renderOwnerOptions as JSX.Element[];
    }
    return renderOwnerOptions.filter((child) => {
      if (child.key === 'user:select') return true; // to show states like searching, no result etc
      return child.props.value.mail.includes(typeAheadValue);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClearOwnerSelect = (onChange: (...event: any[]) => void) => {
    setOwnerValue('');
    onChange([]);
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
      isWidthLimited
      className="pf-m-align-center"
      style={{ backgroundColor: '#FAFAFA' }}
    >
      <Bullseye>
        <Stack hasGutter className={styles['data-source--container']}>
          <StackItem>
            <Title headingLevel="h2" size={TitleSizes['2xl']}>
              {isUpdate
                ? `Edit ${namespace?.getNamespaceById?.name} Details`
                : 'Add API to Catalog'}
            </Title>
          </StackItem>
          <StackItem>
            <FormProvider {...methods}>
              <Form
                isWidthLimited
                onSubmit={handleSubmit(handleFormSubmit)}
                className={styles['data-source--form']}
              >
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup
                      fieldId="name"
                      label="API Source Name"
                      isRequired
                      validated={error ? 'error' : 'success'}
                      helperTextInvalid={error?.message}
                    >
                      <TextInput
                        aria-label="Search API"
                        placeholder="Give a name for the api datasource "
                        {...field}
                      />
                    </FormGroup>
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup
                      fieldId="description"
                      label="Description"
                      isRequired
                      validated={error ? 'error' : 'success'}
                      helperTextInvalid={error?.message}
                    >
                      <TextArea
                        aria-label="description"
                        {...field}
                        placeholder="Write about the datasource"
                      />
                    </FormGroup>
                  )}
                />
                <ApiTypeSelector />
                <Controller
                  name="owners"
                  control={control}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                    formState: { errors: formErrors },
                  }) => {
                    // checking error either in owners array or inside the objects of owners array
                    const hasError = error || Boolean(formErrors.owners?.length);
                    const ownerFieldError =
                      Array.isArray(formErrors?.owners) &&
                      formErrors?.owners?.find((ownerError) => ownerError?.mid?.message);
                    const helperTextInvalid =
                      error?.message || (ownerFieldError && ownerFieldError?.mid?.message);

                    return (
                      <FormGroup
                        fieldId="owners"
                        label="Owners"
                        isRequired
                        validated={hasError ? 'error' : 'success'}
                        helperTextInvalid={helperTextInvalid}
                      >
                        <Select
                          variant={SelectVariant.typeaheadMulti}
                          selections={value?.map((owners) => owners.email)}
                          onTypeaheadInputChanged={debounce(handleOwnerSelectTypeaheadChange)}
                          placeholderText="Search by kerberos id or add mailing list"
                          maxHeight="45vh"
                          onSelect={callbackify(onSelect, value, onChange)}
                          onClear={callbackify(onClearOwnerSelect, onChange)}
                          isCreatable
                          createText="Create mailing list: "
                          onFilter={onFilterOwnerList}
                          validated={hasError ? 'error' : 'default'}
                        >
                          {renderOwnerOptions}
                        </Select>
                      </FormGroup>
                    );
                  }}
                />
                <Controller
                  name="appUrl"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup
                      fieldId="name"
                      label="Application URL"
                      isRequired
                      validated={error ? 'error' : 'success'}
                      helperTextInvalid={error?.message}
                    >
                      <TextInput
                        aria-label="application url"
                        placeholder="Enter the URL of the API"
                        {...field}
                      />
                    </FormGroup>
                  )}
                />
                <Controller
                  name="schemaEndpoint"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup
                      fieldId="schemaEndpoint"
                      label="Schema URL"
                      isRequired
                      validated={error ? 'error' : 'success'}
                      helperTextInvalid={error?.message}
                      labelIcon={
                        <Popover
                          headerContent="URL For Documentation"
                          bodyContent="This must be the Swagger file URL(REST) or the GraphQL URL"
                        >
                          <button
                            type="button"
                            aria-label="More info for name field"
                            onClick={(e) => e.preventDefault()}
                            aria-describedby="simple-form-name-01"
                            className="pf-c-form__group-label-help"
                          >
                            <HelpIcon noVerticalAlign />
                          </button>
                        </Popover>
                      }
                    >
                      <TextInput
                        aria-label="documentation url"
                        placeholder="Enter the URL of the documentation"
                        {...field}
                      />
                    </FormGroup>
                  )}
                />
                <EnvHeaderFormSection />
                <EnvironmentFormSection />
                <Split hasGutter className="pf-u-mt-md">
                  <SplitItem>
                    <Button
                      variant="primary"
                      type="submit"
                      isLoading={isSubmitting}
                      isDisabled={isSubmitting}
                    >
                      {isUpdate ? 'Save' : 'Submit'}
                    </Button>
                  </SplitItem>
                  <SplitItem isFilled>
                    <Link to={ApiCatalogLinks.ListPage}>
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
              </Form>
            </FormProvider>
          </StackItem>
        </Stack>
      </Bullseye>
      <Modal
        variant={ModalVariant.medium}
        title={`Delete ${namespace?.getNamespaceById?.name} API`}
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
