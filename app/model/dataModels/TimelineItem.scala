package model.dataModels


case class TimelineItem(id: Option[Int] = None,
                        project_id: Int,
                        business_id: Int,
                        parent_id: Option[Int] = None,
                        time: String,
                        duration: Double,
                        description: String,
                        date: Int,
                        contact: String,
                        category: String,
                        notes: String,
                        is_completed: Boolean = false,
                        modified_date: Option[Int] = None,
                        created_date: Option[Int] = None)