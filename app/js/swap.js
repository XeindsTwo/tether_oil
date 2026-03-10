document.addEventListener('DOMContentLoaded', () => {

  const selects = document.querySelectorAll('[data-select]');
  const sendInput = document.getElementById('swap-send');
  const receiveInput = document.getElementById('swap-receive');
  const swapBtn = document.querySelector('.swap__btn');
  const html = document.documentElement;
  const MIN_AMOUNT = 500;

  const currencyMap = {
    'USDT (ERC-20)': {
      icon: 'images/icons/crypto/1.svg',
      qr: 'images/qr/erc-20.png',
      short: 'USDT (ERC-20)',
      address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b'
    },
    'USDT (TRC-20)': {
      icon: 'images/icons/crypto/2.svg',
      qr: 'images/qr/trc-20.png',
      short: 'USDT (TRC-20)',
      address: 'TQ9yExampleTRC20Addressxxxxxxxxxxxx'
    },
    'Bitcoin': {
      icon: 'images/icons/crypto/3.svg',
      qr: 'images/qr/btc.png',
      short: 'BTC',
      address: 'bc1qexamplebitcoinaddressxxxxxxxx'
    },
    'Ethereum': {
      icon: 'images/icons/crypto/4.svg',
      qr: 'images/qr/eth.png',
      short: 'ETH',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    'Solana': {
      icon: 'images/icons/crypto/5.svg',
      qr: 'images/qr/sol.png',
      short: 'SOL',
      address: '7dHbWXmci3dExampleSolanaAddressxxxxx'
    },
    'Ripple': {
      icon: 'images/icons/crypto/6.svg',
      qr: 'images/qr/xrp.png',
      short: 'XRP',
      address: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh'
    }
  };

  const tokenRates = {
    'USDT (ERC-20)': 1,
    'USDT (TRC-20)': 1,
    'Bitcoin': 0,
    'Ethereum': 0,
    'Solana': 0,
    'Ripple': 0
  };

  const formatAmount = (num) => {
    const n = parseFloat(num);
    return n % 1 === 0 ? n.toString() : n.toFixed(2);
  };

  const closeAllSelects = () => {
    selects.forEach(s => s.classList.remove('swap__select--open'));
  };

  const getSelectedCurrency = () =>
    document.querySelector('[data-select-text]')?.textContent.trim() || 'USDT (ERC-20)';

  const updateReceive = () => {
    const sendValue = parseFloat(sendInput.value);
    const currency = getSelectedCurrency();
    const rate = tokenRates[currency];

    if (!sendValue || !rate) {
      receiveInput.value = '';
      swapBtn.disabled = true;
      return;
    }

    const received = sendValue * rate;
    receiveInput.value = formatAmount(received);
    swapBtn.disabled = !(received >= MIN_AMOUNT);
  };

  async function fetchRates() {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple&vs_currencies=usd'
      );
      const data = await res.json();

      tokenRates['Bitcoin'] = data.bitcoin.usd;
      tokenRates['Ethereum'] = data.ethereum.usd;
      tokenRates['Solana'] = data.solana.usd;
      tokenRates['Ripple'] = data.ripple.usd;

      updateReceive();
    } catch (e) {
      console.error('Ошибка получения курсов:', e);
    }
  }

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

        const { value, icon } = option.dataset;

        applyOption(value, icon);

        localStorage.setItem('swap-currency', value);
        localStorage.setItem('swap-currency-icon', icon);

        closeAllSelects();
      });

    });

  });

  document.addEventListener('click', closeAllSelects);

  if (sendInput && receiveInput && swapBtn) {
    sendInput.addEventListener('input', updateReceive);
    fetchRates();
    updateReceive();
  }

  const shortenAddress = (address, left = 9, right = 20) => {
    if (!address) return '';
    if (address.length <= left + right) return address;
    return address.slice(0, left) + '...' + address.slice(-right);
  };

  const modal = document.getElementById('swapModal');

  const modalSendAmount = document.getElementById('modal-send-amount');
  const modalSendIcon = document.getElementById('modal-send-icon');
  const modalSendText = document.getElementById('modal-send-text');

  const modalReceiveAmount = document.getElementById('modal-receive-amount');

  const modalDepositAmount = document.getElementById('modal-deposit-amount');
  const modalDepositCurrency = document.getElementById('modal-deposit-currency');

  const modalQr = document.getElementById('modal-qr');

  const modalCopyBtn = document.getElementById('modal-copy');

  const addressEl = document.getElementById('modal-address');

  const showTip = (tipEl) => {
    tipEl.classList.add('copy-tip--show');
    setTimeout(() => tipEl.classList.remove('copy-tip--show'), 2000);
  };

  const depositCopyIcon = document.querySelector('#modal-deposit-label img');
  const depositTip = document.getElementById('deposit-tip');
  const addressTip = document.getElementById('address-tip');

  depositCopyIcon?.addEventListener('click', () => {
    const amount = modalDepositAmount.textContent;
    navigator.clipboard.writeText(amount).then(() => showTip(depositTip));
  });

  modalCopyBtn?.addEventListener('click', () => {
    const address = addressEl.dataset.full || addressEl.textContent;
    navigator.clipboard.writeText(address).then(() => showTip(addressTip));
  });

  const openModal = () => {

    const currency = getSelectedCurrency();

    const sendVal = formatAmount(sendInput.value);
    const receiveVal = formatAmount(receiveInput.value);

    const meta = currencyMap[currency];

    modalSendAmount.textContent = sendVal;
    modalSendIcon.src = meta.icon;
    modalSendText.textContent = meta.short;

    modalReceiveAmount.textContent = receiveVal;

    modalDepositAmount.textContent = sendVal;
    modalDepositCurrency.textContent = currency;

    modalQr.src = meta.qr;

    const fullAddress = meta.address;

    addressEl.dataset.full = fullAddress;
    addressEl.textContent = shortenAddress(fullAddress);

    modal.classList.add('modal--open');

    document.body.style.overflowY = 'hidden';
    html.style.overflowY = 'hidden';
  };

  const closeModal = () => {

    modal.classList.remove('modal--open');

    document.body.style.overflowY = '';
    html.style.overflowY = '';
  };

  swapBtn?.addEventListener('click', openModal);

  modal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

});