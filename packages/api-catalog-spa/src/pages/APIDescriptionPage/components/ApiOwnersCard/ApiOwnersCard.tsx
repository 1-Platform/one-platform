import {
  Card,
  CardBody,
  Stack,
  StackItem,
  Split,
  SplitItem,
  Text,
  TextVariants,
  Divider,
} from '@patternfly/react-core';
import { OutlinedEnvelopeIcon } from '@patternfly/react-icons';
import { ApiOwnerType, ApiEmailGroup } from 'api/types';

interface Props {
  owners?: ApiOwnerType[];
}

export const ApiOwnersCard = ({ owners = [] }: Props): JSX.Element => {
  return (
    <Card className="catalog-card-flat" style={{ minWidth: '320px' }}>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <Stack>
              <StackItem>
                <Text>Want to know more or Report a bug?</Text>
              </StackItem>
              <StackItem>
                <Split hasGutter>
                  <SplitItem>
                    <OutlinedEnvelopeIcon />
                  </SplitItem>
                  <SplitItem>
                    <a href="mailto:one-platform-devs@redhat.com">one-platform-devs@redhat.com</a>
                  </SplitItem>
                </Split>
              </StackItem>
            </Stack>
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
          {owners.map((owner, index) => {
            const name = owner?.group === ApiEmailGroup.USER ? owner.user?.cn : owner?.email; // ts bug: if i make the condition into variable the union is not working firing type error
            const desc =
              owner?.group === ApiEmailGroup.USER ? owner?.user?.rhatJobTitle : 'Mailing list';
            return (
              <StackItem key={`${name}-${index + 1}`}>
                <Split hasGutter className="pf-u-align-items-center">
                  <SplitItem isFilled>
                    <Stack>
                      <StackItem>
                        <Text>{name}</Text>
                      </StackItem>
                      <StackItem>
                        <Text component={TextVariants.small}>{desc}</Text>
                      </StackItem>
                    </Stack>
                  </SplitItem>
                  <SplitItem>
                    <a
                      href={`mailto:${
                        owner?.group === ApiEmailGroup.USER ? owner?.user?.mail : owner?.email
                      }`}
                      className="catalog-nav-link"
                    >
                      <OutlinedEnvelopeIcon />
                    </a>
                  </SplitItem>
                </Split>
                {index !== owners.length - 1 && <Divider className="pf-u-mt-md" />}
              </StackItem>
            );
          })}
        </Stack>
      </CardBody>
    </Card>
  );
};
