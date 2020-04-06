document.getElementById("sign-up").onkeypress = function(e) {
    var key = e.charCode || e.keyCode || 0;     
    if (key == 13) {
      alert("Fll the entire form and then press Sign Up");
      e.preventDefault();
    }
  }