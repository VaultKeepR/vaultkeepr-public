package expo.modules.ocrnative

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class OcrNativeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("VaultKeeperOcrNative")

    AsyncFunction("recognizeText") { uri: String ->
      // TODO: ML Kit text recognition
      ""
    }
  }
}
