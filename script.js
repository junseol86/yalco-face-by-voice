const face = document.querySelector('.face');

async function startLoggingVolume() {
  // 사용자의 오디오 장치에 접근 권한을 요청합니다.
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256; // FFT의 크기를 설정. 이 값을 변경하여 정밀도를 조절할 수 있습니다.

  const bufferLength = analyser.frequencyBinCount; // FFT 크기의 절반
  const dataArray = new Uint8Array(bufferLength); // 데이타를 저장할 배열

  source.connect(analyser);

  // 음량을 계산하고 로그로 보여주는 함수
  function logVolume() {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
      }

      // 평균 음량을 계산합니다.
      const average = sum / dataArray.length;

      if (average > 20) {
        face.classList.add('talking')
        console.log(`Average volume: ${average}`);
      } else {
        face.classList.remove('talking')
      }


      // 다시 이 함수를 호출하여 지속적으로 음량을 체크합니다.
      requestAnimationFrame(logVolume);
  }

  logVolume();
}

// 함수를 호출하여 음량 로깅을 시작합니다.
startLoggingVolume();