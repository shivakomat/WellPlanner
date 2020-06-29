package controllers

import com.google.inject.Inject
import controllers.util.ResponseTypes.{errorResponse, successResponse}
import model.api.projects.ProjectTasksAPI
import model.dataModels.{Task, TaskComment}
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, Action, BodyParsers, ControllerComponents, Result}
import controllers.util.JsonFormats._
import scala.concurrent.Future

class TasksController @Inject() (dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val tasksApi = new ProjectTasksAPI(dbApi, ws)

  def logForSuccess(data: String) =
    logger.info(s"Successfully created \n tasks and id follows : \n { $data } ")

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))


  def addNewTasks(): Action[JsValue] = Action.async(BodyParsers.parse.json) { request =>
    def createTask(newTask: Task): Future[Result] = {
      tasksApi.addTask(newTask) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully created task ${data.title}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }
    }
    request.body.validate[Task].fold(
      errors => badRequest,
      payload => createTask(payload)
    )
  }

  def updateTask(): Action[JsValue] = Action.async(BodyParsers.parse.json) { request =>
    println("Updating task request accepted")

    def updateOperation(task: Task): Future[Result] =
      tasksApi.updateTaskInfo(task) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully update task ${data.title}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }

    request.body.validate[Task].fold(
      errors => badRequest,
      payload => updateOperation(payload)
    )
  }

  def addCommentToTask(): Action[JsValue] = Action.async(BodyParsers.parse.json) { request =>
    def addComment(comment: TaskComment): Future[Result] = {
      tasksApi.addCommentToTask(comment) match {
        case Right(data) =>
          logForSuccess(Json.toJson(data).toString)
          Future.successful(successResponse(CREATED, Json.toJson(data), Seq(s"Successfully added the following comment ${data.comment_text}")))
        case Left(errorMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errorMsg")))
      }
    }
    request.body.validate[TaskComment].fold(
      errors => badRequest,
      payload => addComment(payload)
    )
  }



  def tasks(businessId: Int, projectId: Int) =  Action {
    successResponse(OK, Json.toJson(tasksApi.allTasks(projectId, businessId)), Seq("Successfully processed"))
  }

  def taskCommentsByTask(businessId: Int, projectId: Int, taskId: Int) =  Action {
    successResponse(OK, Json.toJson(tasksApi.taskCommentsByTask(projectId, businessId, taskId)), Seq("Successfully processed"))
  }

  def deleteTaskById(taskId: Int, projectId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(tasksApi.deleteTask(taskId, projectId, businessId)), Seq("Successfully processed"))
  }


  def deleteTaskCommentById(taskCommentId: Int, taskId: Int, projectId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(tasksApi.deleteTaskComment(taskCommentId, taskId, projectId, businessId)), Seq("Successfully processed"))
  }

}
