<template>
  <div>
    <opc-header heading="Feedback" theme="blue">
      <div slot="breadcrumb" id="breadcrumb">
        <nav class="pf-c-breadcrumb" aria-label="breadcrumb">
          <ol class="pf-c-breadcrumb__list" style="color: white">
            <li class="pf-c-breadcrumb__item">
              <span class="pf-c-breadcrumb__item-divider">
                <i class="fas fa-angle-right" aria-hidden="true"></i>
              </span>
              <a
                href="/"
                class="pf-c-breadcrumb__link"
                style="color: var(--pf-global--palette--white)"
                >Home</a
              >
            </li>
            <li
              class="pf-c-breadcrumb__item"
              style="color: var(--pf-global--palette--white)"
            >
              <span class="pf-c-breadcrumb__item-divider">
                <i class="fas fa-angle-right" aria-hidden="true"></i>
              </span>
              <a
                href="/feedback"
                class="pf-c-breadcrumb__link"
                aria-current="page"
                style="color:var(--pf-global--palette--white"
                >Feedback</a
              >
            </li>
          </ol>
        </nav>
      </div>
    </opc-header>
    <div id="app">
      <router-view />
    </div>
    <opc-footer theme="dark">
      <span slot="copyright"> Red Hat Inc. Internal Use Only. </span>
    </opc-footer>
  </div>
</template>

<script>
</script>

<style lang="scss">
#app {
  max-width: 1170px;
  margin: 0 auto;
  margin-bottom: 10px;
  min-height: 700px;
}
</style>
