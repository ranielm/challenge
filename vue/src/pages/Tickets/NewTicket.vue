<template>
  <div id="container">
    <div id="content-master">
      <!-- START HEADER CONTEUDO -->
      <div class="flex-full margin-20-tb">
        <div class="box-shadow width-65 box-width">
          <div class="padding-10-r pointer" @click="backListTickets">
            <img src="/static/icons/back.svg" alt />
          </div>
          <div class="flex flex-column width-75 w-new-ticket">
            <div class="f-10-500-darkcyan padding-2-b">{{ $t('title.newTicket') }}</div>
            <div>
              <input
                v-model="ticket.subject"
                class="width-100 f-18-100-gray input-style-hover"
                type="text"
                :placeholder="$t('newTicketUser.typeSubjectTicket')"
              />
            </div>
          </div>
          <div class="margin-15-rl division division-new-ticket background-darkcyan"></div>
          <div class="width-35 w-save-draft text-center">
            <span
              class="f-14-300-darkcyan f-new-ticket-12 pointer"
              @click="newDraft"
            >{{ $t('newTicket.saveDraft') }}</span>
            <img class="padding-5-l icon-position icon-none" src="/static/icons/sync.svg" />
          </div>
        </div>
      </div>
      <!-- END HEADER CONTEUDO -->
      <div class="flex-full flex-column-1125">
        <div class="box div-default list-tickets">
          <div class="box-padding">
            <form @submit.prevent="validateBeforeSubmit">
              <div class="flex-full flex-column">
                <div
                  class="flex-full flex-row box-shadow-hover margin-20-b padding-0-trbl f-10-500-darkcyan"
                >
                  <div class="flex-full section-form">
                    <div :class="validationGeneral"></div>
                    <div class="flex-full padding-15-trbl">
                      <div class="flex width-20 w-title f-14-500-gray">
                        <div class="width-100 f-10-840">
                          {{ $t('newTicket.form.general.title') }}
                          <img
                            class="validation-img w-14-840"
                            :src="'/static/icons/' + validationGeneral+ '.svg'"
                          />
                        </div>
                      </div>
                      <div class="flex-full flex-column">
                        <!-- CHANEL -->
                        <div class="flex flex-column width-50 input-width-100 padding-12-b">
                          <label
                            class="f-10-500-darkcyan"
                            :class="{'color-red': errors.has('ticket.channel.id') }"
                          >{{ $t('newTicket.form.general.communicationChannel') }} *</label>
                          <select
                            name="ticket.channel.id"
                            v-model="ticket.channel.id"
                            class="select-style width-80 f-12-500-gray-light"
                            :placeholder="$t('newTicket.form.general.selectChannel')"
                            v-validate="'required'"
                          >
                            <option value>{{ $t('newTicket.form.general.selectChannel') }}</option>
                            <option
                              v-for="(channel, id) in this.channels"
                              :key="id"
                              :value="channel.id"
                            >{{channel.name}}</option>
                          </select>
                        </div>
                        <div class="flex-full flex-column-680 input-width-100">
                          <div class="flex flex-column width-50 input-width-100">
                            <label
                              class="f-10-500-darkcyan"
                              :class="{'color-red': errors.has('ticket.department.id') }"
                            >{{ $t('newTicket.form.issue.departmentResponsible') }} *</label>
                            <select
                              name="ticket.department.id"
                              v-model="ticket.department.id"
                              @change="getAgents"
                              v-validate="'required'"
                              class="select-style width-80 f-12-500-gray-light"
                            >
                              <option value>{{ $t('newTicket.form.issue.selectDepartment') }}</option>
                              <option
                                v-for="(department, id) in this.activeDepartments"
                                :key="id"
                                :value="department.id"
                              >{{department.name}}</option>
                            </select>
                          </div>
                          <div
                            class="flex flex-column width-50 input-width-100 padding-12-b"
                            v-if="this.ticket.department.id !== ''"
                          >
                            <label
                              class="f-10-500-darkcyan"
                              :class="{'color-red': errors.has('ticket.agent.id') }"
                            >{{ $t('editTicket.AGENTS') }}</label>
                            <select
                              name="ticket.agent.id"
                              v-model="ticket.agent.id"
                              class="select-style width-80 f-12-500-gray-light"
                            >
                              <option value>{{ $t('editTicket.AGENTSSELECTUP') }}</option>
                              <option
                                v-for="(agent, id) in this.agents"
                                :key="id"
                                :value="agent.id"
                              >{{agent.displayName}}</option>
                            </select>
                          </div>
                        </div>
                        <div class="flex-full flex-column-680">
                          <!-- CLIENTE - COMPANY -->
                          <div class="flex flex-column width-50 input-width-100 padding-12-t">
                            <label
                              class="f-10-500-darkcyan"
                              :class="{ 'color-red': errors.has('ticket.company.id') }"
                            >{{ $t('newTicket.form.general.client') }}</label>
                            <select
                              name="ticket.company.id"
                              v-model="ticket.company.id"
                              @change="getCompanyUsers"
                              class="select-style width-80 f-12-500-gray-light"
                            >
                              <option value>{{ $t('newTicket.form.general.selectClient') }}</option>
                              <option
                                v-for="(comp, id) in this.companies"
                                :key="id"
                                :value="comp.id"
                              >{{comp.name}}</option>
                            </select>
                          </div>

                          <!-- USUÁRIO - CLIENT -->
                          <div class="flex flex-column width-50 input-width-100 padding-12-t" style>
                            <div class="my-row">
                              <label
                                class="f-10-500-darkcyan label-position"
                                :class="{ 'color-red': errors.has('ticket.client.id') }"
                              >{{ $t('newTicket.form.general.requestBy') }}</label>
                              <multiselect
                                name="ticket.client"
                                v-model="ticket.client"
                                @search-change="findUsers"
                                @select="selectedUser"
                                :options="users"
                                :placeholder="$t('newTicket.form.general.selectRequestBy')"
                                label="displayName"
                                track-by="id"
                                :loading="searchingUsers"
                                :internal-search="false"
                                :selectLabel="$t('multiselect.pressEnter')"
                                :deselectLabel="$t('multiselect.pressRemove')"
                                :selectedLabel="$t('multiselect.selected')"
                                :noOptions="$t('multiselect.empty')"
                                class="width-80 f-12-500-gray-light select-position"
                              >
                                <template slot="afterList" v-if="!userQuery.last">
                                  <div
                                    class="loadMore f-12-500-white"
                                    @click="getUsers(true)"
                                  >{{$t('newTicket.loadMore')}}</div>
                                </template>
                                <template slot="noOptions">
                                  <div>{{$t('multiselect.empty')}}</div>
                                </template>
                              </multiselect>
                              <!--{{ $t('newClient.addUser') }}-->
                              <img
                                tooltip.hover
                                :title="$t('newUser.registerNewUser')"
                                v-if="ticket.company.id != ''"
                                @click="addUser()"
                                class="icon-size icon-position-2"
                                src="/static/icons/add-user.svg"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="flex-full flex-row box-shadow-hover margin-20-b padding-0-trbl f-10-500-darkcyan"
                >
                  <div class="flex-full section-form">
                    <div :class="validationIssue"></div>
                    <div class="flex-full padding-15-trbl">
                      <div class="flex width-20 w-title f-14-500-gray">
                        <div class="width-100 f-10-840">
                          {{ $t('newTicket.form.issue.title') }}
                          <img
                            class="validation-img w-14-840"
                            :src="'/static/icons/' + validationIssue+ '.svg'"
                          />
                        </div>
                      </div>
                      <div class="flex-full flex-column">
                        <div class="flex-full flex-column-680 padding-12-b">
                          <div class="flex flex-column width-50 input-width-100 padding-input-b">
                            <label
                              class="f-10-500-darkcyan"
                              :class="{ 'color-red': errors.has('ticket.issueType.id') }"
                            >{{ $t('newTicket.form.issue.typeOfIssue') }} *</label>
                            <select
                              name="ticket.issueType.id"
                              @change="verifyExistTicket"
                              v-model="ticket.issueType.id"
                              v-validate="'required'"
                              class="select-style width-80 f-12-500-gray-light"
                            >
                              <option value>{{ $t('newTicket.form.issue.selectIssueType') }}</option>
                              <option
                                v-for="(issueType, id) in this.issuesTypes"
                                :key="id"
                                :value="issueType.id"
                              >{{issueType.name}}</option>
                            </select>
                          </div>
                          <div class="flex flex-column width-50 input-width-100">
                            <label
                              class="f-10-500-darkcyan"
                              :class="{'color-red': errors.has('ticket.sla.id') }"
                            >{{ $t('newTicket.form.issue.levelServiceAgreement') }} *</label>
                            <select
                              name="ticket.sla.id"
                              v-model="ticket.sla.id"
                              v-validate="'required'"
                              class="select-style width-80 f-12-500-gray-light"
                            >
                              <option value>{{ $t('newTicket.form.issue.selectAgreement') }}</option>
                              <option
                                v-for="(sla, id) in this.slas"
                                :key="id"
                                :value="sla.id"
                              >{{ sla.name }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="flex-full flex-column-680 padding-12-b">
                          <div class="flex flex-column width-50 input-width-100">
                            <label
                              class="f-10-500-darkcyan"
                              :class="{ 'color-red': errors.has('ticket.priority.id') }"
                            >{{ $t('newTicket.form.issue.issuePriority') }} *</label>
                            <select
                              name="ticket.priority.id"
                              v-model="ticket.priority.id"
                              v-validate="'required'"
                              class="select-style width-80 f-12-500-gray-light"
                            >
                              <option value>{{ $t('newTicket.form.issue.selectPriority') }}</option>
                              <option
                                v-for="(priority, id) in this.prioritys"
                                :key="id"
                                :value="priority.id"
                              >{{priority.name}}</option>
                            </select>
                          </div>
                          <div class="flex flex-column width-50 input-width-100">
                            <label
                              class="f-10-500-darkcyan"
                            >{{ $t('newTicket.form.issue.notifyTo') }}</label>
                            <emails ref="email" class="width-80"></emails>
                          </div>
                        </div>
                        <div class="flex flex-column width-50 input-width-100">
                          <label
                            class="f-10-500-darkcyan"
                            :class="{'color-red': errors.has('ticket.associatedProtocols') }"
                          >{{ $t('newTicket.form.ticket.associatedProtocols') }}</label>
                          <multiselect
                            name="ticket.associatedProtocols"
                            class="width-80"
                            :multiple="true"
                            :taggable="true"
                            :options="protocols"
                            :selectLabel="$t('newTicket.form.ticket.enterToSelect')"
                            :tagPlaceholder="$t('newTicket.form.ticket.enterAssociatedProtocol')"
                            @tag="addProtocol"
                            :placeholder="$t('newTicket.form.ticket.typeAssociatedProtocol')"
                            v-model="ticket.associatedProtocols"
                          >
                            <template slot="noOptions">
                              <div>{{$t('multiselect.empty')}}</div>
                            </template>
                          </multiselect>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <modal name="comment-warning" height="auto" :scrollable="true">
                  <div class="div-hover">
                    <form @submit.prevent="sendAnswer">
                      <div class="flex flex-justify-center margin-20-trbl">
                        <span class="f-14-500-darkcyan">{{$t('newTicket.form.ticket.title')}}</span>
                      </div>
                      <div class="flex width-85 flex-tlbr padding-50-b f-18-100-gray">
                        <p>{{ $t('newTicket.form.general.existTicketWarning') }}</p>
                      </div>
                      <div>
                        <span
                          class="flex width-85 flex-tlbr f-14-300-darkcyan"
                        >{{ $t('newTicket.form.general.answer') }}:</span>
                        <div class="flex flex-justify-center">
                          <textarea
                            v-model="answer.name"
                            class="text-shadow div-hover textarea-modal input-style f-12-300-gray width-85"
                          ></textarea>
                        </div>
                      </div>
                      <div class="flex flex-justify-center padding-50-tb">
                        <div class="padding-20-r pointer" @click="hideWarningModal">
                          <button class="btn-medium btn-cancel font-bold">{{ $t('cancel') }}</button>
                        </div>
                        <div class="padding-20-r pointer">
                          <button
                            class="btn-medium btn-blue"
                            type="submit"
                          >{{ $t('editTicket.answers.send') }}</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </modal>

                <div class="flex-full flex-row box-shadow-hover padding-0-trbl f-10-500-darkcyan">
                  <div class="flex-full section-form">
                    <div :class="validationTicket"></div>
                    <div class="flex-full padding-15-trbl">
                      <div class="flex width-20 w-title f-14-500-gray">
                        <div class="width-100 f-10-840">
                          {{ $t('newTicket.form.ticket.title') }}
                          <img
                            class="validation-img w-14-840"
                            :src="'/static/icons/' + validationTicket+ '.svg'"
                          />
                        </div>
                      </div>
                      <div class="flex-full flex-column">
                        <div class="flex flex-column width-80 input-width-100 padding-20-b">
                          <label
                            id="labelSubject"
                            class="f-10-500-darkcyan"
                            :class="{ 'color-red': errors.has('ticket.subject') }"
                          >{{ $t('newTicket.form.ticket.subject') }} *</label>
                          <input
                            name="ticket.subject"
                            v-validate="'required'"
                            v-model="ticket.subject"
                            type="text"
                            class="input-style f-12-300-gray width-100"
                            :placeholder="$t('newTicket.form.ticket.typeSubject')"
                          />
                        </div>

                        <div class="flex-full flex-column padding-20-b">
                          <label
                            class="f-10-500-darkcyan"
                            :class="{ 'color-red': errors.has('ticket.description') }"
                          >{{ $t('newTicket.form.ticket.description') }} *</label>
                          <textarea
                            name="ticket.description"
                            v-validate="'required'"
                            v-model="ticket.description"
                            class="textarea-ticket input-style f-12-300-gray width-80 input-width-100"
                            :placeholder="$t('newTicket.form.ticket.typeDescription')"
                          ></textarea>
                        </div>

                        <div class="flex-full flex-column">
                          <span
                            class="f-10-500-darkcyan"
                          >{{ $t('newTicket.form.ticket.attachFiles') }}</span>
                          <image-upload
                            :startDocs="this.docList"
                            iconScale="1.3"
                            class="width-80 input-width-100"
                            v-bind:imageId="file.name"
                            @change="onFileChange($event, file.name)"
                          ></image-upload>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="margin-15-tb flex-full">
                <hr class="hr-ticket" />
              </div>

              <div class="flex-full flex flex-justify-end">
                <div class="padding-20-r">
                  <button
                    class="btn-medium btn-cancel font-bold"
                    @click="returnListTickets"
                  >{{ $t('cancel') }}</button>
                </div>

                <div class="padding-20-r">
                  <button class="btn-medium btn-blue" type="submit" @click="newTicket">
                    <!-- <button class="btn-medium btn-blue" type="submit" @click="newTicket"> -->
                    <span>{{ $t('newTicket.sendAs') }}</span>
                    &nbsp;
                    <span
                      class="f-14-300-gray color-white"
                    >{{ $t('title.newTicket') }}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="widgets">
          <!-- <jira-actions></jira-actions> -->
        </div>
      </div>
    </div>
    <user-modal @refresh="refreshUsers" @saveUserTicket="saveUser"></user-modal>
  </div>
</template>

<script>
import Ticket from "src/backend/models/Ticket.js";
import Channel from "src/backend/models/Channel.js";
import User from "src/backend/models/User.js";
import IssueType from "src/backend/models/IssueType.js";
import Sla from "src/backend/models/Sla.js";
import Department from "src/backend/models/Department.js";
import Priority from "src/backend/models/Priority.js";
import State from "src/backend/models/State.js";
import Company from "src/backend/models/Company.js";
import { Select, Option, Checkbox } from "element-ui";

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm._renewParametersVueX(to, from);
    });
  },

  name: "NewTicket",

  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    Checkbox
  },

  methods: {
    updatingTickets() {
      this.$store.commit("setCurrentPageTicket", 0);
      this.$store.commit("setTicketsPages", undefined);
    },

    refreshUsers() {
      this.findUsers();
    },

    saveUser(user) {
      this.ticket.client = user;
      if (user.tempId === -1) {
        user.tempId = this.clientComponentInfo.users.length;
        this.clientComponentInfo.users.push(user);
      } else {
        this.clientComponentInfo.users[user.tempId] = user;
      }
    },

    addUser() {
      this.$modal.show(
        "create-user",
        this.ticket.company.id ? { clientId: this.ticket.company.id } : {},
        {
          height: "auto",
          dynamic: true,
          injectModalsContainer: true,
          draggable: true
        }
      );
    },

    validateAllFields() {
      return this.validationGeneral === "validation-sucess" &&
        this.validationIssue === "validation-sucess" &&
        this.validationTicket === "validation-sucess"
        ? true
        : false;
    },

    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (this.validateAllFields()) {
          if (this.tickets.length > 0) {
            this.showWarningModal();
          }
        } else if (this.tickets.length > 0) {
          this.showWarningModal();
        } else {
          this.$swal.fire({
            title: this.$t("swal.titleError"),
            text: this.$t("swal.errorFields"),
            type: "error",
            showConfirmButton: true
          });
        }
        return;
      });
    },

    saveTicket() {
      Ticket.post(this.ticket)
        .then(result => {
          this._getLoading(false);
          this.$store.getters.getFunctions.uploads.forEach(element => {
            Ticket.upload(element, result.data.id)
              .then(result => {})
              .catch(e => {});
          });
          this.$swal
            .fire({
              title: `${this.$t("label.ticket")} ${this.$t(
                "swal.titleSuccess"
              )}`,
              text: this.$t("swal.textSuccess"),
              type: "success",
              showConfirmButton: true
            })
            .then(result => {
              if (result.value) {
                this.submitted = false;
                this.$router.push({
                  name: "Listar Tickets"
                });
              }
            });
          this.updatingTickets(result.data);
        })
        .catch(e => {
          this._getLoading(false);
          this.$swal.fire({
            title: this.$t("swal.titleError"),
            text: e.response.data.message,
            type: "error",
            showConfirmButton: true
          });
        });
    },

    newTicket() {
      this.ticket.draft = false;
      this.$store.getters.getEmails
        ? this.$store.getters.getEmails.forEach(element => {
            this.ticket.emails.push(element);
          })
        : "";
      let temp = "newTicket";
      if (this.validateAllFields()) {
        this.existTicketByIssue(temp);
      }
    },

    existTicketByIssue(temp) {
      if (this.ticket.client != null) {
        this._getLoading(true);
        Ticket.existTicketByClientAndIssue(
          this.ticket.issueType.id,
          this.ticket.client.username
        )
          .then(result => {
            this._getLoading(false);
            this.ticketsTemp = result.data;
            this.tickets = [];
            this.ticketsCloseds = false;
            if (this.ticketsTemp.length > 0) {
              this.ticketsTemp.forEach(element => {
                if (!element.state.closed && !element.state.merged) {
                  this.tickets.push(element);
                }
              });
            }
            if (this.tickets.length > 0) {
              this.showWarningModal();
            } else if (temp == "newTicket") {
              this._getLoading(true);
              this.saveTicket();
            }
          })
          .catch(e => {
            this._getLoading(false);
          });
      } else if (this.ticket.company != null) {
        this._getLoading(true);
        Ticket.existTicketByCompanyAndIssue(
          this.ticket.issueType.id,
          this.ticket.company.id
        )
          .then(result => {
            this._getLoading(false);
            this.ticketsTemp = result.data;
            this.tickets = [];
            if (this.ticketsTemp.length > 0) {
              this.ticketsTemp.forEach(element => {
                if (!element.state.closed && !element.state.merged) {
                  this.tickets.push(element);
                }
              });
            }
            if (this.tickets.length > 0) {
              this.showWarningModal();
            } else if (temp == "newTicket") {
              this._getLoading(true);
              this.saveTicket();
            }
          })
          .catch(e => {
            this._getLoading(false);
          });
      }
    },

    verifyExistTicket() {
      if (this.ticket.client) {
        let temp = "verifyExistTicket";
        this.existTicketByIssue(temp);
      } else if (this.ticket.company) {
        let temp = "verifyExistTicket";
        this.existTicketByIssue(temp);
      }
    },

    showWarningModal() {
      this.answer.name = "";
      this._getLoading(false);
      this.$modal.show("comment-warning");
    },

    hideWarningModal() {
      this._getLoading(false);
      this.$modal.hide("comment-warning");
    },

    sendAnswer() {
      if (this.answer.name) {
        this.hideWarningModal();
        this._getLoading(true);
        var answer = this.answer;
        answer.createdBy = this.$store.getters.getUser.username;
        answer.user.id = this.$store.getters.getUser.id;
        answer.ticket.id = this.tickets[0].id;
        answer.name = this.answer.name;
        Ticket.answer(this.answer)
          .then(result => {
            this._getLoading(false);
            this.$swal
              .fire({
                title: `${this.$t("newTicket.form.ticket.answerSaveSuccess")}`,
                text: this.$t("swal.textSuccess"),
                type: "success",
                showConfirmButton: true
              })
              .then(result => {
                if (result.value) {
                  this.$router.push({
                    path: "/edit-ticket/" + this.tickets[0].id
                  });
                }
              });
          })
          .catch(e => {
            this._getLoading(false);
            this.$swal.fire({
              title: this.$t("swal.titleError"),
              text: e.response.data.message,
              type: "error",
              showConfirmButton: true
            });
          });
      }
    },

    getAgents() {
      this._getLoading(true);
      let departmentID = this.ticket.department.id;
      this.agents = [];
      if (departmentID != "") {
        User.usersFromDepartment(departmentID)
          .then(result => {
            this._getLoading(false);
            result.data.forEach(element => {
              if (element.type === this.$store.getters.getUser.labelAgent) {
                this.agents.push(element);
              }
            });
          })
          .catch(e => {
            this._getLoading(false);
          });
      } else {
        this._getLoading(false);
      }
      return;
    },

    returnListTickets() {
      this.$router.push({ name: "Listar Tickets" });
    },

    changeObserver() {},

    addTag(newTag) {
      const tag = {
        name: newTag
      };
      this.ticket.tags.push(tag);
    },

    addProtocol(protocol) {
      this.ticket.associatedProtocols.push(protocol);
      this.protocols.push(protocol);
    },

    findUsers(query) {
      this.userQuery.query = query;
    },

    selectedUser(user) {
      if (!!user.company && user.company.id !== "") {
        this.ticket.company = user.company;
      } else {
        this.ticket.company = { id: "" };
      }
    },

    getCompanyUsers() {
      this._getLoading(true);
      this.ticket.client = null;
      if (this.ticket.company.id === "") {
        this.userQuery.companyId = "";
      } else {
        this.userQuery.companyId = this.ticket.company.id;
      }
      this.userQuery.page = 0;
      this.users = [];
      this.getUsers();
      this._getLoading(false);
    },

    getUsers(loadMore) {
      this._getLoading(true);
      this.searchingUsers = true;
      if (loadMore) this.userQuery.page++;
      User.getUsersPaginated(
        this.userQuery.page,
        this.userQuery.numberOfElements,
        this.userQuery.query,
        this.userQuery.companyId,
        "USER"
      )
        .then(result => {
          this.users = this.users.concat(result.data.content);
          this.userQuery.last = result.data.last;
          this.searchingUsers = false;
          this._getLoading(false);
        })
        .catch(e => {
          this._getLoading(false);
        });
    },

    nameWithLang({ email }) {
      return `${email}`;
    },

    backListTickets() {
      this.$router.push({
        name: "Listar Tickets"
      });
    },

    onFileChange(file, doc) {
      if (file) {
        let temp = file.name;
        temp = temp.split(".").pop();
        let fileName = doc + "." + temp;
        let myNewFile = new File([file], fileName, {
          type: file.type
        });
        this.file = myNewFile;
      } else {
        this.file = null;
      }
    },

    closeModal() {
      this.$emit("close");
    },

    onRegisterSubmit(model, isValid) {
      this.registerModel = model;
    },

    onLoginSubmit(model, isValid) {
      this.loginModel = model;
    },

    onTypeValidationSubmit(model, isValid) {
      this.typeValidationModel = model;
    },

    uploadFiles() {},

    newDraft() {
      if (this.ticket.subject) {
        this._getLoading(true);
        //this.ticket.agent.id = this.$store.getters.getUser.id;
        this.ticket.emails = [];
        this.$store.getters.getEmails
          ? this.$store.getters.getEmails.forEach(element => {
              this.ticket.emails.push(element);
            })
          : "";
        Ticket.draft(this.ticket)
          .then(result => {
            this.$store.getters.getFunctions.removedFiles.forEach(element => {
              Ticket.deleteFile(element.id)
                .then(result => {})
                .catch(e => {});
            });
            const files = result.data.fileUploads;
            this.$store.getters.getFunctions.uploads.forEach(element => {
              let alreadyExists = false;
              // Checa se o arquivo ja existe nos arquivos associados ao draft
              if (!!files) {
                files.forEach(file => {
                  alreadyExists = alreadyExists
                    ? alreadyExists
                    : file.nameDocument === element.document;
                });
                // Se ele ja estiver associado checa se o associado não foi removido na edição atual do draft
                if (
                  alreadyExists &&
                  !!this.$store.getters.getFunctions.removedFiles
                ) {
                  this.$store.getters.getFunctions.removedFiles.forEach(
                    removed => {
                      alreadyExists = alreadyExists
                        ? !(removed.name === element.document)
                        : alreadyExists;
                    }
                  );
                }
              }
              if (!alreadyExists) {
                Ticket.upload(element, result.data.id)
                  .then(result => {})
                  .catch(e => {});
              }
            });
            this._getLoading(false);
            this.$router.push({
              name: "Listar Tickets"
            });
            this.$swal.fire({
              title: `${this.$t("label.draft")} ${this.$t(
                "swal.titleSuccess"
              )}`,
              text: this.$t("swal.textSuccess"),
              type: "success",
              showConfirmButton: true
            });
          })
          .catch(e => {
            this._getLoading(false);
            this.$swal.fire({
              title: this.$t("swal.titleError"),
              text: e.response.data.message,
              type: "error",
              showConfirmButton: true
            });
          });
      } else {
        this._getLoading(false);
        this.$swal.fire({
          title: this.$t("newTicket.draft.draftErrorTitle"),
          text: this.$t("newTicket.draft.draftErrorText"),
          type: "error",
          showConfirmButton: true
        });
      }
    },

    handleChange(type, singular, plural, event) {
      type === "emails"
        ? ((this.ticket[type] = []),
          this[type].forEach(element => {
            if (element[singular] === event.target.value) {
              this.ticket[type].push(element);
            }
          }))
        : this[plural].forEach(element => {
            if (element[type] === event.target.value) {
              this.ticket[singular]["id"] = element["id"];
            }
          });
    }
  },

  created() {
    this.$store.commit("setUpload", 1);
    this.$store.commit("setRemovedFiles", 1);
    Channel.get()
      .then(result => {
        const data = [...result.data];
        this.channels = data;
      })
      .catch(e => {});

    State.get()
      .then(result => {
        this.states = result.data;
      })
      .catch(e => {});

    IssueType.getActives()
      .then(result => {
        this.issuesTypes = result.data;
      })
      .catch(e => {});

    Sla.get()
      .then(result => {
        this.slas = result.data;
      })
      .catch(e => {});

    Department.get()
      .then(result => {
        this.departments = result.data;
        this.activeDepartments = this.departments.filter(department => {
          return department.active;
        });
      })
      .catch(e => {});

    Priority.get(true)
      .then(result => {
        this.prioritys = result.data;
      })
      .catch(e => {});

    Company.get()
      .then(result => {
        this.companies = result.data;
      })
      .catch(e => {});

    const draftRegex = new RegExp("/new-ticket-draft/.*", "g");
    if (draftRegex.test(this.$route.path)) {
      Ticket.getOne(this.$router.history.current.params.id)
        .then(result => {
          if (result.data.draft) {
            this.ticket = result.data;
            this.draft = true;
            this.ticket.channel = !this.ticket.channel
              ? { id: "" }
              : this.ticket.channel;
            this.ticket.priority = !this.ticket.priority
              ? { id: "" }
              : this.ticket.priority;
            //this.ticket.product = !this.ticket.product ? { id: "" } : this.ticket.product;
            this.ticket.agent = !this.ticket.agent
              ? { id: "" }
              : this.ticket.agent;
            this.ticket.client = !this.ticket.client
              ? { id: "" }
              : this.ticket.client;
            this.ticket.company = !this.ticket.company
              ? null
              : this.ticket.company;
            this.ticket.issueType = !this.ticket.issueType
              ? { id: "" }
              : this.ticket.issueType;
            this.ticket.state = !this.ticket.state
              ? { id: "" }
              : this.ticket.state;
            this.ticket.department = !this.ticket.department
              ? { id: "" }
              : this.ticket.department;
            this.ticket.sla = !this.ticket.sla ? { id: "" } : this.ticket.sla;
            this.ticket.tags = !this.ticket.tags ? [] : this.ticket.tags;
            this.ticket.answers = !this.ticket.answers
              ? []
              : this.ticket.answers;
            this.ticket.emails = !this.ticket.emails ? [] : this.ticket.emails;
            this.ticket.associatedProtocols = !this.ticket.associatedProtocols
              ? []
              : this.ticket.associatedProtocols;

            this.$store.commit("setEmails", this.ticket.emails);
            this.$refs.email.updateEmails();
          }
        })
        .catch(e => {});
    }
    this.getUsers();
  },

  computed: {
    docList() {
      const list = this.ticket.fileUploads || [];
      return list.map(file => ({ name: file.nameDocument, ...file }));
    },

    profileIDRefresh: function() {
      return this.value.id ? this.value.id : 0;
    },

    selectedTag() {
      if (this.ticket.tags[0].name) return this.ticket.tags[0].name;
      else return this.selectedOption;
    },

    validationGeneral: function() {
      if (
        this.ticket.channel.id != "" &&
        this.ticket.department.id != "" &&
        // this.ticket.agent &&
        // this.ticket.agent.id != "" &&
        ((this.ticket.client && this.ticket.client.id != "") ||
          (this.ticket.company && this.ticket.company.id != ""))
      ) {
        return "validation-sucess";
      } else {
        return "validation-fail";
      }
    },

    validationIssue: function() {
      if (
        this.ticket.issueType.id != "" &&
        this.ticket.sla.id != "" &&
        this.ticket.priority.id != ""
        // &&
        // this.$store.getters.getEmails
        //   ? this.$store.getters.getEmails.length > 0
        //   : false
      ) {
        return "validation-sucess";
      } else {
        return "validation-fail";
      }
    },

    validationTicket: function() {
      if (this.ticket.subject != "" && this.ticket.description) {
        return "validation-sucess";
      } else {
        return "validation-fail";
      }
    }

    // getClients: function() {
    //   let companyId = this.company.id;
    //   this.users = [];
    //   this.ticket.company = {
    //     id: ""
    //   };
    //   if (companyId != "") {
    //     User.getByCompany(companyId)
    //       .then(result => {
    //         this.users = result.data;
    //       })
    //       .catch(e => {});
    //   }
    // }
  },

  watch: {
    "userQuery.query": function() {
      this.userQuery.page = 0;
      this.users = [];
      this.getUsers();
    }
  },

  data() {
    return {
      submitted: false,
      duplicatePending: false,
      verifyData: [],
      selectedUsername: "",
      file: {
        name: "newFile"
      },
      company: {
        id: ""
      },
      ticket: {
        active: true,
        createdBy: this.$store.getters.getUser.username,
        channel: {
          id: ""
        },
        client: null,
        company: {
          id: ""
        },
        agent: {
          id: ""
        },
        issueType: {
          id: ""
        },
        sla: {
          id: ""
        },
        priority: {
          id: ""
        },
        department: {
          id: ""
        },
        state: {
          id: 1
        },
        emails: [],
        subject: "",
        description: "",
        associatedProtocols: []
      },
      answer: {
        name: "",
        active: true,
        private: false,
        createdBy: "",
        user: {
          id: ""
        },
        ticket: {
          id: ""
        }
      },

      activeDepartments: [],
      departments: this.departments,
      prioritys: this.prioritys,
      issuesTypes: this.issuesTypes,
      states: this.states,
      slas: this.slas,
      agents: this.agents,
      users: [],
      companies: this.companies,
      emails: [],
      channels: this.channels,
      protocols: [],
      notifications: [],
      tickets: [],
      answerForTicket: [],
      searchingUsers: false,
      userQuery: {
        query: "",
        companyId: "",
        page: 0,
        numberOfElements: 30
      }
    };
  }
};
</script>

<style scoped>
.better-position-file-upload {
  margin-top: 8px;
}

.warning-img {
  position: relative;
  bottom: 2px;
}

.loadMore {
  background-color: #0097a7;
  justify-content: center;
  text-align: center;
  align-content: center;
  cursor: pointer;
}

.loadMore:hover {
  background-color: #e6e6e6;
  color: #35495e;
  font-weight: 700;
}

.my-row {
  display: -webkit-box;
  /* display: flex; */
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  /* margin-right: -15px; */
  margin-left: -15px;
}

.label-position {
  margin-top: 0rem;
  margin-left: 1rem;
}

.select-position {
  margin-top: 1rem;
  margin-left: -6rem;
}

.icon-position-2 {
  margin-top: 1.2rem;
  margin-left: 1.2rem;
}
</style>
