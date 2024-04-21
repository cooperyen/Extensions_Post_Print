// DOM
const printContent = document.querySelector('.info');
const spinnerContent = document.querySelector('.spinner');
const posterCheckBtn = document.querySelector('.check');
const newStart = document.querySelector('.new-start');
const setInfoBTN = document.querySelector('.content_info');
const getPostInfo = document.getElementById('getinf');
const printBTN = document.getElementById('printbtn');
const posterData = JSON.parse(localStorage.getItem('PosterData')) || [];
const createTable = document.querySelector('#table-data');
const getpost = document.getElementById('getpost');
const xlxsListCopyBTN = document.querySelector('#xlxs-list button');
const xlxsList = document.querySelector('#xlxs-list');
const postList = document.querySelector('#post-list');

let postSticker, posetList, html;

// data
let shoplinePostList = [];
let tabsTotal;
let requestTabsTotal = 0;
const spinner_SEC = 0.2;

// Get current target tabs Number
const getCurrentTabsNumber = () => {
  chrome.tabs.query(
    { url: '*://admin.shoplineapp.com/*/orders/*' },
    function (tabs) {
      tabsTotal = tabs.length; //Count all matches the url page

      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url.indexOf('.pdf') !== -1) {
          //Handler not include .pdf page
          tabsTotal -= 1;
        }
      }
    }
  );
};

// Function
const goToOptionPage = () => {
  chrome.tabs.create({
    url: 'options.html',
  });
};

// check poster address
const checkPosterInfoEmpty = () => {
  let state;
  const goToOptionEl = `
    <div class="option-set">
        <div class="option-container">
            <h2>寄件人資料尚未建立</h2>
            <button class="option-btn">前往設定</button>
        </div>
    </div>
    `;

  if (posterData.length === 0) {
    document
      .querySelector('body')
      .insertAdjacentHTML('afterbegin', goToOptionEl);
    document
      .querySelector('.option-btn')
      .addEventListener('click', goToOptionPage);
    state = true;
  } else {
    state = false;
  }

  return state;
};

const loadAllShoplineTabs = (tabs) => {
  for (const i in tabs) {
    if (tabs[i].url.indexOf('.pdf') === 1) return;

    // addition after loading
    chrome.scripting.executeScript({
      target: { tabId: tabs[i].id },
      files: ['js/content.js'],
    });
  }
};

// Poster information
const postContext = () => {
  printContent.classList.remove('flex');
  xlxsList.classList.remove('hidden');
  xlxsListCopyBTN.classList.remove('hidden');

  shoplinePostList.forEach((el) => {
    html = `<td>${el.name}</td><td>${el.city}${el.ad}</td><td>${el.phone}</td>`;
  });
  createTable.insertAdjacentHTML('beforeend', html);
  printContent.innerHTML = '';
};

// Create content
const showContext = () => {
  printContent.classList.add('flex');
  postList.classList.remove('hidden');

  const div = document.createElement('div');
  div.setAttribute('class', 'print');

  if (posterData.length === 0) return;

  shoplinePostList.forEach((url) => {
    div.innerHTML = `
            <div class="uicontainer">
                <div class="printarea">
                    <div class="line_top">
                        <div class="title-content">
                            <p>寄件人</p>
                        </div>
                        <div class="detail-content">
                            <div class="post">
                                <p>${posterData.postcode}</p>
                            </div>
                            <!--  -->
                            <div class="detail_inner">
                                <p>${posterData.area}</p>
                                <p>${posterData.address}</p>
                            </div>
                            <!--  -->
                            <div class="detail_inner">
                                <p>${posterData.poster}</p>
                                <p>${posterData.phone}</p>
                            </div>
                        </div>
                    </div>

                    <!--  -->
                    <div class="space"></div>
                    <!--  -->

                    <div class="line_top">
                        <div class="title-content">
                            <p>收件人</p>
                        </div>
                        <div class="detail-content">
                            <div class="post">
                                <p>${url.post}</p>
                            </div>
                            <!--  -->
                            <div class="detail_inner">
                                <p>${url.city}</p>
                                <p>${url.ad}</p>
                            </div>
                            <!--  -->
                            <div class="detail_inner">
                                <p class="name">${url.name} </p>
                                <p>${url.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    printContent.append(div);
  });
};

// remove context to defalt
const currentState = () => {
  if (requestTabsTotal === 0) {
    newStart.classList.remove('hidden');
  } else {
    newStart.classList.add('hidden');
  }
};

// Get data from "content.js", push to post list
const runtimeOnMessage = () => {
  chrome.runtime.onMessage.addListener(function (request, _, _2) {
    requestTabsTotal += 1;

    // check is Post or other delivery
    if (typeof request.post !== 'undefined') {
      shoplinePostList.push({
        name: request.name,
        ad: request.ad,
        city: request.city,
        post: request.post,
        phone: request.phone,
      });
    }

    if (
      shoplinePostList.length !== 0 &&
      postSticker === true &&
      typeof request.post !== 'undefined'
    ) {
      showContext();
      currentState();
      printBTN.classList.remove('printbtn_close');
      spinnerContent.classList.add('spinner-hidden');
    }

    if (
      shoplinePostList.length !== 0 &&
      posetList === true &&
      typeof request.post !== 'undefined'
    ) {
      postContext();
      currentState();
      printBTN.classList.add('printbtn_close');
      spinnerContent.classList.add('spinner-hidden');
    }

    // removed
    if (tabsTotal === requestTabsTotal) {
      // reset
      postSticker = false;
      posetList = false;
    }

    spinnerContent.classList.add('spinner-hidden');
    return;
  });
};

// get posters list information
getpost.addEventListener('click', (e) => {
  getCurrentTabsNumber();
  requestTabsTotal = 0;
  postList.classList.add('hidden');

  e.preventDefault();
  posetList = true;
  const html = `
  <tr>
    <td>姓名</td>
    <td>地址</td>
    <td>電話</td>
  </tr>
`;
  printContent.innerHTML = '';
  createTable.innerHTML = html;
  xlxsList.classList.add('hidden');
  currentState();

  chrome.tabs.query({ url: '*://admin.shoplineapp.com/*/orders/*' }, (tabs) => {
    if (tabs.length !== 0) {
      spinnerContent.classList.remove('spinner-hidden');
      loadAllShoplineTabs(tabs);
      shoplinePostList = [];
    }
  });
});

// copy excel value BTN
xlxsListCopyBTN.addEventListener('click', () => {
  const text = document.querySelectorAll('#table-data tbody');
  let resutl = '';
  for (let i = 1; i < text.length; i++) {
    resutl += text[i].innerText;
  }
  navigator.clipboard.writeText(resutl).then(() => {
    alert('複製成功');
  });
});

// init
const init = () => {
  getCurrentTabsNumber();
  runtimeOnMessage();
};

init();
