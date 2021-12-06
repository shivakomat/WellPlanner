package model.api.clients

import model.dataModels.ClientAccess
import model.databases.ClientAccessesDbApi
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

case class ClientLoginMessage(username: String, email: String, password: String)

class ClientAccessApi(dbApi: DBApi, ws: WSClient) {

  private val clientsAccessDb = new ClientAccessesDbApi(dbApi)

  def addClientAccess(access: ClientAccess):  Either[String, ClientAccess] = {
    val userExists = clientsAccessDb.byUsername(access.username)
    if(userExists.nonEmpty) {
       Left("username requested already exists please choose a new username")

    } else {
      val newAccessAdded =
        clientsAccessDb.addAccess(access.copy(modified_date = Some(DateTimeNow.getCurrent),
          created_date = Some(DateTimeNow.getCurrent)))
      val newAccessExecution =
        for {
          id <- newAccessAdded
          clientAccessInfo <- clientsAccessDb.byProject(access.project_id, access.business_id)
        } yield (clientAccessInfo)

      if (newAccessExecution.nonEmpty) Right(newAccessExecution.get)
      else Left("failed during database insertion or reading the newly created data")
    }
  }

  def getAccessBy(projectId: Long, businessId: Long): Option[ClientAccess] = {
    clientsAccessDb.byProject(projectId, businessId)
  }

  def loginClient(loginMsg: ClientLoginMessage): Either[String, ClientAccess] = {
    val clientAccessExists = clientsAccessDb.login(loginMsg.username, loginMsg.email, loginMsg.password)
    clientAccessExists match {
      case Some(access) => Right(access)
      case None => Left("Username with email & password didn't match our records, please try again or contact your planner")
    }
  }

  def updateClientAccess(updatedClientAccess: ClientAccess): Either[String, ClientAccess] = {
    val updatedRows = clientsAccessDb.updateClientAccess(updatedClientAccess)
    if(updatedRows == 1) {
      val updatedClient = clientsAccessDb.byUsername(updatedClientAccess.username)
      Right(updatedClient.get)
    } else
      Left("Failed during database update or reading the updated client access back from database")
  }



}