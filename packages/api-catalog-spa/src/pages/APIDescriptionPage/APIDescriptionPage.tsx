import { CSSProperties, Fragment, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Bullseye,
  Button,
  Divider,
  EmptyState,
  EmptyStateIcon,
  Grid,
  GridItem,
  Label,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  PageSection,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { CSSTransition } from 'react-transition-group';
import { css } from '@patternfly/react-styles';
import { BellIcon, CaretDownIcon, CubesIcon, OutlinedCopyIcon } from '@patternfly/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
import opcBase from '@one-platform/opc-base';
import { useToggle, useURLParser } from 'hooks';
import { config } from 'config';
import { ReadMore } from 'components';
import { useBreadcrumb } from 'context/BreadcrumbContext';
import { hasUserApiEditAccess } from 'utils';

import { useGetANamespaceBySlug, useSubscribeSchema } from './hooks';
import { DetailsSection, ApiTypeCard, ApiEnvironmentSection, ApiSchemaList } from './components';

import styles from './apiDescriptionPage.module.scss';

const APIDescriptionPage = (): JSX.Element => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { handleDynamicCrumbs } = useBreadcrumb();
  const urlParser = useURLParser();
  const [selectedSchemaIndex, setSelectedSchemaIndex] = useState(0);
  const [isSubscriptionOptionOpen, setIsSubscriptionOptionOpen] = useToggle();
  const [isSchemaDropdownOpen, setIsSchemaDropdownOpen] = useToggle();
  const [selectedSubscriptonEnv, setSelectedSubscriptionEnv] = useState<Record<
    string,
    boolean
  > | null>(null);
  const userInfo = opcBase.auth?.getUserInfo();

  const [{ fetching: isSubscribing, data: subscribedNamespace }, handleSubscribeSchemaGQL] =
    useSubscribeSchema();
  const { isLoading: isNamespaceLoading, data: fetchedNamespace } = useGetANamespaceBySlug({
    slug,
  });

  const namespace = subscribedNamespace?.subscribeApiSchema || fetchedNamespace?.getNamespaceBySlug;
  const id = namespace?.id;
  const schemas = namespace?.schemas || [];
  const selectedSchema = namespace?.schemas[selectedSchemaIndex];

  // effect to add breadcrumb data
  useEffect(() => {
    if (!isNamespaceLoading && namespace?.name && namespace?.id) {
      handleDynamicCrumbs({
        'api-name': { label: namespace.name, url: `/apis/${namespace?.slug}` },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamespaceLoading, namespace?.name, namespace?.id]);

  const hasEditAccess = useMemo(() => {
    const userUuid = userInfo?.rhatUUID;
    return hasUserApiEditAccess(userUuid as string, namespace);
  }, [namespace, userInfo?.rhatUUID]);

  const onMenuClick = (schemaId: string) => {
    const index = namespace?.schemas.findIndex(({ id: sid }) => sid === schemaId);
    if (index !== -1) {
      setSelectedSchemaIndex(index || 0);
    }
    setIsSchemaDropdownOpen.off();
  };

  const hasSubscribed = selectedSchema?.environments.some(({ isSubscribed }) => isSubscribed);

  const handleSchemaSubscription = async (envIDs?: string[]) => {
    const subscribedIds =
      envIDs ||
      (hasSubscribed ? [] : (selectedSchema?.environments || []).map(({ id: sID }) => sID));
    const subscriptionConfig = {
      namespaceID: id as string,
      schemaID: selectedSchema?.id || '',
      envIDs: subscribedIds,
      email: userInfo?.email || '',
    };
    try {
      const res = await handleSubscribeSchemaGQL({ config: subscriptionConfig });
      if (res.error) {
        opcBase.toast.danger({
          subject: `Failed to apply subscription change`,
          body: res?.error?.message,
        });
      } else {
        opcBase.toast.info({ subject: 'Successfully changed your subscription' });
      }
    } catch (error) {
      opcBase.toast.danger({
        subject: `Failed to ${hasSubscribed ? 'unsubscribe' : 'subscribe'} api`,
      });
    }
  };

  const onInitializeSelect = () => {
    if (!isSubscriptionOptionOpen) {
      const alreadySubscripedEnv = (selectedSchema?.environments || []).reduce<
        Record<string, boolean>
      >(
        (prev, { isSubscribed, id: eId }) =>
          isSubscribed ? { ...prev, [eId]: true } : { ...prev },
        {}
      );
      setSelectedSubscriptionEnv(alreadySubscripedEnv);
    }
    setIsSubscriptionOptionOpen.toggle();
  };

  const onEnvSelect = (env: string) => {
    const isEnvPresent = Boolean(selectedSubscriptonEnv?.[env]);
    const state = { ...selectedSubscriptonEnv };
    if (isEnvPresent) {
      delete state[env];
      setSelectedSubscriptionEnv(state);
    } else {
      state[env] = true;
      setSelectedSubscriptionEnv(state);
    }
  };

  const onEnvSelectBlur = async () => {
    if (selectedSubscriptonEnv) {
      await handleSchemaSubscription(Object.keys(selectedSubscriptonEnv));
    }
    setIsSubscriptionOptionOpen.off();
    setSelectedSubscriptionEnv(null);
  };

  if (isNamespaceLoading) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  if (!namespace) {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            Sorry, Couldn&apos;t find this API
          </Title>
          <Button variant="primary" onClick={() => navigate('../')}>
            Go Back
          </Button>
        </EmptyState>
      </Bullseye>
    );
  }

  return (
    <Stack>
      <StackItem>
        <PageSection isWidthLimited isCenterAligned>
          <Grid hasGutter>
            <GridItem span={8}>
              <DetailsSection namespace={namespace} id={slug} hasEditAccess={hasEditAccess} />
            </GridItem>
            <GridItem span={4}>
              <ApiSchemaList
                schemas={namespace?.schemas}
                onClick={onMenuClick}
                selectedSchemaID={selectedSchema?.id}
              />
            </GridItem>
          </Grid>
        </PageSection>
      </StackItem>
      <StackItem>
        <PageSection
          isWidthLimited
          isCenterAligned
          padding={{ default: 'noPadding' }}
          className="pf-u-py-sm pf-u-px-md"
        >
          <Text component={TextVariants.small} className="pf-u-color-400">
            API Schema
          </Text>
        </PageSection>
      </StackItem>
      <StackItem>
        <Divider />
      </StackItem>
      <StackItem>
        <PageSection isWidthLimited isCenterAligned className="pf-u-pb-4xl">
          <Grid hasGutter>
            {selectedSchema?.flags.isDeprecated && (
              <Grid span={12}>
                <Alert variant="danger" isInline title={`${selectedSchema.name} is deprecated`} />
              </Grid>
            )}
            <GridItem span={8}>
              <Grid hasGutter style={{ '--pf-l-grid--m-gutter--GridGap': '2rem' } as CSSProperties}>
                <GridItem span={12} className={styles.schemaContainer}>
                  <Split>
                    <SplitItem isFilled>
                      <Button
                        variant="link"
                        icon={<CaretDownIcon />}
                        onClick={setIsSchemaDropdownOpen.toggle}
                        iconPosition="right"
                        style={{ color: 'black' }}
                        className={styles.schemaDropdownTitle}
                      >
                        {selectedSchema?.name}
                      </Button>
                    </SplitItem>
                    <SplitItem className="pf-u-mr-lg">
                      <Label color={selectedSchema?.flags?.isInternal ? 'blue' : 'green'} isCompact>
                        {selectedSchema?.flags?.isInternal ? 'Internal API' : 'External API'}
                      </Label>
                    </SplitItem>
                  </Split>
                  <CSSTransition
                    in={isSchemaDropdownOpen}
                    timeout={200}
                    classNames="fade-in"
                    unmountOnExit
                  >
                    <Menu className={styles.schemaMenu}>
                      <MenuContent>
                        <MenuList className="pf-u-py-0">
                          {schemas.map((schema, index) => (
                            <Fragment key={schema.id}>
                              <MenuItem
                                className={css({
                                  'menu-selected': schema.id === selectedSchema?.id,
                                })}
                                icon={
                                  <Avatar
                                    src={`${config.baseURL}/images/${
                                      schema.category === 'REST'
                                        ? 'swagger-black-logo.svg'
                                        : 'graphql-logo.svg'
                                    }`}
                                    alt="api-type"
                                    size="sm"
                                    style={{ width: '1.25rem', height: '1.25rem' }}
                                    className="pf-u-mt-sm"
                                  />
                                }
                                onClick={() => onMenuClick(schema.id)}
                              >
                                <Split>
                                  <SplitItem isFilled>{schema.name}</SplitItem>
                                  <SplitItem>
                                    <Label
                                      color={schema.flags.isInternal ? 'blue' : 'green'}
                                      isCompact
                                      className="pf-u-ml-sm"
                                    >
                                      {schema.flags.isInternal ? 'Internal' : 'External'}
                                    </Label>
                                  </SplitItem>
                                </Split>
                              </MenuItem>
                              {schemas.length - 1 !== index && (
                                <Divider component="li" className="pf-u-my-0" />
                              )}
                            </Fragment>
                          ))}
                        </MenuList>
                      </MenuContent>
                    </Menu>
                  </CSSTransition>
                </GridItem>
                <GridItem span={12}>
                  <ReadMore>{selectedSchema?.description || ''}</ReadMore>
                </GridItem>
                <GridItem span={6}>
                  <Title headingLevel="h3">Application URL</Title>
                  <a href={selectedSchema?.appURL} target="_blank" rel="noopener noreferrer">
                    <Text className="pf-u-color-400">
                      {urlParser(selectedSchema?.appURL || '')}
                    </Text>
                  </a>
                </GridItem>
                {selectedSchema?.docURL && (
                  <GridItem span={6}>
                    <Title headingLevel="h3">Documentation URL</Title>
                    <a href={selectedSchema?.docURL} target="_blank" rel="noopener noreferrer">
                      <Text className="pf-u-color-400">
                        {urlParser(selectedSchema?.docURL || '')}
                      </Text>
                    </a>
                  </GridItem>
                )}
                {selectedSchema?.cmdbAppID && (
                  <GridItem span={6}>
                    <Title headingLevel="h3">CMDB App ID</Title>
                    <Split hasGutter className="pf-u-mt-xs">
                      <SplitItem>
                        <Text className="pf-u-color-400">{selectedSchema?.cmdbAppID}</Text>
                      </SplitItem>
                      <SplitItem>
                        <Button variant="plain" isSmall className="pf-u-p-0">
                          <OutlinedCopyIcon
                            onClick={() => {
                              window.navigator.clipboard.writeText(selectedSchema?.cmdbAppID);
                              window.OpNotification.success({ subject: 'Copied to clipboard' });
                            }}
                          />
                        </Button>
                      </SplitItem>
                    </Split>
                  </GridItem>
                )}
                <GridItem span={12} className="pf-u-mt-lg">
                  <ApiEnvironmentSection
                    environments={selectedSchema?.environments}
                    category={selectedSchema?.category}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem span={1} />
            <GridItem span={3}>
              <Stack hasGutter>
                <StackItem className={styles.subscriptionContainer}>
                  <Split>
                    <SplitItem isFilled>
                      <Button
                        icon={<BellIcon />}
                        variant={hasSubscribed ? 'primary' : 'secondary'}
                        iconPosition="right"
                        isBlock
                        isLoading={isSubscribing}
                        className={css(hasSubscribed ? styles.subscriptionDropdownBtn : null)}
                        onClick={() => handleSchemaSubscription()}
                      >
                        {hasSubscribed ? 'Subscribed' : 'Subscribe'}
                      </Button>
                    </SplitItem>
                    <CSSTransition
                      in={hasSubscribed}
                      timeout={200}
                      classNames="fade-in"
                      unmountOnExit
                    >
                      <SplitItem>
                        <Button
                          icon={<CaretDownIcon />}
                          onClick={onInitializeSelect}
                          className={css('ignore-blur', styles.subscriptionDropdownArrow)}
                        />
                      </SplitItem>
                    </CSSTransition>
                  </Split>
                  <CSSTransition
                    in={isSubscriptionOptionOpen}
                    timeout={200}
                    classNames="fade-in"
                    unmountOnExit
                  >
                    <Menu
                      className={styles.subscriptionMenu}
                      onBlur={(e) => {
                        if (!e.relatedTarget?.className?.includes('ignore-blur')) {
                          onEnvSelectBlur();
                        }
                      }}
                    >
                      <MenuContent>
                        <MenuList className="pf-u-py-0">
                          {selectedSchema?.environments.map(({ name, isSubscribed, id: envId }) => (
                            <MenuItem
                              className="uppercase ignore-blur"
                              isSelected={
                                selectedSubscriptonEnv
                                  ? selectedSubscriptonEnv[envId]
                                  : isSubscribed
                              }
                              key={`subscription-${envId}`}
                              itemId={envId}
                              onClick={() => onEnvSelect(envId)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </MenuContent>
                    </Menu>
                  </CSSTransition>
                </StackItem>
                <StackItem>
                  <ApiTypeCard category={selectedSchema?.category} />
                </StackItem>
              </Stack>
            </GridItem>
          </Grid>
        </PageSection>
      </StackItem>
    </Stack>
  );
};

export default APIDescriptionPage;
