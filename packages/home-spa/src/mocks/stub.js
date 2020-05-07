export const stub = [
   {
      name: "Authentication",
      description: "Adding authentication to your application is pice of cake. Just integrate with our API and focus on application development.",
      link: "microservice-details.html#authentication",
      icon: "img/shield.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #E2EAF6 0%, #E8E4F6 100%)",
      videoUrl: "#"
   },
   {
      name: "Feedback",
      description: "Allows users to review and rate services and products provided by teams. Built into a power packed microservice so serve all.",
      link: "microservice-details.html#feedback",
      icon: "img/talk-bubble.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #E4F3F4 0%, #EDF6F0 100%)",
      videoUrl: "#"
   },
   {
      name: "Notification",
      description: "Notification framework for One Platform and also all other SPAs",
      link: "microservice-details.html#notification",
      icon: "img/bell.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #FFF7C4 0%, #F2F7E6 100%)",
      videoUrl: "#"
   },
   {
      name: "User Profile",
      description: "A prebuilt integration with LDAP to authenticate, authorize and get user information.",
      link: "microservice-details.html#user-profile",
      icon: "img/login.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #E4F3F4 0%, #F3F3F3 100%)",
      videoUrl: "#"
   },
   {
      name: "Search",
      description: "A unified search API gives you ability to search across all hosted applications on the platform.",
      link: "microservice-details.html#search",
      icon: "img/magnifying-glass.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #FDDBDB 0%, #FDDBC7 100%)",
      videoUrl: "#"
   },
   {
      name: "Outage Management",
      description: "Outage Module is a combined tool which helps for planning and operation solutions to manage, control, visualize the process in outage management",
      link: "#",
      icon: "fa-tools",
      entityType: "spa",
      colorScheme: "#",
      videoUrl: "https://www.youtube.com/embed/_MIaJKKxGO0"
   },
   {
      name: "Notification Management",
      description: "Manage your notification SPA",
      link: "#",
      icon: "fa-tools",
      entityType: "spa",
      colorScheme: "#",
      videoUrl: "https://www.youtube.com/embed/b1kXvDscGvU"
   },
   {
      name: "DSAL",
      description: "Dev Ops savings and loan",
      link: "#",
      icon: "fa-tools",
      entityType: "spa",
      colorScheme: "",
      videoUrl: ""
   }
];

export const microserviceDetailsMock = [
   {
      title: 'Authentication',
      info: 'Authentication microservice will verify and authenticate the legitimate user and grant necessary access.',
      features: [
         'SSO integration.',
         'Authenticate SPA users using authentication microservice.',
         'Work with your microservice to authorize users.'
      ],
      illustration: 'img/Auth-illustration.svg',
   },
   {
      title: 'Notification',
      info: 'Notification microservice is tightly coupled with pre-deployed SPA’s to support needs like custom notifications, subscriptions, control over notifications configuration etc. This microservice support both time-based and trigger-based notifications.',
      features: [
         'Manage & Support hosted SPA notifications.',
         'Manage & Support notifications between SPA’s hosted over One Platform.',
         'Manage SPA Subscriptions.',
         'Notification UI to view SPA specific notifications, configuration management dashboard.',
         'Integration with User & Group microservice to notify targeted users.',
         'Integration with Hydra (near future).',
      ],
      illustration: 'img/Notification-illustration.svg',
   },
   {
      title: 'User Profile',
      info: 'User & Group microservice has been designed to handle and provide necessary user information to hosted SPA’s. The microservice is integrated with Rover to manage the groups and related membership.',
      features: [
         'Provide User & Group information.',
         'Role/Group based access control.',
         'Access permissions on the platform and hosted SPAs.',
         'LDAP & Rover Integration',
         'User Interface to view access & roles.',
      ],
      illustration: 'img/User-profile-illustration.svg',
   },
   {
      title: 'Feedback',
      info: `One Platform's GraphQL based Feedback microservice. This microservice will allow users to talk to the feedback database and can perform operations like addFeedback, updateFeedback, deleteFeedback & listFeedback`,
      features: [
         'Provide feedback for the Platform or the hosted apps from anywhere',
         'Allow users to share user experience feedback and feature requests',
         'JIRA integration to automatically create JIRA tasks for every feedback',
      ],
      illustration: 'img/Feedback-illustration.svg',
   }
];

export const teamMembers = [
   {
     name: 'Nilesh Patil',
     title: 'Manager, Software Engineering',
     gender: 'male',
   },
   {
     name: 'Sayak Sarkar',
     title: 'Senior Software Engineer',
     gender: 'male',
   },
   {
     name: 'Diwanshi Pandey',
     title: 'Senior Software Engineer',
     gender: 'female',
   },
   {
     name: 'Rigin Oommen',
     title: 'Software Engineer',
     gender: 'male',
   },
   {
     name: 'Anjnee K. Sharma',
     title: 'Software Engineer',
     gender: 'male',
   },
   {
     name: 'Mayur Deshmukh',
     title: 'Associate Software Engineer',
     gender: 'male'
   },
   {
     name: 'Sumeet Ingole',
     title: 'Associate Software Engineer',
     gender: 'male'
   },
   {
     name: 'Deepesh Nair',
     title: 'Associate Software Engineer',
     gender: 'male'
   },
 ];
