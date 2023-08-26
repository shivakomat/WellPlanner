package model.dataModels


case class Project(id: Option[Int] = None,
                   name: String,
                   event_type: Option[String] = None,
                   brides_name: Option[String] = None,
                   grooms_name: Option[String] = None,
                   client_id: Int,
                   budget: Double,
                   event_date: Int,
                   business_id: Int,
                   modified_date: Int,
                   created_date: Int,
                   is_deleted: Boolean = false)