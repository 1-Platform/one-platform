import {
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Text,
} from '@patternfly/react-core';
import { createStore, useStateMachine } from 'little-state-machine';
import { CSSProperties, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { updateSearchConfigService } from 'services/searchConfig';
import { AppContext } from '../../context/AppContext';
import useSearchConfig from '../../hooks/useSearchConfig';
import Header from '../Header';
import Loader from '../Loader';
import ConfigureSearchStep1 from './Steps/Step1';
import ConfigureSearchStep2 from './Steps/Step2';
import ConfigureSearchStep3 from './Steps/Step3';
import saveState, { overrideState } from './Steps/store';
import { clamp, isEmpty } from 'lodash';

createStore(
  {
    appId: '',
    savedStepId: 0,
    formData: {},
  },
  {
    name: 'SearchConfiguration',
  }
);

const steps = [
  { label: 'API Endpoint', component: ConfigureSearchStep1 },
  { label: 'Auth & Headers', component: ConfigureSearchStep2 },
  { label: 'Field Mapping', component: ConfigureSearchStep3 },
];

export default function SearchWizardForm(props: any) {
  const { appId, loading: appLoading } = useContext(AppContext);
  const { searchConfig, loading: searchConfigLoading } = useSearchConfig(appId);
  const [currentStepId, setCurrentStepId] = useState<number>(0);
  const { actions, state } = useStateMachine({ saveState, overrideState });

  const [defaultValues, setDefaultValues] = useState<App.SearchConfig>();

  useEffect( () => {
    setCurrentStepId( state.savedStepId ?? 0 );
  }, [state.savedStepId] );

  useEffect(() => {
    if (!isEmpty(searchConfig)) {
      setDefaultValues( searchConfig );
      if ( isEmpty( state.formData ) || state.appId !== appId ) {
        actions.saveState( { appId, formData: { ...searchConfig } } );
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, appId, searchConfig] );

  const onMove = useCallback(( stepId: number ) => {
    setCurrentStepId( stepId );
    actions.saveState({
      savedStepId: ( !state.savedStepId || state.savedStepId < stepId )
        ? stepId
        : state.savedStepId,
    });
  }, [actions, state.savedStepId]);

  const onNext = useCallback( () => {
    onMove( clamp( currentStepId + 1, 0, 3 ) );
  }, [currentStepId, onMove] );

  const onBack = useCallback( () => {
    onMove( clamp( currentStepId - 1, 0, 3 ) );
  }, [currentStepId, onMove])

  const saveSearchConfig = useCallback( () => {
    const { formData } = state;
    updateSearchConfigService( appId, formData )
      .then( res => {
        window.OpNotification?.success({
          subject: 'Search Configuration Saved Successfully!',
        } );
        actions.saveState( { savedStepId: 0 } );
      } )
      .catch( err => {
        window.OpNotification?.danger({
          subject: 'An error occurred when saving the Search Config.',
          body: 'Please try again later.',
        });
        console.error(err);
      } );
  }, [actions, appId, state] );

  const resetForm = useCallback(() => {
    actions.overrideState( {
      formData: defaultValues,
      savedStepId: 0,
    } );
  }, [actions, defaultValues] );

  const stepTabs = useMemo( () => {
    return steps.map( ( step, index ) => {
      const isStepActive = currentStepId === index;
      const stepStyles: CSSProperties = {
        marginRight: '0.5rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '2rem',
        width: '1.5rem',
        lineHeight: '1.5rem',
        display: 'inline-grid',
        placeContent: 'center',
      };
      if ( isStepActive ) {
        stepStyles.color = '#fff';
        stepStyles.borderColor = stepStyles.backgroundColor =
          'var(--pf-global--primary-color--100)';
      }

      return (
        <FlexItem key={index} flex={{ default: 'flex_1' }}>
          <Button isBlock variant="plain" isDisabled={state.savedStepId < index}>
            <Text
              className={ isStepActive
                ? 'pf-u-primary-color-100 pf-u-font-weight-bold'
                : ''
              }
            >
              <span style={{ ...stepStyles }}>{index + 1}</span>
              {step.label}
            </Text>
          </Button>
        </FlexItem>
      );});
  }, [currentStepId, state.savedStepId] );

  const currentStep = useMemo(() => {
    const Step = steps[currentStepId].component;

    const props: IConfigureSearchStepProps = {
      onNext,
      onBack,
      onReset: resetForm,
    };
    if (currentStepId === 0) {
      props.onBack = undefined;
    }
    if (currentStepId === steps.length - 1) {
      props.onNext = saveSearchConfig;
      props.nextButtonText = 'Save'
    }
    return <Step {...props} />;
  }, [currentStepId, onBack, onNext, resetForm, saveSearchConfig] );

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Header title="Configure Search" />
        </StackItem>

        {(appLoading || searchConfigLoading) && <Loader />}

        {!appLoading && !searchConfigLoading && (
          <>
            <StackItem>
              <Flex justifyContent={{ default: 'justifyContentSpaceAround' }}>
                {stepTabs}
              </Flex>
            </StackItem>
            <StackItem>
              <Card isRounded>
                <CardBody>{currentStep}</CardBody>
              </Card>
            </StackItem>
          </>
        )}
      </Stack>
    </>
  );
}
