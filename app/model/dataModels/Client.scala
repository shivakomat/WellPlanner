package model.dataModels

case class Client(id: Option[Int] = None, name: Option[String] = None, event_type: Option[String] = None, event_date: Int,
                  phone_number: String, email: Option[String] = None, notes: Option[String] = None, budget: Option[Double] = None,
                  status: Option[String] = None, business_id: Int, modified_date: Int,
                  created_date: Option[Int] = None)
