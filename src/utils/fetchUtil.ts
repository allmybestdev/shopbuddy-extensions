export async function fetchGetApi(url: string): Promise<any> {
  try {
    // API 호출
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    //   body: JSON.stringify(json),
    });
    if (!response.ok) {
      throw new Error('API 응답 오류: ' + response.status);
    }
    
    const data = await response.json();
    console.log('API 응답 데이터:', data);
    return data;
    
  } catch (error) {
    console.error('API 호출 오류:', error);
    return '';
  }
}

export async function fetchPostApi(url: string, json: object | null = {}): Promise<any> {
    try {
      // API 호출
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json || {}),
      });
      if (!response.ok) {
        throw new Error('API 응답 오류: ' + response.status);
      }
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      return data;
      
    } catch (error) {
      console.error('API 호출 오류:', error);
      return '';
    }
  }
