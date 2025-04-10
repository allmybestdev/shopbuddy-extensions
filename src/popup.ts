import { ElementInfo, ElementSelectedMessage } from './interfaces/element';// 팝업 스크립트 - 확장 프로그램의 팝업 UI 로직을 처리합니다
import { fetchGetApi, fetchPostApi } from './utils/fetchUtil';// 팝업 스크립트 - 확장 프로그램의 팝업 UI 로직을 처리합니다

console.log('Popup script loaded1');


// 탭 클릭시 UI 변경을 위한 스크립트
document.addEventListener('DOMContentLoaded', function() {
  const viewedProductsTab: HTMLButtonElement = document.getElementById('viewedProductsTab') as HTMLButtonElement;
  const realtimeProductsTab: HTMLButtonElement = document.getElementById('realtimeProductsTab') as HTMLButtonElement;
  const viewedProductsContent: HTMLDivElement = document.getElementById('viewedProductsContent') as HTMLDivElement;
  const realtimeProductsContent: HTMLDivElement = document.getElementById('realtimeProductsContent') as HTMLDivElement;
  
  // 조회 상품 내역 탭 클릭 이벤트
  viewedProductsTab.addEventListener('click', function() {
    // 탭 활성화 스타일 변경
  viewedProductsTab.classList.add('border-b-2', 'border-purple-500', 'text-purple-700');
  viewedProductsTab.classList.remove('text-gray-500');
  realtimeProductsTab.classList.remove('border-b-2', 'border-purple-500', 'text-purple-700');
  realtimeProductsTab.classList.add('text-gray-500');
  
  // 컨텐츠 표시/숨김
  viewedProductsContent.classList.remove('hidden');
  realtimeProductsContent.classList.add('hidden');
  });
  
  // 실시간 상품 내역 탭 클릭 이벤트
  realtimeProductsTab.addEventListener('click', function() {
    // 탭 활성화 스타일 변경
  realtimeProductsTab.classList.add('border-b-2', 'border-purple-500', 'text-purple-700');
  realtimeProductsTab.classList.remove('text-gray-500');
  viewedProductsTab.classList.remove('border-b-2', 'border-purple-500', 'text-purple-700');
  viewedProductsTab.classList.add('text-gray-500');
  
  // 컨텐츠 표시/숨김
  realtimeProductsContent.classList.remove('hidden');
  viewedProductsContent.classList.add('hidden');
  });

  
});


// 공통 함수 추출
function injectElementSelectionScript(elementType: string): void {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs: chrome.tabs.Tab[]): void 
  {
    if (tabs[0].id) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: startElementSelection,
        args: [elementType]
      });
    }
  });
  window.close();

}

document.addEventListener('DOMContentLoaded', function(): void {
  const selectElement = document.getElementById('selectElement') as HTMLButtonElement;
  const selectElement_sellPrice = document.getElementById('selectElement_sellPrice') as HTMLButtonElement;
  
  selectElement.addEventListener('click', () => injectElementSelectionScript('prdNm'));
  selectElement_sellPrice.addEventListener('click', () => injectElementSelectionScript('sellPrice'));
});




// popup.html 에서 저장된 요소 정보 확인 및 초기 정보 표시
// chrome.storage.local.get(['selectedElement', 'selectedElementType'], function(data: {selectedElement?: any, selectedElementType?: any}): void {
  
//   let selectedInfoDiv: HTMLDivElement | null = null;
//   let elementInfoPre: HTMLPreElement | null = null;

//   if (!data.selectedElement) return; // 메시지가 없으면 함수 종료

//   if (data.selectedElement && data.selectedElementType === 'prdNm') {
//     selectedInfoDiv = document.getElementById('selectedInfo') as HTMLDivElement;
//     elementInfoPre = document.getElementById('elementInfo') as HTMLPreElement;
//   } else if (data.selectedElement && data.selectedElementType === 'sellPrice') {
//     selectedInfoDiv = document.getElementById('selectedInfo_sellPrice') as HTMLDivElement;
//     elementInfoPre = document.getElementById('elementInfo_sellPrice') as HTMLPreElement;
//   }
    
//     // 정보 표시
//   if (selectedInfoDiv && elementInfoPre) {
//     selectedInfoDiv.style.display = 'block';
//     elementInfoPre.textContent = JSON.stringify(data.selectedElement, null, 2);
//   }
    
//     // 사용 후 정보 삭제
//     chrome.storage.local.remove('selectedElement');
// });

chrome.storage.local.get(['prdNm', 'sellPrice','userUUID', 'userId'], async function(data: {prdNm?: ElementInfo, sellPrice?: ElementInfo, userUUID?: string, userId?: string}): Promise<void> {
  let userUUID: HTMLDivElement = document.getElementById('userUUID') as HTMLDivElement;
  let selectedInfoDiv: HTMLDivElement | null = null;
  let elementInfo: HTMLPreElement | null = null;


  if (data.userUUID) {
    console.log('##### uuid:', data.userUUID);
    userUUID.textContent = data.userUUID;
  } else {
    console.log('##### uuid: None');
    const result = await fetchPostApi('http://shopbuddy.kr:8080/api/uuid');
    await chrome.storage.local.set({userUUID: result.uuid});
    userUUID.textContent = result.uuid;
  }

  if (data.userId) {
    console.log('##### userId:', data.userId);
  }
  
  // const prdNm: ElementInfo | undefined = data.prdNm ? JSON.parse(data.prdNm) as ElementInfo : undefined;

  if (data.prdNm) {
      // selectedInfoDiv = document.getElementById('selectedInfo') as HTMLDivElement;
      elementInfo = document.getElementById('elementInfo') as HTMLPreElement;
   
      console.log('prdNm.text:', data.prdNm.text);    
      // selectedInfoDiv.style.display = 'block';
      elementInfo.textContent = data.prdNm.text;
      elementInfo.title = data.prdNm.text;
    
  }

  if (data.sellPrice) {
      // selectedInfoDiv = document.getElementById('selectedInfo_sellPrice') as HTMLDivElement;
      elementInfo = document.getElementById('elementInfo_sellPrice') as HTMLPreElement;

      // selectedInfoDiv.style.display = 'block';
      elementInfo.textContent = data.sellPrice.text;
      elementInfo.title = data.sellPrice.text;
  }

});




// Tab에 삽입 되는 함수들
// 현재 활성화된 탭에 하이라이트 요소 생성 및 마우스 이동 이벤트 리스너 추가 코드
function startElementSelection(type: string): void {
  // 이미 존재하는 하이라이트 요소 제거
  const existingHighlight = document.getElementById('extension-element-highlight');
  if (existingHighlight && existingHighlight.parentNode) {
    existingHighlight.parentNode.removeChild(existingHighlight);
  }
  
  // 하이라이트 요소 생성
  const highlightElement = document.createElement('div');
  highlightElement.id = 'extension-element-highlight';
  highlightElement.style.position = 'absolute';
  highlightElement.style.border = '2px solid red';
  highlightElement.style.pointerEvents = 'none';
  highlightElement.style.zIndex = '10000';
  highlightElement.style.boxSizing = 'border-box';
  document.body.appendChild(highlightElement);
  
  // 마우스 이동 이벤트 리스너
  document.addEventListener('mousemove', highlightElementUnderMouse);
  // API 호출
  // document.addEventListener('DOMContentLoaded', fetchApiData);

  // 클릭 이벤트 리스너 (요소 선택)
  // if (type === 'sellPrice') {
  //   document.addEventListener('click', selectElement_sellPrice);
  // } else if (type === 'prdNm') {
  //   document.addEventListener('click', selectElement);
  // }
  
  
  if (type === 'prdNm') {
    document.addEventListener('click', clickedPageElementPrdNm);
  } else if (type === 'sellPrice') {
    document.addEventListener('click', clickedPageElementSellPrice);
  }


  /**
 * API에서 데이터를 가져오는 함수
 */
// function fetchApiData() {
//   fetch('https://api.example.com/data')
//     .then(response => response.json())
//     .then(data => {
//       console.log('API 응답 데이터:', data);
//       // 데이터로 UI 업데이트
//     })
//     .catch(error => {
//       console.error('API 호출 오류:', error);
//     });
// }
  
  // 마우스 이동 시 요소 하이라이트
  
function clickedPageElementPrdNm(e: MouseEvent): void {
    clickedPageElement(e, 'prdNm');
  }

function clickedPageElementSellPrice(e: MouseEvent): void {
    clickedPageElement(e, 'sellPrice');
  }

// XPath 생성 함수
function getXPath(element: Element): string {
  if (element.id !== '') {
    return `//*[@id="${element.id}"]`;
  }
  
  if (element === document.body) {
    return '/html/body';
  }
  
  let ix = 0;
  const siblings = element.parentNode ? Array.from(element.parentNode.childNodes) : [];
  
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    
    if (sibling === element) {
      const pathIndex = ix + 1;
      const parentPath = element.parentElement ? getXPath(element.parentElement) : '';
      return `${parentPath}/${element.tagName.toLowerCase()}[${pathIndex}]`;
    }
    
    if (sibling.nodeType === 1 && (sibling as HTMLElement).tagName === element.tagName) {
      ix++;
    }
  }
  
  return '';
}

// JS Path 생성 함수 개선
function getJsPath(element: Element): string {
  // ID가 있는 경우 바로 사용
  if (element.id) {
    return `document.getElementById('${element.id}')`;
  }
  
  // body인 경우
  if (element === document.body) {
    return 'document.body';
  }
  
  // CSS 선택자 생성
  let path = [];
  let current: Element | null = element;
  
  while (current && current !== document.documentElement) {
    let selector = current.nodeName.toLowerCase();
    
    // ID가 있으면 사용
    if (current.id) {
      selector = `#${current.id}`;
      path.unshift(selector);
      break;
    } 
    // 클래스가 있으면 사용
    else if (current.classList && current.classList.length > 0) {
      const classNames = Array.from(current.classList).join('.');
      selector += `.${classNames}`;
    }
    
    // 형제 요소 중 위치 계산 (nth-child)
    if (!current.id) {
      let position = 1;
      let sibling = current.previousElementSibling;
      
      while (sibling) {
        position++;
        sibling = sibling.previousElementSibling;
      }
      
      // 형제가 여러 개인 경우에만 nth-child 추가
      if (position > 1 || current.nextElementSibling) {
        selector += `:nth-child(${position})`;
      }
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return `document.querySelector('${path.join(' > ')}')`;
}

// CSS 선택자 생성 함수
function getCssSelector(element: Element): string {
  if (element.id) {
    return `#${element.id}`;
  }
  
  if (element === document.body) {
    return 'body';
  }
  
  let path = [];
  let current = element;
  
  while (current && current !== document.body) {
    let selector = current.nodeName.toLowerCase();
    
    if (current.id) {
      selector = `#${current.id}`;
      path.unshift(selector);
      break;
    } else if (current.className) {
      const classes = Array.from(current.classList).join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }
    
    let sibling = current;
    let index = 1;
    
    while (sibling = sibling.previousElementSibling as HTMLElement) {
      if (sibling.nodeName === current.nodeName) {
        index++;
      }
    }
    
    if (index > 1) {
      selector += `:nth-of-type(${index})`;
    }
    
    path.unshift(selector);
    current = current.parentElement as HTMLElement;
  }
  
  return path.join(' > ');
}

function clickedPageElement(e: MouseEvent, type: string): void {
    e.preventDefault();
    e.stopPropagation();
    
    // 이벤트 리스너 제거
    document.removeEventListener('mousemove', highlightElementUnderMouse);

    if (type === 'prdNm') {
      document.removeEventListener('click', clickedPageElementPrdNm);
    } else if (type === 'sellPrice') {
      document.removeEventListener('click', clickedPageElementSellPrice);
    }
    
    const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    if (element) {
      
      const elementInfo: ElementInfo = {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        text: element.textContent ? element.textContent.trim().substring(0, 50) + (element.textContent.length > 50 ? '...' : '') : '',
        xPath: getXPath(element),
        jsPath: getJsPath(element),
        selector: getCssSelector(element), 
        rect: {
          top: element.getBoundingClientRect().top,
          left: element.getBoundingClientRect().left,
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height
        }
      };

      // 확장 프로그램에 정보 전송
      chrome.runtime.sendMessage({
        action: 'elementSelected',
        type: type,
        elementInfo: elementInfo
      });
    }
  }
  
  function highlightElementUnderMouse(e: MouseEvent): void {
    e.preventDefault();
    const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    if (element && element !== highlightElement) {
      const rect = element.getBoundingClientRect();
      highlightElement.style.top = (window.scrollY + rect.top) + 'px';
      highlightElement.style.left = (window.scrollX + rect.left) + 'px';
      highlightElement.style.width = rect.width + 'px';
      highlightElement.style.height = rect.height + 'px';
    }
  }
  

}
