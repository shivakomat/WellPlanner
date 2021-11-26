package model.dataModels

case class ClientAccess(id: Option[Int] = None, username: String, password: String, client_id: Int, project_id: Int,
                        business_id: Int, modified_date: Int, created_date: Option[Int] = None)