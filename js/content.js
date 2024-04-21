// window.onload = function () {
(function () {
  if (location.href.indexOf('.pdf') !== -1) return;

  let postAddress = [];
  // DOM

  const postName = document
    .querySelector(
      '#delivery_form .controls div[ng-if="!state.isEditing  && (order && order.delivery_data && order.delivery_data.recipient_name)"]'
    )
    .innerText.trim();
  const postPhone = document
    .querySelector(
      '#delivery_form .controls div[ng-if="!state.isEditing && (order && order.delivery_data && order.delivery_data.recipient_phone)"]'
    )
    .innerText.trim();

  setTimeout(() => {
    const postAddressGet = document.querySelectorAll(
      'div[ng-if="hasModularizeAddress() && !hkSfplusHomeDelivery() && !state.isEditing && displayOrder.delivery_address"] div[ng-if="isDisplayScope && displayContent"]'
    );

    const postAddressGetT = document.querySelector(
      'div[ng-hide="hasEditOrderDeliveryMethod() && state.isEditing"]'
    );

    console.log(postAddressGetT.textContent.trim());

    if (postAddressGetT.textContent.trim() === '郵局宅配') {
      for (let i = 0; i < postAddressGet.length; i++) {
        postAddress.push(postAddressGet[i].innerText);
      }

      chrome.runtime.sendMessage({
        ad: postAddress[3],
        post: postAddress[1],
        city: postAddress[2].replace(' ', ''),
        name: postName,
        phone: postPhone,
      });
      return;
    }

    if (postAddressGetT.textContent.trim() !== '郵局宅配') {
      chrome.runtime.sendMessage({
        state: undefined,
      });
      return;
    }
  }, 1000);
})();

// };
