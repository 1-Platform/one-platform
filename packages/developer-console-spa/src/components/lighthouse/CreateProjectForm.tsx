import { Button, Flex, FlexItem, Form, FormGroup, TextInput } from '@patternfly/react-core';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createLightHouseProjects } from '../../services/lighthouse';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

const CreateProjectForm = ( props: any ) => {
    const [ isPrimaryLoading, setIsPrimaryLoading ] = useState( false );
    type FormValues = {
        projectName: string;
        repoUrl: string;
        baseBranch: string;
    };
    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>( {
        mode: 'onBlur'
    } );

    const createProject = (data: FormValues) => {
        setIsPrimaryLoading( true );
        let project = {
            name: data.projectName,
            baseBranch: data.baseBranch,
            externalUrl: data.repoUrl
        };
        createLightHouseProjects( project ).then( res => {
            setIsPrimaryLoading( false );
            props.setSelectedProject(res);
            props.setShowConfirmation(true);
        });
    }
    return (
        <Form onSubmit={ handleSubmit( createProject ) } className="lighthouse-projectForm--marginTop" >
            <FormGroup
                isRequired
                fieldId=""
                helperTextInvalid="Project Name is mandatory"
                helperTextInvalidIcon={ <ExclamationCircleIcon /> }
                validated={ errors.projectName ? "error" : "default"  }
                label="Project Name"
            >
                <Controller
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            type="text"
                            id="project-name"
                            aria-describedby="projectName"
                            validated={ errors.projectName ? "error" : "default" }
                        />
                    )}
                    name="projectName"
                    control={control}
                    rules={{ required: true }}
                />
            </FormGroup>
            <FormGroup fieldId="" label="Repository URL">
                <Controller
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            type="text"
                            id="project-name"
                            aria-describedby="projectName"
                        />
                    )}
                    name="repoUrl"
                    control={control}
                />
            </FormGroup>
            <FormGroup fieldId="" label="Base Branch">
                <Controller
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            type="text"
                            id="project-name"
                            aria-describedby="projectName"
                        />
                    )}
                    name="baseBranch"
                    control={control}
                />
            </FormGroup>
            <FormGroup fieldId="">
                <Flex>
                    <FlexItem align={ { default: 'alignRight' } }>
                        <Button
                            type="submit"
                            disabled={isPrimaryLoading}
                            spinnerAriaValueText={ isPrimaryLoading ? 'Loading' : undefined }
                            isLoading={ isPrimaryLoading }
                            variant="primary"
                        >
                            Create Project
                        </Button>
                    </FlexItem>
                </Flex>
            </FormGroup>
        </Form>
    );
}

export default CreateProjectForm;
