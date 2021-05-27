export const contactUsTeamBlock = () => {
  const teamMembers = [
    {
      name: 'Nilesh Patil',
      title: 'Manager, Software Engineering',
      gender: 'male',
    },
    {
      name: 'Sayak Sarkar',
      title: 'Principle Software Engineer',
      gender: 'male',
    },
    {
       name: 'Ghanshyam Lohar',
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
      title: 'Senior Software Engineer',
      gender: 'male',
    },
    {
      name: 'Mayur Deshmukh',
      title: 'Software Engineer',
      gender: 'male'
    },
    {
      name: 'Sumeet Ingole',
      title: 'Software Engineer',
      gender: 'male'
    },
    {
      name: 'Prasad Ambulkar',
      title: 'Software Engineer',
      gender: 'male'
    },
    {
      name: 'Deepesh Nair',
      title: 'Software Engineer',
      gender: 'male'
    },
  ];
  const teamBlock = document.querySelector('#team-block');
  if (teamBlock !== null) {
    teamBlock.innerHTML = teamMembers.map(member => {
      return `
      <div class="team-block__list--item">
          <img src="/res/img/${member.gender === 'male' ? 'user-male.svg': 'user-female.svg'}" alt="">
          <span class="name">${member.name}</span>
          <span class="title">${member.title}</span>
      </div>`;
    })
    .join('');
  }
}
