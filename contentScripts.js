console.log('I am ready');

const messages = {
  showComments: 'Show comments',
  hideComments: 'Hide comments'
}

const isVideo = () => {
  return window.location.pathname === '/watch';
};

const YouTube = {
  isVideo,
  registerListeners() {
    document.addEventListener('yt-register-action', YouTube.addMainClasses) // used this custom youtube event because it persists till everything is loaded
  },

  addMainClasses() {
    YouTube._hideComments();
    YouTube._showButton();

    document.removeEventListener('yt-register-action', YouTube.addMainClasses);
  },

  _hideComments() {
    console.log('ADDING CLASS...');
    document
      .querySelector('ytd-item-section-renderer.ytd-comments')
      .classList.add('hide-comments'); // this line hides all comments
  },

  _showButton() {
    console.log('ADDING BUTTON...');
    const moreButton = document.getElementById('more');
    const button = `
    <button class="fake-paper-button" id="toggle-comments" type="button">
      <div class="fake-yt-formatted-string">
        <span id="toggle-comments-label">${messages.showComments}</span>
      </div>
    </button>
    `;

    moreButton.insertAdjacentHTML('afterend', button);

    document
      .getElementById('toggle-comments-label')
      .addEventListener('click', YouTube._toggleComments);
  },

  _toggleComments() {
    const buttonLabel = document.getElementById('toggle-comments-label');
    const comments = document.querySelector(
      'ytd-item-section-renderer.ytd-comments'
    );


    if (comments.classList.toggle('hide-comments')) {
      buttonLabel.textContent = messages.showComments;
    } else {
      buttonLabel.textContent = messages.hideComments;
    }
  }
}

YouTube.registerListeners();