import {
  Button,
  Form,
  FormGroup,
  Modal,
  Text,
  TextInput,
} from '@patternfly/react-core';
import useQueryParams from 'common/hooks/useQueryParams';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function DeleteAppModal({ spa, onConfirm }: any) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAppConfirmation, setDeleteAppConfirmation] = useState('');

  const history = useHistory();
  const location = useLocation();
  const searchParams = useQueryParams();

  useEffect(() => {
    setDeleteModalOpen(searchParams.get('action') === 'delete');
  }, [ location, searchParams ]);

  const handleAppSubmit = (event: any) => {
    event.preventDefault();
    onConfirm?.();
    handleModalClose();
  };

  const handleModalClose = () => {
    searchParams.delete('action');
    history.replace({ search: searchParams.toString() });
    setDeleteAppConfirmation('');
  };

  return (
    <>
      <Modal
        variant="small"
        isOpen={isDeleteModalOpen}
        aria-label="Delete App Modal"
        title="Are you sure?"
        titleIconVariant="danger"
        showClose={true}
        onClose={handleModalClose}
      >
        <Text>
          This action is irreversible and will permanently delete the app{' '}
          <strong style={{display: 'inline-block'}}>
            <em>{spa?.name}</em>
          </strong>
          .
        </Text>
        <br />
        <Form onSubmit={handleAppSubmit}>
          <FormGroup
            fieldId="delete-spa"
            label={`Please type "${spa?.name}" to confirm`}
            isRequired
          >
            <TextInput
              id="delete-spa"
              autoFocus
              autoComplete='off'
              onChange={setDeleteAppConfirmation}
              isRequired
            ></TextInput>
          </FormGroup>
          <Button
            variant="danger"
            type="submit"
            isDisabled={spa?.name !== deleteAppConfirmation}
          >
            I understand the consequences, delete this project
          </Button>
        </Form>
      </Modal>
    </>
  );
}
