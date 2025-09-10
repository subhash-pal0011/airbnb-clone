window.addEventListener('DOMContentLoaded', () => {
  const alertBox = document.getElementById('flash-alert');
  if (alertBox) {
    setTimeout(() => {
      // Bootstrap alert close
      const alert = new bootstrap.Alert(alertBox);
      alert.close();
    }, 3000); 
  }
});