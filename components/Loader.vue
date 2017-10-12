<template>
    <div class="overlay">
    <div class="loader">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    </div>
    </div>
</template>

<style>
body {
    background: #34495e;
  }
    .overlay {
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         z-index: 10;
         background-color: rgba(0,0,0,0.5); /*dim the background*/
    }
  .loader {
    position: absolute;
    top: 50%;
    left: 48%;
  }
  
  .line {
    animation: expand 1s ease-in-out infinite;
    border-radius: 10px;
    display: inline-block;
    transform-origin: center center;
    margin: 0 3px;
    width: 1px;
    height: 25px;
  }
  
  .line:nth-child(1) {
    background: #27ae60;
  }
  
  .line:nth-child(2) {
    animation-delay: 180ms;
    background: #f1c40f;
  }
  
  .line:nth-child(3) {
    animation-delay: 360ms;
    background: #e67e22;
  }
  
  .line:nth-child(4) {
    animation-delay: 540ms;
    background: #2980b9;
  }
  
  @keyframes expand {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(2);
    }
  }
  

</style>