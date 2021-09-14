import * as microservices from '../res/static/microservices.json';
import * as spas from '../res/static/applications.json';

export const microserviceCards = () => {
    const microservicesCardDetails = microservices.default;
    const microserviceHTMLObject = document.querySelector('#microservices');
    if (microserviceHTMLObject !== null) {
        microserviceHTMLObject.innerHTML = microservicesCardDetails.map(
            (details, index) => {
                if (index % 2 == 0) {
                    return `
                    <div class="services__microservices-card">
                        <div class="text">
                            <h3>${details.name}</h3>
                            <p>${details.description}</p>
                            <a target="_blank" rel="noopener" href="${details.link}">Learn more</a>
                        </div>
                        <div class="img">
                            <img src="${details.icon}" alt="">
                        </div>
                    </div>`;
                }
                return `
                    <div class="services__microservices-card">
                        <div class="img">
                            <img src="${details.icon}" alt="">
                        </div>
                        <div class="text">
                            <h3>${details.name}</h3>
                            <p>${details.description}</p>
                            <a target="_blank" rel="noopener" href="${details.link}">Learn more</a>
                        </div>
                    </div>`; 
            } 
        ).join('');
    }
};

export const applicationCards = () => {
    const spaInfo = spas.default;
    const spaHTMLObject = document.querySelector("#apps");
    if (spaHTMLObject !== null) {
        spaHTMLObject.innerHTML = spaInfo
        .slice(0, 12)
        .map(
            (spa) => {
                return `
                <a rel="noopener" class="app" href="${spa.path}">
                <div class="app__logo">
                  <img src="../res/img/cube.svg" alt="cube">
                </div>
                <div class="app__label">
                 <h3>${spa.name.slice(0, 30)}</h3>
                 <span>${spa.applicationType.toLowerCase()}</span>
                </div>
               </a>`;
            }
        ).join('')
    }
}
