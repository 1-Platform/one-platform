import { Button, Card, CardBody, SearchInput, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import UnderDevelopment from 'components/UnderDevelopment';
import { useCallback, useState } from 'react';

interface IAPIKeyProps {
  app: any
}

export default function APIKeys ( prop: IAPIKeyProps ) {
  const [ searchText, setSearchText ] = useState( '' );

  const handleSearchInput = useCallback( ( value: string ) => {
    setSearchText( value ?? '' );
  }, [] );

  return (
    <>
      <Card isRounded>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              <Split hasGutter>
                <SplitItem isFilled>
                  <SearchInput
                    placeholder="Search API Keys"
                    value={ searchText }
                    onChange={ handleSearchInput }
                    onClear={ () => handleSearchInput('') }
                  />
                </SplitItem>
                <SplitItem>
                  <Button
                    isDisabled
                    variant="primary"
                    type="button"
                    icon={ <ion-icon style={{ marginBottom: '-3px' } } name="key-outline"></ion-icon>}
                  >Create API Key</Button>
                </SplitItem>
              </Split>
            </StackItem>

            {/* TODO: If form is open, show the Add API Key Form */}

            <StackItem>
              {/* TODO: If Loading, show loader */}

              {/* TODO: Show List of existing API Keys */}

              <UnderDevelopment />
            </StackItem>
          </Stack>
        </CardBody>
      </Card>
    </>
  )
}
