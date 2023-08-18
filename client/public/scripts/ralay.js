!function(){
	// Parameterized the widget
  $(document).ready(function () {  
    $("#Zone_Widget").MR_ParcelShopPicker({  
      Target: "#ParcelShopCode",
      Brand: "BDTEST  ", // PROD: change it
      Country: "FR" ,
      Responsive: true,  
      ColLivMod: "24R",
      OnParcelShopSelected: 
        function(data) {
          console.log(data);
          $("#cb_ID").val(data.ID);
          $("#cb_Nom").val(data.Nom);
          $("#cb_Adresse1").val(data.Adresse1);
          $("#cb_Adresse2").val(data.Adresse2);
          $("#cb_CP").val(data.CP);
          $("#cb_Ville").val(data.Ville);
          $("#cb_Pays").val(data.Pays);
        }
    });  
  });
}();