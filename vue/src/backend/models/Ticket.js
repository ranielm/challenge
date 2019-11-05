import http from '../request/http';
import store from '../store';
import axios from 'axios';

export default class{
  static getAll(){
    return http.get(store.getters.getRoutes.ticket);
  }

  static get(numberPage){
    return http.get(store.getters.getRoutes.ticketGetPages + "?pageNumber=" + numberPage);
  }

  static getClosedTicketsPerCompany(numberPage, query){
    //GET: /api/ticket/company/49?pageNumber=0&pageSize=10&query=aushdausdh
    return http.get(store.getters.getRoutes.ticket + "/company/" + store.getters.getMerge + "?pageNumber=" + (numberPage ? numberPage : 0) + "&pageSize=10&query=" + (query ? query : ""));
  }

  static search(numberPage, query){
    return http.get(store.getters.getRoutes.ticketGetPages + "?pageNumber=" + numberPage + query);
  }

  static informationsByUser(){
    return http.get(store.getters.getRoutes.ticket + "/informationsByUser");
  }

  static searchQuery(numberPage, searchQuery){
    return http.get(store.getters.getRoutes.ticket + "/query/" + numberPage + "/10?query=" + searchQuery);
  }

  static getOne(ticketID){
    return http.get(store.getters.getRoutes.ticketGetOne + ticketID);
  }

  static post(ticket){
    return http.post(store.getters.getRoutes.ticket, ticket);
  }

  static put(ticket){
    return http.put(store.getters.getRoutes.ticket, ticket);
  }

  static split(split){
    return http.put(store.getters.getRoutes.ticket + "/split", split);
  }

  static merge(merge){
    //GET: /api/ticket/merge/{into}/{from}
    return http.get(store.getters.getRoutes.ticket + "/merge/" + merge.ticketIdInto + "/" + merge.ticketIdFrom);
  }

  static draft(draft){
    return http.post(store.getters.getRoutes.draft, draft);
  }

  static upload(file, ticketID){
    return http.post(store.getters.getRoutes.upload + "?ticketId=" + ticketID + "&document=" + file.document, file);
  }

  static deleteFile(fileId){
    return http.delete( store.getters.getRoutes.upload + "?fileId=" + fileId);
  }

  static uploadAnswer(file, answerID){
    return http.post(store.getters.getRoutes.upload + "/answer?answerId=" + answerID + "&document=" + file.document, file);
  }

  static answer(answer){
    return http.post(store.getters.getRoutes.answer, answer);
  }

  static getAnswersNotifications(ticketID, locale){
    return http.get(store.getters.getRoutes.ticket + "/getHistory?ticketId="+ ticketID +"&locale=" + locale);
  }

  static getByIssue(issue){
    return http.get(store.getters.getRoutes.ticket + "/issue/" + issue.id);
  }

  static validateTicket(ticketID){
    return http.get(store.getters.getRoutes.ticket + "/validate/" + ticketID);
  }

  static reassign(params){
    return http.post(store.getters.getRoutes.ticket + "/reassign/", params);
  }

  static existTicketByClientAndIssue(issueTypeId, username) {
    return http.get(store.getters.getRoutes.ticket + "/issueTypeUser/" + issueTypeId + '/' + username);
  }

  static existTicketByCompanyAndIssue(issueTypeId, companyId) {
    return http.get(store.getters.getRoutes.ticket + "/issueTypeCompany/" + issueTypeId + '/' + companyId);
  }

  static searchSatisfaction(hash, params){
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return axios
      .put(store.getters.getRoutes.searchSatisfaction + "/" + hash, params, config);

  }

}
