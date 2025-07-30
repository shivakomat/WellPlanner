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

  def newTimelineItem(): Action[JsValue] = Action.async(parse.json) { request =>
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

  def timelineItems(businessId: Int, projectId: Int) =  Action {
    successResponse(OK, Json.toJson(timelineApi.allTimelineItems(projectId, businessId)), Seq("Successfully processed"))
  }

  def deleteTimelineItemById(timelineItemId: Int, projectId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(timelineApi.deleteTimelineItem(timelineItemId, projectId, businessId)), Seq("Successfully processed"))
  }


  def updateTimelineItem(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Updating timeline item request accepted")

    def updateOperation(timelineItem: TimelineItem): Future[Result] =
      timelineApi.updateItem(timelineItem) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update task ${data.description}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[TimelineItem].fold(
      errors => badRequest,
      payload => updateOperation(payload)
    )
  }

}