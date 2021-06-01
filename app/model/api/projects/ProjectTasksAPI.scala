package model.api.projects

import model.dataModels.{Task, TaskComment, TaskItem}
import model.databases.{TaskCommentsDbFacade, TasksDbFacade}
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class ProjectTasksAPI(dbApi: DBApi, ws: WSClient) {

  private val tasksListDb = new TasksDbFacade(dbApi)
  private val tasksCommentsDb = new TaskCommentsDbFacade(dbApi)

  def addTask(newTask: Task): Either[String, Task] = {
    val newTaskAdded =
      tasksListDb.addNewTask(newTask.copy(modified_date = Some(DateTimeNow.getCurrent),
                                          created_date = Some(DateTimeNow.getCurrent)))
    val newTaskExecution =
      for {
        id <- newTaskAdded
        task <- tasksListDb.byTaskId(id)
      } yield (task)

    if(newTaskExecution.nonEmpty) Right(newTaskExecution.get)
    else Left("failed during database insertion or reading the newly created data")
  }

  def addTaskItem(newTaskItem: TaskItem): Either[String, TaskItem] = {

    print(newTaskItem);

    val newTaskItemAdded = tasksListDb
      .addNewTaskItem(newTaskItem.copy(modified_date = Some(DateTimeNow.getCurrent),
                                    created_date = Some(DateTimeNow.getCurrent)))
    val newTaskItemExecution =
      for {
        id <- newTaskItemAdded
        taskItem <- tasksListDb.byTaskItemId(id)
      } yield (taskItem)

    if(newTaskItemExecution.nonEmpty) Right(newTaskItemExecution.get)
    else Left("Failed during database insertion or reading the newly created data")

  }

  def allTasks(projectId: Long, businessId: Long): Seq[TaskList] = {
    val listOfTasks = tasksListDb.list(projectId, businessId)

    val mapOfParentTaskWithSubTasks = listOfTasks.groupBy(_.parent_task_id)
    val parentTasks: Option[Seq[Task]] = mapOfParentTaskWithSubTasks.get(None)

    if(parentTasks.nonEmpty)
        parentTasks.get.map(parentTask => TaskList(parent = parentTask, subTasks = mapOfParentTaskWithSubTasks.getOrElse(parentTask.id, Seq.empty[Task])))
    else
        Seq.empty[TaskList]
  }

  def taskItemsByTask(taskId: Long, projectId: Long, businessId: Long): Seq[TaskItem] =
    tasksListDb.listOfTaskItem(taskId, projectId, businessId)

  def addCommentToTask(taskComment: TaskComment): Either[String, TaskComment] = {
    val newTaskCommentAdded =
      tasksCommentsDb.addNewTaskComment(taskComment.copy(modified_date = Some(DateTimeNow.getCurrent), created_date = Some(DateTimeNow.getCurrent)))

    val newTaskComment =
      for {
        id <- newTaskCommentAdded
        taskComment <- tasksCommentsDb.byId(id)
      } yield (taskComment)

    if(newTaskComment.nonEmpty) Right(newTaskComment.get)
    else Left("failed during database insertion or reading the newly created data")
  }

  def updateTaskInfo(updatedTask: Task): Either[String, Task] = {
    val updatedRows = tasksListDb.updateTaskInfo(updatedTask)
    if(updatedRows == 1) {
      val updatedClient = tasksListDb.byTaskId(updatedTask.id.get)
      Right(updatedClient.get)
    } else
      Left("Failed during database update or reading the updated task back from database")
  }

  def taskCommentsByTask(projectId: Long, businessId: Long, taskId: Long): Seq[TaskComment] =
    tasksCommentsDb.byTaskId(taskId, businessId, projectId)

  def deleteTaskComment(taskCommentId: Long, taskId: Long, projectId: Long, businessId: Long): Seq[TaskComment] = {
    val rowsDeleted = tasksCommentsDb.deleteTaskComment(taskCommentId, taskId, projectId, businessId)
    this.taskCommentsByTask(businessId, projectId, taskId)
  }

  def deleteTask(taskId: Long, projectId: Long, businessId: Long): Seq[TaskList] = {
    val rowsDeleted = tasksListDb.deleteTask(taskId,projectId, businessId)
    this.allTasks(projectId, businessId)
  }

  def deleteTaskItem(taskItemId: Long, taskId: Long, projectId: Long, businessId: Long): Seq[TaskItem] = {
    val rowsDeleted = tasksListDb.deleteTaskItem(taskItemId, taskId, projectId, businessId)
    this.taskItemsByTask(taskId, projectId, businessId)
  }

}