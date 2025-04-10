// 백그라운드 스크립트 - 확장 프로그램의 백그라운드 로직을 처리합니다
import { ElementInfo, ElementSelectedMessage, UrlChangedMessage } from './interfaces/element';
import { fetchPostApi } from './utils/fetchUtil';


chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// 선택된 요소 정보 수신
chrome.runtime.onMessage.addListener(function(
  message: ElementSelectedMessage, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
): void {

   console.log("##########backend run") 
   console.log(message) 
  if (message.action === 'elementSelected') {
    // 선택된 요소 정보를 저장하거나 처리
    chrome.storage.local.set({[message.type]: message.elementInfo});
    
    // 팝업을 다시 열어 정보 표시
    chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener(function(
  message: UrlChangedMessage, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
): void {

  console.log('##### sendUrlChangedEvent')
  console.log(message)
  if (message.type === 'sendUrlChangedEvent') {
    fetchPostApi('http://shopbuddy.kr:8080/api/browsing-history', {site_url: message.url,chrome_extention_uuid:message.userUUID,user_id:message.userId});
  }

});





// // 백그라운드 스크립트에서 메시지 수신 및 API 호출
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('##### sendUrlChangedEvent')
//   console.log(message)
//   if (message.type === 'sendUrlChangedEvent') {
//     fetchPostApi('http://shopbuddy.kr:8080/api/browsing-history', {url: message.url,uuid:message.uuid,userId:message.userUUID});
//   }
// });

