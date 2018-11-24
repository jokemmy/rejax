

export default function( type, data ) {

  let response;

  switch ( type ) {

    case 'json':
      if ( data.length ) {
        try {
          if ( 'JSON' in global ) {
            response = JSON.parse( data );
          } else {
            response = new Function( `return (${data})` )(); // eslint-disable-line
          }
        } catch ( e ) {
          throw Error( `Hope: Error while parsing JSON body : ${e}` );
        }
      }
      break;

    case 'xml':

      // Based on jQuery's parseXML() function
      try {
        // Standard
        if ( window.DOMParser ) {
          response = ( new DOMParser()).parseFromString( data, 'text/xml' );

        // IE<9
        } else {
          response = new window.ActiveXObject( 'Microsoft.XMLDOM' );
          response.async = 'false';
          response.loadXML( data );
        }
      } catch ( e ) {
        response = undefined;
      }
      if (
        !response ||
        !response.documentElement ||
        response.getElementsByTagName( 'parsererror' ).length
      ) {
        throw Error( 'Hope: Invalid XML' );
      }
      break;
    default:
      response = data;
  }

  return response;
}

