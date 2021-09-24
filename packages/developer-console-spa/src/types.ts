/*
 * PURPOSE: This file contains the types for the components and their state & props
 * AUTHOR: Ghanshyam Lohar
*/

import { Dispatch, SetStateAction } from 'react';

export type LinkProjectFormValues = {
    project: string,
    branch: string
}
export type ProjectType = {
    name: string,
    id: string,
    adminToken: string,
    token: string
}
export type LHConfigType = {
    _id?: string | null,
    appId: string | null,
    branch?: string,
    projectId?: string,
    createdBy?: string
}
export type LinkProjectProps = {
    selectedProject: ProjectType,
    lighthouseConfig?: LHConfigType,
    branchVariant?: boolean,
    setActiveTabKey?: Dispatch<SetStateAction<number>>,
    setLighthouseConfig: Dispatch<SetStateAction<LHConfigType>>,
    setSelectedProject?: Dispatch<SetStateAction<ProjectType>>,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}
// Create project form types
export type CreateProjectFormValues = {
    projectName: string;
    repoUrl: string;
    baseBranch: string;
};
export type CreateProjectProps = {
    setActiveTabKey: Dispatch<SetStateAction<number>>,
    setSelectedProject: Dispatch<SetStateAction<ProjectType>>,
    setShowConfirmation: Dispatch<SetStateAction<boolean>>
}
