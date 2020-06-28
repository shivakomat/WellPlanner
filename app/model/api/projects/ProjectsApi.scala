package model.api.projects

import model.dataModels.Project
import model.databases.ProjectsDbFacade
import model.tools.DateTimeNow
import play.api.db.DBApi


trait ProjectsApi {
  def addNewWeddingEventProject(weddingProject: NewWeddingProjectMessage): Either[String, Long]
}


class ProjectsFacade(dbApi: DBApi) extends ProjectsApi {
  override def addNewWeddingEventProject(weddingProject: NewWeddingProjectMessage): Either[String, Long] = {
    val eventType = "WEDDING"
    val projectsDB = new ProjectsDbFacade(dbApi)
    val newProject = Project(name = weddingProject.groom.concat(weddingProject.bride),
      event_type = Some(eventType),
      brides_name = Some(weddingProject.bride),
      grooms_name = Some(weddingProject.groom),
      due_date = weddingProject.dueDate,
      budget = weddingProject.budget,
      business_id = weddingProject.businessId,
      modified_date = DateTimeNow.getCurrent,
      created_date = DateTimeNow.getCurrent)
    projectsDB.addNewProject(newProject) match {
      case Some(projectId) => Right(projectId)
      case None => Left("Unable to create the project in the database!")
    }
  }
}