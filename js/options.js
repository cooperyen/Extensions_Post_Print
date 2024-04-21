//DOM
const posterListPostcode = document.querySelectorAll('.poster form input');
const posterCheckBtn = document.querySelector('.check');
const currentPosterTextbox = document.querySelector('.current-poster-textbox');

// Data
let posterData = JSON.parse(localStorage.getItem('PosterData')) || [];
let psoterInformation;

// ****** Function

const currentPosterInformation = function () {
  // chrome.storage.sync.get(['key'], function (posterData) {
  if (posterData.length === 0) return;
  currentPosterTextbox.innerHTML = `
      <p>郵遞區號 : ${posterData.postcode}</p>
      <p>區域 : ${posterData.area}</p>
      <p>地址 : ${posterData.address}</p>
      <p>寄件人 : ${posterData.poster}</p>
      <p>電話 : ${posterData.phone}</p>
    `;
  // });
};

//updata Information
const updataInformation = function () {
  psoterInformation = {
    postcode: posterListPostcode[0].value,
    area: posterListPostcode[1].value,
    address: posterListPostcode[2].value,
    poster: posterListPostcode[3].value,
    phone: posterListPostcode[4].value,
  };
};

// Input value check
const InputCheckValue = function (inputId) {
  const InputData = document.querySelectorAll(`#${inputId} .poster-content`);
  let result;

  InputData.forEach((e) => {
    const inputDOM = e.querySelector('input');
    const errorDOM = e.querySelector('p');

    if (inputDOM.value === '') {
      inputDOM.classList.add('input-check');
      errorDOM.innerHTML = `${inputDOM.getAttribute('placeholder')}為空值`;
      return (result = true);
    } else {
      inputDOM.classList.remove('input-check');
      errorDOM.innerHTML = '';
    }
  });

  return result;
};

//click infomation BTN
const addToPosterData = function (e) {
  e.preventDefault();

  if (InputCheckValue('poster-form')) return;

  updataInformation();

  localStorage.setItem('PosterData', JSON.stringify(psoterInformation));
  chrome.tabs.query(
    {
      url: 'chrome-extension://llifenbohfibjjnepgonkolboehcmhgi/popup.html',
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.reload(tabs[0].id);
    }
  );
  window.location.reload();
};

// ****** addEventlistener
// poster BTN click
posterCheckBtn.addEventListener('click', addToPosterData);

const init = () => {
  // chrome.storage.sync.set({ key: posterData });
  currentPosterInformation();
};

init();
