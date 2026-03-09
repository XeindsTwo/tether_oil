document.addEventListener('DOMContentLoaded', () => {
  const selects = document.querySelectorAll('[data-select]');
  const sendInput = document.getElementById('swap-send');
  const receiveInput = document.getElementById('swap-receive');
  const swapBtn = document.querySelector('.swap__btn');
  const MIN_AMOUNT = 500;

  const closeAllSelects = () => {
    selects.forEach(s => s.classList.remove('swap__select--open'));
  };

  selects.forEach(select => {
    const btn = select.querySelector('[data-select-btn]');
    const textEl = select.querySelector('[data-select-text]');
    const iconEl = select.querySelector('.swap__select-icon');
    const options = select.querySelectorAll('.swap__option');

    const applyOption = (value, icon) => {
      textEl.textContent = value;
      iconEl.src = icon;
      options.forEach(opt => {
        opt.classList.toggle('swap__option--active', opt.dataset.value === value);
      });
      updateReceive();
    };

    const savedValue = localStorage.getItem('swap-currency');
    const savedIcon = localStorage.getItem('swap-currency-icon');
    if (savedValue && savedIcon) applyOption(savedValue, savedIcon);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = select.classList.contains('swap__select--open');
      closeAllSelects();
      if (!isOpen) select.classList.add('swap__select--open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        const {value, icon} = option.dataset;
        applyOption(value, icon);
        localStorage.setItem('swap-currency', value);
        localStorage.setItem('swap-currency-icon', icon);
        closeAllSelects();
      });
    });
  });

  document.addEventListener('click', closeAllSelects);

  const tokenRates = {
    "USDT (ERC-20)": 1,
    "USDT (TRC-20)": 1,
    "Bitcoin": 0,
    "Ethereum": 0,
    "Solana": 0,
    "Ripple": 0
  };

  async function fetchRates() {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple&vs_currencies=usd"
      );
      const data = await res.json();
      tokenRates["Bitcoin"] = data.bitcoin.usd;
      tokenRates["Ethereum"] = data.ethereum.usd;
      tokenRates["Solana"] = data.solana.usd;
      tokenRates["Ripple"] = data.ripple.usd;
      updateReceive();
    } catch(e) {
      console.error("Ошибка получения курсов:", e);
    }
  }

  function updateReceive() {
    const sendValue = parseFloat(sendInput.value);
    const currency = document.querySelector('[data-select-text]').textContent.trim();
    if (!sendValue || !tokenRates[currency]) {
      receiveInput.value = "";
      swapBtn.disabled = true;
      return;
    }
    const rate = tokenRates[currency];
    receiveInput.value = (sendValue * rate).toFixed(2);
    swapBtn.disabled = !(parseFloat(receiveInput.value) >= MIN_AMOUNT);
  }

  if (sendInput && receiveInput && swapBtn) {
    sendInput.addEventListener('input', updateReceive);
    fetchRates();
    updateReceive();

    swapBtn.addEventListener('click', () => {
      const currency = document.querySelector('[data-select-text]').textContent.trim();
      const sendAmount = parseFloat(sendInput.value);
      const receiveAmount = parseFloat(receiveInput.value);

      const swapData = {
        currency,
        sendAmount,
        receiveAmount,
        tokenName: '₮QOR'
      };

      console.log("Swap выполнен:", swapData);
    });
  }
});