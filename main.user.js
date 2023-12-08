// ==UserScript==
// @name        DTF Script Loader
// @namespace   https://github.com/TentacleTenticals
// @match       https://dtf.ru/*
// @grant       none
// @version     1.0.0
// @author      TentacleTenticals
// @description Скрипт для определения статуса загрузки страниц DTF
// @homepage    https://github.com/TentacleTenticals/DTF-Script-Loader
// @updateURL   https://github.com/TentacleTenticals/DTF-Script-Loader/raw/master/main.user.js
// @downloadURL https://github.com/TentacleTenticals/DTF-Script-Loader/raw/master/main.user.js
// ==/UserScript==

(() => {
  function onPageLoad(){
    {
    const log = console.log.bind(console);
    console.log = (...args) => {
      if(Array.isArray(args)){
        if(args[0]){
          if(typeof args[0] === 'string'){
            if(args[0].match(/\[ Air \] Ready.*/)){
              document.dispatchEvent(
                new CustomEvent('status', {
                  bubbles: true,
                  detail: {
                    page: 'page',
                    status: 'ready'
                  }
                })
              );
            }else
            if(args[0].match(/\[Editor in popup\] Ready.*/)){
              document.dispatchEvent(
                new CustomEvent('status', {
                  bubbles: true,
                  detail: {
                    page: 'editor',
                    status: 'ready'
                  }
                })
              );
            }else
            if(args[0].match(/\[Editor in popup\] Closed.*/)){
              document.dispatchEvent(
                new CustomEvent('status', {
                  bubbles: true,
                  detail: {
                    page: 'editor',
                    status: 'closed'
                  }
                })
              );
            }
          }
        }
      }
      log(...args);
    }}
  };

  function obsCheckUrl(url){
    url = url.replace(/http[s]*:\/\/api.dtf.ru\/[^\/]+\//, '').split(/\/|\?|\&/);

    // console.log(url);

    switch(url[0]){
      case 'feed':{
        const feeds = document.querySelectorAll(`#app>.layout>.view>.feed-page>.feed-page__content-list>.content-list>.content`);
        console.log('%c [Page Status] Page Ready! Type:new', 'background: #222; color: #bada55');
        console.log(`Feeds founded: ${feeds.length}`);
        document.dispatchEvent(
          new CustomEvent('status', {
            bubbles: true,
            detail: {
              page: 'page',
              status: 'ready'
            }
          })
        );
      }break;
      case 'bookmarks':{
        const feeds = document.querySelectorAll(`#app>.layout>.view>.feed-page>.feed-page__content-list>.content-list>.content`);
        console.log('%c [Page Status] Page Ready! Type:bookmarks', 'background: #222; color: #bada55');
        console.log(`Feeds founded: ${feeds.length}`);
        document.dispatchEvent(
          new CustomEvent('status', {
            bubbles: true,
            detail: {
              page: 'page',
              status: 'ready'
            }
          })
        );
      }break;
      case 'timeline':{
        const feeds = document.querySelectorAll(`#app>.layout>.view>.subsite>.subsite-feed>.content-list>.content`);
        console.log('%c [Page Status] Page Ready! Type:subsite', 'background: #222; color: #bada55');
        console.log(`Feeds founded: ${feeds.length}`);
        document.dispatchEvent(
          new CustomEvent('status', {
            bubbles: true,
            detail: {
              page: 'page',
              status: 'ready'
            }
          })
        );
      }break;
      case 'content':{
        const feeds = document.querySelectorAll(`#app>.layout>.view>.feed-page>.feed-page__content-list>.content-list>.content`);
        console.log('%c [Page Status] Page Ready! Type:feed', 'background: #222; color: #bada55');
        document.dispatchEvent(
          new CustomEvent('status', {
            bubbles: true,
            detail: {
              page: 'page',
              status: 'ready'
            }
          })
        );
      }break;
      case 'editor':{
        console.log('%c [Page Status] Editor Opened!', 'background: #222; color: #bada55');
        document.dispatchEvent(
          new CustomEvent('status', {
            bubbles: true,
            detail: {
              page: 'editor',
              status: 'opened'
            }
          })
        );
        const editorClose = (e) => {
          if(e.key === 'Escape'){
            console.log('%c [Page Status] Editor Closed!', 'background: #222; color: #bada55');
            document.removeEventListener('keydown', editorClose);
          }
        };
        document.addEventListener('keydown', editorClose);
        document.querySelector('#app>.modal-fullpage .modal-fullpage__controls>button:nth-child(2)').addEventListener('mousedown', () => {
          console.log('%c [Page Status] Editor Closed!', 'background: #222; color: #bada55');
        });
      }break;
    }
  }
  function perfObserver(list, observer) {
    list.getEntries().forEach((entry) => {
      // console.log(`${entry.name}`, entry);
      if(entry.entryType === "resource"){
        // console.log(`${entry.name}`, entry);
        if(entry.initiatorType === "fetch"){
          // console.log(`${entry.name}`, entry);

          obsCheckUrl(entry.name);
        }
      }
    });
  }

  if(document.querySelector(`#app>.layout>.aside--right`)){
    console.log('[DTF Page Loader] Redesign mode');
    const observer = new PerformanceObserver(perfObserver);
    observer.observe({ entryTypes: ['resource'] });
  }else{
    console.log('[DTF Page Loader] Vanil mode');
    onPageLoad();
  }

})();
