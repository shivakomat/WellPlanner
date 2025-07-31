package model.dataModels

case class Business(id: Option[Int] = None, name: String, city: Option[String] = None, state: Option[String] = None, phone_number: Option[String] = None, social_media_link: Option[String] = None, owner_profile_name: Option[String] = None, email: Option[String] = None,
                    about: Option[String] = None, country: Option[String] = None, modified_date: Int, created_date: Int)
