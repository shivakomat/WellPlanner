package model.api.projects

import model.dataModels.TimelineItem

case class TimelineItemsList(parent: TimelineItem, subItems: Seq[TimelineItem])