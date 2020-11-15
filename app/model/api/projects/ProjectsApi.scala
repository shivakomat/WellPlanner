package model.api.projects

import model.dataModels.Project
import model.databases.ProjectsDbFacade
import model.tools.DateTimeNow
import play.api.db.DBApi


trait ProjectsApi {
  def addNewWeddingEventProject(weddingProject: NewWeddingProjectMessage): Either[String, Long]

  def allByBusiness(businessId: Int): Seq[Project]

  def deleteProjectById(projectId: Int, businessId: Int): Seq[Project]

  def getProjectById(projectId: Int, businessId: Int): Option[Project]
}


class ProjectsFacade(dbApi: DBApi) extends ProjectsApi {

  val projectsDB = new ProjectsDbFacade(dbApi)

  def allByBusiness(businessId: Int): Seq[Project] =
    projectsDB.list().filter(_.business_id == businessId)


  def getProjectById(projectId: Int, businessId: Int): Option[Project] = {
    projectsDB.byId(projectId, businessId)
  }

  override def addNewWeddingEventProject(weddingProject: NewWeddingProjectMessage): Either[String, Long] = {
    val eventType = "WEDDING"
    val newProject = Project(name = weddingProject.groom.concat(weddingProject.bride),
      event_type = Some(eventType),
      brides_name = Some(weddingProject.bride),
      grooms_name = Some(weddingProject.groom),
      event_date = weddingProject.eventDate,
      budget = weddingProject.budget,
      client_id = weddingProject.clientId,
      business_id = weddingProject.businessId,
      modified_date = DateTimeNow.getCurrent,
      created_date = DateTimeNow.getCurrent)
    projectsDB.addNewProject(newProject) match {
      case Some(projectId) => Right(projectId)
      case None => Left("Unable to create the project in the database!")
    }
  }

  def deleteProjectById(projectId: Int, businessId: Int): Seq[Project] = {
    val rowsDeleted = projectsDB.deleteByProjectIdAndBusinessId(projectId, businessId)
    projectsDB.list()
  }
}