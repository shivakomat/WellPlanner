package controllers

import com.google.inject.Inject
import controllers.util.ResponseTypes.{errorResponse, successResponse}
import model.api.projects.ProjectTimelineAPI
import model.dataModels.TimelineItem
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, Action, BodyParsers, ControllerComponents, Result}
import controllers.util.JsonFormats._
import scala.concurrent.Future

class TimelineController  @Inject() (dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val timelineApi = new ProjectTimelineAPI(dbApi, ws)

  def logForSuccess(data: String) =
    logger.info(s"Successfully created \n timeline item id follows : \n { $data } ")

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))

  def newTimelineItem(): Action[JsValue] = Action.async(BodyParsers.parse.json) { request =>
    def createItem(newItem: TimelineItem): Future[Result] =
      timelineApi.addNewItem(newItem) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created timeline ${data.description}")))
        case Left(errMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errMsg")))
      }

    request.body.validate[TimelineItem].fold(
      errors => badRequest,
      payload => createItem(payload)
    )
  }

}