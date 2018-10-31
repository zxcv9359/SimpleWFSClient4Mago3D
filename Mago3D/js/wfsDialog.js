$( function() {

  var dialogRequest = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Close: function() {
        dialogRequest.dialog( "close" );
      }
    },
    close: function() {
      dialogRequest.dialog( "close" );
    }
  });

  var dialogResult = $( "#dialog-result" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Close: function() {
        dialogResult.dialog( "close" );
      }
    },
    close: function() {
      dialogResult.dialog( "close" );
    }
  });
  /*
  $( "#request-wfs-building" ).button().on("click", function() {
    dialogRequest.dialog( "open" );
  });
  $( "#response-wfs-building" ).button().on("click", function() {
    $( ".wfs-result" ).remove();
    $( "#dialog-result" ).append( "<p class=\"wfs-result\">" + lastResult + "</p>" );
    dialogResult.dialog( "open" );
  });
  $( "#request-wfs-indoor" ).button().on("click", function() {
    dialogRequest.dialog( "open" );
  });
  $( "#response-wfs-indoor" ).button().on("click", function() {
    $( ".wfs-result" ).remove();
    $( "#dialog-result" ).append( "<p class=\"wfs-result\">" + lastResult + "</p>" );
    dialogResult.dialog( "open" );
  });
  */
  $( "#send-wfs-building" ).button().on("click", function() {
    $.post("/wfs", {filter : filter("geom", "Intersects", queryType, points, height), typeName : "footprint", properteis : ["part_id"]}, function(data) {
        lastResult = data;
        //console.log(lastResult);
        $xml = $( $.parseXML( data ) );
        highlightedEntities = [];
        $ids = $xml.find("topp\\:part_id").each(function() {
          var $id = $(this);
          var entity = entityMap[getIdentifier($id.text())];
          //console.log($id.text());
          highlightedEntities = highlightedEntities.concat(entity);
        });
    });
  });

  

  highlightedEntities = new Set();
  $( "#send-wfs-indoor" ).button().on("click", function() {
    $.post("/wfs", {filter : filter("geom", "Intersects", queryType, points, height), typeName : "buildings", properties : ["bid"]}, function(data) {
        lastResult = data;
        //console.log(lastResult);
        $xml = $( $.parseXML( data ) );
        clearHighlightEntities();
        $ids = $xml.find("topp\\:bid").each(function() {
          var $id = $(this);
          //highlited.push($id.text());
          highlightedEntities.add($id.text().substring(0, 10));
	  //changeColorAPI(managerFactory, "workshop.json", "buildings", "gml_KFQR1X", "true", "255,255,0");
          //console.log($id.text().substring(0, 10));
        });
  var arrays = Array.from(highlightedEntities);
  
  console.log(arrays);
  var textFile = null, makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

    var link = document.createElement('a');
    link.setAttribute('download', 'result.txt');

    // for(var i = 0; i < arrays.length; i++){

    // }
    function arrayToString(arr) {
      let str = '';
      arr.forEach(function(i, index) {
        str += (index + 1)+ " : "+i;
        if (index != (arr.length - 1)) {
          str += '\n';
        };
      });
      return str;
    }
    var resultText = arrayToString(arrays);
    link.href = makeTextFile(resultText);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });

	changeColorAPI(managerFactory, "workshop.json", "buildings", arrays, "isMain=true", "255,255,0");
    });
  });


  function clearHighlightEntities() {
     changeColorAPI(managerFactory, "workshop.json", "buildings", Array.from(highlightedEntities), "isMain=true", "255,255,255");
     highlightedEntities.clear();
  }

  function clearHighlight() {
    for(id in highlited) {
        var polygons = HilightCell[ id ];
        for(p in polygons) {
          var attributes = viewer.scene.primitives._primitives[1].getGeometryInstanceAttributes( polygons[p] );
          attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.ALICEBLUE.withAlpha(0.3));
        }
      }
      highlited = [];
  }
} );
