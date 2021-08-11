import '@one-platform/opc-footer/dist/opc-footer';
import { FC } from 'react';
import { Flex, FlexItem, Page } from '@patternfly/react-core';
import { Container } from 'components/Container';
interface Props {

}

export const AppLayout: FC<Props> = ({children}) => {
    return (
        <Page mainContainerId="app-layout-page">
            <Container>
                <Flex
                    direction={ { default: 'column' } }
                    className="pf-u-h-100"
                    flexWrap={ { default: 'nowrap' } }>
                    <Flex direction={ { default: 'column' } } flex={ { default: 'flex_1' } }>
                        { children }
                    </Flex>
                    <FlexItem>
                        <opc-footer />
                    </FlexItem>
                </Flex>
            </Container>
        </Page>
    );
}

export default AppLayout
