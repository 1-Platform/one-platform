import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Grid,
  GridItem,
  List,
  ListItem,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';

import { config } from 'config';
import { CatalogBigButton, ReadMore } from 'components';
import { FormData } from 'pages/APICUDPage/APICUDPage.types';

import { Description } from './components/Description';

const apiOptions: Record<string, { title: string; desc: string; image: string }> = {
  REST: {
    title: 'REST',
    desc: 'Confirms to OpenAPI specs',
    image: 'rest-logo.svg',
  },
  GRAPHQL: {
    title: 'GraphQL',
    desc: 'Query Language for your API',
    image: 'graphql-logo.svg',
  },
};

export const APIReview = (): JSX.Element => {
  const { getValues } = useFormContext<FormData>();
  const [formData] = useState(getValues());

  return (
    <Stack hasGutter>
      <StackItem>
        <Card>
          <CardTitle>
            <Title headingLevel="h2">API Details</Title>
          </CardTitle>
          <CardBody>
            <Stack hasGutter>
              <StackItem>
                <Description title="Name" isRequired>
                  <Title headingLevel="h6">{formData.name}</Title>
                </Description>
              </StackItem>
              <StackItem>
                <Description title="Description" isRequired>
                  <Title headingLevel="h6">
                    <ReadMore>{formData.description}</ReadMore>
                  </Title>
                </Description>
              </StackItem>
              <StackItem>
                <Description title="Owners">
                  <Title headingLevel="h6">
                    <List isPlain isBordered>
                      {formData.owners.map(({ email }) => (
                        <ListItem key={email}>{email}</ListItem>
                      ))}
                    </List>
                  </Title>
                </Description>
              </StackItem>
            </Stack>
          </CardBody>
        </Card>
      </StackItem>
      {formData.schemas?.map((schema, schemaIndex) => (
        <StackItem key={schema.name}>
          <Card>
            <CardTitle>
              <Title headingLevel="h2">{`API Schema #${schemaIndex}`}</Title>
            </CardTitle>
            <CardBody>
              <Stack hasGutter>
                <StackItem>
                  <Description title="Schema Name" isRequired>
                    <Title headingLevel="h6">{schema.name}</Title>
                  </Description>
                </StackItem>
                <StackItem>
                  <Description title="Description" isRequired>
                    <Title headingLevel="h6">
                      <ReadMore>{schema.description}</ReadMore>
                    </Title>
                  </Description>
                </StackItem>
                <StackItem>
                  <Description title="Type" isRequired>
                    <CatalogBigButton
                      title={apiOptions[schema.category].title}
                      desc={apiOptions[schema.category].desc}
                      image={`${config.baseURL}/images/${apiOptions[schema.category].image}`}
                    />
                  </Description>
                </StackItem>
                <StackItem>
                  <Split hasGutter>
                    <SplitItem isFilled>
                      <Description title="App URL" isRequired>
                        <Title headingLevel="h6">{schema.appURL}</Title>
                      </Description>
                    </SplitItem>
                    <SplitItem isFilled>
                      <Description title="App Documentation URL" isRequired>
                        <Title headingLevel="h6">{schema.docURL}</Title>
                      </Description>
                    </SplitItem>
                  </Split>
                </StackItem>
                <StackItem>
                  <Description title="Environments">
                    <div style={{ border: '1px solid #d2d2d2' }} className="pf-u-p-lg">
                      {schema.environments.map((env, envIndex) => (
                        <Grid key={`schema-${schemaIndex + 1}-env-${envIndex + 1}`} hasGutter>
                          <GridItem span={6}>
                            <Description title="Name" isRequired>
                              <Title headingLevel="h6" className="uppercase">
                                {env.name}
                              </Title>
                            </Description>
                          </GridItem>
                          <GridItem span={6}>
                            <Description title="API Base Path" isRequired>
                              <Title headingLevel="h6">{env.apiBasePath}</Title>
                            </Description>
                          </GridItem>
                          <GridItem span={6}>
                            <Description title="API Schema Endpoint" isRequired>
                              <Title headingLevel="h6">{env.schemaEndpoint}</Title>
                            </Description>
                          </GridItem>
                          <GridItem span={12}>
                            <Description title="Headers" isRequired>
                              <DataList aria-label="header-list" isCompact>
                                {env.headers?.map(
                                  ({ key }, index) =>
                                    key && (
                                      <DataListItem key={`${key}-${index + 1}`}>
                                        <DataListItemRow>
                                          <DataListItemCells
                                            dataListCells={[
                                              <DataListCell key={`${key}-${index + 1}-cell-1`}>
                                                <span>{key}</span>
                                              </DataListCell>,
                                              <DataListCell key={`${key}-${index + 1}-cell-2`}>
                                                <span>********</span>
                                              </DataListCell>,
                                            ]}
                                          />
                                        </DataListItemRow>
                                      </DataListItem>
                                    )
                                )}
                              </DataList>
                            </Description>
                          </GridItem>
                          <GridItem span={12}>
                            <Checkbox
                              isChecked={env.isPublic}
                              isDisabled
                              id={`schema-${schemaIndex}-env-${envIndex}-isPublic`}
                              label="Is this API accessible from public?"
                            />
                          </GridItem>
                        </Grid>
                      ))}
                    </div>
                  </Description>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </StackItem>
      ))}
    </Stack>
  );
};
