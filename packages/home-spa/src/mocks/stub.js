export const stub = [
   {
      name: "Authentication",
      description: "Adding authentication to your application is pice of cake. Just integrate with our API and focus on application development.",
      link: "microservice-details.html#Authentication",
      icon: "img/shield.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #E2EAF6 0%, #E8E4F6 100%)",
      videoUrl: "#"
   },
   {
      name: "Feedback",
      description: "Allows users to review and rate services and products provided by teams. Built into a power packed microservice so serve all.",
      link: "microservice-details.html#Feedback",
      icon: "img/talk-bubble.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #E4F3F4 0%, #EDF6F0 100%)",
      videoUrl: "#"
   },
   {
      name: "Notification",
      description: "Notification framework for One Platform and also all other SPAs",
      link: "microservice-details.html#Notification",
      icon: "img/bell.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #FFF7C4 0%, #F2F7E6 100%)",
      videoUrl: "#"
   },
   {
      name: "User Profile",
      description: "A prebuilt integration with LDAP to authenticate, authorize and get user information.",
      link: "microservice-details.html#User Profile",
      icon: "img/login.svg",
      entityType: "microservice",
      colorScheme: "linear-gradient(119deg, #E4F3F4 0%, #F3F3F3 100%)",
      videoUrl: "#"
   },
   {
      name: "Search",
      description: "A unified search API gives you ability to search across all hosted applications on the platform.",
      link: "microservice-details.html#Search",
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
      videoUrl: "_MIaJKKxGO0"
   },
   {
      name: "Notification Management",
      description: "Manage your notification SPA",
      link: "#",
      icon: "fa-tools",
      entityType: "spa",
      colorScheme: "#",
      videoUrl: "b1kXvDscGvU"
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

export const microserviceMock = [
   {
      title: 'Authentication',
      info: 'Authentication microservices would verify and authenticate the legitimate user and grant necessary access.',
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
         'Integration with User & Group microservice to notify targetted users.',
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
];