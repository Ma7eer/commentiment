const videoIdQueryParamId = 'v';

/* returns youtube video id from youtube url */
export const getVideoId = params => params.get(videoIdQueryParamId);