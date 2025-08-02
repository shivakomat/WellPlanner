package controllers.util

import model.api.businesses.AdminSignUpMessage
import model.api.clients.{ClientLoginMessage, ClientMessage, NewClientMessage}
import model.api.projects.{BudgetBreakdownList, NewWeddingProjectMessage, SubBreakDownWithPayments, TaskList, TimelineItemsList}
import model.api.users.UserMessage
import model.dataModels._
import org.joda.time.DateTime
import play.api.libs.json.{JodaReads, JodaWrites, Json, Writes}


object JsonFormats {

  implicit val dateTimeWriter: Writes[DateTime] = JodaWrites.jodaDateWrites("dd/MM/yyyy HH:mm:ss")
  implicit val dateTimeJsReader = JodaReads.jodaDateReads("yyyyMMddHHmmss")
  implicit val userMessageFormat = Json.format[UserMessage]
  implicit val userFormat = Json.format[User]
  implicit val businessFormat = Json.format[Business]
  implicit val adminSignUpMessageFormat = Json.format[AdminSignUpMessage]
  implicit val newWeddingProjectMessage = Json.format[NewWeddingProjectMessage]
  implicit val newClientMessage = Json.format[NewClientMessage]
  implicit val clientFormat = Json.format[Client]
  implicit val vendorContactFormat = Json.format[VendorContact]
  implicit val vendorManageFormat = Json.format[VendorManage]
  implicit val taskFormat = Json.format[Task]
  implicit val taskItemFormat = Json.format[TaskItem]
  implicit val taskCommentsFormat= Json.format[TaskComment]
  implicit val taskListFormat = Json.format[TaskList]
  implicit val paymentFormat = Json.format[Payment]
  implicit val budgetBreakdownsFormat = Json.format[BudgetBreakdowns]
  implicit val subBreakDownWithPaymentsFormat = Json.format[SubBreakDownWithPayments]
  implicit val budgetBreakdownListFormat = Json.format[BudgetBreakdownList]
  implicit val projectsFormat = Json.format[Project]
  implicit val teamMemberFormat = Json.format[TeamMember]
  implicit val clientMessageFormat = Json.format[ClientMessage]
  implicit val timelineItemFormat = Json.format[TimelineItem]
  implicit val timelineItemsListFormat = Json.format[TimelineItemsList]
  implicit val clientAccessFormat = Json.format[ClientAccess]
  implicit val clientDocumentFormat = Json.format[ClientDocument]
  implicit val clientLoginMessageFormat = Json.format[ClientLoginMessage]
  
  // New authentication-related formats
  implicit val userRegistrationFormat = Json.format[UserRegistration]
  implicit val loginResponseFormat = Json.format[LoginResponse]
}