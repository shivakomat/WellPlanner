package controllers

import com.google.inject.Inject
import controllers.util.JsonFormats._
import controllers.util.ResponseTypes._
import model.api.businesses.{AdminSignUpMessage, BusinessesApi}
import model.dataModels.{Business, TeamMember}
import play.api.Logger
import play.api.db.DBApi
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future

class BusinessController  @Inject() (dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val businessesApi = new BusinessesApi(dbApi, ws)

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))

  def logForSuccess(data: String) =
    logger.info(s"Successfully created \n tasks and id follows : \n { $data } ")

  def registerNewBusiness(): Action[JsValue] = Action.async(parse.json) { request =>

    println("Register new business request accepted ")

  def logForSuccess(data: String) =
      logger.info(s"Successfully registered \n user details follow : \n { $data } ")

  def apiRegister(newBusiness: AdminSignUpMessage): Future[Result] =
    businessesApi.signUpBusiness(newBusiness) match {
      case Right(data) =>
        logForSuccess(Json.toJson(data).toString)
        Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully registered ${data._1.name}")))
      case Left(errorMsg) =>
        Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
    }

    request.body.validate[AdminSignUpMessage].fold(
      errors => badRequest,
      payload => apiRegister(payload)
    )
  }

  def businessExists(businessName: String) = Action.async {
    val businessExists = businessesApi.businessExists(businessName)
    val successMessage = Seq("true if it exists otherwise false if it doesn't exist")
    Future.successful(successBooleanResponse(OK, businessExists, successMessage))
  }

  def byId(businessId: Int) =  Action {
    successResponse(OK, Json.toJson(businessesApi.businessInfo(businessId)), Seq("Successfully processed"))
  }

  def updateBusinessInfo(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Updating business info request accepted")

    def updateOperation(business: Business): Future[Result] =
      businessesApi.updateBusinessInfoBy(business) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update business ${data.id}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[Business].fold(
      errors => badRequest,
      payload => updateOperation(payload)
    )
  }

  def updateTeamMember(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Updating team info request accepted")

    def updateOperation(newTeamMember: TeamMember): Future[Result] =
      businessesApi.updateTeamMemberBy(newTeamMember) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully updated team member ${data.id}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[TeamMember].fold(
      errors => badRequest,
      payload => updateOperation(payload)
    )
  }

  def addNewMemberToTeamByBusiness(): Action[JsValue] = Action.async(parse.json) { request =>
    request.body.validate[TeamMember].fold(
      errors => badRequest,
      newMember =>
      businessesApi.addTeamMemberToBusiness(newMember) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update business ${data.id}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }
    )
  }

  def allTeamMembers(businessId: Int) = Action {
    successResponse(OK, Json.toJson(businessesApi.getAllTeamMembers(businessId)), Seq("Successfully processed"))
  }


}