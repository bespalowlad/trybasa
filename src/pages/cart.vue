<template lang="pug">
    div
        block-header
        #menu-div.content
            //- iframe(id="jane-menu" frameborder="0" height="100%" src="https://www.iheartjane.com/embed/stores/173/menu?&amp;og_ref=https://trybasa.ribs.pro/" scrolling="no" style="width: 1px; min-width: 100%;")
            //- script(id="jane-frame-script" src="https://api.iheartjane.com/v1/stores/173/embed.js")

        block-footer
</template>

<script>
    import Header from '@/blocks/header.vue';
    import Footer from '@/blocks/footer.vue';
    
    export default {
        name: 'Widget',
        data () {
            return {}
        },
        components: {
            'block-header': Header,
			      'block-footer': Footer,
        },
        methods: {
          iheartjane() {
            var preventResizing = false;
            var contentHeight = 0;
            var originalScrollPosition = 0;
            var contentHeightMap = {};
            var allowShrinking = false;
            var distanceToTopOfWindow = 0;

            function setDistanceToTop(){
              var elem = document.getElementById('menu-div');

              do {
                distanceToTopOfWindow += elem.offsetTop;
                elem = elem.offsetParent;
              } while (elem);

              distanceToTopOfWindow = distanceToTopOfWindow < 0 ? 0 : distanceToTopOfWindow;
            }

            function resizeAppleDevices() {
              if (/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
                  document.getElementById('menu-div').style.height = "100vh";
                  document.getElementById('iframe-div').style.height = "100vh";
              }
            }

            function handleMessage(message) {
              if (message.origin !== "https://www.iheartjane.com") {
                return;
              }

              if (message.data.messageType === "resizeIFrame" && message.data.payload) {
                var pathname = message.data.pathname;
                var delimiter = '/menu?'
                pathname = pathname.slice(-delimiter.length) === delimiter ? pathname.slice(0, -1) : pathname

                if (allowShrinking){
                  contentHeightMap[pathname] = message.data.payload;
                  var shrunkenHeight = message.data.payload + 'px';
                  menuElement.style.height = shrunkenHeight;
                  iframeContainerElement.style.height = shrunkenHeight;
                  contentHeight = shrunkenHeight;
                  allowShrinking = false;
                  return;
                }

                contentHeightMap[pathname] = Math.max(parseInt(contentHeightMap[pathname]) || 0, message.data.payload);

                var height = contentHeightMap[pathname] + 'px';

                if (!preventResizing) {
                  menuElement.style.height = height;
                  iframeContainerElement.style.height = height;
                }

                contentHeight = height;

                if (!pathname.includes('/menu')){
                  window.scrollTo(0, distanceToTopOfWindow);
                }
              }

              if (message.data.messageType === "scrollToTop") {
                window.scrollTo(0, distanceToTopOfWindow);
                originalScrollPosition = 0;
              }

              if (message.data.messageType === "saveScrollPosition") {
                originalScrollPosition = window.scrollY;
              }

              if (message.data.messageType === "restoreScrollPosition") {
                if (originalScrollPosition){
                  var pathname = message.data.pathname;
                  var newHeight = Math.max(parseInt(contentHeightMap[pathname]) || 0, parseInt(contentHeight) || 0) + 'px';

                  menuElement.style.height = newHeight;
                  iframeContainerElement.style.height = newHeight;
                  window.scrollTo(0, originalScrollPosition);
                  originalScrollPosition = 0;
                }
              }

              if (message.data.messageType === "scrollToBucketTop" && message.data.payload) {
                window.scrollTo(0, message.data.payload)
              }

              if (message.data.messageType === "openMobileModal"){
                preventResizing = true;
                window.scrollTo(0, document.getElementById('jane-menu').offsetTop)
                document.getElementById('jane-menu').style.height = '500px';
                resizeAppleDevices()
              }

              if (message.data.messageType === "closeMobileModal"){
                preventResizing = false;
                document.getElementById('jane-menu').style.height = '100%';
                document.getElementById('menu-div').style.height = contentHeight;
                document.getElementById('iframe-div').style.height = contentHeight;
              }

              if (message.data.messageType === "openDesktopFilters"){
                resizeAppleDevices()
              }

              if (message.data.messageType === 'allowIframeShrinking'){
                allowShrinking = true;
              }
            }

            window.addEventListener("message", handleMessage, false);

            var menuElement = document.getElementById("menu-div");
            //menuElement.id = "menu-div"
            menuElement.style = "height: 800px; width: 1px; min-width: 100%; background-color: #fff;";
            var iframeContainerElement = document.createElement("div");
            iframeContainerElement.id = "iframe-div"
            iframeContainerElement.style = "height: 800px; width: 1px; min-width: 100%; background-color: #fff;";

            var query = [""];
            if (document.referrer) {
              query.push('og_ref=' + encodeURIComponent(document.referrer));
            }

            if (typeof URLSearchParams === 'function') {
              var urlParams = new URLSearchParams(window.location.search);
              [
                'utm_source',
                'utm_medium',
                'utm_campaign',
                'utm_term',
                'utm_content',
              ].map(function(key) {
                if (urlParams.has(key)) {
                  query.push(key + '=' + encodeURIComponent(urlParams.get(key)));
                }
              })
            }

            var iframe = document.createElement('iframe');
            iframe.id = "jane-menu";
            iframe.frameBorder = "0";
            iframe.height = "100%";
            iframe.style = "width: 1px; min-width: 100%;";
            iframe.src = "https://www.iheartjane.com/embed/stores/173/cart/?" + query.join("&");

            var scriptElement = document.getElementById("jane-frame-script");
            iframeContainerElement.appendChild(iframe);
            menuElement.appendChild(iframeContainerElement);
            //scriptElement.parentElement.appendChild(menuElement);

            document.getElementById('jane-menu').setAttribute('scrolling', 'no');
            setDistanceToTop()
          }
        },
        mounted () {
            this.iheartjane();
        }
      }
</script>

<style lang="scss" scoped>
    .content {
        min-height: 100vh;
    }
</style>


