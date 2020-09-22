package model.dataModels

case class TeamMember (id: Option[Int] = None, business_id: Int, member_name: String, email: String, modified_date:  Option[Int] = None, created_date:  Option[Int] = None)