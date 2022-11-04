import {
  Button,
  ContextSelector,
  ContextSelectorFooter,
  ContextSelectorItem,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  getLHProjects,
  getLHProjectBranches,
  createLHSpaConfig,
  deleteLHSpaConfig,
} from 'common/services/lighthouse';
import { ProjectContext } from 'common/context/ProjectContext';

type LinkProjectFormInput = {
  project: string;
  branch: string;
};

interface LinkProjectProps {
  selectedProject: Lighthouse.Project;
  lighthouseConfig?: Lighthouse.Config;
  branchVariant?: boolean;
  setActiveTabKey?: Dispatch<SetStateAction<number>>;
  setLighthouseConfig: Dispatch<SetStateAction<Lighthouse.Config>>;
  setSelectedProject?: Dispatch<SetStateAction<Lighthouse.Project>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const LinkProjectForm = (props: LinkProjectProps) => {
  const {
    branchVariant,
    selectedProject,
    setSelectedProject,
    lighthouseConfig,
    setLighthouseConfig,
    setIsModalOpen,
    setActiveTabKey,
  } = props;
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);
  const { control, handleSubmit, setValue } = useForm<LinkProjectFormInput>();

  //For branch select
  const [branches, setBranches] = useState(Array<string>());
  const [isBranchListOpen, setIsBranchListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { projectId } = useContext(ProjectContext);

  const editMode = Boolean(lighthouseConfig?.projectId);

  useEffect(() => {
    !branchVariant &&
      getLHProjects().then((res: any) => {
        setProjects(res);
        let project;
        if (editMode) {
          project = res.filter((projectObj: any) => {
            return projectObj.id === lighthouseConfig?.projectId;
          })[0];
          setValue('project', project.name, { shouldDirty: true });
        } else {
          project = res[0] || {
            name: '',
            id: '',
            adminToken: '',
            token: '',
          };
        }
        setSelectedProject && setSelectedProject(project);
        getLHProjectBranches(project.id).then((brancheArr: any) => {
          const arr = brancheArr.map((branchObj: any) => branchObj.branch);
          // Edit mode logic to polpulate the branch select
          if (editMode) {
            const pos = arr.indexOf(lighthouseConfig?.branch);
            let branch = arr[pos] || lighthouseConfig?.branch;
            setValue('branch', branch, { shouldDirty: true });
            if (pos === -1) {
              arr.push(branch);
            }
          }
          setBranches(arr);
        });
        setFilteredProjects(res);
      });
  }, [branchVariant, editMode, lighthouseConfig, setSelectedProject, setValue]);
  const onBranchToggle = (isOpen: any) => {
    setIsBranchListOpen((isOpen: boolean) => !isOpen);
  };
  const onCreateOption = (newValue: any) => {
    const config = {
      appId: projectId,
      projectId: selectedProject.id,
      branch: newValue,
      createdBy: window.OpAuthHelper.getUserInfo().rhatUUID,
    };
    createLHSpaConfig(config).then((res) => {
      setLighthouseConfig(res);
      window.OpNotification?.success({
        subject: 'SPA configuration saved successfully!',
      });
      setBranches([...branches, newValue]);
    });
  };
  const clearSelection = () => {
    setValue('branch', '');
    setIsBranchListOpen(false);
  };
  const onToggle = (
    event: React.FormEvent<HTMLSelectElement>,
    isOpen: boolean
  ) => {
    setIsProjectListOpen((isOpen: boolean) => !isOpen);
  };
  const onSearchInputChange = (value: any) => {
    setSearchTerm(value);
  };
  const onSearchButtonClick = (event: any) => {
    let filteredProjects =
      searchTerm === ''
        ? projects
        : projects.filter(
            (project: any) =>
              project.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
              -1
          );
    setFilteredProjects(filteredProjects);
  };

  const linkProject = (data: LinkProjectFormInput) => {
    setIsPrimaryLoading(true);
    const config = {
      appId: projectId,
      projectId: selectedProject.id,
      branch: data.branch,
      createdBy: window.OpAuthHelper.getUserInfo().rhatUUID,
    };
    createLHSpaConfig(config).then((res: any) => {
      setIsPrimaryLoading(false);
      setLighthouseConfig(res);
      window.OpNotification?.success({
        subject: 'SPA configuration saved successfully!',
      });
      setIsModalOpen(false);
    });
  };
  const removeLHSpaConfig = () => {
    if (!lighthouseConfig?._id) {
      return;
    }
    deleteLHSpaConfig(lighthouseConfig._id).then((res: any) => {
      setLighthouseConfig({ appId: null, _id: null });
      window.OpNotification?.success({
        subject: 'SPA configuration deleted successfully!',
      });
      setIsModalOpen(false);
    });
  };
  return (
    <Form onSubmit={handleSubmit(linkProject)}>
      {!branchVariant && (
        <Controller
          rules={{ required: true }}
          name="project"
          control={control}
          render={({ field, formState: { errors } }) => {
            return (
              <FormGroup
                isRequired
                fieldId=""
                label="Project Name"
                helperTextInvalid="Project is mandatory field"
                helperTextInvalidIcon={
                  <ion-icon name="alert-circle-outline"></ion-icon>
                }
                validated={errors.project ? 'error' : 'default'}
                helperText="Select a project to link your app with the project."
              >
                <ContextSelector
                  className="lighthouse-projectList--filled"
                  toggleText={field.value}
                  onSearchInputChange={onSearchInputChange}
                  isOpen={isProjectListOpen}
                  searchInputValue={searchTerm}
                  onToggle={onToggle}
                  onSelect={(
                    event: React.FormEvent<HTMLSelectElement>,
                    selection: any
                  ) => {
                    clearSelection();
                    const selProject: any = projects.filter((project: any) => {
                      return project.name === selection;
                    });
                    setSelectedProject && setSelectedProject(selProject[0]);
                    getLHProjectBranches(selProject[0].id).then(
                      (brancheArr: any) => {
                        const arr = brancheArr.map(
                          (branchObj: any) => branchObj.branch
                        );
                        setBranches(arr);
                      }
                    );
                    setIsProjectListOpen(false);
                    field.onChange(selection);
                  }}
                  onSearchButtonClick={onSearchButtonClick}
                  screenReaderLabel="Selected Project"
                  footer={
                    <ContextSelectorFooter>
                      <Button
                        variant="link"
                        isInline
                        onClick={() => setActiveTabKey && setActiveTabKey(0)}
                      >
                        Create a project
                      </Button>
                    </ContextSelectorFooter>
                  }
                >
                  {filteredProjects.map((item: any, index) => (
                    <ContextSelectorItem key={index}>
                      {item.name}
                    </ContextSelectorItem>
                  ))}
                </ContextSelector>
              </FormGroup>
            );
          }}
        />
      )}
      {selectedProject.id !== '' && (
        <Controller
          rules={{ required: true }}
          name="branch"
          control={control}
          render={({ field, formState: { errors } }) => {
            return (
              <FormGroup
                isRequired
                fieldId=""
                label="Select a branch"
                helperTextInvalid="Branch is mandatory field"
                helperTextInvalidIcon={
                  <ion-icon name="alert-circle-outline"></ion-icon>
                }
                validated={errors.branch ? 'error' : 'default'}
                helperText="Start typing in the field to find a branch or create one if it does not exists."
              >
                <Select
                  isPlain={false}
                  variant={SelectVariant.typeahead}
                  typeAheadAriaLabel="Select a state"
                  onToggle={onBranchToggle}
                  onSelect={(
                    event: any,
                    selection: any,
                    isPlaceholder: any
                  ) => {
                    if (isPlaceholder) clearSelection();
                    else {
                      setIsBranchListOpen(false);
                    }
                    field.onChange(selection);
                  }}
                  onClear={clearSelection}
                  selections={field.value}
                  isOpen={isBranchListOpen}
                  aria-labelledby={'Select a branch'}
                  placeholderText="Select a branch"
                  isCreatable={true}
                  onCreateOption={onCreateOption}
                >
                  {branches.map((branch: any, index: any) => (
                    <SelectOption key={index} value={branch} />
                  ))}
                </Select>
              </FormGroup>
            );
          }}
        />
      )}
      <FormGroup fieldId="">
        <Flex>
          {editMode && (
            <FlexItem>
              <Button
                variant="plain"
                className="pf-u-danger-color-100"
                onClick={removeLHSpaConfig}
              >
                Delete Project
              </Button>
            </FlexItem>
          )}
          <FlexItem align={{ default: 'alignRight' }}>
            <Button
              key="Confirm"
              type="submit"
              variant="primary"
              //onClick={ linkProject }
              isLoading={isPrimaryLoading}
            >
              Link Project
            </Button>
          </FlexItem>
        </Flex>
      </FormGroup>
    </Form>
  );
};

export default LinkProjectForm;
