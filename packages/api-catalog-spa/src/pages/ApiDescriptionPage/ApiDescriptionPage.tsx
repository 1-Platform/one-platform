import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Bullseye,
  Button,
  Grid,
  GridItem,
  PageSection,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { BellIcon, ExternalLinkAltIcon, EditIcon } from '@patternfly/react-icons';
import opcBase from '@one-platform/opc-base';

import { hasUserApiEditAccess } from 'utils';
import { useBreadcrumb } from 'context/BreadcrumbContext';
import { CatalogBigButton } from 'components/CatalogBigButton';
import { useSubscribeNamespace, useUnsubscribeNamespace } from 'graphql/namespace';
import { ApiCategory, ApiEmailGroup, Namespace } from 'graphql/namespace/types';

import { useGetANamespace } from './hooks';
import { ApiOwnersCard } from './components/ApiOwnersCard';
import { ApiTypeCard } from './components/ApiTypeCard';
import { ApiEnvironmentSection } from './components/ApiEnvironmentSection';
import { DetailsSection } from './components/DetailsSection';
import styles from './apiDescription.module.scss';

const SWAGGER_ICON = `${process.env.PUBLIC_URL}/images/swagger-logo.svg`;
const VOYAGER_ICON = `${process.env.PUBLIC_URL}/images/voyager-logo.svg`;
const PLAYGROUND_ICON = `${process.env.PUBLIC_URL}/images/gql-playground-logo.svg`;

export const ApiDescriptionPage = (): JSX.Element => {
  const { id } = useParams();
  const { handleDynamicCrumbs } = useBreadcrumb();
  const userInfo = opcBase.auth?.getUserInfo();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    status: false,
    isChanging: false,
  });

  // grahpql queries and mutation
  const { isLoading, data: fetchedNamespace } = useGetANamespace({
    id,
    email: userInfo?.email || '',
  });
  const [, handleSubscribeNamespace] = useSubscribeNamespace();
  const [, handleUnsubscribeNamespace] = useUnsubscribeNamespace();

  // effect to add breadcrumb data
  useEffect(() => {
    const nsRecord = fetchedNamespace?.getNamespaceById;
    if (!isLoading && nsRecord) {
      handleDynamicCrumbs({ 'api-name': { label: nsRecord?.name, url: `/apis/${nsRecord?.id}` } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, fetchedNamespace]);

  // effect to check subscription status
  useEffect(() => {
    const hasSubscribed = Boolean(fetchedNamespace?.getNamespaceSubscriberStatus?.subscribed);
    setSubscriptionStatus((state) => ({ ...state, status: hasSubscribed }));
  }, [fetchedNamespace?.getNamespaceSubscriberStatus?.subscribed]);

  const namespace = fetchedNamespace?.getNamespaceById;
  const hasSubscribed = subscriptionStatus?.status;

  // permission check
  const hasEditAccess = useMemo(() => {
    const userUuid = userInfo?.rhatUUID;
    return hasUserApiEditAccess(userUuid as string, namespace);
  }, [namespace, userInfo?.rhatUUID]);

  const onSubsciptionButtonClick = async () => {
    if (subscriptionStatus.isChanging) return; // checking any req is processing

    const subFn = hasSubscribed ? handleUnsubscribeNamespace : handleSubscribeNamespace;
    setSubscriptionStatus((state) => ({ ...state, isChanging: true }));
    const res = await subFn({
      id,
      payload: {
        group: ApiEmailGroup.USER,
        email: userInfo?.email || '',
      },
    });
    if (res.error) {
      setSubscriptionStatus((state) => ({ ...state, isChanging: false }));
      opcBase.toast.danger({
        subject: `Failed to ${hasSubscribed ? 'unsubscribe' : 'subscribe'} api`,
        body: res?.error?.message,
      });
    } else {
      const subject = `${hasSubscribed ? 'Unsubscribed' : 'Subscribed'} to ${namespace?.name}`;
      const body = `You will ${
        hasSubscribed ? 'not be' : 'be'
      } be notified regarding updates on this API`;
      opcBase.toast.info({ subject, body });
      setSubscriptionStatus((state) => ({ status: !state.status, isChanging: false }));
    }
  };

  // to render tools required for each API
  const renderApiTools = useCallback(() => {
    if (namespace?.category === ApiCategory.REST) {
      return (
        <SplitItem>
          <Link to={`/apis/rest/swagger/${id}`} className="catalog-nav-link">
            <CatalogBigButton
              title="Swagger"
              desc="Try Swagger UI"
              isFlat
              image={SWAGGER_ICON}
              rightIcon={<ExternalLinkAltIcon size="sm" color="#B8BBBE" />}
            />
          </Link>
        </SplitItem>
      );
    }

    return [
      <SplitItem key="catalog-button-voyager">
        <Link to={`/apis/graphql/voyager/${id}`} className="catalog-nav-link">
          <CatalogBigButton
            title="Voyager"
            desc="Try voyager"
            isFlat
            image={VOYAGER_ICON}
            rightIcon={<ExternalLinkAltIcon size="sm" color="#B8BBBE" />}
          />
        </Link>
      </SplitItem>,
      <SplitItem key="catalog-button-playground">
        <Link to={`/apis/graphql/playground/${id}`} className="catalog-nav-link">
          <CatalogBigButton
            title="GraphQL Playground"
            desc="Try playground"
            isFlat
            image={PLAYGROUND_ICON}
            rightIcon={<ExternalLinkAltIcon size="sm" color="#B8BBBE" />}
          />
        </Link>
      </SplitItem>,
    ];
  }, [namespace?.category, id]);

  if (isLoading) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }
  return (
    <PageSection isWidthLimited className="pf-m-align-center">
      <Grid hasGutter>
        <GridItem span={8}>
          <Stack hasGutter className={styles['catalog-content']}>
            <StackItem>
              <DetailsSection namespace={namespace as Namespace} />
            </StackItem>
            <StackItem>
              <Title headingLevel="h3" className="pf-u-mb-sm">
                API Tools
              </Title>
              <Split hasGutter>{renderApiTools()}</Split>
            </StackItem>
            <StackItem>
              <ApiEnvironmentSection environments={namespace?.environments} />
            </StackItem>
          </Stack>
        </GridItem>
        <GridItem span={4}>
          <Stack hasGutter style={{ maxWidth: '320px' }}>
            <StackItem>
              <Split hasGutter>
                {hasEditAccess && (
                  <SplitItem>
                    <Link to={`/apis/${namespace?.id}/edit`} className="catalog-nav-link">
                      <Button icon={<EditIcon />} variant="secondary" iconPosition="left" isBlock>
                        Edit
                      </Button>
                    </Link>
                  </SplitItem>
                )}
                <SplitItem isFilled>
                  <Button
                    icon={<BellIcon />}
                    variant={hasSubscribed ? 'primary' : 'secondary'}
                    iconPosition="right"
                    isBlock
                    onClick={onSubsciptionButtonClick}
                    isLoading={subscriptionStatus.isChanging}
                  >
                    {hasSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                </SplitItem>
              </Split>
            </StackItem>
            <StackItem>
              <ApiTypeCard category={namespace?.category} />
            </StackItem>
            <StackItem>
              <ApiOwnersCard owners={namespace?.owners} />
            </StackItem>
          </Stack>
        </GridItem>
      </Grid>
    </PageSection>
  );
};
