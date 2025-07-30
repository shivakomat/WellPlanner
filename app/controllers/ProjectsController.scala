package controllers

import com.google.inject.Inject
import controllers.util.JsonFormats._
import controllers.util.ResponseTypes._
import model.api.projects.{NewWeddingProjectMessage, ProjectsFacade}
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future

class ProjectsController  @Inject() (dbApi: DBApi, cc: ControllerComponents, ws: WSClient) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  private val projectsApi = new ProjectsFacade(dbApi)

  def logForSuccess(data: String) =
    logger.info(s"Successfully created \n project id follows : \n { $data } ")

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))

  def newWeddingProject(): Action[JsValue] = Action.async(parse.json) { request =>
    println("Register new project request accepted ")
    def createProject(newProject: NewWeddingProjectMessage): Future[Result] =
      projectsApi.addNewWeddingEventProject(newProject) match {
        case Right(projectId) =>
          logForSuccess(projectId.toString)
          Future.successful(successResponseWithId(CREATED, projectId, Seq(s"Successfully created project ${projectId}")))
        case Left(errMsg) =>
          Future.successful(errorResponse(FOUND, Seq(s"Error: $errMsg")))
      }

    request.body.validate[NewWeddingProjectMessage].fold(
      errors => badRequest,
      payload => createProject(payload)
    )
  }

  def projectsByBusiness(businessId: Int) =  Action {
    successResponse(OK, Json.toJson(projectsApi.allByBusiness(businessId)), Seq("Successfully processed"))
  }

  def getProjectById(projectId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(projectsApi.getProjectById(projectId, businessId)), Seq("Successfully processed"))
  }

  def deleteProjectById(projectId: Int, businessId: Int) = Action {
    successResponse(OK, Json.toJson(projectsApi.deleteProjectById(projectId, businessId)), Seq("Successfully processed"))
  }

}