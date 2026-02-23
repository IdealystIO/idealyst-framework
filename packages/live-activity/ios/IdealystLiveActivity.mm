#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(IdealystLiveActivity, RCTEventEmitter)

RCT_EXTERN_METHOD(isSupported)

RCT_EXTERN_METHOD(isEnabled:
                  (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startActivity:
                  (NSString *)templateType
                  attributesJson:(NSString *)attributesJson
                  contentStateJson:(NSString *)contentStateJson
                  optionsJson:(NSString *)optionsJson
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateActivity:
                  (NSString *)activityId
                  contentStateJson:(NSString *)contentStateJson
                  alertConfigJson:(NSString *)alertConfigJson
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(endActivity:
                  (NSString *)activityId
                  finalContentStateJson:(NSString *)finalContentStateJson
                  dismissalPolicy:(NSString *)dismissalPolicy
                  dismissAfter:(double)dismissAfter
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(endAllActivities:
                  (NSString *)dismissalPolicy
                  dismissAfter:(double)dismissAfter
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getActivity:
                  (NSString *)activityId
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(listActivities:
                  (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPushToken:
                  (NSString *)activityId
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
