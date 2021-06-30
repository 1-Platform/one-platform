import { getContactUsTeamDetails, getData } from '../service/service';

export const contactUsTeamBlock = () => {
  const teamBlock = document.querySelector('#team-block');
  if ( teamBlock !== null ) {
    getData( getContactUsTeamDetails ).then( ( result ) => {
        const teamMembers = result.data.group.members.sort((a, b) =>
          a.cn.localeCompare(b.cn)
        );
      teamBlock.innerHTML = teamMembers
        .map((member) => {
          return `
      <div class="team-block__list--item">
          <img src="/res/img/avatar.svg" alt="">
          <span class="name">${member.cn}</span>
          <span class="title">${member.rhatJobTitle}</span>
      </div>`;
        })
        .join("");
    } ).catch( ( err ) => {
      console.error( err );
    })
  }
}
