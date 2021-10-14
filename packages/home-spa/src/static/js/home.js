window.OpAuthHelper.onLogin(() => {
  getData(getHomeTypeBySPA)
    .then((result) => {
      const apps = result.data.apps ? result.data.apps : [];
      localStorage.setItem("spaList", JSON.stringify(apps));
      applicationCards(apps);
    })
    .catch((err) => {
      console.error(err);
      window.OpNotification.danger({ subject: err.message });
    });
});

window.openAppDrawer = () => {
  try {
    document.querySelector("opc-menu-drawer").open();
  } catch (err) {
    return err;
  }
};

const applicationCards = (apps) => {
  const spaHTMLObject = document.querySelector("#apps");
  if (spaHTMLObject !== null) {
    spaHTMLObject.innerHTML = apps
      .slice(0, 12)
      .map((spa) => {
        return `<a rel="noopener" class="app" href="${spa.path}">
              <div class="app__logo">
                <img src="/static/img/app-cube-white.svg" alt="cube">
              </div>
              <div class="app__label">
               <h3>${spa.name.slice(0, 30)}</h3>
               <span>${spa.applicationType.toLowerCase()}</span>
              </div>
             </a>`;
      })
      .join("");
  }
};
