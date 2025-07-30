package controllers

import com.google.inject.Inject
import controllers.util.JsonFormats.{clientFormat, newClientMessage}
import controllers.util.ResponseTypes.{errorResponse, successResponse}
import model.api.clients.{ClientsApi, NewClientMessage}
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future

class ClientsController  @Inject() (dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val clientsApi = new ClientsApi(dbApi, ws)

  def logForSuccess(data: String) =
    logger.info(s"Successfully created a new client and details follow : \n { $data } ")

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))

  def newClient(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Adding of new client request incoming")

    def createClient(newClient: NewClientMessage): Future[Result] =
      clientsApi.addNewClient(newClient) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created client ${data.name}")))
        case Left(errorMsg) =>
          logger.info(errorMsg)
          println("ERROR" + errorMsg)
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[NewClientMessage].fold(
      errors => badRequest,
      payload => createClient(payload)
    )
  }

  def updateClient(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Updated client request incoming")

    def update(client: NewClientMessage): Future[Result] =
      clientsApi.updateClientsBasicInfo(client) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update client ${data.name}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[NewClientMessage].fold(
      errors => badRequest,
      payload => update(payload)
    )
  }

  def businessClients(businessId: Int) =  Action {
    successResponse(OK, Json.toJson(clientsApi.allClientsByBusiness(businessId)), Seq("Successfully processed"))
  }

  def deleteClientById(clientId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(clientsApi.deleteClientById(clientId, businessId)), Seq("Successfully processed"))
  }

}