import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import moment from 'moment';
import { Validator } from 'vee-validate';
import { CountryList } from 'src/backend/request/allCountries.js'

Vue.use(Vuex);

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const backend = {
  state: {
    clientId: undefined,
    clientSecret: undefined,
    redirectUri: undefined,
    code: undefined,
    oAuthToken: undefined,    
    local: "https://accounts.spotify.com",
    development: "https://development",
    sandbox: "https://sandbox",    
    frontLocalhost: "localhost",
    frontDev: "localhost", //:8092
    frontTM2Dev: "localhost:8192",
    frontSandbox: "https://sandbox.com",
    frontTM2Sandbox: "https://sandbox.com",
  },
  mutations: {
    setBackend(state, URL) {
      state.URL = URL;
      routes.state.authority = URL + "/api/authority";
      routes.state.authorityrule = URL + "/api/authorityrule";
      routes.state.rule = URL + "/api/rule";
      routes.state.authorize = URL + "/authorize?";
      routes.state.token = URL + "/api/token";
      routes.state.ticket = URL + "/api/ticket";
      routes.state.ticketGetPages = URL + "/api/ticket/getPages";
      routes.state.ticketGetOne = URL + "/api/ticket/";
      routes.state.channel = URL + "/api/channel";
      routes.state.template = URL + "/api/template";
      routes.state.satisfactionSurvey = URL + "/api/survey";
      routes.state.user = URL + "/api/user";
      routes.state.issue = URL + "/api/issue";
      routes.state.sla = URL + "/api/sla";
      routes.state.worktime = URL + "/api/worktime";
      routes.state.tag = URL + "/api/tag";
      routes.state.jiraIssue = URL + "/api/basic/issue";
      routes.state.department = URL + "/api/department";
      routes.state.priority = URL + "/api/priority";
      routes.state.state = URL + "/api/state";
      routes.state.draft = URL + "/api/ticket/draft";
      routes.state.upload = URL + "/api/upload";
      routes.state.notification = URL + "/api/notification/findByUserId";
      routes.state.tag = URL + "/api/tag";
      routes.state.answer = URL + "/api/answer";
      routes.state.product = URL + "/api/product";
      routes.state.issueType = URL + "/api/issueType";
      routes.state.company = URL + "/api/company";
      routes.state.jira = URL + "/api/basic/";
      routes.state.dashboardNps = URL + "/api/survey/result";
      routes.state.ticketConfig = URL + "/api/config/";
      routes.state.surveyType = URL + "/api/surveytype";
      routes.state.report = URL + "/api/reports";
      routes.state.statusTicket = URL + "/api/state";
      routes.state.searchSatisfaction = URL + "/api/ticket-survey/reply";
    },
    setOAuthToken(state, oAuthToken) {
      state.oAuthToken = oAuthToken;
    },
    setClientId(state, clientId) {
      state.clientId = clientId;
    },
    setClientSecret(state, clientSecret) {
      state.clientSecret = clientSecret;
    },
    setRedirectUri(state, redirectUri) {
      state.redirectUri = redirectUri;
    },
    setCode(state, code) {
      state.code = code;
    }
  },
  getters: {
    getBackend(state) {
      return state;
    },
    getOAuthToken(state) {
      return state.oAuthToken;
    },
    getClientId(state) {
      return state.clientId;      
    },
    getClientSecret(state) {
      return state.clientSecret;      
    },
    getRedirectUri(state) {
      return state.redirectUri;
    },
    getCode(state) {
      return state.code;      
    }
  }
};

const user = {
  state: {
    countryDefault: "BR",
    labelAdmin: "ADMIN",
    labelAgent: "AGENT",
    labelUser: "USER",
    displayName: "",
    admin: localStorage.getItem("admin"),
    domain: localStorage.getItem("domain"),
    email: localStorage.getItem("email"),
    firstName: localStorage.getItem("firstName"),
    genre: localStorage.getItem("genre"),
    departments: localStorage.getItem("departments"),
    lastName: localStorage.getItem("lastName"),
    id: localStorage.getItem("id"),
    name: localStorage.getItem("name"),
    profile: localStorage.getItem("profile"),
    username: localStorage.getItem("username"),
    updateUser: localStorage.getItem("updatedUser"),
    locale: localStorage.getItem("locale")
  },
  mutations: {
    setUser(state, user) {
      if (user) {
        state.admin = user.admin;
        state.displayName = user.displayName;
        state.domain = user.domain;
        state.email = user.email;
        state.firstName = user.firstName;
        state.genre = user.genre;
        state.profile = user.type;
        state.authority = user.authority;
        state.authorityId = user.authority.id;
        state.departments = user.departments;
        state.lastName = user.lastName;
        state.id = user.id;
        state.username = user.username;
        state.name = user.name;
        state.updatedUser = user.updatedUser;
        state.locale = user.locale;
      }
      else {
        state.authorityId = undefined;
      }
    },
    setLocale(state, locale) {
      state.locale = locale;
      Validator.localize(locale);
      moment.locale(locale);
    }
  },
  getters: {
    getUser(state) {
      return state;
    },
    getCountryDefault(state) {
      return state.countryDefault;
    },
    getAuthorityId(state) {
      return state.authorityId;
    },
    getLocale(state) {
      return state.locale;
    }

  }
};

const response = {
  state: {
    codeStatus: undefined,
    errorMessage: undefined,
    resetByTokenExpired: false,
    resetByBlockedProfile: false,
    tokenExpired: "Error: Request failed with status code 400",
    notAuthorized: "Error: Request failed with status code 401",
    blockedProfileLogin: "Error: Request failed with status code 403",
    blockedProfile: "Error: Request failed with status code 412"
  },
  mutations: {
    setCodeStatus(state, codeStatus) {
      state.codeStatus = codeStatus;
    },
    setErrorMessage(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
    setResetByTokenExpired(state, status) {
      state.resetByTokenExpired = status;
    },
    setResetByBlockedProfile(state, status) {
      state.resetByBlockedProfile = status;
    }
  },
  getters: {
    getResponse(state) {
      return state;
    }
  }
};

const split = {
  state: {
    split: {},
    companyId: "",
    ticketIdFrom: "",
    ticketIdInto: "",
    closedTicketsPerCompany: [],
    refresh: false
  },
  mutations: {
    setSplit(state, split) {
      state.split = split;
    },
    setMergeCompanyId(state, value) {
      state.companyId = value;
    },
    setTicketIdFrom(state, ticketIdFrom) {
      state.ticketIdFrom = ticketIdFrom;
    },
    setTicketIdInto(state, ticketIdInto) {
      state.ticketIdInto = ticketIdInto;
    },
    setRefresh(state, value) {
      state.refresh = value;
    },
    setClosedTicketsPerCompany(state, value) {
      state.closedTicketsPerCompany = value;
    }
  },
  getters: {
    getSplit(state) {
      return state;
    },
    getRefresh(state) {
      return state.refresh;
    },
    getMerge(state) {
      return state.companyId;
    },
    getClosedTicketsPerCompany(state) {
      return state.closedTicketsPerCompany;
    },
    getTicketIdFrom(state) {
      return state.ticketIdFrom;
    },
    getTicketIdInto(state) {
      return state.ticketIdInto;
    }
  }
};

const users = {
  state: {
    users: []
  },
  mutations: {
    setUsers(state, listUsers) {
      state.users = listUsers;
    }
  },
  getters: {
    getUsers(state) {
      return state;
    }
  }
};

const initialData = {
  state: {
    initialData: undefined
  },
  mutations: {
    setInitialData(state, initialData) {
      state.initialData = initialData;
    }
  },
  getters: {
    getInitialData(state) {
      return state;
    }
  }
};

const typesOfProfiles = {
  state: {
    typesOfProfiles: ["ADMIN", "AGENT", "USER"],
    profilesByTypeOfUser: undefined,
    profileByTypeOfUser: undefined,
  },
  mutations: {
    setTypesOfProfiles(state, typesOfProfiles) {
      state.typesOfProfiles = typesOfProfiles;
    },
    setProfilesByTypeOfUser(state, profilesByTypeOfUser) {
      state.profilesByTypeOfUser = profilesByTypeOfUser;
    },
    setProfileByTypeOfUser(state, profileByTypeOfUser) {
      state.profileByTypeOfUser = profileByTypeOfUser;
    }
  },
  getters: {
    getTypesOfProfiles(state) {
      return state.typesOfProfiles;
    },
    getProfilesByTypeOfUser(state) {
      return state.profilesByTypeOfUser;
    },
    getProfileByTypeOfUser(state) {
      return state.profileByTypeOfUser;
    }
  }
};

const routes = {
  state: { },
  getters: {
    getRoutes(state) {
      return state;
    }
  }
};

const systemParameters = {
  state: {
    url: localStorage.getItem("URL") + "/systemParameters",
  },
  getters: {
    getSystemParameters(state) {
      return state;
    }
  }
};

const spinner = {
  state: {
    loading: false
  },
  getters: {
    getLoading(state) {
      return state.loading;
    }
  },
  mutations: {
    setLoading(state, loading) {
      Vue.set(state, 'loading', loading);
    }
  },
};

const template = {
  state: {
    template: undefined
  },
  getters: {
    getTemplate(state) {
      return state.template;
    }
  },
  mutations: {
    setTemplate(state, template) {
      state.template = template;
    }
  },
};

const notifications = {
  state: {
    notifications: undefined,
  },
  mutations: {
    setNotifications(state, notifications) {
      state.notifications = notifications;
    },
  },
  getters: {
    getNotifications(state) {
      return state.notifications;
    }
  }
};

const tags = {
  state: {
    tags: undefined,
    tagsArray: undefined,
  },
  getters: {
    getTags(state) {
      return state.tags;
    },
    getTagsArray(state) {
      return state.tagsArray;
    }
  },
  mutations: {
    setTags(state, tags) {
      state.tags = tags;
    },
    setTagsArray(state, tagsArray) {
      state.tagsArray = tagsArray;
    }
  },
};

const emails = {
  state: {
    emails: undefined
  },
  getters: {
    getEmails(state) {
      return state.emails;
    }
  },
  mutations: {
    setEmails(state, emails) {
      Vue.set(state, 'emails', emails);
    }
  },
};

const rangeDate = {
  state: {
    rangeDate: []
  },
  getters: {
    getRangeDate(state) {
      return state.rangeDate;
    }
  },
  mutations: {
    setRangeDate(state, rangeDate) {
      Vue.set(state, 'rangeDate', rangeDate);
    }
  },
};

const countryList = {
  state: {
    countryList: CountryList
  },
  getters: {
    getCountryList(state) {
      return state.countryList;
    }
  },
  mutations: {
    setCountryList(state, rangeDate) {
      Vue.set(state, 'rangeDate', rangeDate);
    }
  },
};

const functions = {
  state: {
    HREF: undefined,
    search: undefined,
    paramsURL: undefined,
    isEmpty: undefined,
    clearSearch: undefined,
    searchQuery: undefined,
    uploads: [],
    removedFiles: [],
    locales: ["pt-Br", "en", "es"],
  },
  mutations: {
    setSearchQuery(state, searchQuery) {
      state.searchQuery = searchQuery;
    },
    setHREF(state, HREF) {
      state.HREF = HREF;
    },
    setClearSearch(state, clearSearch) {
      state.clearSearch = clearSearch;
    },
    setParamsURL(state, paramsURL) {
      state.paramsURL = paramsURL;
    },
    setIsEmpty(state, isEmpty) {
      state.isEmpty = isEmpty;
    },
    setUpload(state, upload) {
      upload === 1 ?
        state.uploads = [] :
        state.uploads.push(upload);
    },
    removeUpload(state, uploadName) {
      state.uploads = state.uploads.filter(f => {
        return f.document !== uploadName;
      });
    },
    setRemovedFiles(state, removed) {
      removed === 1 ?
        state.removedFiles = [] :
        state.removedFiles.push(removed);
    },
    setSearch(state, search) {
      state.search = search;
    },
  },
  getters: {
    getFunctions(state) {
      return state;
    }
  }
};

const tickets = {
  state: {
    tickets: undefined,
  },
  mutations: {
    setTickets(state, tickets) {
      state.tickets = tickets;
    },
  },
  getters: {
    getTickets(state) {
      return state;
    }
  }
};

const clearFilters = {
  state: {
    clearFilters: undefined,
  },
  mutations: {
    setClearFilters(state, clearFilters) {
      state.clearFilters = clearFilters;
    },
  },
  getters: {
    getClearFilters(state) {
      return state.clearFilters;
    }
  }
};

const ticketsPages = {
  state: {
    ticketsPages: undefined,
  },
  mutations: {
    setTicketsPages(state, ticketsPages) {
      state.ticketsPages = ticketsPages;
    },
  },
  getters: {
    getTicketsPages(state) {
      return state.ticketsPages;
    }
  }
};

const refreshErrors = {
  state: {
    commentIssueJira: undefined,
  },
  mutations: {
    setCommentIssueJiraError(state, value) {
      state.commentIssueJira = value;
    },
  },
  getters: {
    getCommentIssueJiraError(state) {
      return state.commentIssueJira;
    }
  }
};

const ticket = {
  state: {
    ticket: undefined,
    totalTime: undefined,
  },
  mutations: {
    setTicket(state, ticket) {
      state.ticket = ticket;
    },
    setTotalTime(state, totalTime) {
      state.totalTime = totalTime;
    },
  },
  getters: {
    getTicket(state) {
      return state;
    },
    getTotalTime(state) {
      return state.totalTime;
    },
  }
};

const ticketPaging = {
  state: {
    ticketPaging: undefined,
    currentPageTicket: undefined
  },
  mutations: {
    setCurrentPageTicket(state, currentPageTicket) {
      state.currentPageTicket = currentPageTicket;
    },
    setTicketPaging(state, ticketPaging) {
      state.ticketPaging = ticketPaging;
    }
  },
  getters: {
    getTicketPaging(state) {
      return state.ticketPaging;
    },
    getCurrentPageTicket(state) {
      return state.currentPageTicket;
    }
  }
}

const login = {
  state: {
    makeLogin: false,
  },
  mutations: {
    setLogin(state, makeLogin) {
      state.makeLogin = makeLogin;
    }
  },
  getters: {
    getLogin(state) {
      return state.makeLogin;
    }
  }
};

const roles = {
  state: {
    roles: undefined,
    size: undefined
  },
  mutations: {
    setRoles(state, roles) {
      state.roles = roles;
    },
    setRolesLength(state, value) {
      state.size = value;
    }
  },
  getters: {
    getRoles(state) {
      return state.roles;
    },
    getRolesLength(state) {
      return state.size;
    }
  }
};

const menus = {
  state: {
    menus: [],
    mainMenus: [],
    size: undefined,
    amIOnTheMainMenus: true,
    showMainMenus: true,
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus;
    },
    setMenusLength(state, value) {
      state.size = value;
    },
    setMainMenus(state, value) {
      state.mainMenus = value;
    },
    setAmIOnTheMainMenus(state, value) {
      state.amIOnTheMainMenus = value;
    },
    setShowMainMenus(state, value) {
      state.showMainMenus = value;
    }
  },
  getters: {
    getMenus(state) {
      return state.menus;
    },
    getMainMenus(state) {
      return state.mainMenus;
    },
    getMenusLength(state) {
      return state.size;
    },
    getMainMenusLength(state) {
      return state.mainMenus ? state.mainMenus.length : "";
    },
    getAmIOnTheMainMenus(state) {
      return state.amIOnTheMainMenus;
    },
    getShowMainMenus(state) {
      return state.amIOnTheMainMenus;
    }
  }
};

const channels = {
  state: {
    channels: undefined,
  },
  mutations: {
    setChannels(state, channels) {
      state.channels = channels;
    },
  },
  getters: {
    getChannels(state) {
      return state.channels;
    },
  }
};

const states = {
  state: {
    states: undefined,
  },
  mutations: {
    setStates(state, states) {
      state.states = states;
    },
  },
  getters: {
    getStates(state) {
      return state.states;
    },
  }
};

const informationsByUser = {
  state: {
    informationsByUser: undefined,
  },
  mutations: {
    setInformationsByUser(state, informationsByUser) {
      state.informationsByUser = informationsByUser;
    },
  },
  getters: {
    getInformationsByUser(state) {
      return state.informationsByUser;
    },
  }
};

const priorities = {
  state: {
    priorities: undefined,
  },
  mutations: {
    setPriorities(state, priorities) {
      state.priorities = priorities;
    },
  },
  getters: {
    getPriorities(state) {
      return state.priorities;
    },
  }
};

const keepSearchingTickets = {
  state: {
    queryString: undefined,
    filters: undefined,
  },
  mutations: {
    setQueryString(state, queryString) {
      state.queryString = queryString;
    },
    setFilters(state, filters) {
      state.filters = filters;
    },
  },
  getters: {
    getQueryString(state) {
      return state.queryString;
    },
    getFilters(state) {
      return state.filters;
    },
  }
};

const templates = {
  state: {
    templates: undefined,
  },
  mutations: {
    setTemplates(state, templates) {
      state.templates = templates;
    },
  },
  getters: {
    getTemplates(state) {
      return state.templates;
    },
  }
};

const getChannelsTM2 = {
  state: {
    channelsTM2: undefined,
    channelTM2: undefined,
  },
  mutations: {
    setChannelsTM2(state, channelsTM2) {
      state.channelsTM2 = channelsTM2;
    },
    setChannelTM2(state, channelTM2) {
      state.channelTM2 = channelTM2;
    },
  },
  getters: {
    getChannelsTM2(state) {
      return state.channelsTM2;
    },
    getChannelTM2(state) {
      return state.channelTM2;
    },
  }
};

const satisfactionSurvey = {
  state: {
    satisfactionSurvey: undefined,
  },
  mutations: {
    setSatisfactionSurvey(state, satisfactionSurvey) {
      state.satisfactionSurvey = satisfactionSurvey;
    }
  },
  getters: {
    getSatisfactionSurvey(state) {
      return state.satisfactionSurvey;
    }
  }
};

const getSurveyTypes = {
  state: {
    surveyType: undefined,
    surveyTypes: undefined,
  },
  mutations: {
    setSurveyType(state, surveyType) {
      state.surveyType = surveyType;
    },
    setSurveyTypes(state, surveyTypes) {
      state.surveyTypes = surveyTypes;
    },
  },
  getters: {
    getSurveyType(state) {
      return state.surveyType;
    },
    getSurveyTypes(state) {
      return state.surveyTypes;
    },
  }
};

const templatesLocale = {
  state: {
    ptbr: undefined,
    en: undefined,
    es: undefined,
    subjectPtbr: undefined,
    subjectEn: undefined,
    subjectEs: undefined,
    listTemplates: undefined,
    iDptbr: undefined,
    iDen: undefined,
    iDes: undefined
  },
  mutations: {
    setListTemplates(state, value) {
      state.listTemplates = value;
    },
    setPtbr(state, ptbr) {
      state.ptbr = ptbr;
    },
    setIdPtbr(state, iDptbr) {
      state.iDptbr = iDptbr;
    },
    setIdEn(state, iDen) {
      state.iDen = iDen;
    },
    setIdEs(state, iDes) {
      state.iDes = iDes;
    },
    setEn(state, en) {
      state.en = en;
    },
    setEs(state, es) {
      state.es = es;
    },
    setSubjectPtbr(state, subjectPtbr) {
      state.subjectPtbr = subjectPtbr;
    },
    setSubjectEn(state, subjectEn) {
      state.subjectEn = subjectEn;
    },
    setSubjectEs(state, subjectEs) {
      state.subjectEs = subjectEs;
    },
  },
  getters: {
    getIdPtbr(state) {
      return state.iDptbr;
    },
    getIdEn(state) {
      return state.iDen;
    },
    getIdEs(state) {
      return state.iDes;
    },
    getListTemplates(state) {
      return state.listTemplates;
    },
    getPtbr(state) {
      return state.ptbr;
    },
    getEn(state) {
      return state.en;
    },
    getEs(state) {
      return state.es;
    },
    getSubjectPtbr(state) {
      return state.subjectPtbr;
    },
    getSubjectEn(state) {
      return state.subjectEn;
    },
    getSubjectEs(state) {
      return state.subjectEs;
    },
  }
};

const typesOfTemplates = {
  state: {
    typeOfTemplate: undefined,
    typesOfTemplates: []
  },
  mutations: {
    setTypesOfTemplates(state, typesOfTemplates) {
      state.typesOfTemplates = typesOfTemplates
    },
    setTypeOfTemplate(state, typeOfTemplate) {
      state.typeOfTemplate = typeOfTemplate
    }
  },
  getters: {
    getTypesOfTemplates(state) {
      return state.typesOfTemplates;
    },
    getTypeOfTemplate(state) {
      return state.typeOfTemplate;
    }
  }
}

const subMenus = {
  state: {
    subMenus: undefined,
    size: undefined
  },
  mutations: {
    setSubMenus(state, subMenus) {
      state.subMenus = subMenus
    },
    setSubMenusLength(state, value) {
      state.size = value;
    }
  },
  getters: {
    getSubMenus(state) {
      return state.subMenus;
    },
    getSubMenusLength(state) {
      return state.subMenus ? state.subMenus.length : "";
    }
  }
}


const tracksAlbums = {
  state: {
    tracks: undefined,
    albums: undefined
  },
  mutations: {
    setTracks(state, tracks) {
      state.tracks = tracks
    },
    setAlbums(state, albums) {
      state.albums = albums;
    }
  },
  getters: {
    getTracks(state) {
      return state.tracks;
    },
    getAlbums(state) {
      return state.albums;
    }
  }
}

const blockedRoutesForUsers = {
  state: {
    typesOfUsersWhoHaveBlockedRoutes: ['USER'],
    blockedRoutes: ['/dashboard', '/new-client', '/list-clients', '/edit-client', '/new-ticket', '/new-profile', '/list-profiles', '/edit-profile', '/new-satisfaction-survey', '/list-satisfaction-surveys', '/edit-satisfaction-survey', '/new-user', '/edit-user'],
    pageSize: 250
  },
  mutations: {
    setTypesOfUsersWhoHaveBlockedRoutes(state, value) {
      state.typesOfUsersWhoHaveBlockedRoutes = value
    },
    setBlockedRoutes(state, value) {
      state.blockedRoutes = value;
    }
  },
  getters: {
    getTypesOfUsersWhoHaveBlockedRoutes(state) {
      return state.typesOfUsersWhoHaveBlockedRoutes;
    },
    getBlockedRoutes(state) {
      return state.blockedRoutes;
    },
    getPageSizeAllPermissions(state) {
      return state.pageSize;
    }
  }
}
const store = new Vuex.Store({
  modules: {
    tracksAlbums: tracksAlbums,
    // blockedRoutesForUsers: blockedRoutesForUsers,
    subMenus: subMenus,
    satisfactionSurvey, satisfactionSurvey,
    getSurveyTypes: getSurveyTypes,
    template: template,
    templatesLocale: templatesLocale,
    getChannelsTM2: getChannelsTM2,
    typesOfTemplates: typesOfTemplates,
    templates: templates,
    clearFilters: clearFilters,
    keepSearchingTickets: keepSearchingTickets,
    ticketsPages: ticketsPages,
    channels: channels,
    states: states,
    informationsByUser: informationsByUser,
    priorities: priorities,
    menus: menus,
    roles: roles,
    typesOfProfiles: typesOfProfiles,
    refreshErrors: refreshErrors,
    countryList: countryList,
    user: user,
    tickets: tickets,
    notifications: notifications,
    ticket: ticket,
    backend: backend,
    response: response,
    routes: routes,
    rangeDate: rangeDate,
    tags: tags,
    emails: emails,
    users: users,
    spinner: spinner,
    systemParameters: systemParameters,
    // functions: functions,
    ticketPaging: ticketPaging,
    login: login,
    split: split,
    initialData: initialData
  }
});

export default store;
