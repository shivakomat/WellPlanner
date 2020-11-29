package model.dataModels

case class Business(id: Option[Int] = None, name: String, city: String, state: String, phone_number: String, social_media_link: String, owner_profile_name: Option[String] = None, email: String,
                    about: Option[String] = None, country: String, modified_date: Int, created_date: Int)
