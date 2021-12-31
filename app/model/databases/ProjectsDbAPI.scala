package model.databases

import model.dataModels.Project

trait ProjectsDbAPI {

  def addNewProject(project: Project): Option[Long]

  def list(): Seq[Project]

  def byId(projectId: Int, businessId: Int): Option[Project]

  def softDeleteByProjectIdAndBusinessId(projectId: Int, businessId: Int): Int

}
