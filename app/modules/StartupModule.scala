package modules

import com.google.inject.AbstractModule
import services.ApplicationStartup

class StartupModule extends AbstractModule {
  override def configure(): Unit = {
    // Eagerly bind ApplicationStartup to ensure it runs on application startup
    bind(classOf[ApplicationStartup]).asEagerSingleton()
  }
}
