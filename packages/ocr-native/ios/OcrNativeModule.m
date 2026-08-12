#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


#ifndef RCT_EXTERN_REMAP_MODULE
#define RCT_EXTERN_REMAP_MODULE(js_name, objc_name, objc_supername) \
  objc_name : objc_supername @end \
  @interface objc_name (RCTExternModule) @end \
  @implementation objc_name (RCTExternModule)
#define RCT_EXTERN_METHOD(method) - (void)method {}
typedef void (^RCTPromiseResolveBlock)(id result);
typedef void (^RCTPromiseRejectBlock)(NSString *code, NSString *message, NSError *error);
#endif

@interface RCT_EXTERN_REMAP_MODULE(OcrNative, OcrNativeModule, NSObject)

RCT_EXTERN_METHOD(recognizeDocument:(NSString *)imageUri
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(readPassportNfc:(NSString *)mrzKey
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
