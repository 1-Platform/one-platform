import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import gqlClient from '../../utils/gqlClient';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TrashIcon from '@patternfly/react-icons/dist/esm/icons/trash-icon';
import { useContext, useState } from 'react';
import { deleteAppDatabase } from 'utils/gql-queries/delete-app-database';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'context/AppContext';

interface DeleteDBInput {
  dbname: string;
}

interface DeleteDBProps {
  dbname: string;
  appUniqueId: string;
  appId: string;
}

const DeleteDBForm = (props: DeleteDBProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ isDeletingDB, setIsDeletingDB ] = useState<boolean>( false );
  const { forceRefreshApp } = useContext(AppContext);
  const deleteFormSchema = yup.object().shape({
    dbname: yup
      .string()
      .required()
      .matches(
        new RegExp(props.dbname),
        `dbname must match the following: ${props.dbname}`
      ),
  } );
  let history = useHistory();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteDBInput>({
    mode: 'onBlur',
    resolver: yupResolver(deleteFormSchema),
  });

  const handleModalToggle = () => {
    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  const showConfirmation = (db: DeleteDBInput) => {
    setIsModalOpen(true);
  };
  const DeleteDBInstance = () => {

    setIsDeletingDB(true);
    gqlClient({
      query: deleteAppDatabase,
      variables: {
        databaseName: props.dbname,
        id: props.appUniqueId,
      },
    })
      .then((res: any) => {
        window.OpNotification?.success({
          subject: `Database ${props.dbname} deleted successfully!`,
        });
        history.push( `/${ props.appId }/couchdb` );
        forceRefreshApp( res.data.deleteAppDatabase );
        setIsModalOpen(false);
      })
      .catch((err: any) => {
        window.OpNotification?.danger({
          subject: 'An error occurred when deleting the Database.',
          body: 'Please try again later.',
        });
        console.error(err);
      });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(showConfirmation)}>
        <FormGroup
          label={`Please type "${props.dbname}" to confirm`}
          fieldId="delete-app"
          helperText="Please type the DB name to cofirm database delete"
          helperTextInvalid={errors.dbname?.message}
          validated={errors.dbname ? 'error' : 'default'}
        >
          <Controller
            name="dbname"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="delete-app"
                aria-describedby="delete-app-helper"
                validated={
                  errors.dbname || props.dbname !== field.value
                    ? 'error'
                    : 'default'
                }
                placeholder="Enter database name here..."
              />
            )}
          />
        </FormGroup>
        <ActionGroup>
          <Button
            variant="danger"
            icon={<TrashIcon />}
            type="submit"
            iconPosition="left"
          >
            Delete
          </Button>
        </ActionGroup>
      </Form>
      <Modal
        variant={ModalVariant.small}
        title={`Are you sure to delete ${props.dbname}?`}
        titleIconVariant="danger"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button
            key="confirm"
            variant="danger"
            onClick={DeleteDBInstance}
            isLoading={isDeletingDB}
          >
            Yes, Delete
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>,
        ]}
      >
        You are deleting the Database from CouchDB, this operation will delete
        all data permanently.
      </Modal>
    </>
  );
};
export default DeleteDBForm;
