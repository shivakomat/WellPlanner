package model.databases

import model.dataModels.Project

trait ProjectsDbAPI {

  def addNewProject(project: Project): Option[Long]

  def list(): Seq[Project]

//  def listByBusinessId(businessId:Long): Seq[Project]

  def deleteByProjectIdAndBusinessId(projectId: Int, businessId: Int): Int

}
