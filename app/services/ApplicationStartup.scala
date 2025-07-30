package services

import javax.inject.{Inject, Singleton}
import play.api.inject.ApplicationLifecycle
import play.api.Logger
import scala.concurrent.Future

@Singleton
class ApplicationStartup @Inject()(
  lifecycle: ApplicationLifecycle,
  databaseInitializer: DatabaseInitializer
) {

  private val logger = Logger(this.getClass)

  // Initialize database on application startup
  logger.info("Starting WellPlanner application...")
  
  try {
    databaseInitializer.initializeDatabase()
    logger.info("Application startup completed successfully")
  } catch {
    case e: Exception =>
      logger.error(s"Application startup failed: ${e.getMessage}", e)
  }

  // Register shutdown hook
  lifecycle.addStopHook { () =>
    logger.info("WellPlanner application shutting down...")
    Future.successful(())
  }
}
