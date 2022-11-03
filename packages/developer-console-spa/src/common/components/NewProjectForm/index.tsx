import { ActionGroup, Button, Form, FormGroup, Modal, TextArea, TextInput } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import gqlClient from 'common/utils/gqlClient';
import { newProject } from 'common/utils/gql-queries';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useQueryParams from 'common/hooks/useQueryParams';
import { useCallback } from 'react';

interface IProjectInput {
  name: string;
  description: string;
}
const projectSchema = yup.object().shape( {
  name: yup.string().trim().required(),
  description: yup.string().trim(),
} );

export default function NewProjectForm () {
  const history = useHistory();
  const searchParams = useQueryParams();
  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<IProjectInput>( {
    mode: 'onBlur',
    resolver: yupResolver( projectSchema ),
    defaultValues: {
      name: '',
      description: '',
    },
  } );

  const isOpen = searchParams.get( 'new' ) === 'true';

  const handleModalClose = useCallback(() => {
    /* Reset the form */
    reset();
    /* Remove the new=true from the url search params */
    searchParams.delete('new');
    history.push({ search: searchParams.toString() });
  }, [history, reset, searchParams]);

  function submitForm ( project: IProjectInput ) {
    gqlClient({ query: newProject, variables: { project } })
      .then((res) => {
        if (res?.data?.project) {
          window.OpNotification?.success({
            subject: 'Project Created Successfully!',
          });
          history.push(res.data.project.projectId);
        }
      })
      .catch((err) => {
        window.OpNotification?.danger({
          subject: 'An error occurred when creating the Project.',
          body: 'Please try again later.',
        });
        console.error(err);
      });
  }

  return <>
    <Modal
      variant="small"
      title="Create a New Project"
      isOpen={ isOpen }
      onClose={ handleModalClose }
      showClose={false}>

      <Form noValidate={ false } onSubmit={ handleSubmit( submitForm ) } onReset={ handleModalClose }>
        <FormGroup
          label="Project Name"
          isRequired
          fieldId="project-name"
          helperText="Please provide a name for your project"
          helperTextInvalid={ errors.name?.message }
          validated={errors.name ? 'error': 'default'}>
          <Controller
            name="name"
            control={ control }
            render={ ( { field } ) => (
              <TextInput
                {...field}
                type="text"
                id="project-name"
                aria-describedby="project-name-helper"
                validated={errors.name ? 'error' : 'default'}
                placeholder="Enter project name here..."/>
            )}/>
        </FormGroup>
        <FormGroup
          label="Project Description"
          fieldId="project-desc"
          helperText="Please provide a brief description of your project"
          helperTextInvalid={ errors.description?.message }
          validated={ errors.description ? 'error' : 'default' }>
          <Controller
            name="description"
            control={ control }
            render={ ( { field } ) => (
              <TextArea
                { ...field }
                id="project-desc"
                aria-describedby="project-desc-helper"
                validated={ errors.description ? 'error' : 'default' }
                placeholder="Enter project description here..." />
            ) } />
        </FormGroup>

        <ActionGroup>
          <Button variant="primary" type="submit" isDisabled={ !isValid }>Create</Button>
          <Button variant="plain" type="reset">Cancel</Button>
        </ActionGroup>
      </Form>
    </Modal>
  </>;
}
