(function() {
  function install(options, callback, errback) {
    callback || (callback = function() {});
    errback || (errback = function() {});

    <% if (ServiceWorker) { %>
      if (
        'serviceWorker' in navigator &&
        (window.fetch || 'imageRendering' in document.documentElement.style) &&
        (window.location.protocol === 'https' || window.location.hostname === 'localhost')
      ) {
        navigator.serviceWorker
          .register(<%- JSON.stringify(ServiceWorker.output) %>)
          .then(function() {
            callback({
              service: 'ServiceWorker'
            });
          }).catch(function(err) {
            errback({
              service: 'ServiceWorker'
            });
          });

        return;
      }
    <% } %>

    <% if (AppCache) { %>
      if (window.ApplicationCache) {
        var directory = <%- JSON.stringify(AppCache.directory) %>;

        var doLoad = function() {
          var page = directory + 'main.html';
          var iframe = document.createElement('iframe');

          // iframe.onload = onLoad;
          iframe.src = page;
          iframe.style.display = 'none';

          document.body.appendChild(iframe);
        };

        if (document.readyState === 'complete') {
          setTimeout(doLoad);
        } else {
          window.addEventListener('load', doLoad);
        }

        return;
      }
    <% } %>

    setTimeout(function() {
      callback({
        service: ''
      });
    });
  }

  return {
    install: install
  };
}())