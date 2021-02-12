<template>
    <div class="feedback-item pf-u-p-md">
      <span class="pf-u-display-flex pf-u-flex-wrap" v-on:click="isAccordionOpen = !isAccordionOpen">
        <span class="feedback-category-icon pf-u-display-flex pf-u-font-size-lg pf-u-align-items-center pf-u-justify-content-center">
          <i v-bind:class="{'fas fa-bug':feedback.category === 'BUG', 'fas fa-comment-alt':feedback.category === 'FEEDBACK'}"></i>
        </span>
        <div class="feedback-title pf-u-font-weight-normal">
          <div>
            {{ feedback.summary || 'Nil' }}
          </div>
          <div class="feedback-description pf-u-font-size-sm">
            <span v-if="!isAccordionOpen">{{ feedback.description | truncate }}</span>
            <span v-if="isAccordionOpen">{{ feedback.description }}</span>
          </div>

          <div class="pf-u-display-flex">
            <span class="tag tag-module-name pf-u-display-flex pf-u-justify-content-center pf-u-align-items-center pf-u-font-weight-bold">
              {{ feedback.module || 'General' }}
            </span>
            <span class="tag pf-u-display-flex pf-u-justify-content-center pf-u-align-items-center pf-u-font-weight-bold" v-bind:class="{'tag-closed':feedback.state.toLowerCase().includes('close'), 'tag-open':!feedback.state.toLowerCase().includes('close')}">
              {{ feedback.state || 'N/A' }}
            </span>
          </div>
        </div>

        <div class="feedback-experience">
          <p>Experience</p>
          <p>{{ feedback.experience || 'N/A'}}</p>
        </div>

        <div class="feedback-assignees">
          <p>Assignee(s)</p>
          <span>
            <a target="blank" v-bind:href="`mailto:${feedback.assignee.email}`" v-if="feedback.assignee.name">
              {{ feedback.assignee.name }}
            </a>
          </span>
          <i v-if="!feedback.assignee.name">
            Not Assigned
          </i>
        </div>
        <div class="fb-accordion pf-u-display-flex pf-u-justify-content-center pf-u-align-items-center" v-bind:class="{'close':!isAccordionOpen, 'open':isAccordionOpen }" v-on:click="isAccordionOpen = !isAccordionOpen">
          <i class="fas fa-sort-up"></i>
        </div>
      </span>

      <div class="accordion-open" v-if="isAccordionOpen">
        <p class="pf-u-font-size-sm">
          Created By <br />
          <b>{{ feedback.createdBy.name }}</b>
          at {{ feedback.createdOn | formatDate }}</p>
          <i v-if="!feedback.createdBy.name">Not Assigned</i>
        <button class="pf-c-button pf-m-secondary pf-m-small" type="button" @click='openModal()'>View Details</button>&nbsp;
        <a target="_blank" :href="`${feedback.ticketUrl}`">
        <button class="pf-c-button pf-m-tertiary pf-m-small" type="button">{{ feedback.source }} Link&nbsp;<i class="fas fa-external-link-alt"></i></button>
        </a>
      </div>
    </div>
</template>
<script>
export default {
  name: 'ListFeedback',
  props: {
    feedback: Object
  },
  data () {
    return {
      isAccordionOpen: false
    }
  },
  filters: {
    formatDate: function (date) {
      const formattedDate = new Date(date)
      return `${formattedDate.getDay()}-${formattedDate.getMonth()}-${formattedDate.getFullYear()}`
    },
    truncate: function (text) {
      return (text.length > 100 ? text.slice(0, 100) + '...' : text)
    }
  },
  methods: {
    openModal: function ($event) {
      this.$emit('openModal')
    }
  }
}
</script>

<style scoped>
.feedback-item {
  border: 1px solid #ddd;
  }

.feedback-item:hover, .feedback-item.open {
  box-shadow: 0 4px 16px #e5e5e5;
  border: 1px solid #ddd;
  }

.feedback-category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(66, 133, 244, 0.1);
  color: #22457f;
  }

.feedback-title {
  flex: 0 0 30%;
  margin-left: 1.5rem;
  }

.feedback-description {
  font-style: italic;
  }

.tag {
  height: 20px;
  font-size: 10px;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 4px 10px;
  margin: 8px 10px 0 0;
  }

.tag-module-name {
  border: 1px solid rgba(108, 117, 125, 0.75);
  color: #76828f;
  }

.tag-open {
  color: #28a745;
  border: 1px solid #28a745;
  }

.tag-closed {
  color: #c00;
  border: 1px solid #c00;
  }

.feedback-experience, .feedback-assignees {
  margin-left: 5rem;
  }

.feedback-experience p:first-child, .feedback-assignees p:first-child {
  font-size: 14px;
  color: #868e96;
  font-weight: 300;
  margin-bottom: 0;
  }

.feedback-experience p:last-child, .feedback-assignees p:last-child {
  font-weight: 300;
  color: #495057;
  }

.feedback-experience {
  margin-left: 6rem;
  flex: 0 0 16%;
  }

.feedback-assignees {
  flex: 0 0 20%;
  }

.fb-accordion {
  width: 24px;
  height: 24px;
  font-size: 20px;
  margin-left: 0rem;
  transition: all 300ms ease-in-out;
  border-radius: 50%;
  }

.fb-accordion.close {
  transform: rotate(180deg);
  opacity: 1;
  }

.fb-accordion:hover, .fb-accordion.open {
  background: #ddd;
  }

.accordion-open {
  flex: 1 1 100%;
  margin-left: 64px;
  margin-top: 24px;
  }
</style>
