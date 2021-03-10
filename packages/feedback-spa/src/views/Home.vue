<template>
<div>
  <div class="home pf-u-mt-4xl" v-if="!loading">
    <div class="pf-l-grid pf-m-gutter">
      <div class="pf-l-grid__item pf-m-4-col" v-for="(stat, index) in feedbackStats" v-bind:key="stat.id">
        <div class="pf-c-card click-card" id="card-action" v-on:click="setCategory(stat.title, index)" v-bind:class="{ 'active':index === selectedCategoryIndex }">
          <div class="pf-c-card__header">
            <i v-bind:class="stat.icon"></i>
            <div class="pf-c-card__actions">
              <div class="count">
                {{ stat.count }}
              </div>
            </div>
          </div>
          <div class="pf-c-card__body" id="card-action-check-label">
            <p>{{ stat.title }}</p>
            <div class="pf-c-progress pf-m-sm" id="progress-sm-example">
              <div class="pf-c-progress__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                aria-valuenow="100" aria-describedby="progress-sm-example-description">
                <div class="pf-c-progress__indicator" style="width:100%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pf-l-grid pf-m-gutter pf-u-mt-xl">
      <div class="pf-u-display-flex pf-m-8-col">
        <div v-for="(state, index) in feedbackStates" v-bind:key="state.id">
          <div class="status-box" v-on:click="setState(state.name, index)" v-bind:class="{'active': index === selectedStateIndex}">
          {{ state.name }}
            <span class="badge op-badge" v-bind:class="{'op-open': state.name === 'Open', 'op-close': state.name ==='Close'}" v-if="state.name !=='All'">{{ state.count }}</span>
          </div>
        </div>

        <div class="pf-u-ml-md pf-c-dropdown pf-m-expanded">
          <button class="pf-c-dropdown__toggle" type="button" id="dropdown-expanded-button" aria-expanded="true" v-on:click="enableToogle=!enableToogle">
            <span class="pf-c-dropdown__toggle-text"><i class="fas fa-star fa-xs"></i>&nbsp;{{ selectedModule || 'Any'}}</span>
            <span class="pf-c-dropdown__toggle-icon">
              <i class="fas fa-caret-down" aria-hidden="true"></i>
            </span>
          </button>
            <ul class="pf-c-dropdown__menu" aria-labelledby="dropdown-expanded-button" v-if="enableToogle">
              <li>
                <a class="pf-c-dropdown__menu-item" v-on:click="selectedModule='Any';enableToogle=!enableToogle">Any</a>
              </li>
              <li v-for="(module, index) in uniqueModuleList(allFeedback)" v-bind:key="index">
                <a class="pf-c-dropdown__menu-item" v-on:click="selectedModule=module;enableToogle=!enableToogle">{{ module }}</a>
              </li>
            </ul>
        </div>
      </div>
      <div class="pf-l-grid__item pf-m-1-col">
        <button class="pf-c-button pf-m-secondary" type="button" v-on:click="csvExport(allFeedback)"><i class="fas fa-upload"></i>&nbsp;Export</button>
      </div>
      <div class="pf-u-ml-sm pf-l-grid__item pf-m-3-col">
        <div class="pf-c-input-group">
          <input class="pf-c-form-control" placeholder="Search Feedback" type="search" id="input-search" name="search-input" aria-label="Search" v-model="searchText"/>
          <button class="pf-c-button pf-m-control" type="button" aria-label="Search button for search input">
            <i class="fas fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="pf-u-mt-xl">
      <span v-for="feedback in filterFeedback(allFeedback, this.pageSize, this.pageNumber)" v-bind:key="feedback._id">
        <ListFeedback  v-if="recordSize !== 0" :feedback="feedback" @openModal="openDetailsModal(feedback)"/>
      </span>
        <div class="pf-u-mt-xl" v-if="recordSize === 0">
          <p class="pf-u-text-align-center">No Feedback Found.</p>
        </div>
      <!-- Pagination -->
      <div class="pf-c-pagination pf-m-compact" v-if="recordSize !== 0">
        <div class="pf-c-options-menu">
          <div class="pf-c-options-menu__toggle pf-m-text pf-m-plain">
            <span class="pf-c-options-menu__toggle-text">
              <b>{{ Number(pageNumber) + 1  }} - {{ (this.allFeedback.length > Number(pageSize)) ? Number(pageSize) : this.allFeedback.length }}</b>&nbsp;of&nbsp;
              <b>{{ this.allFeedback.length }}</b>
            </span>
          </div>
          <select class="pf-c-form-control page-width" id="perPage" name="perPage" aria-label="per page entry" v-model="pageSize">
            <option value="5">5 per page</option>
            <option value="10" selected>10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
        <nav class="pf-c-pagination__nav" aria-label="Pagination">
          <div class="pf-c-pagination__nav-control pf-m-prev">
            <button class="pf-c-button pf-m-plain" type="button" :disabled="Number(pageNumber) < Number(pageSize)" aria-label="Go to previous page" v-on:click="pageNumber = Number(pageNumber) - Number(pageSize)">
              <i class="fas fa-angle-left" aria-hidden="true"></i>
            </button>
          </div>
          <div class="pf-c-pagination__nav-control pf-m-next">
            <button class="pf-c-button pf-m-plain" type="button" :disabled="Number(pageNumber) > Number(pageSize)" aria-label="Go to next page" v-on:click="pageNumber = Number(pageNumber) + Number(pageSize)">
              <i class="fas fa-angle-right" aria-hidden="true"></i>
            </button>
          </div>
        </nav>
      </div>
    </div>
    <!-- Modal -->
    <div class="pf-c-backdrop pf-l-bullseye" v-if="showModal">
        <div class="pf-c-modal-box pf-m-md" role="dialog" aria-modal="true" aria-labelledby="modal-md-title" aria-describedby="modal-md-description">
          <button class="pf-c-button pf-m-plain" type="button" aria-label="Close dialog" v-on:click="showModal = !showModal">
          <i class="fas fa-times" aria-hidden="true"></i>
          </button>
          <header class="pf-c-modal-box__header">
              <h1 class="pf-c-modal-box__title" id="modal-md-title">
                <span class="pf-c-modal-box__title-icon">
                  <i class="fas fa-fw fa-link" aria-hidden="true"></i>
                </span>
                <a class="link-color" :href="`${selectedFeedback.ticketUrl}`" target="_blank">
                Issue - {{ selectedFeedback.ticketUrl.split( '/' )[ selectedFeedback.ticketUrl.split( '/' ).length - 1 ] }}</a></h1>
          </header>
          <div class="pf-c-modal-box__body" id="modal-md-description">
            {{selectedFeedback.summary}}<br/>

          <div class="pf-u-mt-sm pf-u-display-flex pf-l-grid pf-m-gutter">
            <span class="pf-c-label">
              <span class="pf-c-label__content">{{selectedFeedback.module.toUpperCase()}}</span>
            </span>

            <span class="pf-c-label pf-m-red">
              <span class="pf-c-label__content">{{selectedFeedback.state.toUpperCase()}}</span>
            </span>
          </div>

          <div class="pf-u-mt-sm pf-l-grid pf-m-gutter">
            <div class=" pf-m-6-col">
              Created By
              <p><a v-bind:href="`mailto:${selectedFeedback.createdBy.uid}@redhat.com`">{{selectedFeedback.createdBy.name || 'N/A'}}</a></p>
            </div>

            <div class=" pf-m-6-col">
              Assignee(s)
              <p><a v-bind:href="`mailto:${selectedFeedback.assignee.email}`">{{selectedFeedback.assignee.name || 'N/A'}}</a></p>
            </div>
          </div>

          <div class="pf-u-mt-sm pf-l-grid pf-m-gutter" v-if="selectedFeedback.experience">
            <div class=" pf-m-12-col">
              Experience
              <p>{{selectedFeedback.experience}}</p>
            </div>
          </div>

          <div class="pf-u-mt-sm pf-l-grid pf-m-gutter">
            <div class=" pf-m-12-col">
              Description
              <p>{{selectedFeedback.description}}</p>
            </div>
          </div>

          </div>
        </div>
    </div>
  </div>

<!-- Loader -->
  <div class="pf-u-text-align-center pf-u-mt-4xl" v-if="loading">
    <span class="pf-c-spinner" role="progressbar" aria-valuetext="Loading...">
        <span class="pf-c-spinner__clipper"></span>
        <span class="pf-c-spinner__lead-ball"></span>
        <span class="pf-c-spinner__tail-ball"></span>
    </span>
  </div>
</div>
</template>

<script>
import { ListFeedbacks } from '../graphql/gqlQueries'
import ListFeedback from '@/components/ListFeedback.vue'
import jsonexport from 'jsonexport'

export default {
  name: 'Feedback',
  components: {
    ListFeedback
  },
  data () {
    return {
      allFeedback: [],
      feedbackStats: [],
      feedbackStates: [
        {
          id: 1,
          name: 'All',
          count: 0
        },
        {
          id: 2,
          name: 'Open',
          count: 0
        },
        {
          id: 3,
          name: 'Close',
          count: 0
        }
      ],
      loading: true,
      activeCategory: null,
      selectedCategoryIndex: null,
      selectedStateIndex: null,
      selectedState: null,
      enableToogle: false,
      selectedModule: null,
      searchText: null,
      showModal: false,
      selectedFeedback: null,
      pageSize: 10,
      pageNumber: 0,
      recordSize: 0
    }
  },
  async created () {
    this.allFeedback = await this.$apollo.query({
      query: ListFeedbacks
    }).then(response => {
      this.loading = response.loading
      return response.data.listFeedbacks
    })
    this.feedbackStats = [
      {
        id: 1,
        count: this.allFeedback.length,
        title: 'All',
        icon: 'fas fa-th-list'
      },
      {
        id: 2,
        count: (this.allFeedback.filter(feedback => feedback.category === 'FEEDBACK')).length,
        title: 'Feedback',
        icon: 'fas fa-comment-alt'
      },
      {
        id: 3,
        count: (this.allFeedback.filter(feedback => feedback.category === 'BUG')).length,
        title: 'Bug',
        icon: 'fas fa-bug'
      }
    ]
  },
  methods: {
    setCategory: function (category, index) {
      this.selectedCategoryIndex = index
      if (category === 'Feedback') {
        this.activeCategory = 'FEEDBACK'
      } else if (category === 'Bug') {
        this.activeCategory = 'BUG'
      } else {
        this.activeCategory = null
      }
    },
    setState: function (state, index) {
      this.selectedStateIndex = index
      this.selectedState = state.toLowerCase()
    },
    matcher: function (expression) {
      return (obj) => {
        let found = false
        Object.keys(obj).forEach((key) => {
          if (!found) {
            if ((typeof obj[key] === 'string') && expression.exec(obj[key])) {
              found = true
            }
          }
        })
        return found
      }
    },
    filterFeedback: function (feedbackList, pageSize, pageNumber) {
      if (this.activeCategory) {
        feedbackList = feedbackList.filter(feedback => feedback.category === this.activeCategory)
      }
      this.feedbackStates[1].count = (feedbackList?.filter(feedback => !feedback.state.toLowerCase().includes('close'))).length
      this.feedbackStates[2].count = (feedbackList.filter(feedback => feedback.state.toLowerCase().includes('close'))).length
      if (this.selectedState) {
        if (this.selectedState.includes('close')) {
          feedbackList = feedbackList.filter(feedback => feedback.state.toLowerCase().includes('close'))
        } else if (!this.selectedState.includes('close') && !this.selectedState.includes('all')) {
          feedbackList = feedbackList.filter(feedback => !feedback.state.toLowerCase().includes('close'))
        }
      }
      if (this.selectedModule && this.selectedModule !== 'Any') {
        feedbackList = feedbackList.filter(feedback => feedback.module === this.selectedModule)
      }
      if (this.searchText) {
        feedbackList = feedbackList.filter(this.matcher(new RegExp('\\b' + this.searchText + '\\b', 'i')))
      }
      feedbackList = feedbackList.slice(Number(pageNumber), Number(pageNumber) + Number(pageSize))
      this.recordSize = feedbackList.length
      return feedbackList
    },
    uniqueModuleList: function (feedbackList) {
      return [...new Set(feedbackList.map(feedback => feedback.module))]
    },
    openDetailsModal: function (feedback) {
      this.selectedFeedback = feedback
      this.showModal = true
    },
    csvExport: function (arrData) {
      jsonexport(arrData, (err, csv) => {
        if (err) return console.error(err)
        let csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += csv
        const data = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', data)
        link.setAttribute('download', 'Feedback.csv')
        link.click()
      })
    }
  }
}
</script>

<style scoped>
.count {
  color: rgb(33, 155, 224);
  font-weight: 100;
  font-size: 35px;
  }

.status-box {
  padding: 0.4rem 1rem;
  border: 0.5px solid #e1e0e061;
  cursor: pointer;
  transition: all 120ms ease-in-out;
  }

.op-badge.op-open {
  color: green;
  border: 1px solid green;
  border-radius: 1px;
  padding: 2px
  }

.op-badge.op-close {
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.75);
  border-radius: 1px;
  padding: 2px
  }

.click-card {
  cursor: pointer;
  transition: all 320ms ease-in-out;
}
.click-card:hover {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.active {
  background: rgba(22, 112, 230, 0.1);
  border: 1px solid rgba(22, 112, 230, 0.3);
  border-radius: 5px;
}

.link-color {
  color: var(--pf-global--BackgroundColor--dark-200);
}

.page-width {
  width: 125px;
}

</style>
