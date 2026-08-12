import Vision
import UIKit
import CoreImage
import React
#if canImport(NFCPassportReader)
import NFCPassportReader
#endif

@objc(OcrNativeModule)
public class OcrNativeModule: NSObject {
  
  #if canImport(NFCPassportReader)
  private var passportReader: PassportReader?
  #endif
  
  @objc
  public static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc(recognizeDocument:withResolver:withRejecter:)
  public func recognizeDocument(imageUri: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    print("[OcrNativeModule] recognizeDocument called with URI: \(imageUri)")
    Task {
      do {
        let result = try await OcrNativeModule.performOCR(imageUri: imageUri)
        print("[OcrNativeModule] OCR processing successful. Found \(result["blocks"] != nil ? (result["blocks"] as! [[String: Any]]).count : 0) blocks.")
        resolve(result)
      } catch {
        print("[OcrNativeModule] Error processing OCR: \(error.localizedDescription)")
        reject("OCR_ERROR", error.localizedDescription, error)
      }
    }
  }



  @objc(readPassportNfc:withResolver:withRejecter:)
  public func readPassportNfc(mrzKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("[OcrNativeModule] readPassportNfc called with mrzKey: \(mrzKey)")
      
      #if canImport(NFCPassportReader)
      Task { @MainActor [weak self] in
          guard let self = self else { return }
          do {
              self.passportReader = PassportReader()
              let customDisplayMessage: ((NFCViewDisplayMessage) -> String?) = { (displayMessage) in
                  switch displayMessage {
                      case .requestPresentPassport:
                          return "Approchez votre carte d'identité ou passeport..."
                      case .authenticatingWithPassport(_):
                          return "Authentification cryptographique..."
                      case .readingDataGroupProgress(_, _):
                          return "Lecture sécurisée des données..."
                      case .error(_):
                          return "Erreur de lecture NFC."
                      case .successfulRead:
                          return "Lecture validée !"
                      default:
                          return nil
                  }
              }

              let passport = try await self.passportReader!.readPassport(
                  mrzKey: mrzKey,
                  customDisplayMessage: customDisplayMessage
              )

              var result: [String: Any] = [:]
              result["success"] = true
              result["documentNumber"] = passport.documentNumber
              result["documentType"] = passport.documentType
              result["firstName"] = passport.firstName
              result["lastName"] = passport.lastName
              result["gender"] = passport.gender
              result["dateOfBirth"] = passport.dateOfBirth
              result["expiryDate"] = passport.documentExpiryDate
              result["issuingAuthority"] = passport.issuingAuthority
              result["nationality"] = passport.nationality
              
              if let passportImage = passport.passportImage {
                  if let jpegData = passportImage.jpegData(compressionQuality: 0.8) {
                      result["photoBase64"] = jpegData.base64EncodedString()
                  }
              }

              resolve(result)
          } catch {
              print("[OcrNativeModule] Passport Error: \(error.localizedDescription)")
              reject("NFC_ERROR", error.localizedDescription, error)
          }
      }
      #else
      reject("NFC_UNSUPPORTED", "NFCPassportReader is not available. Please rebuild with pods.", nil)
      #endif
  }



  private static func performOCR(imageUri: String) async throws -> [String: Any] {

    let url: URL
    if imageUri.hasPrefix("file://") {
      url = URL(string: imageUri)!
    } else {
      url = URL(fileURLWithPath: imageUri)
    }

    print("[OcrNativeModule] Loading image from URL: \(url)")
    guard let cgImage = try loadCGImage(from: url) else {
      print("[OcrNativeModule] Failed to load CGImage from \(url)")
      throw NSError(
        domain: "OcrNative",
        code: 1,
        userInfo: [NSLocalizedDescriptionKey: "Cannot load image from \(imageUri)"]
      )
    }
    print("[OcrNativeModule] CGImage loaded successfully. Size: \(cgImage.width)x\(cgImage.height)")



    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate         
    request.usesLanguageCorrection = true        
    request.recognitionLanguages = ["fr-FR", "en-US", "fr"]  
    request.minimumTextHeight = 0.01             


    print("[OcrNativeModule] Performing VNImageRequestHandler...")
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try handler.perform([request])

    guard let observations = request.results else {
      print("[OcrNativeModule] No text observations found in the image")
      return buildEmptyResult()
    }
    
    print("[OcrNativeModule] Found \(observations.count) raw text observations")


    var blocks: [[String: Any]] = []
    var fullText = ""

    for observation in observations {
      guard let candidate = observation.topCandidates(1).first else { continue }
      let text = candidate.string



      let bbox = observation.boundingBox
      let frame: [String: Double] = [
        "left": Double(bbox.minX),
        "top": Double(1.0 - bbox.maxY),  
        "width": Double(bbox.width),
        "height": Double(bbox.height)
      ]


      let line: [String: Any] = [
        "text": text,
        "frame": frame,
        "elements": [[
          "text": text,
          "frame": frame
        ] as [String: Any]]
      ]

      let block: [String: Any] = [
        "text": text,
        "frame": frame,
        "lines": [line]
      ]

      blocks.append(block)
      if !fullText.isEmpty { fullText += "\n" }
      fullText += text
    }

    return [
      "text": fullText,
      "blocks": blocks
    ]
  }

  private static func loadCGImage(from url: URL) throws -> CGImage? {
    guard let data = try? Data(contentsOf: url),
          let uiImage = UIImage(data: data),
          let cgImage = uiImage.cgImage else {
      return nil
    }


    if uiImage.imageOrientation == .up {
      return cgImage
    }


    let ciImage = CIImage(cgImage: cgImage).oriented(
      CGImagePropertyOrientation(uiImage.imageOrientation)
    )
    let context = CIContext()
    return context.createCGImage(ciImage, from: ciImage.extent)
  }

  private static func buildEmptyResult() -> [String: Any] {
    return ["text": "", "blocks": [] as [[String: Any]]]
  }
}



extension CGImagePropertyOrientation {
  init(_ uiOrientation: UIImage.Orientation) {
    switch uiOrientation {
    case .up:            self = .up
    case .upMirrored:    self = .upMirrored
    case .down:          self = .down
    case .downMirrored:  self = .downMirrored
    case .left:          self = .left
    case .leftMirrored:  self = .leftMirrored
    case .right:         self = .right
    case .rightMirrored: self = .rightMirrored
    @unknown default:    self = .up
    }
  }
}
