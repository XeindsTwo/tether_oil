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
      answer.style.height = answerText.offsetHeight + 'px';
    }
  });
});