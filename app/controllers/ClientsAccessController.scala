package controllers

import com.google.inject.Inject
import controllers.util.ResponseTypes.{errorResponse, successResponse}
import model.api.clients.ClientAccessApi
import model.dataModels.ClientAccess
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, Action, BodyParsers, ControllerComponents, Result}
import controllers.util.JsonFormats._

import scala.concurrent.Future

class ClientsAccessController @Inject() (dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val clientAccessApi = new ClientAccessApi(dbApi, ws)

  def logForSuccess(data: String) =
    logger.info(s"Successfully added access and username follows : \n { $data } ")

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))


  def addNewTasks(): Action[JsValue] = Action.async(BodyParsers.parse.json) { request =>
    def createTask(access: ClientAccess): Future[Result] = {
      clientAccessApi.addClientAccess(access) match {
        case Right(data) =>
          logForSuccess(data.username)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created access as username:  ${data.username}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }
    }
    request.body.validate[ClientAccess].fold(
      errors => badRequest,
      payload => createTask(payload)
    )
  }



}
