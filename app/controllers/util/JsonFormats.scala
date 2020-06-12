package controllers.util

import model.api.businesses.AdminSignUpMessage
import model.api.projects.NewWeddingProjectMessage
import model.api.users.UserMessage
import model.dataModels.{Business, User}
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

}
