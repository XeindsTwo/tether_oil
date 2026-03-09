document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const answerText = item.querySelector('.faq__answer-text');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');

      faqItems.forEach(el => {
        el.classList.remove('faq__item--open');
        el.querySelector('.faq__answer').style.height = '0px';
      });

      if (!isOpen) {
        item.classList.add('faq__item--open');
        answer.style.height = `${answerText.offsetHeight}px`;
      }
    });
  });

  const selects = document.querySelectorAll('[data-select]');

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
    };

    const savedValue = localStorage.getItem('swap-currency');
    const savedIcon = localStorage.getItem('swap-currency-icon');

    if (savedValue && savedIcon) applyOption(savedValue, savedIcon);

    btn.addEventListener('click', (e) => {
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

  const sendInput = document.getElementById('swap-send');
  const receiveInput = document.getElementById('swap-receive');
  const swapBtn = document.querySelector('.swap__btn');
  const MIN_AMOUNT = 500;

  if (sendInput && receiveInput && swapBtn) {
    const validate = () => {
      const value = parseFloat(sendInput.value);
      swapBtn.disabled = !(value >= MIN_AMOUNT);
      receiveInput.value = sendInput.value || '';
    };

    sendInput.addEventListener('input', validate);
    validate();
  }

});