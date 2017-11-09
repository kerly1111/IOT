        <!-- Start Service Section -->
        <div class="section-modal modal fade" id="mapa-modal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-content">
                <div class="close-modal" data-dismiss="modal">
                    <div class="lr">
                        <div class="rl">
                        </div>
                    </div>
                </div>
                
                <div class="container">
                    <div class="row">
                        <div class="section-title text-center">
                            <h3>Ubicación Estaciones Meteorológicas</h3>
                            <div id="mapa"></div>
                         <!--   <p>Duis aute irure dolor in reprehenderit in voluptate</p>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Service Section -->

<script src="js/jquery-2.1.1.min.js"></script>
<script src="bootstrap/js/bootstrap.min.js"></script>
<script src="js/jquery.appear.js"></script>
<script src="js/contact_me.js"></script>
<script src="js/jqBootstrapValidation.js"></script>
<script src="js/modernizr.custom.js"></script>
<script src="js/script.js"></script>
<script src="js/jquery.circliful.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
<script src="js/RGraph.common.core.js"></script>
<script src="js/RGraph.bar.js"></script>
<script src="js/RGraph.thermometer.js"></script>
<script src="js/RGraph.semicircularprogress.js"></script>
<script src="js/RGraph.common.effects.js"></script>
<script src="js/RGraph.vprogress.js"></script>
<script src="js/RGraph.common.dynamic.js"></script>
<script type="text/javascript" src="http://static.fusioncharts.com/code/latest/fusioncharts.js"></script>
<script type="text/javascript" src="http://static.fusioncharts.com/code/latest/themes/fusioncharts.theme.fint.js?cacheBust=56"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript">
    function initialize() {
      var marcadores = [
        ['Machala', -3.251284, -79.909703],
        ['Quito', -0.208421, -78.564876],
        ['Guayaquil', -1.867026, -80.067814]
      ];
      var map = new google.maps.Map(document.getElementById('mapa'), {
        zoom: 6,
        center: new google.maps.LatLng(-1.4915563,-78.3821154),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
       google.maps.event.addDomListener(mapDiv, 'click', function() {
    window.alert('Map was clicked!');
    //window.locationf="http://www.midominio.com";
  });
      var infowindow = new google.maps.InfoWindow();
      var marker, i;
      for (i = 0; i < marcadores.length; i++) {  
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
          map: map
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(marcadores[i][0]);
            infowindow.open(map, marker);
          }
        })(marker, i));
      }
    }
    google.maps.event.addDomListener(window, 'load', initialize);
</script>









//////////////////////////
$('#rempresa').click(function () {  

          var doc = new jsPDF('l', 'pt','a4');
          var elem = document.getElementById("tablausuarios");
          var res = doc.autoTableHtmlToJson(elem);
var imgData= 'data:image/png;base64,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'

          var header = function(data) {
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.addImage(imgData, 'PNG', 250, 30, 365, 127);
            //doc.text("Testing Report", data.settings.margin.left, 50);
          };

          doc.autoTable(res.columns, res.data,
          {
          beforePageContent: header,
          margin: {
            top: 180
          },
          theme: 'striped',
          startY: 180,
          styles: {
            fillStyle: 'DF',
            lineWidth: 1,
            overflow: 'linebreak',
            fontSize: 8,
            rowHeight: 20,
            tableWidth: 'auto',
            columnWidth: 'auto',
          },
          //columnStyles: {
          //  0: {columnWidth: 'auto'}
          //}

        });          
          var string = doc.output('datauristring');

          $('iframe').attr('src', string);
        //  doc.save('table.pdf');
        });

