// 요소 정보 인터페이스
export interface ElementInfo {
    tagName: string;
    id: string;
    className: string;
    text: string;
    xPath: string;
    jsPath: string;
    selector: string;
    rect: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  }
  
  // 요소 선택 메시지 인터페이스
  export interface ElementSelectedMessage {
    action: string;
    type: string;
    elementInfo: ElementInfo;
  }

  // 요소 선택 메시지 인터페이스
  export interface UrlChangedMessage {
    type: string;
    url: string;
    userUUID: string;
    userId: string;
  }


  