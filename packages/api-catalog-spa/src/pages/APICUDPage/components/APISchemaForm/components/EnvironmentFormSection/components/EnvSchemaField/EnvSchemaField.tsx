import { forwardRef } from 'react';
import {
  Button,
  FormGroup,
  Popover,
  Spinner,
  Split,
  SplitItem,
  TextInput,
  TextInputProps,
} from '@patternfly/react-core';
import { HelpIcon, UndoIcon } from '@patternfly/react-icons';
import { useToggle } from 'hooks';

type Props = {
  envIndex: number;
  onCopyValue: () => void;
  onRedoValidation: () => void | Promise<void>;
  isGraphqlAPI?: boolean;
  isError?: boolean;
  errorMessage?: string;
} & TextInputProps;

export const EnvSchemaField = forwardRef<HTMLInputElement, Props>(
  (
    { isGraphqlAPI, isError, errorMessage, envIndex, onCopyValue, onRedoValidation, ...inputProps },
    ref
  ): JSX.Element => {
    const [isValidating, setIsValidating] = useToggle();

    const handleRedoValidation = async () => {
      setIsValidating.on();
      await onRedoValidation();
      setIsValidating.off();
    };

    return (
      <FormGroup
        fieldId={`environments.${envIndex}.schemaEndpoint`}
        label={isGraphqlAPI ? 'Introspection URL' : 'API Schema URL'}
        validated={isError ? 'error' : 'success'}
        helperTextInvalid={errorMessage}
        labelIcon={
          isGraphqlAPI ? (
            <Popover
              headerContent={<div>What is Introsepection URL?</div>}
              bodyContent={
                <div>
                  GraphQL schema for information about what queries it supports. GraphQL allows us
                  to do so using the introspection system. For more information visit:{' '}
                  <a
                    href="https://graphql.org/learn/introspection/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Doc
                  </a>
                </div>
              }
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
          ) : undefined
        }
        helperText={
          isGraphqlAPI &&
          !inputProps.value && (
            <Button
              variant="plain"
              className="pf-u-font-size-xs pf-u-px-0 pf-u-mt-xs"
              onClick={onCopyValue}
            >
              Click here to use API Base Path as introspection URL
            </Button>
          )
        }
      >
        <Split>
          <SplitItem isFilled>
            <TextInput
              aria-label="env link"
              placeholder="Enter api schema URL"
              ref={ref}
              {...inputProps}
              onBlur={(event) => {
                handleRedoValidation();
                if (inputProps?.onBlur) inputProps?.onBlur(event);
              }}
            />
          </SplitItem>
          <SplitItem>
            <Button variant="control" onClick={handleRedoValidation} isDisabled={isValidating}>
              {isValidating ? <Spinner size="sm" /> : <UndoIcon />}
            </Button>
          </SplitItem>
        </Split>
      </FormGroup>
    );
  }
);
