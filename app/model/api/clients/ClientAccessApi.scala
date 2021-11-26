package model.api.clients

import model.dataModels.ClientAccess
import model.databases.ClientAccessesDbApi
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class ClientAccessApi(dbApi: DBApi, ws: WSClient) {

  private val clientsAccessDb = new ClientAccessesDbApi(dbApi)

  def addClientAccess(access: ClientAccess):  Either[String, ClientAccess] = {
    val newAccessAdded =
      clientsAccessDb.addAccess(access.copy(modified_date = DateTimeNow.getCurrent,
        created_date = Some(DateTimeNow.getCurrent)))
    val newAccessExecution =
      for {
        id <- newAccessAdded
        clientAccessInfo <- clientsAccessDb.byProject(access.client_id, access.project_id, access.business_id)
      } yield (clientAccessInfo)

    if(newAccessExecution.nonEmpty) Right(newAccessExecution.get)
    else Left("failed during database insertion or reading the newly created data")
  }

  def getAccessBy(clientId: Long, projectId: Long, businessId: Long): Option[ClientAccess] = {
    clientsAccessDb.byProject(clientId, projectId, businessId)
  }

}