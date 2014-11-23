function switch2(){
    var res=this.id=='on'?'on':'off';
    window.localStorage.setItem('power',res);
}
document.getElementById('on').onclick=switch2;
document.getElementById('off').onclick=switch2;
function initial(){
    var re=window.localStorage.getItem('power')==null?'on':document.getElementById(window.localStorage.getItem('power')).checked=true;
}
window.onload=initial;
