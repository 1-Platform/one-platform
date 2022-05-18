import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Divider,
  Label,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { config } from 'config';
import { ApiSchema, ApiCategory } from 'api/types';

interface Props {
  schemas: ApiSchema[];
  onClick: (schemaID: string) => void;
  selectedSchemaID?: string;
}

export const ApiSchemaList = ({ schemas = [], onClick, selectedSchemaID }: Props): JSX.Element => {
  const numberOfGraphqlAPI = schemas.reduce(
    (prev, { category }) => (category === ApiCategory.GRAPHQL ? prev + 1 : prev),
    0
  );

  const numberOfRestAPI = schemas.reduce(
    (prev, { category }) => (category === ApiCategory.REST ? prev + 1 : prev),
    0
  );

  return (
    <Card
      isCompact
      isRounded
      style={{ maxWidth: '320px', marginLeft: 'auto' }}
      className="border-1"
    >
      <CardHeader>
        <Stack hasGutter className="pf-u-w-100">
          <StackItem className="pf-u-text-align-center">
            <CardTitle>API Schemas Registered</CardTitle>
          </StackItem>
          <StackItem>
            <Split hasGutter>
              <SplitItem isFilled>
                <Stack>
                  <StackItem>
                    <Text component={TextVariants.small}>Total</Text>
                    <Title headingLevel="h3" size="3xl">
                      {schemas.length}
                    </Title>
                  </StackItem>
                </Stack>
              </SplitItem>
              <Divider isVertical />
              <SplitItem isFilled>
                <Stack>
                  <StackItem>
                    <Text component={TextVariants.small}>REST</Text>
                    <Title headingLevel="h3" size="3xl">
                      {numberOfRestAPI}
                    </Title>
                  </StackItem>
                </Stack>
              </SplitItem>
              <Divider isVertical />
              <SplitItem isFilled>
                <Stack>
                  <StackItem>
                    <Text component={TextVariants.small}>GraphQL</Text>
                    <Title headingLevel="h3" size="3xl">
                      {numberOfGraphqlAPI}
                    </Title>
                  </StackItem>
                </Stack>
              </SplitItem>
            </Split>
          </StackItem>
        </Stack>
      </CardHeader>
      <CardBody>
        <DataList
          isCompact
          aria-label="schema-list"
          style={{ overflowY: 'auto', maxHeight: '180px' }}
        >
          {schemas.map(({ id: sID, name, category, flags }) => (
            <DataListItem key={sID}>
              <DataListItemRow
                className={css('pf-u-px-sm cursor-pointer', {
                  'menu-selected': selectedSchemaID === sID,
                })}
                onClick={() => onClick(sID)}
              >
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key={`${sID}-category`} isFilled={false}>
                      <Avatar
                        src={`${config.baseURL}/images/${
                          category === 'REST' ? 'swagger-black-logo.svg' : 'graphql-logo.svg'
                        }`}
                        alt="api-type"
                        size="sm"
                        style={{ width: '1rem', height: '1rem' }}
                        className="pf-u-mt-sm"
                      />
                    </DataListCell>,
                    <DataListCell
                      key={`${sID}-${name}`}
                      className="pf-u-display-flex pf-u-align-items-center"
                    >
                      <Text>{name}</Text>
                    </DataListCell>,
                    <DataListCell
                      isFilled={false}
                      key={`${sID}-flag`}
                      className="pf-u-display-flex pf-u-align-items-center"
                    >
                      <Label
                        color={flags.isInternal ? 'blue' : 'green'}
                        isCompact
                        className="pf-u-ml-sm"
                      >
                        {flags.isInternal ? 'Internal' : 'External'}
                      </Label>
                    </DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      </CardBody>
    </Card>
  );
};
