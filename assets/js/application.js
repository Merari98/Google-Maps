// Travaille avec l'API Google Maps
var googleMaps = (function( $ ) {
  var map,
      infoWindow;

  // Crée une carte et InfoWindow à utiliser sur la carte
  var initialize = function() {
    var mapProperty = {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map( $( '#map' ).get( 0 ), mapProperty );
    infoWindow = new google.maps.InfoWindow({
      maxWidth: 300
    });

    handleFormInput();
  };

  // Permet de valider le formulaire et gérer une soumission de formulaire
  var handleFormInput = function() {
    $( 'form' ).validate({
      submitHandler: function( form ) {
        addMarker( getFormInput() );
        form.reset();
        return false;
      }
    });
  };

  // Permet créer un marqueur à partir des données de formulaire fournies par l'utilisateur
  var addMarker = function( data ) {
    var marker = new google.maps.Marker({
      position: { lat: data.latitude, lng: data.longitude },
      animation: google.maps.Animation.DROP,
      map: map,
      title: data.message
    });
    map.panTo( marker.getPosition() );

    setupMarkerListener( marker );
  };

  // Permet de gérer un événement de clic sur un marqueur (en utilisant une fermeture)
  var setupMarkerListener = function( marker ) {
    google.maps.event.addListener( marker, 'click', (function( marker ) {
      return function() {
        infoWindow.close();

        if( marker.title ) {
          wrapInfoWindowContent( infoWindow, marker.title );
          infoWindow.open( map, marker );
        }
        map.panTo( marker.getPosition() );
      };
    })( marker ) );
  };

  // Permet d'envelopper le contenu dans une div avant d'en faire un contenu d'InfoWindow
  var wrapInfoWindowContent = function( infoWindow, content ) {
    content = '<div class="info-wrapper">' + content + '</div>';
    infoWindow.setContent( content );
  };

  // Permet d'obtenir les informations de formulaire utilisées pour créer un marqueur Google Maps
  var getFormInput = function() {
    var latitude  = parseInt( $('input[name="latitude"]').val(), 10 ),
        longitude = parseInt( $('input[name="longitude"]').val(), 10 ),
        message   = $('input[name="message"]').val();

    return {
      latitude:  restrict( latitude, -90, 90 ),
      longitude: restrict( longitude, -180, 180 ),
      message:   message.trim()
    };
  };

  // Permet de comparer num
  var restrict = function( num, min, max ) {
    if( !num ) {
      num = 0;
    }
    if( num < min ) {
      return min;
    } else if( num > max ) {
      return max;
    } else {
      return num;
    }
  };

  return { initialize: initialize };
})( jQuery );

$( googleMaps.initialize );
