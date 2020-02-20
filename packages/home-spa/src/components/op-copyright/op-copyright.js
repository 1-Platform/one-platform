import html from 'html-template-tag';

const copyright = document.createElement('template');

copyright.innerHTML = html`
<div class="copyight-section">
	<span class="copyright">
			Copyright &copy; <span id="year"></span> <slot name="name">All rights reserved</slot>
	</span>
</div>
<style>
	.copyight-section {
		font-size: 14px;
		color: #72767B;
	}
</style>
`;

/**
 *
 * @class OpCopyright
 * @extends {HTMLElement}
 */
class OpCopyright extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(copyright.content.cloneNode(true));
		if (this.getAttribute('year') === null) {
			shadow.getElementById('year').innerHTML = new Date().getFullYear();
		} else {
			shadow.getElementById('year').innerHTML = this.getAttribute('year');
		}
	}
}
window.customElements.define('op-copyright', OpCopyright);
