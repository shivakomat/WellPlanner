package model.dataModels


case class TimelineItem(id: Option[Int] = None,
                          projectId: Int,
                          business_id: Int,
                          time: String,
                          duration: Double,
                          description: String,
                          date: Int,
                          contact: String,
                          notes: String,
                          modified_date: Option[Int] = None,
                          create_date: Option[Int] = None)