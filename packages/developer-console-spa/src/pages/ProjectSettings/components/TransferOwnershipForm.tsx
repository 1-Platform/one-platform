import {
  Button,
  Form,
  FormGroup,
  Modal,
  Select,
  SelectOption,
  SelectOptionObject,
  Text,
} from '@patternfly/react-core';
import useDebounceEffect from 'common/hooks/useDebounceEffect';
import { findUsers } from 'common/services/userGroup';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type TransferOwnershipFormData = {
  search: string;
  uid: string;
  name: string;
  email: string;
};

interface ITransferOwnershipFormProps {
  isModalOpen?: boolean;
  projectName: string;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit?: (userId: string) => void;
}

export default function TransferOwnershipForm({
  isModalOpen,
  projectName,
  isSaving,
  onCancel,
  onSubmit,
}: ITransferOwnershipFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<TransferOwnershipFormData>({ mode: 'onBlur' });
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
  const [isSearching, setSearching] = useState(false);

  useDebounceEffect(() => {
    if (
      !searchText ||
      searchText.length < 3 ||
      searchText === getValues('search')
    ) {
      setSearching(false);
      return;
    }
    setAutocompleteOpen(true);
    setSearching(true);

    const abortController = new AbortController();
    const signal = abortController.signal;
    findUsers(searchText, signal)
      .then((users) => {
        setSearchResults(users);
        setSearching(false);
      })
      .finally(() => {
        setSearching(false);
      });
    return () => abortController.abort();
  }, [searchText]);

  const handleSearchToggle = useCallback((state: boolean) => {
    setAutocompleteOpen(state);
    if (state) {
      setSearching(state);
    }
  }, []);

  const selectMember = useCallback(
    (user: User) => {
      setValue('name', user.name ?? '');
      setValue('email', user.email ?? '');
      setValue('uid', user.id ?? '');
    },
    [setValue]
  );

  const dismissSelectedMember = useCallback(() => {
    setValue('name', '');
    setValue('email', '');
    setValue('uid', '');
  }, [setValue]);

  const handleMemberSelect = useCallback(
    (email: string | SelectOptionObject) => {
      setAutocompleteOpen(false);

      const user = searchResults.find((result) => result.email === email);
      if (user) {
        selectMember(user);
      }
    },
    [searchResults, selectMember]
  );

  const handleCancel = useCallback(() => {
    reset();
    onCancel?.();
  }, [onCancel, reset]);

  const submit = useCallback(
    (data: TransferOwnershipFormData) => {
      onSubmit?.(data.uid);
    },
    [onSubmit]
  );

  const resultsMessage = isSearching ? 'Searching...' : 'No results found';

  const autocomplete = isSearching
    ? undefined
    : searchResults
        .filter((user) => user.id && user.email)
        .map((user, index) => (
          <SelectOption
            key={index}
            value={user.email}
            description={user.name}
          />
        ));

  return (
    <Modal
      variant="small"
      isOpen={isModalOpen}
      aria-label="Transfer Ownership Modal"
      title="Transfer App Ownership"
      titleIconVariant="warning"
      showClose={true}
      onClose={onCancel}
    >
      <Text>
        The ownership of <strong>{projectName}</strong> will be transfered to
        another user.
      </Text>
      <Text>
        Don't worry, you'll still have <strong>editor</strong> access.
      </Text>
      <br />
      <Form onSubmit={handleSubmit(submit)} onReset={handleCancel}>
        <FormGroup
          isRequired
          fieldId="email"
          label="Email Address"
          helperTextInvalid={errors.email?.message}
          validated={errors.email ? 'error' : 'default'}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                variant="typeahead"
                placeholderText="Search user by email address"
                noResultsFoundText={resultsMessage}
                isOpen={isAutocompleteOpen}
                onToggle={() => handleSearchToggle(!isAutocompleteOpen)}
                selections={field.value}
                onTypeaheadInputChanged={setSearchText}
                onSelect={(event, value) => handleMemberSelect(value)}
                onClear={dismissSelectedMember}
                validated={errors.email ? 'error' : 'default'}
              >
                {autocomplete}
              </Select>
            )}
          />
        </FormGroup>
        <Button variant="danger" type="submit" isLoading={isSaving}>
          Transfer
        </Button>
        <Button variant="link" type="reset">
          Cancel
        </Button>
      </Form>
    </Modal>
  );
}
