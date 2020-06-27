package model.dataModels

case class VendorContact(id: Option[Int] = None, name: Option[String] = None, description: String, contact: String, location: String,
                         vendor_type: Option[String] = None, phone_number: String, email: Option[String] = None, estimated_costs: Double,
                         notes: Option[String] = None, business_id: Int, modified_date: Option[Int] = None, created_date: Option[Int] = None)