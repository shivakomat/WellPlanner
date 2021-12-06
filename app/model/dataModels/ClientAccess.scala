package model.dataModels

case class ClientAccess(id: Option[Int] = None, username: String, password: String, project_id: Int,
                        email: String, logged_in: Boolean = false, business_id: Int,
                        modified_date: Option[Int] = None, created_date: Option[Int] = None)