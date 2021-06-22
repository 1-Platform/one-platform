export const renderSPAList = (homeList) => {
    const spaListForFourZeroFour = document.querySelector('#banner-links');
    if (spaListForFourZeroFour !== null) {
      spaListForFourZeroFour.innerHTML = homeList.map(spa =>
        {
          if (spa) {
            return `<a href="${spa.link}"><em class="fa ${spa.icon}"></em>${spa.name}</a>`;
          }
        }
      ).splice(0,10).join('');
    }
};
