import { fetchPostApi } from './utils/fetchUtil';
import { UrlChangedMessage } from './interfaces/element';

console.log('##### Content script loaded!.')


// 초기 URL 로깅
// let lastUrl = window.location.href;
let lastUrl = '';

// URL 변경 감지 함수
const checkForUrlChange = () => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    addUrlChangedEvent('changeState',window.location.href);
    lastUrl = currentUrl;
  }
};

// 주기적으로 URL 변경 확인 (100ms 간격)
setInterval(checkForUrlChange, 100);

// History API 메소드 오버라이드
// const originalPushState = history.pushState;
// history.pushState = function(...args) {
//   originalPushState.apply(this, args);
//   addUrlModifyEvent('pushState',window.location.href);
// };

// const originalReplaceState = history.replaceState;
// history.replaceState = function(...args) {
//   originalReplaceState.apply(this, args);
//   addUrlModifyEvent('replaceState',window.location.href);
// };

// // popstate 이벤트 리스너 (뒤로가기/앞으로가기)
// window.addEventListener('popstate', () => {
//   addUrlModifyEvent('popstate',window.location.href);
// });

const addUrlChangedEvent = async (from:string,url: string) => {  
    console.log('##### URL이 변경되었습니다:',from,url);  
    // fetchPostApi('http://shopbuddy.kr:8080/api/url',{url:url});
    // Content Script에서 메시지 전송
    let storage =  await chrome.storage.local.get(['userUUID','userId']);
    console.log('##### uuid:',storage.userUUID);
    console.log('##### userId:',storage.userId || '');
    
    const urlChangedMessage: UrlChangedMessage = {
      type: 'sendUrlChangedEvent',
      url: url,
      userUUID:storage.userUUID || '',
      userId:storage.userId  || ''
    }

    chrome.runtime.sendMessage(urlChangedMessage);
    
};
