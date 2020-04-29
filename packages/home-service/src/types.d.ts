declare module '*.graphql';
declare module '*.json';

// define your types here
type HomeType = {
    name: string;
    description: string;
    link: string;
    icon: string;
    entityType: string;
    colorScheme: string;
    videoUrl: string;
}

type MicroserviceDetailsType = {
    title: string;
    info: string;
    features: string[];
    illustration: string;
}