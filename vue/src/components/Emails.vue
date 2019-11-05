<template>
  <multiselect
    :searchable="true"
    :loading="isLoading"
    :internal-search="true"
    :clear-on-select="true"
    :close-on-select="true"
    :selectLabel="$t('multiselect.pressEnter')"
    :deselectLabel="$t('multiselect.pressRemove')"
    :tagPlaceholder="$t('multiselect.pressCreate')"
    @search-change="asyncFind"
    v-if="emails"
    :block-keys="['Delete']"
    v-model="email"
    :options="emails"
    :multiple="true"
    :taggable="true"
    @tag="addEmail"
    @input="changeObserver()"
    :placeholder="$t('newTicket.form.issue.searchOrAddEmail')"
  >
    <template slot="noOptions">
      <div>{{$t('multiselect.empty')}}</div>
    </template>
  </multiselect>
</template>

<script>
import User from "src/backend/models/User";

export default {
  components: {
    User
  },
  data() {
    return {
      emails: [],
      email: [],
      isLoading: false
    };
  },
  props: {
    taggable: {
      type: Boolean,
      default: false
    }
  },
  beforeDestroy() {
    this.$store.commit("setEmails", undefined);
  },
  methods: {
    asyncFind(query) {
      this.isLoading = true;
      User.getEmails(query).then(response => {
        this.emails = response.data;
        this.isLoading = false;
      });
    },
    addEmail(newEmail) {
      this.email.push(newEmail);
      this.$store.commit("setEmails", this.email);
    },
    changeObserver() {
      this.$store.commit("setEmails", this.email);
      return this.emails;
    },
    async updateEmails() {
      this.$store.getters.getEmails
        ? this.$store.getters.getEmails.forEach(element => {
            this.email.push(element);
          })
        : (this.email = []);
    },
    async populatedOptionsEmails() {
      await User.getEmails()
        .then(result => {
          this.emails = result.data;
        })
        .catch(e => {});
    }
  },
  created() {
    this.updateEmails();
    this.populatedOptionsEmails();
  }
};
</script>
<style>
</style>
