
function getVideoId(el) {
    let src = el.getAttribute('data-src');
    return src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i)[1];
}

document.querySelectorAll('.video').forEach(function (el) {
    let id = getVideoId(el);
    el.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
});

let videoBtn = document.querySelectorAll('.video-block .play-video-btn');

videoBtn.forEach(function (el) {
    el.addEventListener('click', function () {

        let parent = this.closest('.video-block');
        let id = getVideoId(parent.querySelector('.video'));
        parent.querySelector('.video-iframe').innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?rel=0&showinfo=0&autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>';
        parent.classList.add('playing');
        el.closest('.slider-item').classList.add('play-video');
    });
});