(function () {
  "use strict";
  bsCustomFileInput.init();
  var forms = document.querySelectorAll(".validated-form");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VuZXlyYWwiLCJhIjoiY2sxMmV3ZG4yMG9oYTNicDZpdDd0cjFzMSJ9.6vDLZvLXZqSh1dBXmgmpHw";
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [...campgroundLocation.coordinates],
  zoom: 9,
});
let popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h5 style="font-weight:bold">${campgroundTitle}</h5>
  <p style="font-size:15px;margin-top:-5px">${campgroundLocationString}</p>
  <p style="font-size:13px;margin-top:-10px">${campgroundPrice}</p>
  `
);
new mapboxgl.Marker()
  .setLngLat([...campgroundLocation.coordinates])
  .setPopup(popup)
  .addTo(map);
